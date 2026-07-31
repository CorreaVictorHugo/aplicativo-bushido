'use client'

import { useParams, useRouter } from 'next/navigation'
import { useAdminPayments } from '@/hooks/useAdminPayments'
import { PaymentStatusBadge, computeSituation } from '@/components/admin/PaymentStatusBadge'
import { PaymentForm } from '@/components/admin/PaymentForm'

export default function AdminFinanceiroAlunoPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const studentId = params.id
  const { payments, studentsWithPayments } = useAdminPayments(studentId)

  const student = (studentsWithPayments.data ?? []).find((s) => s.id === studentId)
  const situation = computeSituation(student?.payments ?? [])

  const list = payments.data ?? []

  return (
    <div>
      <button
        type="button"
        onClick={() => router.push('/admin/financeiro')}
        className="mb-4 text-sm font-medium text-zinc-600 hover:text-zinc-900"
      >
        ← Voltar para Financeiro
      </button>

      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-zinc-900">{student?.name || 'Aluno'}</h1>
        {student && <PaymentStatusBadge situation={situation} />}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section aria-labelledby="historico-heading">
          <h2 id="historico-heading" className="text-lg font-semibold text-zinc-900 mb-3">
            Histórico de pagamentos
          </h2>

          {payments.isLoading && (
            <div className="animate-pulse space-y-3" role="status" aria-label="Carregando pagamentos">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-12 rounded-lg bg-zinc-200" />
              ))}
            </div>
          )}

          {!payments.isLoading && payments.error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
              Não foi possível carregar os pagamentos.
            </div>
          )}

          {!payments.isLoading && !payments.error && list.length === 0 && (
            <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center">
              <p className="text-sm text-zinc-500">Nenhum pagamento registrado.</p>
            </div>
          )}

          {!payments.isLoading && !payments.error && list.length > 0 && (
            <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
              <ul className="divide-y divide-zinc-100" role="list" aria-label="Pagamentos">
                {list.map((p) => (
                  <li key={p.id} className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-medium text-zinc-900">{p.reference}</p>
                      <p className="mt-0.5 text-sm text-zinc-500">
                        {formatDate(p.date)}
                        {p.amount != null ? ` · R$ ${Number(p.amount).toFixed(2)}` : ''}
                        {p.notes ? ` · ${p.notes}` : ''}
                      </p>
                    </div>
                    <PaymentStatusBadge situation={p.status} />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        <section aria-labelledby="registro-heading">
          <h2 id="registro-heading" className="text-lg font-semibold text-zinc-900 mb-3">
            Registrar pagamento
          </h2>
          <div className="rounded-lg border border-zinc-200 bg-white p-5">
            <PaymentForm
              students={student ? [{ id: student.id, name: student.name }] : []}
              defaultStudentId={studentId}
            />
          </div>
        </section>
      </div>
    </div>
  )
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('pt-BR')
  } catch {
    return dateStr
  }
}

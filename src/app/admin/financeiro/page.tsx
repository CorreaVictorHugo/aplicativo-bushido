'use client'

import Link from 'next/link'
import { useAdminPayments } from '@/hooks/useAdminPayments'
import { PaymentStatusBadge, computeSituation } from '@/components/admin/PaymentStatusBadge'

export default function AdminFinanceiroPage() {
  const { studentsWithPayments } = useAdminPayments()

  const students = studentsWithPayments.data ?? []

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900 mb-6">Financeiro</h1>

      {studentsWithPayments.isLoading && (
        <div className="animate-pulse space-y-3" role="status" aria-label="Carregando financeiro">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-14 rounded-lg bg-zinc-200" />
          ))}
        </div>
      )}

      {!studentsWithPayments.isLoading && studentsWithPayments.error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          Não foi possível carregar o financeiro.
        </div>
      )}

      {!studentsWithPayments.isLoading && !studentsWithPayments.error && students.length === 0 && (
        <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center">
          <p className="text-sm text-zinc-500">Nenhum aluno cadastrado.</p>
        </div>
      )}

      {!studentsWithPayments.isLoading && !studentsWithPayments.error && students.length > 0 && (
        <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
          <ul className="divide-y divide-zinc-100" role="list" aria-label="Situação financeira dos alunos">
            {students.map((s) => {
              const situation = computeSituation(s.payments)
              return (
                <li key={s.id} className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium text-zinc-900">{s.name}</p>
                    <p className="mt-0.5 text-sm text-zinc-500">
                      {s.status === 'inactive' ? 'Inativo' : `Última referência: ${s.payments[0]?.reference || '—'}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <PaymentStatusBadge situation={situation} />
                    <Link
                      href={`/admin/financeiro/${s.id}`}
                      className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
                    >
                      Ver / registrar
                    </Link>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}

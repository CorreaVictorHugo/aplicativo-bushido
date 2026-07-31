'use client'

import { useStudentPayments } from '@/hooks/useStudentPayments'
import { PaymentStatusBadge, computeSituation } from '@/components/admin/PaymentStatusBadge'

export function FinanceView() {
  const { data: payments, isLoading, error } = useStudentPayments()

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-3" role="status" aria-label="Carregando financeiro">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-12 rounded-lg bg-zinc-200" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
        Não foi possível carregar sua situação financeira.
      </div>
    )
  }

  const situation = computeSituation(payments ?? [])

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-zinc-200 bg-white p-5 flex items-center justify-between">
        <div>
          <p className="text-sm text-zinc-500">Situação financeira</p>
          <p className="text-lg font-semibold text-zinc-900 mt-1">{situation === 'none' ? 'Sem registros' : 'Mensalidade'}</p>
        </div>
        <PaymentStatusBadge situation={situation} />
      </div>

      {!payments || payments.length === 0 ? (
        <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center">
          <p className="text-sm text-zinc-500">Nenhum pagamento registrado ainda.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
          <ul className="divide-y divide-zinc-100" role="list" aria-label="Histórico de pagamentos">
            {payments.map((p) => (
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

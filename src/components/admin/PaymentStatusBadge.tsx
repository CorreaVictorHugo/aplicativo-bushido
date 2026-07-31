export type PaymentSituation = 'paid' | 'pending' | 'overdue' | 'none'

export function PaymentStatusBadge({ situation }: { situation: PaymentSituation }) {
  const styles: Record<PaymentSituation, string> = {
    paid: 'bg-green-100 text-green-800',
    pending: 'bg-amber-100 text-amber-800',
    overdue: 'bg-red-100 text-red-800',
    none: 'bg-zinc-100 text-zinc-600',
  }
  const labels: Record<PaymentSituation, string> = {
    paid: 'Em dia',
    pending: 'Pendente',
    overdue: 'Atrasado',
    none: 'Sem registro',
  }

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[situation]}`}>
      {labels[situation]}
    </span>
  )
}

export function computeSituation(
  payments: { status: 'paid' | 'pending' | 'overdue' }[]
): PaymentSituation {
  if (!payments || payments.length === 0) return 'none'
  return payments[0].status
}

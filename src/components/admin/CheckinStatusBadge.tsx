export function CheckinStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-800',
    confirmed: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  }
  const labels: Record<string, string> = {
    pending: 'Pendente',
    confirmed: 'Confirmado',
    rejected: 'Recusado',
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status] || 'bg-zinc-100 text-zinc-700'}`}
    >
      {labels[status] || status}
    </span>
  )
}

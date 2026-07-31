'use client'

import type { CheckinWithDetails } from '@/hooks/useAdminCheckins'

interface PendingCheckinListProps {
  checkins: CheckinWithDetails[]
  busyIds: Set<string>
  onDecide: (checkin: CheckinWithDetails, status: 'confirmed' | 'rejected') => void
}

export function PendingCheckinList({ checkins, busyIds, onDecide }: PendingCheckinListProps) {
  if (checkins.length === 0) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center">
        <p className="text-sm text-zinc-500">Nenhum check-in pendente.</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
      <ul className="divide-y divide-zinc-100" role="list" aria-label="Check-ins pendentes">
        {checkins.map((checkin) => {
          const busy = busyIds.has(checkin.id)
          return (
            <li key={checkin.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="font-medium text-zinc-900">{checkin.students?.name || 'Aluno'}</p>
                <p className="mt-0.5 text-sm text-zinc-500">
                  {checkin.trainings?.modality || 'Treino'} · {checkin.trainings?.time || ''} ·{' '}
                  {checkin.trainings?.location || ''} · {formatDate(checkin.class_date)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onDecide(checkin, 'confirmed')}
                  disabled={busy}
                  className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-50"
                >
                  Confirmar
                </button>
                <button
                  type="button"
                  onClick={() => onDecide(checkin, 'rejected')}
                  disabled={busy}
                  className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                >
                  Recusar
                </button>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr + 'T00:00:00')
    return d.toLocaleDateString('pt-BR')
  } catch {
    return dateStr
  }
}

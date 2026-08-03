'use client'

import { useWeekTrainings } from '@/hooks/useWeekTrainings'

export function WeekSchedule() {
  const { data, isLoading, error } = useWeekTrainings()

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-3" role="status" aria-label="Carregando agenda da semana">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-14 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
        ))}
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-700 dark:bg-red-900/30 dark:text-red-400" role="alert">
        Não foi possível carregar a agenda da semana.
      </div>
    )
  }

  const hasAnyTraining = data.days.some((d) => d.trainings.length > 0)

  if (!hasAnyTraining) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-6 text-center dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Nenhum treino cadastrado para esta semana.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {data.days.map((day) => {
        const hasTraining = day.trainings.length > 0
        return (
          <div
            key={day.weekday}
            className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{day.label}</p>
              <span className="text-xs text-zinc-400 dark:text-zinc-500">{formatDate(day.date)}</span>
            </div>

            {hasTraining ? (
              <ul className="mt-2 space-y-2" role="list">
                {day.trainings.map((t) => (
                  <li key={t.id} className="flex items-center justify-between gap-2 text-sm">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-zinc-800 dark:text-zinc-200">{t.modality}</p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {t.time} · {t.location}
                      </p>
                    </div>
                    <CheckinMini status={t.checkin?.status} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-1 text-sm text-zinc-400 dark:text-zinc-500">Sem treino</p>
            )}
          </div>
        )
      })}
    </div>
  )
}

function CheckinMini({ status }: { status?: string }) {
  if (!status) return null
  const styles: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-400',
    confirmed: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400',
  }
  const labels: Record<string, string> = {
    pending: 'Pendente',
    confirmed: 'Confirmado',
    rejected: 'Recusado',
  }
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${styles[status] || 'bg-zinc-100 text-zinc-600'}`}>
      {labels[status] || status}
    </span>
  )
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
  } catch {
    return dateStr
  }
}

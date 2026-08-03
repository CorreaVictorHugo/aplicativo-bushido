'use client'

import { useNextTraining } from '@/hooks/useNextTraining'

export function NextTrainingCard() {
  const { data, isLoading, error } = useNextTraining()

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-1">
        <div className="h-8 w-20 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-3 w-24 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-1">
        <div className="text-2xl font-bold text-zinc-400 dark:text-zinc-500">—</div>
        <div className="text-sm text-zinc-500 mt-1">Próximo treino</div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center gap-1">
        <div className="text-2xl font-bold text-zinc-400 dark:text-zinc-500">—</div>
        <div className="text-sm text-zinc-500 mt-1">Sem treinos</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center gap-1">
      <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
        {data.training.modality}
      </div>
      <div className="text-sm text-zinc-500 dark:text-zinc-400">
        {data.training.time} · {data.training.location}
      </div>
      <span
        className={`mt-1 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
          data.isToday
            ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400'
            : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300'
        }`}
      >
        {data.isToday ? 'Hoje' : `${data.weekdayLabel} · ${data.dateLabel}`}
      </span>
    </div>
  )
}

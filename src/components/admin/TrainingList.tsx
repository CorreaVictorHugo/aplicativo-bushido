'use client'

import Link from 'next/link'
import type { Training } from '@/lib/supabase/types'

const weekdayMap: Record<number, string> = {
  0: 'Dom',
  1: 'Seg',
  2: 'Ter',
  3: 'Qua',
  4: 'Qui',
  5: 'Sex',
  6: 'Sáb',
}

interface TrainingListProps {
  trainings: Training[]
  busyIds: Set<string>
  onToggle: (training: Training) => void
}

export function TrainingList({ trainings, busyIds, onToggle }: TrainingListProps) {
  if (trainings.length === 0) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center">
        <p className="text-sm text-zinc-500">Nenhum treino cadastrado.</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
      <ul className="divide-y divide-zinc-100" role="list" aria-label="Lista de treinos">
        {trainings.map((training) => {
          const busy = busyIds.has(training.id)
          return (
            <li key={training.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-zinc-900">{training.modality}</p>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      training.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {training.status === 'active' ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-zinc-500">
                  {weekdayMap[training.weekday]} · {training.time} · {training.location} · capacidade {training.capacity}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={`/admin/treinos/${training.id}/editar`}
                  className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
                >
                  Editar
                </Link>
                <button
                  type="button"
                  onClick={() => onToggle(training)}
                  disabled={busy}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${
                    training.status === 'active'
                      ? 'border-zinc-300 text-zinc-700 hover:bg-zinc-50'
                      : 'border-green-300 text-green-700 hover:bg-green-50'
                  }`}
                >
                  {training.status === 'active' ? 'Desativar' : 'Ativar'}
                </button>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

'use client'

import type { Graduation } from '@/lib/supabase/types'
import { beltLabel, beltColorClass, formatDateBr } from '@/lib/belt'

interface GraduationTimelineProps {
  graduations: Graduation[]
}

export function GraduationTimeline({ graduations }: GraduationTimelineProps) {
  if (graduations.length === 0) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center">
        <p className="text-sm text-zinc-500">Nenhuma graduação registrada ainda.</p>
      </div>
    )
  }

  return (
    <ol className="relative space-y-4 border-l border-zinc-200 pl-6" role="list" aria-label="Histórico de graduações">
      {graduations.map((g) => (
        <li key={g.id} className="relative">
          <span
            className={`absolute -left-6 top-1 flex h-4 w-4 -translate-x-1/2 items-center justify-center rounded-full ring-2 ${beltColorClass(g.belt)}`}
            aria-hidden="true"
          />
          <div className="rounded-lg border border-zinc-200 bg-white p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="font-medium text-zinc-900">
                Faixa {beltLabel(g.belt)}
                {g.degree > 0 ? ` — ${g.degree}º Grau` : ''}
              </p>
              <span className="text-sm text-zinc-500">{formatDateBr(g.date)}</span>
            </div>
            {(g.responsible_name || g.notes) && (
              <p className="mt-1 text-sm text-zinc-500">
                {g.responsible_name}
                {g.responsible_name && g.notes ? ' · ' : ''}
                {g.notes}
              </p>
            )}
          </div>
        </li>
      ))}
    </ol>
  )
}

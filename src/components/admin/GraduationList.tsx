'use client'

import type { GraduationWithStudent } from '@/hooks/useAdminGraduations'
import { beltLabel, beltColorClass, formatDateBr } from '@/lib/belt'

interface GraduationListProps {
  graduations: GraduationWithStudent[]
}

export function GraduationList({ graduations }: GraduationListProps) {
  if (graduations.length === 0) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center">
        <p className="text-sm text-zinc-500">Nenhuma graduação registrada ainda.</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
      <ul className="divide-y divide-zinc-100" role="list" aria-label="Lista de graduações">
        {graduations.map((g) => (
          <li key={g.id} className="flex flex-col gap-1 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="font-medium text-zinc-900">{g.students?.name || 'Aluno'}</p>
              <p className="mt-0.5 text-sm text-zinc-500">
                {g.responsible_name ? `${g.responsible_name} · ` : ''}
                {g.notes ? `${g.notes} · ` : ''}
                {formatDateBr(g.date)}
              </p>
            </div>
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-2 ${beltColorClass(g.belt)}`}>
              {beltLabel(g.belt)}
              {g.degree > 0 ? ` ${g.degree}º` : ''}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

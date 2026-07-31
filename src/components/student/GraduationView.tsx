'use client'

import { useStudent } from '@/hooks/useStudent'
import { beltLabel, beltColorClass, timeInBelt, formatDateBr } from '@/lib/belt'
import { GraduationTimeline } from './GraduationTimeline'

export function GraduationView() {
  const { data: student, isLoading, error } = useStudent()

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4" role="status" aria-label="Carregando graduação">
        <div className="h-32 rounded-lg bg-zinc-200" />
        <div className="h-6 w-48 bg-zinc-200 rounded" />
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-14 rounded-lg bg-zinc-200" />
          ))}
        </div>
      </div>
    )
  }

  if (error || !student) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
        Não foi possível carregar sua graduação. Tente novamente.
      </div>
    )
  }

  const graduations = student.graduations || []
  const sorted = [...graduations].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  const latest = sorted[0]
  const startDate = latest?.date || student.entry_date

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-zinc-200 bg-white p-6 text-center">
        <span
          className={`inline-flex items-center rounded-full px-4 py-2 text-base font-semibold ring-2 ${beltColorClass(student.belt)}`}
        >
          Faixa {beltLabel(student.belt)}
          {student.degree > 0 ? ` — ${student.degree}º Grau` : ''}
        </span>
        <dl className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <dt className="text-xs text-zinc-500">Tempo na faixa</dt>
            <dd className="mt-1 text-lg font-semibold text-zinc-900">{timeInBelt(startDate)}</dd>
          </div>
          <div>
            <dt className="text-xs text-zinc-500">Graduado em</dt>
            <dd className="mt-1 text-lg font-semibold text-zinc-900">{latest ? formatDateBr(latest.date) : '—'}</dd>
          </div>
        </dl>
      </div>

      <section aria-labelledby="historico-heading">
        <h2 id="historico-heading" className="text-lg font-semibold text-zinc-900 mb-3">
          Histórico de graduações
        </h2>
        <GraduationTimeline graduations={sorted} />
      </section>
    </div>
  )
}

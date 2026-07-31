'use client'

import { useState } from 'react'
import { useStudentCheckins } from '@/hooks/useStudentCheckins'

export function FrequencyHistory() {
  const { data: checkins, isLoading, error } = useStudentCheckins()
  const [monthFilter, setMonthFilter] = useState('')

  const filtered = checkins?.filter((c) => !monthFilter || c.class_date.startsWith(monthFilter)) ?? []

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-3" role="status" aria-label="Carregando frequência">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-12 rounded-lg bg-zinc-200" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
        Não foi possível carregar seu histórico de presença.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-zinc-200 bg-white px-4 py-3">
        <p className="text-sm text-zinc-500">
          Treinos realizados: <span className="font-semibold text-zinc-900">{filtered.length}</span>
          {monthFilter ? ' no período selecionado' : ' no total'}
        </p>
      </div>

      <div>
        <input
          type="month"
          value={monthFilter}
          onChange={(e) => setMonthFilter(e.target.value)}
          aria-label="Filtrar por mês"
          className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm outline-none transition-colors focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center">
          <p className="text-sm text-zinc-500">Nenhuma presença registrada ainda.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
          <ul className="divide-y divide-zinc-100" role="list" aria-label="Histórico de presenças">
            {filtered.map((checkin) => (
              <li key={checkin.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium text-zinc-900">{checkin.trainings?.modality || 'Treino'}</p>
                  <p className="mt-0.5 text-sm text-zinc-500">
                    {checkin.trainings?.time || ''} · {checkin.trainings?.location || ''}
                  </p>
                </div>
                <span className="text-sm text-zinc-500">{formatDate(checkin.class_date)}</span>
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
    const d = new Date(dateStr + 'T00:00:00')
    return d.toLocaleDateString('pt-BR')
  } catch {
    return dateStr
  }
}

'use client'

import { useMemo, useState } from 'react'
import { useAdminDashboard } from '@/hooks/useAdminDashboard'
import { DashboardCards } from '@/components/admin/DashboardCards'

type Mode = 'month' | 'range'

function todayStr(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function monthRange(month: string): { start: string; end: string } {
  const [y, m] = month.split('-').map(Number)
  const start = `${y}-${String(m).padStart(2, '0')}-01`
  const lastDay = new Date(y, m, 0).getDate()
  const end = `${y}-${String(m).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`
  return { start, end }
}

export default function AdminDashboardPage() {
  const [mode, setMode] = useState<Mode>('month')
  const currentMonth = todayStr().slice(0, 7)
  const [month, setMonth] = useState(currentMonth)
  const [rangeStart, setRangeStart] = useState(todayStr())
  const [rangeEnd, setRangeEnd] = useState(todayStr())

  const period = useMemo(() => {
    if (mode === 'month') return monthRange(month)
    if (rangeStart && rangeEnd) {
      const a = rangeStart < rangeEnd ? rangeStart : rangeEnd
      const b = rangeStart < rangeEnd ? rangeEnd : rangeStart
      return { start: a, end: b }
    }
    return { start: todayStr(), end: todayStr() }
  }, [mode, month, rangeStart, rangeEnd])

  const { data, isLoading, error } = useAdminDashboard(period.start, period.end)

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900 mb-6">Dashboard</h1>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setMode('month')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              mode === 'month' ? 'bg-zinc-900 text-white' : 'bg-white border border-zinc-300 text-zinc-600 hover:bg-zinc-50'
            }`}
            aria-pressed={mode === 'month'}
          >
            Mês
          </button>
          <button
            type="button"
            onClick={() => setMode('range')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              mode === 'range' ? 'bg-zinc-900 text-white' : 'bg-white border border-zinc-300 text-zinc-600 hover:bg-zinc-50'
            }`}
            aria-pressed={mode === 'range'}
          >
            Intervalo
          </button>
        </div>

        {mode === 'month' ? (
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            aria-label="Selecionar mês"
            className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm outline-none transition-colors focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
          />
        ) : (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              type="date"
              value={rangeStart}
              onChange={(e) => setRangeStart(e.target.value)}
              aria-label="Data inicial"
              className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm outline-none transition-colors focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
            />
            <span className="text-sm text-zinc-500">até</span>
            <input
              type="date"
              value={rangeEnd}
              onChange={(e) => setRangeEnd(e.target.value)}
              aria-label="Data final"
              className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm outline-none transition-colors focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
            />
          </div>
        )}
      </div>

      {isLoading && (
        <div className="animate-pulse space-y-4" role="status" aria-label="Carregando dashboard">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 rounded-lg bg-zinc-200" />
            ))}
          </div>
          <div className="h-40 rounded-lg bg-zinc-200" />
        </div>
      )}

      {!isLoading && error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          Não foi possível carregar os indicadores. Tente novamente.
        </div>
      )}

      {!isLoading && !error && data && <DashboardCards data={data} />}
    </div>
  )
}

'use client'

import { useMemo, useState } from 'react'
import type { CheckinWithDetails } from '@/hooks/useAdminCheckins'
import { CheckinStatusBadge } from './CheckinStatusBadge'
import { formatDate } from './PendingCheckinList'

interface CheckinHistoryProps {
  checkins: CheckinWithDetails[]
}

export function CheckinHistory({ checkins }: CheckinHistoryProps) {
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'rejected'>('all')
  const [dateFilter, setDateFilter] = useState('')

  const filtered = useMemo(() => {
    return checkins.filter((c) => {
      const matchStatus = statusFilter === 'all' || c.status === statusFilter
      const matchDate = !dateFilter || c.class_date === dateFilter
      return matchStatus && matchDate
    })
  }, [checkins, statusFilter, dateFilter])

  const metrics = useMemo(() => {
    const total = filtered.length
    const confirmed = filtered.filter((c) => c.status === 'confirmed').length
    const rejected = filtered.filter((c) => c.status === 'rejected').length
    const pending = filtered.filter((c) => c.status === 'pending').length
    return { total, confirmed, rejected, pending }
  }, [filtered])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MetricCard label="Total" value={metrics.total} />
        <MetricCard label="Confirmados" value={metrics.confirmed} color="bg-green-100 text-green-800" />
        <MetricCard label="Recusados" value={metrics.rejected} color="bg-red-100 text-red-800" />
        <MetricCard label="Pendentes" value={metrics.pending} color="bg-amber-100 text-amber-800" />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          aria-label="Filtrar por status"
          className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm outline-none transition-colors focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
        >
          <option value="all">Todos os status</option>
          <option value="pending">Pendentes</option>
          <option value="confirmed">Confirmados</option>
          <option value="rejected">Recusados</option>
        </select>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          aria-label="Filtrar por data"
          className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm outline-none transition-colors focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center">
          <p className="text-sm text-zinc-500">Nenhum check-in encontrado com os filtros atuais.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
          <ul className="divide-y divide-zinc-100" role="list" aria-label="Histórico de check-ins">
            {filtered.map((checkin) => (
              <li key={checkin.id} className="flex flex-col gap-1 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="font-medium text-zinc-900">{checkin.students?.name || 'Aluno'}</p>
                  <p className="mt-0.5 text-sm text-zinc-500">
                    {checkin.trainings?.modality || 'Treino'} · {checkin.trainings?.time || ''} ·{' '}
                    {formatDate(checkin.class_date)}
                  </p>
                </div>
                <CheckinStatusBadge status={checkin.status} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function MetricCard({ label, value, color = 'bg-zinc-100 text-zinc-800' }: { label: string; value: number; color?: string }) {
  return (
    <div className={`rounded-lg px-4 py-3 ${color}`}>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs">{label}</p>
    </div>
  )
}

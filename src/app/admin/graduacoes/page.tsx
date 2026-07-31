'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAdminGraduations } from '@/hooks/useAdminGraduations'
import { GraduationList } from '@/components/admin/GraduationList'

export default function AdminGraduacoesPage() {
  const { graduations } = useAdminGraduations()
  const [monthFilter, setMonthFilter] = useState('')

  const filtered = graduations.data?.filter((g) => !monthFilter || g.date.startsWith(monthFilter)) ?? []

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-zinc-900">Graduações</h1>
        <Link
          href="/admin/graduacoes/nova"
          className="flex h-11 items-center justify-center rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
        >
          Nova graduação
        </Link>
      </div>

      <div className="mb-4">
        <input
          type="month"
          value={monthFilter}
          onChange={(e) => setMonthFilter(e.target.value)}
          aria-label="Filtrar por mês"
          className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm outline-none transition-colors focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
        />
      </div>

      {graduations.isLoading && (
        <div className="animate-pulse space-y-3" role="status" aria-label="Carregando graduações">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 rounded-lg bg-zinc-200" />
          ))}
        </div>
      )}

      {!graduations.isLoading && graduations.error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          Não foi possível carregar as graduações.
        </div>
      )}

      {!graduations.isLoading && !graduations.error && <GraduationList graduations={filtered} />}
    </div>
  )
}

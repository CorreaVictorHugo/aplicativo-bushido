'use client'

import type { DashboardData } from '@/hooks/useAdminDashboard'
import { beltLabel } from '@/lib/belt'

export function DashboardCards({ data }: { data: DashboardData }) {
  const belts = Object.entries(data.beltDistribution).sort((a, b) => b[1] - a[1])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Card label="Alunos ativos" value={data.activeStudents} />
        <Card label="Alunos novos" value={data.newStudents} />
        <Card label="Graduações no período" value={data.graduations} />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card label="Check-ins (total)" value={data.checkins.total} color="bg-zinc-100 text-zinc-800" />
        <Card label="Confirmados" value={data.checkins.confirmed} color="bg-green-100 text-green-800" />
        <Card label="Recusados" value={data.checkins.rejected} color="bg-red-100 text-red-800" />
        <Card label="Pendentes" value={data.checkins.pending} color="bg-amber-100 text-amber-800" />
      </div>

      <section aria-labelledby="faixas-heading" className="rounded-lg border border-zinc-200 bg-white p-4">
        <h2 id="faixas-heading" className="text-sm font-semibold text-zinc-900 mb-3">
          Alunos por faixa
        </h2>
        {belts.length === 0 ? (
          <p className="text-sm text-zinc-500">Nenhum aluno cadastrado.</p>
        ) : (
          <ul className="space-y-2" role="list">
            {belts.map(([belt, count]) => (
              <li key={belt} className="flex items-center justify-between text-sm">
                <span className="text-zinc-600">Faixa {beltLabel(belt)}</span>
                <span className="font-semibold text-zinc-900">{count}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

function Card({ label, value, color = 'bg-zinc-100 text-zinc-800' }: { label: string; value: number; color?: string }) {
  return (
    <div className={`rounded-lg px-4 py-3 ${color}`}>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs">{label}</p>
    </div>
  )
}

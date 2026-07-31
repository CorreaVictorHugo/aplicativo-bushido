'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAdminTrainings } from '@/hooks/useAdminTrainings'
import { TrainingList } from '@/components/admin/TrainingList'
import { ConfirmModal } from '@/components/admin/ConfirmModal'
import type { Training } from '@/lib/supabase/types'

export default function AdminTreinosPage() {
  const { data: trainings, isLoading, error, toggleTraining } = useAdminTrainings()
  const [toggleTarget, setToggleTarget] = useState<Training | null>(null)
  const [busyIds, setBusyIds] = useState<Set<string>>(new Set())

  const handleToggle = async (training: Training) => {
    setBusyIds((prev) => new Set(prev).add(training.id))
    try {
      await toggleTraining.mutateAsync({
        id: training.id,
        status: training.status === 'active' ? 'inactive' : 'active',
      })
    } catch (err) {
      console.error('Erro ao alterar status:', err)
      alert('Erro ao alterar o status. Tente novamente.')
    } finally {
      setBusyIds((prev) => {
        const next = new Set(prev)
        next.delete(training.id)
        return next
      })
      setToggleTarget(null)
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-zinc-900">Treinos</h1>
        <Link
          href="/admin/treinos/novo"
          className="flex h-11 items-center justify-center rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
        >
          Novo treino
        </Link>
      </div>

      {isLoading && (
        <div className="animate-pulse space-y-3" role="status" aria-label="Carregando treinos">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 rounded-lg bg-zinc-200" />
          ))}
        </div>
      )}

      {!isLoading && error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          Não foi possível carregar os treinos. Tente novamente.
        </div>
      )}

      {!isLoading && !error && (
        <TrainingList trainings={trainings ?? []} busyIds={busyIds} onToggle={setToggleTarget} />
      )}

      <ConfirmModal
        open={toggleTarget !== null}
        title={toggleTarget?.status === 'active' ? 'Desativar treino' : 'Ativar treino'}
        message={`${toggleTarget?.status === 'active' ? 'Desativar' : 'Ativar'} o treino de ${toggleTarget?.modality} (${toggleTarget ? `${weekdayLabel(toggleTarget.weekday)} ${toggleTarget.time}` : ''})?`}
        confirmLabel={toggleTarget?.status === 'active' ? 'Desativar' : 'Ativar'}
        loading={toggleTarget ? busyIds.has(toggleTarget.id) : false}
        onConfirm={() => toggleTarget && handleToggle(toggleTarget)}
        onCancel={() => setToggleTarget(null)}
      />
    </div>
  )
}

function weekdayLabel(weekday: number): string {
  const map: Record<number, string> = {
    0: 'Dom',
    1: 'Seg',
    2: 'Ter',
    3: 'Qua',
    4: 'Qui',
    5: 'Sex',
    6: 'Sáb',
  }
  return map[weekday] ?? String(weekday)
}

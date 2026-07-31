'use client'

import { useState } from 'react'
import { useAdminCheckins, type CheckinWithDetails } from '@/hooks/useAdminCheckins'
import { PendingCheckinList } from '@/components/admin/PendingCheckinList'
import { CheckinHistory } from '@/components/admin/CheckinHistory'

type Tab = 'pending' | 'history'

export default function AdminCheckinsPage() {
  const { pending, history, decide } = useAdminCheckins()
  const [tab, setTab] = useState<Tab>('pending')
  const [busyIds, setBusyIds] = useState<Set<string>>(new Set())

  const handleDecide = async (checkin: CheckinWithDetails, status: 'confirmed' | 'rejected') => {
    setBusyIds((prev) => new Set(prev).add(checkin.id))
    try {
      await decide.mutateAsync({ checkin, status })
    } catch (err) {
      console.error('Erro ao decidir check-in:', err)
      alert('Erro ao processar o check-in. Tente novamente.')
    } finally {
      setBusyIds((prev) => {
        const next = new Set(prev)
        next.delete(checkin.id)
        return next
      })
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900 mb-6">Check-ins</h1>

      <div className="mb-6 flex gap-2 border-b border-zinc-200">
        <TabButton active={tab === 'pending'} onClick={() => setTab('pending')}>
          Pendentes ({pending.data?.length ?? 0})
        </TabButton>
        <TabButton active={tab === 'history'} onClick={() => setTab('history')}>
          Histórico
        </TabButton>
      </div>

      {tab === 'pending' && (
        <div className="space-y-4">
          {pending.isLoading && (
            <div className="animate-pulse space-y-3" role="status" aria-label="Carregando pendentes">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 rounded-lg bg-zinc-200" />
              ))}
            </div>
          )}
          {!pending.isLoading && pending.error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
              Não foi possível carregar os check-ins pendentes.
            </div>
          )}
          {!pending.isLoading && !pending.error && (
            <PendingCheckinList checkins={pending.data ?? []} busyIds={busyIds} onDecide={handleDecide} />
          )}
        </div>
      )}

      {tab === 'history' && (
        <div className="space-y-4">
          {history.isLoading && (
            <div className="animate-pulse space-y-3" role="status" aria-label="Carregando histórico">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-12 rounded-lg bg-zinc-200" />
              ))}
            </div>
          )}
          {!history.isLoading && history.error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
              Não foi possível carregar o histórico de check-ins.
            </div>
          )}
          {!history.isLoading && !history.error && (
            <CheckinHistory checkins={history.data ?? []} />
          )}
        </div>
      )}
    </div>
  )
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
        active ? 'border-zinc-900 text-zinc-900' : 'border-transparent text-zinc-500 hover:text-zinc-700'
      }`}
      aria-current={active ? 'page' : undefined}
    >
      {children}
    </button>
  )
}

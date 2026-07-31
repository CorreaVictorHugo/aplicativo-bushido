'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAdminPublications } from '@/hooks/useAdminPublications'
import { PublicationList } from '@/components/admin/PublicationList'
import { ConfirmModal } from '@/components/admin/ConfirmModal'
import { NotificationForm } from '@/components/admin/NotificationForm'
import { useAdminStudents } from '@/hooks/useAdminStudents'
import type { Publication } from '@/lib/supabase/types'

export default function AdminComunicacaoPage() {
  const { publications, savePublication, deletePublication } = useAdminPublications()
  const { data: students } = useAdminStudents()
  const [showNotificationForm, setShowNotificationForm] = useState(false)
  const [toggleTarget, setToggleTarget] = useState<Publication | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Publication | null>(null)
  const [busyIds, setBusyIds] = useState<Set<string>>(new Set())

  const run = async (id: string, fn: () => Promise<void>) => {
    setBusyIds((prev) => new Set(prev).add(id))
    try {
      await fn()
    } catch (err) {
      console.error('Erro:', err)
      alert('Erro ao processar. Tente novamente.')
    } finally {
      setBusyIds((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }
  }

  const handleToggle = (p: Publication) =>
    run(p.id, () =>
      savePublication.mutateAsync({
        id: p.id,
        data: {
          status: p.status === 'published' ? 'draft' : 'published',
          published_at: p.status === 'published' ? null : new Date().toISOString(),
        },
      })
    )

  const handleDelete = (p: Publication) => run(p.id, () => deletePublication.mutateAsync(p.id))

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-zinc-900">Comunicação</h1>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setShowNotificationForm((prev) => !prev)}
            className="flex h-11 items-center justify-center rounded-lg border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
            aria-expanded={showNotificationForm}
          >
            {showNotificationForm ? 'Fechar notificação' : 'Nova notificação'}
          </button>
          <Link
            href="/admin/comunicacao/nova"
            className="flex h-11 items-center justify-center rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
          >
            Nova publicação
          </Link>
        </div>
      </div>

      {showNotificationForm && (
        <section aria-label="Enviar notificação" className="mb-6 rounded-lg border border-zinc-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-zinc-900 mb-3">Enviar notificação</h2>
          <NotificationForm
            students={(students ?? []).map((s) => ({ id: s.id, name: s.name }))}
            onDone={() => setShowNotificationForm(false)}
          />
        </section>
      )}

      {publications.isLoading && (
        <div className="animate-pulse space-y-3" role="status" aria-label="Carregando publicações">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 rounded-lg bg-zinc-200" />
          ))}
        </div>
      )}

      {!publications.isLoading && publications.error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          Não foi possível carregar as publicações.
        </div>
      )}

      {!publications.isLoading && !publications.error && (
        <PublicationList
          publications={publications.data ?? []}
          busyIds={busyIds}
          onToggleStatus={setToggleTarget}
          onDelete={setDeleteTarget}
        />
      )}

      <ConfirmModal
        open={toggleTarget !== null}
        title={toggleTarget?.status === 'published' ? 'Despublicar' : 'Publicar'}
        message={`Deseja ${toggleTarget?.status === 'published' ? 'despublicar' : 'publicar'} "${toggleTarget?.title}"?`}
        confirmLabel={toggleTarget?.status === 'published' ? 'Despublicar' : 'Publicar'}
        loading={toggleTarget ? busyIds.has(toggleTarget.id) : false}
        onConfirm={() => toggleTarget && handleToggle(toggleTarget)}
        onCancel={() => setToggleTarget(null)}
      />

      <ConfirmModal
        open={deleteTarget !== null}
        title="Excluir publicação"
        message={`Excluir "${deleteTarget?.title}"? Esta ação é permanente.`}
        confirmLabel="Excluir"
        danger
        loading={deleteTarget ? busyIds.has(deleteTarget.id) : false}
        onConfirm={() => deleteTarget && handleDelete(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}

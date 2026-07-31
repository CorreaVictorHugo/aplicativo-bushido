'use client'

import Link from 'next/link'
import type { Publication } from '@/lib/supabase/types'

const typeLabels: Record<string, string> = {
  notice: 'Aviso',
  news: 'Notícia',
  event: 'Evento',
  photo: 'Foto',
  video: 'Vídeo',
}

interface PublicationListProps {
  publications: Publication[]
  busyIds: Set<string>
  onToggleStatus: (p: Publication) => void
  onDelete: (p: Publication) => void
}

export function PublicationList({ publications, busyIds, onToggleStatus, onDelete }: PublicationListProps) {
  if (publications.length === 0) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center">
        <p className="text-sm text-zinc-500">Nenhuma publicação ainda.</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
      <ul className="divide-y divide-zinc-100" role="list" aria-label="Lista de publicações">
        {publications.map((p) => {
          const busy = busyIds.has(p.id)
          return (
            <li key={p.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600">
                    {typeLabels[p.type] || p.type}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      p.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {p.status === 'published' ? 'Publicado' : 'Rascunho'}
                  </span>
                </div>
                <p className="mt-1 truncate font-medium text-zinc-900">{p.title}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={`/admin/comunicacao/${p.id}/editar`}
                  className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
                >
                  Editar
                </Link>
                <button
                  type="button"
                  onClick={() => onToggleStatus(p)}
                  disabled={busy}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${
                    p.status === 'published'
                      ? 'border-zinc-300 text-zinc-700 hover:bg-zinc-50'
                      : 'border-green-300 text-green-700 hover:bg-green-50'
                  }`}
                >
                  {p.status === 'published' ? 'Despublicar' : 'Publicar'}
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(p)}
                  disabled={busy}
                  className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                >
                  Excluir
                </button>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

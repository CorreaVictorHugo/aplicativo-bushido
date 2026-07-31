'use client'

import { usePublications } from '@/hooks/usePublications'
import { YoutubeEmbed, extractYoutubeId } from './YoutubeEmbed'

const typeLabels: Record<string, string> = {
  notice: 'Aviso',
  news: 'Notícia',
  event: 'Evento',
  photo: 'Foto',
  video: 'Vídeo',
}

export function MuralList() {
  const { data: publications, isLoading, error } = usePublications()

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-3" role="status" aria-label="Carregando mural">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 rounded-lg bg-zinc-200" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
        Não foi possível carregar o mural.
      </div>
    )
  }

  if (!publications || publications.length === 0) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center">
        <p className="text-sm text-zinc-500">Nenhuma publicação ainda.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {publications.map((p) => {
        const isVideo = p.type === 'video' && p.media_url && extractYoutubeId(p.media_url)
        const isImage = p.type === 'photo' && p.media_url
        return (
          <article key={p.id} className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
            <div className="flex items-center justify-between gap-2 px-4 pt-4">
              <span className="inline-flex items-center rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600">
                {typeLabels[p.type] || p.type}
              </span>
              {p.published_at && (
                <span className="text-xs text-zinc-400">{formatDate(p.published_at)}</span>
              )}
            </div>
            <div className="px-4 py-3">
              <h2 className="font-semibold text-zinc-900">{p.title}</h2>
              {p.content && <p className="mt-1 text-sm text-zinc-600 whitespace-pre-line">{p.content}</p>}
            </div>
            {isVideo && (
              <div className="px-4 pb-4">
                <YoutubeEmbed url={p.media_url!} />
              </div>
            )}
            {isImage && (
              <div className="px-4 pb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.media_url!} alt={p.title} className="w-full rounded-lg object-cover" />
              </div>
            )}
          </article>
        )
      })}
    </div>
  )
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('pt-BR')
  } catch {
    return iso
  }
}

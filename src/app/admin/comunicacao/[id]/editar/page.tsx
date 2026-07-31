'use client'

import { useParams } from 'next/navigation'
import { useAdminPublications } from '@/hooks/useAdminPublications'
import { PublicationForm } from '@/components/admin/PublicationForm'

export default function EditarPublicacaoPage() {
  const params = useParams<{ id: string }>()
  const { publications } = useAdminPublications()
  const publication = publications.data?.find((p) => p.id === params.id)

  if (publications.isLoading) {
    return <p className="text-sm text-zinc-500">Carregando...</p>
  }

  if (!publication) {
    return <p className="text-sm text-zinc-500">Publicação não encontrada.</p>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900 mb-6">Editar publicação</h1>
      <PublicationForm
        mode="edit"
        publicationId={publication.id}
        initialData={{
          type: publication.type,
          title: publication.title,
          content: publication.content || '',
          media_url: publication.media_url || '',
          status: publication.status,
        }}
      />
    </div>
  )
}

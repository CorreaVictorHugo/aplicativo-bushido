'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { publicationSchema, type PublicationFormData } from '@/lib/schemas/publicationSchema'
import { useAdminPublications } from '@/hooks/useAdminPublications'

const typeOptions = [
  { value: 'notice', label: 'Aviso' },
  { value: 'news', label: 'Notícia' },
  { value: 'event', label: 'Evento' },
  { value: 'photo', label: 'Foto' },
  { value: 'video', label: 'Vídeo' },
]

interface PublicationFormProps {
  mode: 'create' | 'edit'
  publicationId?: string
  initialData?: Partial<PublicationFormData>
}

export function PublicationForm({ mode, publicationId, initialData }: PublicationFormProps) {
  const router = useRouter()
  const { savePublication } = useAdminPublications()
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PublicationFormData>({
    resolver: zodResolver(publicationSchema),
    defaultValues: {
      type: initialData?.type || 'notice',
      title: initialData?.title || '',
      content: initialData?.content || '',
      media_url: initialData?.media_url || '',
      status: initialData?.status || 'draft',
    },
  })

  const onSubmit = async (data: PublicationFormData) => {
    setSubmitError(null)
    try {
      const payload = {
        type: data.type,
        title: data.title,
        content: data.content || null,
        media_url: data.media_url || null,
        status: data.status,
        published_at: data.status === 'published' ? new Date().toISOString() : null,
      }
      await savePublication.mutateAsync({ id: publicationId, data: payload })
      router.push('/admin/comunicacao')
      router.refresh()
    } catch (err) {
      console.error('Erro ao salvar publicação:', err)
      setSubmitError('Erro ao salvar. Tente novamente.')
    }
  }

  const inputClass =
    'w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm outline-none transition-colors focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900'

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5 max-w-lg">
      {submitError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {submitError}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="type" className="text-sm font-medium text-zinc-900">
            Tipo
          </label>
          <select id="type" {...register('type')} className={inputClass}>
            {typeOptions.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          {errors.type && <p className="text-xs text-red-600" role="alert">{errors.type.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="status" className="text-sm font-medium text-zinc-900">
            Status
          </label>
          <select id="status" {...register('status')} className={inputClass}>
            <option value="draft">Rascunho</option>
            <option value="published">Publicado</option>
          </select>
          {errors.status && <p className="text-xs text-red-600" role="alert">{errors.status.message}</p>}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="title" className="text-sm font-medium text-zinc-900">
          Título
        </label>
        <input id="title" type="text" {...register('title')} className={inputClass} />
        {errors.title && <p className="text-xs text-red-600" role="alert">{errors.title.message}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="content" className="text-sm font-medium text-zinc-900">
          Conteúdo
        </label>
        <textarea id="content" rows={4} {...register('content')} className={inputClass} />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="media_url" className="text-sm font-medium text-zinc-900">
          Mídia (URL de imagem ou vídeo do YouTube)
        </label>
        <input id="media_url" type="url" placeholder="https://..." {...register('media_url')} className={inputClass} />
        {errors.media_url && <p className="text-xs text-red-600" role="alert">{errors.media_url.message}</p>}
      </div>

      <div className="flex flex-col gap-3 pt-2 sm:flex-row">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex h-12 items-center justify-center rounded-lg bg-zinc-900 px-6 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? 'Salvando...' : mode === 'create' ? 'Criar publicação' : 'Salvar alterações'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/comunicacao')}
          disabled={isSubmitting}
          className="flex h-12 items-center justify-center rounded-lg border border-zinc-300 bg-white px-6 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-50"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}

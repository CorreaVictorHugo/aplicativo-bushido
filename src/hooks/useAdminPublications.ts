'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { Publication } from '@/lib/supabase/types'

async function fetchPublications(): Promise<Publication[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('publications')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Erro ao listar publicações:', JSON.stringify({ message: error.message, code: error.code }))
    throw error
  }
  return data ?? []
}

export function useAdminPublications() {
  const queryClient = useQueryClient()

  const publications = useQuery({
    queryKey: ['admin-publications'],
    queryFn: fetchPublications,
    staleTime: 30 * 1000,
  })

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-publications'] })
    queryClient.invalidateQueries({ queryKey: ['publications'] })
    queryClient.invalidateQueries({ queryKey: ['notifications'] })
  }

  const savePublication = useMutation({
    mutationFn: async (values: { id?: string; data: Record<string, unknown> }) => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Não autenticado')

      if (values.id) {
        const { error } = await supabase.from('publications').update(values.data).eq('id', values.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('publications')
          .insert({ ...values.data, author_id: user.id })
        if (error) throw error
      }

      // Notifica todos quando a publicação é publicada
      if (values.data.status === 'published') {
        const title = String(values.data.title || 'Novo aviso')
        const message = String(values.data.content || 'Nova publicação no mural.')
        const { error: notifError } = await supabase.from('notifications').insert({
          target_profile: 'all',
          title,
          message,
          sent_at: new Date().toISOString(),
        })
        if (notifError) {
          console.error('Erro ao criar notificação de publicação:', notifError.message)
        }
      }
    },
    onSuccess: invalidate,
  })

  const deletePublication = useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient()
      const { error } = await supabase.from('publications').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: invalidate,
  })

  return { publications, savePublication, deletePublication }
}

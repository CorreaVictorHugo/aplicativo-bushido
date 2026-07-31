'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { Publication } from '@/lib/supabase/types'

async function fetchPublished(): Promise<Publication[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('publications')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  if (error) {
    console.error('Erro ao listar publicações:', JSON.stringify({ message: error.message, code: error.code }))
    throw error
  }
  return data ?? []
}

export function usePublications() {
  return useQuery({
    queryKey: ['publications'],
    queryFn: fetchPublished,
    staleTime: 60 * 1000,
  })
}

'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { Training } from '@/lib/supabase/types'

async function fetchTrainings(): Promise<Training[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('trainings')
    .select('*')
    .order('weekday', { ascending: true })
    .order('time', { ascending: true })

  if (error) {
    console.error('Erro ao listar treinos:', JSON.stringify({ message: error.message, code: error.code }))
    throw error
  }
  return data ?? []
}

export function useAdminTrainings() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['admin-trainings'],
    queryFn: fetchTrainings,
    staleTime: 30 * 1000,
  })

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin-trainings'] })

  const createTraining = useMutation({
    mutationFn: async (values: Record<string, unknown>) => {
      const supabase = createClient()
      const { error } = await supabase.from('trainings').insert(values)
      if (error) throw error
    },
    onSuccess: invalidate,
  })

  const updateTraining = useMutation({
    mutationFn: async ({ id, values }: { id: string; values: Record<string, unknown> }) => {
      const supabase = createClient()
      const { error } = await supabase.from('trainings').update(values).eq('id', id)
      if (error) throw error
    },
    onSuccess: invalidate,
  })

  const toggleTraining = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'active' | 'inactive' }) => {
      const supabase = createClient()
      const { error } = await supabase.from('trainings').update({ status }).eq('id', id)
      if (error) throw error
    },
    onSuccess: invalidate,
  })

  return { ...query, createTraining, updateTraining, toggleTraining }
}

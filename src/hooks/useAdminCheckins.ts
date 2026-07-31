'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { CheckIn } from '@/lib/supabase/types'

export type CheckinWithDetails = CheckIn & {
  students: { name: string } | null
  trainings: { modality: string; time: string; location: string; weekday: number } | null
}

async function fetchPending(): Promise<CheckinWithDetails[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('checkins')
    .select('*, students(name), trainings(modality, time, location, weekday)')
    .eq('status', 'pending')
    .order('checkin_at', { ascending: true })

  if (error) {
    console.error('Erro ao buscar check-ins pendentes:', JSON.stringify({ message: error.message, code: error.code }))
    throw error
  }
  return data ?? []
}

async function fetchHistory(): Promise<CheckinWithDetails[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('checkins')
    .select('*, students(name), trainings(modality, time, location, weekday)')
    .order('class_date', { ascending: false })
    .order('checkin_at', { ascending: false })
    .limit(200)

  if (error) {
    console.error('Erro ao buscar histórico de check-ins:', JSON.stringify({ message: error.message, code: error.code }))
    throw error
  }
  return data ?? []
}

export function useAdminCheckins() {
  const queryClient = useQueryClient()

  const pending = useQuery({
    queryKey: ['admin-checkins-pending'],
    queryFn: fetchPending,
    staleTime: 30 * 1000,
  })

  const history = useQuery({
    queryKey: ['admin-checkins-history'],
    queryFn: fetchHistory,
    staleTime: 30 * 1000,
  })

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-checkins-pending'] })
    queryClient.invalidateQueries({ queryKey: ['admin-checkins-history'] })
    queryClient.invalidateQueries({ queryKey: ['notifications'] })
  }

  const decide = useMutation({
    mutationFn: async ({
      checkin,
      status,
    }: {
      checkin: CheckinWithDetails
      status: 'confirmed' | 'rejected'
    }) => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Não autenticado')

      const { error } = await supabase
        .from('checkins')
        .update({ status, decided_by: user.id, decided_at: new Date().toISOString() })
        .eq('id', checkin.id)

      if (error) {
        console.error('Erro ao decidir check-in:', JSON.stringify({ message: error.message, code: error.code }))
        throw error
      }

      const trainingLabel = checkin.trainings?.modality || 'Treino'
      const title = status === 'confirmed' ? 'Check-in confirmado' : 'Check-in recusado'
      const message =
        status === 'confirmed'
          ? `Sua presença em ${trainingLabel} foi confirmada.`
          : `Seu check-in em ${trainingLabel} foi recusado.`

      await supabase.from('notifications').insert({
        target_profile: 'specific',
        target_student_id: checkin.student_id,
        title,
        message,
        sent_at: new Date().toISOString(),
      })
    },
    onSuccess: invalidate,
  })

  return { pending, history, decide }
}

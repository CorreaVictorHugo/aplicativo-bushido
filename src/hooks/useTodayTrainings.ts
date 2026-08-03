'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { localDateString } from '@/lib/dates'
import type { Training, CheckIn } from '@/lib/supabase/types'

export type TodayTraining = Training & { checkin: CheckIn | null }

export type TodayData = {
  trainings: TodayTraining[]
  studentId: string | null
  status: 'active' | 'inactive' | null
}

async function fetchToday(): Promise<TodayData> {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) return { trainings: [], studentId: null, status: null }

  const { data: student } = await supabase
    .from('students')
    .select('id, status')
    .eq('profile_id', session.user.id)
    .maybeSingle()

  if (!student) return { trainings: [], studentId: null, status: null }

  const today = new Date()
  const weekday = today.getDay()
  const classDate = localDateString(today)

  const { data: trainings } = await supabase
    .from('trainings')
    .select('*')
    .eq('weekday', weekday)
    .eq('status', 'active')
    .order('time', { ascending: true })

  const { data: checkins } = await supabase
    .from('checkins')
    .select('*')
    .eq('student_id', student.id)
    .eq('class_date', classDate)

  const checkinMap = new Map((checkins ?? []).map((c) => [c.training_id, c]))

  return {
    trainings: (trainings ?? []).map((t) => ({ ...t, checkin: checkinMap.get(t.id) ?? null })),
    studentId: student.id,
    status: student.status,
  }
}

export function useTodayTrainings() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['today-trainings'],
    queryFn: fetchToday,
    staleTime: 60 * 1000,
  })

  const doCheckin = useMutation({
    mutationFn: async (trainingId: string) => {
      const supabase = createClient()
      const today = await queryClient.ensureQueryData({
        queryKey: ['today-trainings'],
        queryFn: fetchToday,
      })
      if (!today.studentId) throw new Error('Aluno não encontrado')

      const { data, error } = await supabase
        .from('checkins')
        .insert({
          student_id: today.studentId,
          training_id: trainingId,
          class_date: localDateString(),
          status: 'pending',
        })
        .select()
        .single()

      if (error) {
        console.error('Erro no check-in:', JSON.stringify({ message: error.message, code: error.code, details: error.details }))
        throw error
      }
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['today-trainings'] })
      queryClient.invalidateQueries({ queryKey: ['week-trainings'] })
      queryClient.invalidateQueries({ queryKey: ['next-training'] })
    },
  })

  return { ...query, doCheckin }
}

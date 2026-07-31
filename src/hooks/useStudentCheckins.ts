'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { CheckIn } from '@/lib/supabase/types'

export type StudentCheckin = CheckIn & {
  trainings: { modality: string; time: string; location: string } | null
}

async function fetchStudentCheckins(): Promise<StudentCheckin[]> {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) return []

  const { data: student } = await supabase
    .from('students')
    .select('id')
    .eq('profile_id', session.user.id)
    .maybeSingle()

  if (!student) return []

  const { data, error } = await supabase
    .from('checkins')
    .select('*, trainings(modality, time, location)')
    .eq('student_id', student.id)
    .eq('status', 'confirmed')
    .order('class_date', { ascending: false })

  if (error) {
    console.error('Erro ao buscar presenças:', JSON.stringify({ message: error.message, code: error.code }))
    throw error
  }
  return data ?? []
}

export function useStudentCheckins() {
  return useQuery({
    queryKey: ['student-checkins'],
    queryFn: fetchStudentCheckins,
    staleTime: 60 * 1000,
  })
}

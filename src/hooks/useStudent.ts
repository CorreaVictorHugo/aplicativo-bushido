'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { StudentWithGraduations } from '@/lib/supabase/types'

async function fetchStudent(): Promise<StudentWithGraduations | null> {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) return null

  const { data: student, error } = await supabase
    .from('students')
    .select('*, graduations(belt, degree, date, responsible_name, notes)')
    .eq('profile_id', session.user.id)
    .maybeSingle()

  if (error) {
    console.error(
      'Erro ao buscar aluno:',
      JSON.stringify({ message: error.message, code: error.code, details: error.details })
    )
    return null
  }

  return student
}

export function useStudent() {
  return useQuery({
    queryKey: ['student'],
    queryFn: fetchStudent,
    staleTime: 60 * 1000,
  })
}
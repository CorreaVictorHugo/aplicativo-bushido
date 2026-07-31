'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { Payment } from '@/lib/supabase/types'

async function fetchStudentPayments(): Promise<Payment[]> {
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
    .from('payments')
    .select('*')
    .eq('student_id', student.id)
    .order('date', { ascending: false })

  if (error) {
    console.error('Erro ao buscar pagamentos:', JSON.stringify({ message: error.message, code: error.code }))
    throw error
  }
  return data ?? []
}

export function useStudentPayments() {
  return useQuery({
    queryKey: ['student-payments'],
    queryFn: fetchStudentPayments,
    staleTime: 60 * 1000,
  })
}

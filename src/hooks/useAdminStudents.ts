'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { Student } from '@/lib/supabase/types'

export type StudentWithProfile = Student & { profiles: { email: string } | null }

async function fetchStudents(): Promise<StudentWithProfile[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('students')
    .select('*, profiles(email)')
    .order('name', { ascending: true })

  if (error) {
    console.error('Erro ao listar alunos:', JSON.stringify({ message: error.message, code: error.code }))
    throw error
  }
  return data ?? []
}

export function useAdminStudents() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['admin-students'],
    queryFn: fetchStudents,
    staleTime: 30 * 1000,
  })

  const updateStudent = useMutation({
    mutationFn: async ({ id, values }: { id: string; values: Record<string, unknown> }) => {
      const supabase = createClient()
      const { error } = await supabase.from('students').update(values).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-students'] })
    },
  })

  const deleteStudent = useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient()
      const { error } = await supabase.from('students').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-students'] })
    },
  })

  return { ...query, updateStudent, deleteStudent }
}

'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { Graduation, Student } from '@/lib/supabase/types'

export type GraduationWithStudent = Graduation & {
  students: { name: string } | null
}

async function fetchGraduations(): Promise<GraduationWithStudent[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('graduations')
    .select('*, students(name)')
    .order('date', { ascending: false })
    .limit(200)

  if (error) {
    console.error('Erro ao listar graduações:', JSON.stringify({ message: error.message, code: error.code }))
    throw error
  }
  return data ?? []
}

async function fetchStudents(): Promise<Pick<Student, 'id' | 'name' | 'belt' | 'degree' | 'status'>[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('students')
    .select('id, name, belt, degree, status')
    .eq('status', 'active')
    .order('name', { ascending: true })

  if (error) {
    console.error('Erro ao listar alunos:', JSON.stringify({ message: error.message, code: error.code }))
    throw error
  }
  return data ?? []
}

export function useAdminGraduations() {
  const queryClient = useQueryClient()

  const graduations = useQuery({
    queryKey: ['admin-graduations'],
    queryFn: fetchGraduations,
    staleTime: 30 * 1000,
  })

  const students = useQuery({
    queryKey: ['admin-graduation-students'],
    queryFn: fetchStudents,
    staleTime: 60 * 1000,
  })

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-graduations'] })
    queryClient.invalidateQueries({ queryKey: ['admin-students'] })
    queryClient.invalidateQueries({ queryKey: ['student'] })
  }

  const register = useMutation({
    mutationFn: async (values: {
      student_id: string
      belt: string
      degree: number
      date: string
      responsible_name?: string
      notes?: string
    }) => {
      const supabase = createClient()

      const { error: insertError } = await supabase.from('graduations').insert({
        student_id: values.student_id,
        belt: values.belt,
        degree: values.degree,
        date: values.date,
        responsible_name: values.responsible_name || null,
        notes: values.notes || null,
      })
      if (insertError) throw insertError

      const { error: updateError } = await supabase
        .from('students')
        .update({ belt: values.belt, degree: values.degree })
        .eq('id', values.student_id)
      if (updateError) throw updateError
    },
    onSuccess: invalidate,
  })

  return { graduations, students, register }
}

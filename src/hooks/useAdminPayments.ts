'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { Payment, Student } from '@/lib/supabase/types'

export type PaymentWithStudent = Payment & { students: { name: string } | null }

async function fetchPayments(studentId?: string): Promise<PaymentWithStudent[]> {
  const supabase = createClient()
  let query = supabase.from('payments').select('*, students(name)').order('date', { ascending: false })
  if (studentId) query = query.eq('student_id', studentId)

  const { data, error } = await query.limit(200)
  if (error) {
    console.error('Erro ao listar pagamentos:', JSON.stringify({ message: error.message, code: error.code }))
    throw error
  }
  return data ?? []
}

async function fetchStudentsWithPayments(): Promise<
  (Pick<Student, 'id' | 'name' | 'status'> & { payments: Pick<Payment, 'status' | 'date' | 'reference'>[] })[]
> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('students')
    .select('id, name, status, payments(status, date, reference)')
    .order('name', { ascending: true })

  if (error) {
    console.error('Erro ao listar alunos com pagamentos:', JSON.stringify({ message: error.message, code: error.code }))
    throw error
  }
  return (data ?? []) as never
}

export function useAdminPayments(studentId?: string) {
  const queryClient = useQueryClient()

  const payments = useQuery({
    queryKey: ['admin-payments', studentId ?? 'all'],
    queryFn: () => fetchPayments(studentId),
    staleTime: 30 * 1000,
  })

  const studentsWithPayments = useQuery({
    queryKey: ['admin-students-payments'],
    queryFn: fetchStudentsWithPayments,
    staleTime: 30 * 1000,
  })

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-payments'] })
    queryClient.invalidateQueries({ queryKey: ['admin-students-payments'] })
  }

  const createPayment = useMutation({
    mutationFn: async (values: {
      student_id: string
      reference: string
      date: string
      amount?: number
      status: 'paid' | 'pending' | 'overdue'
      notes?: string
    }) => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Não autenticado')

      const { error } = await supabase.from('payments').insert({
        student_id: values.student_id,
        reference: values.reference,
        date: values.date,
        amount: values.amount ?? null,
        status: values.status,
        notes: values.notes || null,
        registered_by: user.id,
      })
      if (error) throw error
    },
    onSuccess: invalidate,
  })

  const deletePayment = useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient()
      const { error } = await supabase.from('payments').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: invalidate,
  })

  return { payments, studentsWithPayments, createPayment, deletePayment }
}

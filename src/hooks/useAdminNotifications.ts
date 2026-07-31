'use client'

import { useMutation } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export type NewNotification = {
  target_profile: 'all' | 'students' | 'admins' | 'specific'
  target_student_id?: string
  title: string
  message: string
}

async function sendNotification(n: NewNotification): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from('notifications').insert({
    target_profile: n.target_profile,
    target_student_id: n.target_profile === 'specific' ? n.target_student_id || null : null,
    title: n.title,
    message: n.message,
    sent_at: new Date().toISOString(),
  })
  if (error) {
    console.error('Erro ao enviar notificação:', JSON.stringify({ message: error.message, code: error.code }))
    throw error
  }
}

export function useAdminNotifications() {
  return useMutation({
    mutationFn: sendNotification,
  })
}

import { z } from 'zod'

export const notificationSchema = z.object({
  target_profile: z.enum(['all', 'students', 'admins', 'specific']),
  target_student_id: z.string().optional(),
  title: z.string().min(1, 'Título é obrigatório'),
  message: z.string().min(1, 'Mensagem é obrigatória'),
})

export type NotificationFormData = z.infer<typeof notificationSchema>

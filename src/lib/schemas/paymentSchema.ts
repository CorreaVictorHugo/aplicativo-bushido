import { z } from 'zod'

export const paymentSchema = z.object({
  student_id: z.string().min(1, 'Selecione o aluno'),
  reference: z.string().min(1, 'Referência é obrigatória').max(50, 'Referência muito longa'),
  date: z.string().min(1, 'Data é obrigatória'),
  amount: z.string().optional().refine(
    (val) => !val || (!isNaN(Number(val)) && Number(val) >= 0),
    { message: 'Valor deve ser um número maior ou igual a zero' }
  ),
  status: z.enum(['paid', 'pending', 'overdue']),
  notes: z.string().optional(),
})

export type PaymentFormData = z.infer<typeof paymentSchema>

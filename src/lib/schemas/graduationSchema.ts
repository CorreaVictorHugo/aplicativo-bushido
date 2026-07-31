import { z } from 'zod'

export const graduationSchema = z.object({
  student_id: z.string().min(1, 'Selecione o aluno'),
  belt: z.enum(['white', 'blue', 'purple', 'brown', 'black', 'red', 'coral']),
  degree: z.string().refine((val) => ['0', '1', '2', '3', '4'].includes(val), 'Grau deve ser entre 0 e 4'),
  date: z.string().min(1, 'Data é obrigatória'),
  responsible_name: z.string().optional(),
  notes: z.string().optional(),
})

export type GraduationFormData = z.infer<typeof graduationSchema>

import { z } from 'zod'

const beltEnum = z.enum(['white', 'blue', 'purple', 'brown', 'black', 'red', 'coral'])

export const studentFormSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().optional(),
  password: z.string().optional(),
  phone: z.string().optional().refine(
    (val) => !val || val.replace(/\D/g, '').length === 0 || (val.replace(/\D/g, '').length >= 10 && val.replace(/\D/g, '').length <= 11),
    { message: 'Telefone deve ter entre 10 e 11 dígitos' }
  ),
  birth_date: z.string().optional(),
  weight: z.string().optional().refine(
    (val) => !val || !isNaN(Number(val)),
    { message: 'Peso deve ser um número' }
  ),
  belt: beltEnum,
  degree: z.string().refine((val) => ['0', '1', '2', '3', '4'].includes(val), 'Grau deve ser entre 0 e 4'),
  entry_date: z.string().min(1, 'Data de entrada é obrigatória'),
  status: z.enum(['active', 'inactive']),
  notes: z.string().optional(),
})

export const createStudentSchema = studentFormSchema
  .extend({
    email: z.string().min(1, 'E-mail é obrigatório').email('E-mail inválido'),
    password: z.string().min(1, 'Senha é obrigatória').min(6, 'Senha deve ter no mínimo 6 caracteres'),
  })

export const editStudentSchema = studentFormSchema

export type StudentFormData = z.infer<typeof studentFormSchema>
export type CreateStudentData = z.infer<typeof createStudentSchema>
export type EditStudentData = z.infer<typeof editStudentSchema>

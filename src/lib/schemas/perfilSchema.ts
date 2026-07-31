import { z } from 'zod'

export const perfilSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').min(3, 'Nome deve ter no mínimo 3 caracteres'),
  phone: z.string().min(1, 'Telefone é obrigatório').refine(
    (val) => { const digits = val.replace(/\D/g, ''); return digits.length >= 10 && digits.length <= 11 },
    { message: 'Telefone deve ter entre 10 e 11 dígitos' }
  ),
  weight: z.string().optional().refine(
    (val) => !val || !isNaN(Number(val)),
    { message: 'Peso deve ser um número' }
  ),
  birthDate: z.string().min(1, 'Data de nascimento é obrigatória').refine((val) => {
    const date = new Date(val); const today = new Date(); return !isNaN(date.getTime()) && date < today
  }, 'Data de nascimento inválida'),
})

export type PerfilData = z.infer<typeof perfilSchema>
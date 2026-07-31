import { z } from 'zod'

const weekdayOptions = [
  { value: '0', label: 'Domingo' },
  { value: '1', label: 'Segunda-feira' },
  { value: '2', label: 'Terça-feira' },
  { value: '3', label: 'Quarta-feira' },
  { value: '4', label: 'Quinta-feira' },
  { value: '5', label: 'Sexta-feira' },
  { value: '6', label: 'Sábado' },
]

export const trainingSchema = z.object({
  modality: z.string().min(1, 'Modalidade é obrigatória').min(2, 'Modalidade muito curta'),
  weekday: z.string().refine((val) => ['0', '1', '2', '3', '4', '5', '6'].includes(val), 'Dia da semana inválido'),
  time: z.string().min(1, 'Horário é obrigatório').regex(/^\d{2}:\d{2}$/, 'Horário inválido'),
  location: z.string().min(1, 'Local é obrigatório'),
  capacity: z.string().refine((val) => !val || (Number(val) > 0 && Number.isInteger(Number(val))), 'Capacidade deve ser um número inteiro positivo'),
  status: z.enum(['active', 'inactive']),
})

export type TrainingFormData = z.infer<typeof trainingSchema>

export { weekdayOptions }

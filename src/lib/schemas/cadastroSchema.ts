import { z } from 'zod'

export const cadastroSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Nome é obrigatório')
      .min(3, 'Nome deve ter no mínimo 3 caracteres'),
    email: z
      .string()
      .min(1, 'E-mail é obrigatório')
      .email('E-mail inválido'),
    password: z
      .string()
      .min(1, 'Senha é obrigatória')
      .min(6, 'Senha deve ter no mínimo 6 caracteres')
      .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
      .regex(/[0-9]/, 'Senha deve conter pelo menos um número'),
    confirmPassword: z
      .string()
      .min(1, 'Confirmação de senha é obrigatória'),
    birthDate: z
      .string()
      .min(1, 'Data de nascimento é obrigatória')
      .refine((val) => {
        const date = new Date(val)
        const today = new Date()
        return !isNaN(date.getTime()) && date < today
      }, 'Data de nascimento inválida'),
    phone: z
      .string()
      .min(1, 'Telefone é obrigatório')
      .refine(
        (val) => {
          const digits = val.replace(/\D/g, '')
          return digits.length >= 10 && digits.length <= 11
        },
        { message: 'Telefone deve ter entre 10 e 11 dígitos' }
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Senhas não conferem',
    path: ['confirmPassword'],
  })

export type CadastroData = z.infer<typeof cadastroSchema>

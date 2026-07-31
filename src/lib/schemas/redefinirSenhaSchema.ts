import { z } from 'zod'

// Schema de validação para redefinição de senha
export const redefinirSenhaSchema = z
  .object({
    // Nova senha: obrigatória, min 6 chars, 1 maiúscula, 1 número
    password: z
      .string()
      .min(1, 'Nova senha é obrigatória')
      .min(6, 'Senha deve ter no mínimo 6 caracteres')
      .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
      .regex(/[0-9]/, 'Senha deve conter pelo menos um número'),
    // Confirmação de senha: obrigatória
    confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatória'),
  })
  // Refinamento: senhas devem coincidir
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Senhas não conferem',
    path: ['confirmPassword'],
  })

// Tipo inferido do schema para TypeScript
export type RedefinirSenhaData = z.infer<typeof redefinirSenhaSchema>
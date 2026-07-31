import { z } from 'zod'

// Schema de validação do formulário de login usando Zod v4
export const loginSchema = z.object({
  // E-mail obrigatório com formato válido
  email: z
    .string()
    .min(1, 'E-mail é obrigatório')
    .email('E-mail inválido'),
  // Senha obrigatória (validação de força feita no backend)
  password: z.string().min(1, 'Senha é obrigatória'),
})

// Tipo inferido do schema para TypeScript
export type LoginData = z.infer<typeof loginSchema>
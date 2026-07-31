import { z } from 'zod'

// Schema de validação para solicitação de recuperação de senha
export const recuperarSenhaSchema = z.object({
  // E-mail obrigatório com formato válido
  email: z
    .string()
    .min(1, 'E-mail é obrigatório')
    .email('E-mail inválido'),
})

// Tipo inferido do schema para TypeScript
export type RecuperarSenhaData = z.infer<typeof recuperarSenhaSchema>
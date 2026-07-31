import { describe, it, expect } from 'vitest'
import { cadastroSchema } from './cadastroSchema'

const validBase = {
  name: 'João da Silva',
  email: 'joao@example.com',
  password: 'Senha123',
  confirmPassword: 'Senha123',
  birthDate: '2000-01-01',
  phone: '(11) 99999-9999',
}

describe('cadastroSchema', () => {
  it('aceita dados válidos', () => {
    const result = cadastroSchema.safeParse(validBase)
    expect(result.success).toBe(true)
  })

  it('rejeita nome curto', () => {
    const result = cadastroSchema.safeParse({ ...validBase, name: 'Jo' })
    expect(result.success).toBe(false)
  })

  it('rejeita e-mail inválido', () => {
    const result = cadastroSchema.safeParse({ ...validBase, email: 'nao-e-email' })
    expect(result.success).toBe(false)
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path[0] === 'email')
      expect(issue?.message).toContain('E-mail')
    }
  })

  it('rejeita senha sem maiúscula', () => {
    const result = cadastroSchema.safeParse({ ...validBase, password: 'senha123', confirmPassword: 'senha123' })
    expect(result.success).toBe(false)
  })

  it('rejeita senha sem número', () => {
    const result = cadastroSchema.safeParse({ ...validBase, password: 'Senhaabc', confirmPassword: 'Senhaabc' })
    expect(result.success).toBe(false)
  })

  it('rejeita senhas que não conferem', () => {
    const result = cadastroSchema.safeParse({ ...validBase, confirmPassword: 'Diferente1' })
    expect(result.success).toBe(false)
  })

  it('rejeita telefone com menos de 10 dígitos', () => {
    const result = cadastroSchema.safeParse({ ...validBase, phone: '(11) 9999' })
    expect(result.success).toBe(false)
  })

  it('rejeita data de nascimento no futuro', () => {
    const result = cadastroSchema.safeParse({ ...validBase, birthDate: '2999-01-01' })
    expect(result.success).toBe(false)
  })
})

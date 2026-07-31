import { describe, it, expect } from 'vitest'
import { loginSchema } from './loginSchema'

describe('loginSchema', () => {
  it('aceita dados válidos', () => {
    const result = loginSchema.safeParse({ email: 'joao@example.com', password: 'qualquer' })
    expect(result.success).toBe(true)
  })

  it('rejeita e-mail inválido', () => {
    const result = loginSchema.safeParse({ email: 'invalido', password: 'x' })
    expect(result.success).toBe(false)
  })

  it('rejeita senha vazia', () => {
    const result = loginSchema.safeParse({ email: 'joao@example.com', password: '' })
    expect(result.success).toBe(false)
  })

  it('rejeita e-mail vazio', () => {
    const result = loginSchema.safeParse({ email: '', password: 'x' })
    expect(result.success).toBe(false)
  })
})

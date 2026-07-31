import { describe, it, expect } from 'vitest'
import { perfilSchema } from './perfilSchema'

const validBase = {
  name: 'João da Silva',
  phone: '(11) 99999-9999',
  weight: '80',
  birthDate: '2000-01-01',
}

describe('perfilSchema', () => {
  it('aceita dados válidos com peso', () => {
    expect(perfilSchema.safeParse(validBase).success).toBe(true)
  })

  it('aceita peso vazio (opcional)', () => {
    expect(perfilSchema.safeParse({ ...validBase, weight: '' }).success).toBe(true)
  })

  it('rejeita peso não numérico', () => {
    const result = perfilSchema.safeParse({ ...validBase, weight: 'abc' })
    expect(result.success).toBe(false)
  })

  it('rejeita telefone inválido', () => {
    const result = perfilSchema.safeParse({ ...validBase, phone: '123' })
    expect(result.success).toBe(false)
  })

  it('rejeita data de nascimento no futuro', () => {
    const result = perfilSchema.safeParse({ ...validBase, birthDate: '2999-01-01' })
    expect(result.success).toBe(false)
  })

  it('rejeita nome curto', () => {
    const result = perfilSchema.safeParse({ ...validBase, name: 'Jo' })
    expect(result.success).toBe(false)
  })
})

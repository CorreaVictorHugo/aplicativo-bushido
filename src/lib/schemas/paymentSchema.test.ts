import { describe, it, expect } from 'vitest'
import { paymentSchema } from './paymentSchema'

const validBase = {
  student_id: '123e4567-e89b-12d3-a456-426614174000',
  reference: '2026-07',
  date: '2026-07-15',
  amount: '150.00',
  status: 'paid',
}

describe('paymentSchema', () => {
  it('aceita dados válidos com valor', () => {
    expect(paymentSchema.safeParse(validBase).success).toBe(true)
  })

  it('aceita valor vazio (opcional)', () => {
    expect(paymentSchema.safeParse({ ...validBase, amount: '' }).success).toBe(true)
  })

  it('rejeita referência vazia', () => {
    const result = paymentSchema.safeParse({ ...validBase, reference: '' })
    expect(result.success).toBe(false)
  })

  it('rejeita valor negativo', () => {
    const result = paymentSchema.safeParse({ ...validBase, amount: '-10' })
    expect(result.success).toBe(false)
  })

  it('rejeita valor não numérico', () => {
    const result = paymentSchema.safeParse({ ...validBase, amount: 'abc' })
    expect(result.success).toBe(false)
  })

  it('rejeita status inválido', () => {
    const result = paymentSchema.safeParse({ ...validBase, status: 'cancelado' })
    expect(result.success).toBe(false)
  })

  it('rejeita data vazia', () => {
    const result = paymentSchema.safeParse({ ...validBase, date: '' })
    expect(result.success).toBe(false)
  })
})

import { describe, it, expect } from 'vitest'
import { graduationSchema } from './graduationSchema'

const validBase = {
  student_id: '123e4567-e89b-12d3-a456-426614174000',
  belt: 'blue',
  degree: '1',
  date: '2025-03-15',
}

describe('graduationSchema', () => {
  it('aceita dados válidos', () => {
    expect(graduationSchema.safeParse(validBase).success).toBe(true)
  })

  it('aceita campos opcionais preenchidos', () => {
    const result = graduationSchema.safeParse({
      ...validBase,
      responsible_name: 'Prof. Carlos',
      notes: 'Bom desempenho',
    })
    expect(result.success).toBe(true)
  })

  it('rejeita aluno não selecionado', () => {
    const result = graduationSchema.safeParse({ ...validBase, student_id: '' })
    expect(result.success).toBe(false)
  })

  it('rejeita grau fora do intervalo 0-4', () => {
    const result = graduationSchema.safeParse({ ...validBase, degree: '7' })
    expect(result.success).toBe(false)
  })

  it('rejeita faixa inválida', () => {
    const result = graduationSchema.safeParse({ ...validBase, belt: 'green' })
    expect(result.success).toBe(false)
  })

  it('rejeita data vazia', () => {
    const result = graduationSchema.safeParse({ ...validBase, date: '' })
    expect(result.success).toBe(false)
  })
})

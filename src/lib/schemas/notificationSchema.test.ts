import { describe, it, expect } from 'vitest'
import { notificationSchema } from './notificationSchema'

const validBase = {
  target_profile: 'all',
  title: 'Aula cancelada',
  message: 'A aula de hoje foi cancelada.',
}

describe('notificationSchema', () => {
  it('aceita dados válidos', () => {
    expect(notificationSchema.safeParse(validBase).success).toBe(true)
  })

  it('aceita target_profile specific com student id', () => {
    const result = notificationSchema.safeParse({
      ...validBase,
      target_profile: 'specific',
      target_student_id: '123e4567-e89b-12d3-a456-426614174000',
    })
    expect(result.success).toBe(true)
  })

  it('rejeita título vazio', () => {
    const result = notificationSchema.safeParse({ ...validBase, title: '' })
    expect(result.success).toBe(false)
  })

  it('rejeita mensagem vazia', () => {
    const result = notificationSchema.safeParse({ ...validBase, message: '' })
    expect(result.success).toBe(false)
  })

  it('rejeita target_profile inválido', () => {
    const result = notificationSchema.safeParse({ ...validBase, target_profile: 'todos' })
    expect(result.success).toBe(false)
  })
})

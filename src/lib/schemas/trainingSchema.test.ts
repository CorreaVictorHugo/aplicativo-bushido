import { describe, it, expect } from 'vitest'
import { trainingSchema } from './trainingSchema'

const validBase = {
  modality: 'Jiu-Jitsu',
  weekday: '1',
  time: '19:00',
  location: 'Tatame 1',
  capacity: '30',
  status: 'active',
}

describe('trainingSchema', () => {
  it('aceita dados válidos', () => {
    expect(trainingSchema.safeParse(validBase).success).toBe(true)
  })

  it('rejeita modalidade vazia', () => {
    const result = trainingSchema.safeParse({ ...validBase, modality: '' })
    expect(result.success).toBe(false)
  })

  it('rejeita dia da semana inválido', () => {
    const result = trainingSchema.safeParse({ ...validBase, weekday: '9' })
    expect(result.success).toBe(false)
  })

  it('rejeita horário mal formatado', () => {
    const result = trainingSchema.safeParse({ ...validBase, time: '7h' })
    expect(result.success).toBe(false)
  })

  it('rejeita capacidade não inteira positiva', () => {
    const result = trainingSchema.safeParse({ ...validBase, capacity: '-5' })
    expect(result.success).toBe(false)
  })

  it('aceita capacidade vazia (usa default no form)', () => {
    expect(trainingSchema.safeParse({ ...validBase, capacity: '' }).success).toBe(true)
  })
})

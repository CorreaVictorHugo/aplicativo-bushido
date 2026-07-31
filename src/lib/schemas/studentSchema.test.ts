import { describe, it, expect } from 'vitest'
import { studentFormSchema, createStudentSchema } from './studentSchema'

const validBase = {
  name: 'Maria Souza',
  phone: '(21) 98888-7777',
  birth_date: '2001-05-10',
  weight: '65',
  belt: 'white',
  degree: '0',
  entry_date: '2024-01-10',
  status: 'active',
  notes: '',
}

describe('studentFormSchema', () => {
  it('aceita dados válidos', () => {
    expect(studentFormSchema.safeParse(validBase).success).toBe(true)
  })

  it('rejeita nome curto', () => {
    const result = studentFormSchema.safeParse({ ...validBase, name: 'Ma' })
    expect(result.success).toBe(false)
  })

  it('rejeita telefone inválido', () => {
    const result = studentFormSchema.safeParse({ ...validBase, phone: '123' })
    expect(result.success).toBe(false)
  })

  it('rejeita grau fora do intervalo', () => {
    const result = studentFormSchema.safeParse({ ...validBase, degree: '9' })
    expect(result.success).toBe(false)
  })

  it('rejeita data de entrada vazia', () => {
    const result = studentFormSchema.safeParse({ ...validBase, entry_date: '' })
    expect(result.success).toBe(false)
  })
})

describe('createStudentSchema', () => {
  it('exige e-mail válido para criação', () => {
    const result = createStudentSchema.safeParse({ ...validBase, email: 'invalido', password: 'Senha123' })
    expect(result.success).toBe(false)
  })

  it('exige senha com mínimo de 6 caracteres', () => {
    const result = createStudentSchema.safeParse({ ...validBase, email: 'maria@example.com', password: '123' })
    expect(result.success).toBe(false)
  })

  it('aceita criação com e-mail e senha válidos', () => {
    const result = createStudentSchema.safeParse({ ...validBase, email: 'maria@example.com', password: 'Senha123' })
    expect(result.success).toBe(true)
  })
})

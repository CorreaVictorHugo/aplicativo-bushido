import { describe, it, expect } from 'vitest'
import { publicationSchema } from './publicationSchema'

const validBase = {
  type: 'notice',
  title: 'Aviso importante',
  content: 'Texto do aviso',
  media_url: '',
  status: 'draft',
}

describe('publicationSchema', () => {
  it('aceita dados válidos', () => {
    expect(publicationSchema.safeParse(validBase).success).toBe(true)
  })

  it('aceita media_url http válida', () => {
    expect(publicationSchema.safeParse({ ...validBase, media_url: 'https://example.com/foto.jpg' }).success).toBe(true)
  })

  it('rejeita media_url sem http', () => {
    const result = publicationSchema.safeParse({ ...validBase, media_url: 'example.com/foto.jpg' })
    expect(result.success).toBe(false)
  })

  it('rejeita título vazio', () => {
    const result = publicationSchema.safeParse({ ...validBase, title: '' })
    expect(result.success).toBe(false)
  })

  it('rejeita tipo inválido', () => {
    const result = publicationSchema.safeParse({ ...validBase, type: 'artigo' })
    expect(result.success).toBe(false)
  })

  it('rejeita status inválido', () => {
    const result = publicationSchema.safeParse({ ...validBase, status: 'deleted' })
    expect(result.success).toBe(false)
  })
})

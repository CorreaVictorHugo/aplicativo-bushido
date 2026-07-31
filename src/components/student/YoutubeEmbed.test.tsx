import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { YoutubeEmbed, extractYoutubeId } from './YoutubeEmbed'

describe('extractYoutubeId', () => {
  it('extrai ID de URL watch', () => {
    expect(extractYoutubeId('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
  })

  it('extrai ID de URL youtu.be', () => {
    expect(extractYoutubeId('https://youtu.be/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
  })

  it('extrai ID de URL embed', () => {
    expect(extractYoutubeId('https://www.youtube.com/embed/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
  })

  it('extrai ID de URL shorts', () => {
    expect(extractYoutubeId('https://www.youtube.com/shorts/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
  })

  it('retorna null para URL que não é do YouTube', () => {
    expect(extractYoutubeId('https://vimeo.com/123')).toBeNull()
  })

  it('retorna null para texto sem URL', () => {
    expect(extractYoutubeId('não é uma url')).toBeNull()
  })
})

describe('YoutubeEmbed', () => {
  it('renderiza iframe para URL válida', () => {
    render(<YoutubeEmbed url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" />)
    const iframe = screen.getByTitle('Vídeo do YouTube')
    expect(iframe).toHaveAttribute('src', 'https://www.youtube.com/embed/dQw4w9WgXcQ')
  })

  it('não renderiza nada para URL inválida', () => {
    const { container } = render(<YoutubeEmbed url="https://vimeo.com/123" />)
    expect(container.firstChild).toBeNull()
  })
})

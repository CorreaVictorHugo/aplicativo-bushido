import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { GraduationTimeline } from './GraduationTimeline'
import type { Graduation } from '@/lib/supabase/types'

function makeGraduation(overrides: Partial<Graduation> = {}): Graduation {
  return {
    id: 'grad-1',
    student_id: 'student-1',
    belt: 'blue',
    degree: 1,
    date: '2025-03-15',
    responsible_name: 'Prof. Carlos',
    notes: 'Bom desempenho',
    created_at: '2025-03-15T10:00:00Z',
    ...overrides,
  }
}

describe('GraduationTimeline', () => {
  it('exibe estado vazio quando não há graduações', () => {
    render(<GraduationTimeline graduations={[]} />)
    expect(screen.getByText('Nenhuma graduação registrada ainda.')).toBeInTheDocument()
  })

  it('exibe a faixa, grau e data da graduação', () => {
    render(<GraduationTimeline graduations={[makeGraduation()]} />)
    expect(screen.getByText('Faixa Azul — 1º Grau')).toBeInTheDocument()
    expect(screen.getByText('15/03/2025')).toBeInTheDocument()
  })

  it('exibe professor responsável', () => {
    render(<GraduationTimeline graduations={[makeGraduation()]} />)
    expect(screen.getByText(/Prof\. Carlos/)).toBeInTheDocument()
  })

  it('exibe múltiplas graduações em ordem', () => {
    render(
      <GraduationTimeline
        graduations={[
          makeGraduation({ id: 'g1', belt: 'white', degree: 2, date: '2024-01-10' }),
          makeGraduation({ id: 'g2', belt: 'blue', degree: 0, date: '2025-03-15' }),
        ]}
      />
    )
    expect(screen.getByText('Faixa Branca — 2º Grau')).toBeInTheDocument()
    expect(screen.getByText('Faixa Azul')).toBeInTheDocument()
  })
})

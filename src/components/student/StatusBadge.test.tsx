import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatusBadge } from './StatusBadge'

describe('StatusBadge', () => {
  it('exibe "Ativo" para status active', () => {
    render(<StatusBadge status="active" />)
    expect(screen.getByText('Ativo')).toBeInTheDocument()
  })

  it('exibe "Inativo" para status inactive', () => {
    render(<StatusBadge status="inactive" />)
    expect(screen.getByText('Inativo')).toBeInTheDocument()
  })

  it('inclui aria-label com o status', () => {
    render(<StatusBadge status="active" />)
    expect(screen.getByLabelText('Status: Ativo')).toBeInTheDocument()
  })
})

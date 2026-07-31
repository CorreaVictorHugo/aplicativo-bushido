import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CheckinStatusBadge } from './CheckinStatusBadge'

describe('CheckinStatusBadge', () => {
  it('exibe "Pendente" para pending', () => {
    render(<CheckinStatusBadge status="pending" />)
    expect(screen.getByText('Pendente')).toBeInTheDocument()
  })

  it('exibe "Confirmado" para confirmed', () => {
    render(<CheckinStatusBadge status="confirmed" />)
    expect(screen.getByText('Confirmado')).toBeInTheDocument()
  })

  it('exibe "Recusado" para rejected', () => {
    render(<CheckinStatusBadge status="rejected" />)
    expect(screen.getByText('Recusado')).toBeInTheDocument()
  })

  it('exibe o valor bruto para status desconhecido', () => {
    render(<CheckinStatusBadge status="unknown" />)
    expect(screen.getByText('unknown')).toBeInTheDocument()
  })
})

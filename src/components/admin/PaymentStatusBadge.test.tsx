import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PaymentStatusBadge, computeSituation } from './PaymentStatusBadge'

describe('PaymentStatusBadge', () => {
  it('exibe "Em dia" para paid', () => {
    render(<PaymentStatusBadge situation="paid" />)
    expect(screen.getByText('Em dia')).toBeInTheDocument()
  })

  it('exibe "Pendente" para pending', () => {
    render(<PaymentStatusBadge situation="pending" />)
    expect(screen.getByText('Pendente')).toBeInTheDocument()
  })

  it('exibe "Atrasado" para overdue', () => {
    render(<PaymentStatusBadge situation="overdue" />)
    expect(screen.getByText('Atrasado')).toBeInTheDocument()
  })

  it('exibe "Sem registro" para none', () => {
    render(<PaymentStatusBadge situation="none" />)
    expect(screen.getByText('Sem registro')).toBeInTheDocument()
  })
})

describe('computeSituation', () => {
  it('retorna none quando não há pagamentos', () => {
    expect(computeSituation([])).toBe('none')
  })

  it('usa o status do pagamento mais recente', () => {
    expect(computeSituation([{ status: 'paid' }, { status: 'pending' }])).toBe('paid')
    expect(computeSituation([{ status: 'overdue' }])).toBe('overdue')
  })
})

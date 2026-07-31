import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ConfirmModal } from './ConfirmModal'

describe('ConfirmModal', () => {
  it('retorna null quando fechado', () => {
    const { container } = render(
      <ConfirmModal open={false} title="Título" message="Mensagem" onConfirm={vi.fn()} onCancel={vi.fn()} />
    )
    expect(container.firstChild).toBeNull()
  })

  it('exibe título e mensagem quando aberto', () => {
    render(
      <ConfirmModal open title="Excluir aluno" message="Esta ação é permanente" onConfirm={vi.fn()} onCancel={vi.fn()} />
    )
    expect(screen.getByText('Excluir aluno')).toBeInTheDocument()
    expect(screen.getByText('Esta ação é permanente')).toBeInTheDocument()
  })

  it('chama onConfirm ao clicar em confirmar', async () => {
    const onConfirm = vi.fn()
    const user = userEvent.setup()
    render(<ConfirmModal open title="Confirmar" message="msg" confirmLabel="Sim" onConfirm={onConfirm} onCancel={vi.fn()} />)
    await user.click(screen.getByRole('button', { name: 'Sim' }))
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it('chama onCancel ao clicar em cancelar', async () => {
    const onCancel = vi.fn()
    const user = userEvent.setup()
    render(<ConfirmModal open title="Confirmar" message="msg" onConfirm={vi.fn()} onCancel={onCancel} />)
    await user.click(screen.getByRole('button', { name: 'Cancelar' }))
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('usa label de confirmação padrão "Confirmar"', () => {
    render(<ConfirmModal open title="Confirmar" message="msg" onConfirm={vi.fn()} onCancel={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Confirmar' })).toBeInTheDocument()
  })
})

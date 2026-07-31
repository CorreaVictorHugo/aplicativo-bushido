import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PasswordField } from './PasswordField'
import type { UseFormRegisterReturn } from 'react-hook-form'

function fakeRegister(name: string): UseFormRegisterReturn {
  return {
    name,
    onChange: async () => {},
    onBlur: async () => {},
    ref: () => {},
  }
}

describe('PasswordField', () => {
  it('renderiza o label e o campo com type password', () => {
    render(<PasswordField id="password" label="Senha" registerProps={fakeRegister('password')} />)
    expect(screen.getByLabelText('Senha')).toHaveAttribute('type', 'password')
  })

  it('exibe o hint quando não há erro', () => {
    render(
      <PasswordField id="password" label="Senha" hint="Mínimo de 6 caracteres" registerProps={fakeRegister('password')} />
    )
    expect(screen.getByText('Mínimo de 6 caracteres')).toBeInTheDocument()
  })

  it('exibe erro quando presente (prioridade sobre hint)', () => {
    render(
      <PasswordField
        id="password"
        label="Senha"
        hint="hint"
        error="Senha inválida"
        registerProps={fakeRegister('password')}
      />
    )
    expect(screen.getByText('Senha inválida')).toBeInTheDocument()
    expect(screen.queryByText('hint')).not.toBeInTheDocument()
  })

  it('alterna para text ao clicar no olho', async () => {
    const user = userEvent.setup()
    render(<PasswordField id="password" label="Senha" registerProps={fakeRegister('password')} />)
    const input = screen.getByLabelText('Senha')
    expect(input).toHaveAttribute('type', 'password')

    await user.click(screen.getByRole('button', { name: 'Mostrar senha' }))
    expect(input).toHaveAttribute('type', 'text')

    await user.click(screen.getByRole('button', { name: 'Ocultar senha' }))
    expect(input).toHaveAttribute('type', 'password')
  })
})

import { describe, it, expect } from 'vitest'
import { beltLabel, beltColorClass, formatDateBr, timeInBelt } from './belt'

describe('belt', () => {
  it('beltLabel traduz todas as faixas', () => {
    expect(beltLabel('white')).toBe('Branca')
    expect(beltLabel('blue')).toBe('Azul')
    expect(beltLabel('purple')).toBe('Roxa')
    expect(beltLabel('brown')).toBe('Marrom')
    expect(beltLabel('black')).toBe('Preta')
    expect(beltLabel('red')).toBe('Vermelha')
    expect(beltLabel('coral')).toBe('Coral')
  })

  it('beltLabel retorna o próprio valor para faixas desconhecidas', () => {
    expect(beltLabel('green')).toBe('green')
  })

  it('beltColorClass retorna classes para todas as faixas', () => {
    expect(beltColorClass('white')).toContain('bg-zinc-100')
    expect(beltColorClass('blue')).toContain('bg-blue-100')
    expect(beltColorClass('black')).toContain('bg-zinc-800')
    expect(beltColorClass('green')).toContain('bg-zinc-100')
  })

  it('formatDateBr formata data ISO para pt-BR', () => {
    expect(formatDateBr('2025-03-15')).toBe('15/03/2025')
  })

  it('formatDateBr retorna o valor original para datas inválidas', () => {
    expect(formatDateBr('nao-e-data')).toBe('nao-e-data')
  })
})

describe('timeInBelt', () => {
  function dateStr(yearsBack: number, monthsBack: number): string {
    const now = new Date()
    const d = new Date(now.getFullYear() - yearsBack, now.getMonth() - monthsBack, 1)
    return d.toISOString().slice(0, 10)
  }

  it('retorna 1 ano e 1 mês para ~13 meses atrás', () => {
    expect(timeInBelt(dateStr(1, 1))).toBe('1 ano e 1 mês')
  })

  it('retorna somente anos quando meses é 0', () => {
    expect(timeInBelt(dateStr(2, 0))).toBe('2 anos')
  })

  it('retorna somente meses quando menos de 1 ano', () => {
    expect(timeInBelt(dateStr(0, 2))).toBe('2 meses')
  })

  it('retorna "—" para data inválida', () => {
    expect(timeInBelt('nao-e-data')).toBe('—')
  })
})

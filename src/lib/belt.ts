export const beltLabels: Record<string, string> = {
  white: 'Branca',
  blue: 'Azul',
  purple: 'Roxa',
  brown: 'Marrom',
  black: 'Preta',
  red: 'Vermelha',
  coral: 'Coral',
}

export function beltLabel(belt: string): string {
  return beltLabels[belt] || belt
}

export function beltColorClass(belt: string): string {
  const colors: Record<string, string> = {
    white: 'bg-zinc-100 text-zinc-700 ring-zinc-300',
    blue: 'bg-blue-100 text-blue-800 ring-blue-300',
    purple: 'bg-purple-100 text-purple-800 ring-purple-300',
    brown: 'bg-amber-100 text-amber-800 ring-amber-300',
    black: 'bg-zinc-800 text-white ring-zinc-600',
    red: 'bg-red-100 text-red-800 ring-red-300',
    coral: 'bg-orange-100 text-orange-800 ring-orange-300',
  }
  return colors[belt] || 'bg-zinc-100 text-zinc-700 ring-zinc-300'
}

export function timeInBelt(startDateStr: string): string {
  try {
    const start = new Date(startDateStr.length === 10 ? startDateStr + 'T00:00:00' : startDateStr)
    const now = new Date()
    if (isNaN(start.getTime())) return '—'

    let months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth())
    if (months < 0) months = 0

    const years = Math.floor(months / 12)
    const remMonths = months % 12

    const yearLabel = years === 1 ? 'ano' : 'anos'
    const monthLabel = remMonths === 1 ? 'mês' : 'meses'

    if (years > 0 && remMonths > 0) return `${years} ${yearLabel} e ${remMonths} ${monthLabel}`
    if (years > 0) return `${years} ${yearLabel}`
    return `${remMonths} ${monthLabel}`
  } catch {
    return '—'
  }
}

export function formatDateBr(dateStr: string): string {
  try {
    const date = new Date(dateStr + 'T00:00:00')
    if (isNaN(date.getTime())) return dateStr
    return date.toLocaleDateString('pt-BR')
  } catch {
    return dateStr
  }
}

import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { Student, Graduation } from '@/lib/supabase/types'

interface ProfileInfoProps {
  student: Student
  graduations: Graduation[]
}

const beltMap: Record<string, string> = {
  white: 'Branca',
  blue: 'Azul',
  purple: 'Roxa',
  brown: 'Marrom',
  black: 'Preta',
  red: 'Vermelha',
  coral: 'Coral',
}

function getCurrentBeltInfo(student: Student): { belt: string; degree: number } {
  return {
    belt: beltMap[student.belt] || student.belt,
    degree: student.degree,
  }
}

function getTimeInCurrentBelt(graduations: Graduation[]): string {
  if (!graduations || graduations.length === 0) return '—'

  const sorted = [...graduations].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  const latest = sorted[0]
  const startDate = new Date(latest.date)
  const now = new Date()

  const years = now.getFullYear() - startDate.getFullYear()
  const months = now.getMonth() - startDate.getMonth()

  if (years > 0) {
    return months > 0 ? `${years} ano${years > 1 ? 's' : ''} e ${months} mês${months > 1 ? 'es' : ''}` : `${years} ano${years > 1 ? 's' : ''}`
  }
  return `${months} mês${months > 1 ? 'es' : ''}`
}

function formatDate(dateStr: string): string {
  try {
    return format(new Date(dateStr), "dd/MM/yyyy", { locale: ptBR })
  } catch {
    return dateStr
  }
}

export function ProfileInfo({ student, graduations }: ProfileInfoProps) {
  const { belt, degree } = getCurrentBeltInfo(student)
  const timeInBelt = getTimeInCurrentBelt(graduations)

  const infoItems = [
    { label: 'Faixa', value: `${belt}${degree > 0 ? ` — ${degree}º Grau` : ''}` },
    { label: 'Data de entrada', value: formatDate(student.entry_date) },
    { label: 'Tempo na faixa', value: timeInBelt },
    { label: 'Peso', value: student.weight ? `${student.weight} kg` : '—' },
    { label: 'Telefone', value: student.phone || '—' },
    { label: 'Data de nascimento', value: student.birth_date ? formatDate(student.birth_date) : '—' },
  ]

  return (
    <dl className="divide-y divide-zinc-100" role="list" aria-label="Informações do perfil">
      {infoItems.map((item, index) => (
        <div key={index} className="flex justify-between px-4 py-3">
          <dt className="text-sm text-zinc-500">{item.label}</dt>
          <dd className="text-sm font-medium text-zinc-900 text-right max-w-[60%] truncate">
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  )
}
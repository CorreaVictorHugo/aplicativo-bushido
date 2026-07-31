'use client'

import Link from 'next/link'
import type { StudentWithProfile } from '@/hooks/useAdminStudents'

const beltMap: Record<string, string> = {
  white: 'Branca',
  blue: 'Azul',
  purple: 'Roxa',
  brown: 'Marrom',
  black: 'Preta',
  red: 'Vermelha',
  coral: 'Coral',
}

interface StudentTableProps {
  students: StudentWithProfile[]
  onToggleStatus: (student: StudentWithProfile) => void
  onDelete: (student: StudentWithProfile) => void
  busyIds: Set<string>
}

export function StudentTable({ students, onToggleStatus, onDelete, busyIds }: StudentTableProps) {
  if (students.length === 0) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center">
        <p className="text-sm text-zinc-500">Nenhum aluno encontrado.</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
      <ul className="divide-y divide-zinc-100" role="list" aria-label="Lista de alunos">
        {students.map((student) => {
          const busy = busyIds.has(student.id)
          return (
            <li key={student.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate font-medium text-zinc-900">{student.name}</p>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      student.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {student.status === 'active' ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-zinc-500">
                  {student.profiles?.email || '—'} · {beltMap[student.belt] || student.belt} {student.degree > 0 ? `· ${student.degree}º Grau` : ''}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={`/admin/alunos/${student.id}/editar`}
                  className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
                >
                  Editar
                </Link>
                <button
                  type="button"
                  onClick={() => onToggleStatus(student)}
                  disabled={busy}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${
                    student.status === 'active'
                      ? 'border-zinc-300 text-zinc-700 hover:bg-zinc-50'
                      : 'border-green-300 text-green-700 hover:bg-green-50'
                  }`}
                >
                  {student.status === 'active' ? 'Inativar' : 'Ativar'}
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(student)}
                  disabled={busy}
                  className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                >
                  Excluir
                </button>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

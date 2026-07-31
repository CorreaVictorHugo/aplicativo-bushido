'use client'

const beltOptions = [
  { value: 'white', label: 'Branca' },
  { value: 'blue', label: 'Azul' },
  { value: 'purple', label: 'Roxa' },
  { value: 'brown', label: 'Marrom' },
  { value: 'black', label: 'Preta' },
  { value: 'red', label: 'Vermelha' },
  { value: 'coral', label: 'Coral' },
]

export type StudentFilters = {
  search: string
  status: 'all' | 'active' | 'inactive'
  belt: 'all' | (typeof beltOptions)[number]['value']
}

interface AdminStudentFiltersProps {
  filters: StudentFilters
  onChange: (filters: StudentFilters) => void
}

export function AdminStudentFilters({ filters, onChange }: AdminStudentFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <input
        type="search"
        value={filters.search}
        onChange={(e) => onChange({ ...filters, search: e.target.value })}
        placeholder="Buscar por nome ou e-mail..."
        aria-label="Buscar alunos"
        className="w-full sm:w-64 rounded-lg border border-zinc-300 px-4 py-2.5 text-sm outline-none transition-colors focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
      />
      <select
        value={filters.status}
        onChange={(e) => onChange({ ...filters, status: e.target.value as StudentFilters['status'] })}
        aria-label="Filtrar por status"
        className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm outline-none transition-colors focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
      >
        <option value="all">Todos os status</option>
        <option value="active">Ativos</option>
        <option value="inactive">Inativos</option>
      </select>
      <select
        value={filters.belt}
        onChange={(e) => onChange({ ...filters, belt: e.target.value as StudentFilters['belt'] })}
        aria-label="Filtrar por faixa"
        className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm outline-none transition-colors focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
      >
        <option value="all">Todas as faixas</option>
        {beltOptions.map((b) => (
          <option key={b.value} value={b.value}>
            {b.label}
          </option>
        ))}
      </select>
    </div>
  )
}

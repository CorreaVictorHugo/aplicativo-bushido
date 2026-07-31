'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useAdminStudents, type StudentWithProfile } from '@/hooks/useAdminStudents'
import { AdminStudentFilters, type StudentFilters } from '@/components/admin/AdminStudentFilters'
import { StudentTable } from '@/components/admin/StudentTable'
import { ConfirmModal } from '@/components/admin/ConfirmModal'

export default function AdminAlunosPage() {
  const { data: students, isLoading, error, updateStudent, deleteStudent } = useAdminStudents()
  const [filters, setFilters] = useState<StudentFilters>({ search: '', status: 'all', belt: 'all' })
  const [toggleTarget, setToggleTarget] = useState<StudentWithProfile | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<StudentWithProfile | null>(null)
  const [busyIds, setBusyIds] = useState<Set<string>>(new Set())

  const filtered = useMemo(() => {
    if (!students) return []
    const term = filters.search.trim().toLowerCase()
    return students.filter((s) => {
      const matchSearch =
        !term ||
        s.name.toLowerCase().includes(term) ||
        (s.profiles?.email || '').toLowerCase().includes(term)
      const matchStatus = filters.status === 'all' || s.status === filters.status
      const matchBelt = filters.belt === 'all' || s.belt === filters.belt
      return matchSearch && matchStatus && matchBelt
    })
  }, [students, filters])

  const handleToggleStatus = async (student: StudentWithProfile) => {
    setBusyIds((prev) => new Set(prev).add(student.id))
    try {
      await updateStudent.mutateAsync({
        id: student.id,
        values: { status: student.status === 'active' ? 'inactive' : 'active' },
      })
    } catch (err) {
      console.error('Erro ao alterar status:', err)
      alert('Erro ao alterar o status. Tente novamente.')
    } finally {
      setBusyIds((prev) => {
        const next = new Set(prev)
        next.delete(student.id)
        return next
      })
      setToggleTarget(null)
    }
  }

  const handleDelete = async (id: string) => {
    setBusyIds((prev) => new Set(prev).add(id))
    try {
      await deleteStudent.mutateAsync(id)
    } catch (err) {
      console.error('Erro ao excluir:', err)
      alert('Erro ao excluir o aluno. Tente novamente.')
    } finally {
      setBusyIds((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
      setDeleteTarget(null)
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-zinc-900">Alunos</h1>
        <Link
          href="/admin/alunos/novo"
          className="flex h-11 items-center justify-center rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
        >
          Novo aluno
        </Link>
      </div>

      <div className="mb-4">
        <AdminStudentFilters filters={filters} onChange={setFilters} />
      </div>

      {isLoading && (
        <div className="animate-pulse space-y-3" role="status" aria-label="Carregando alunos">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 rounded-lg bg-zinc-200" />
          ))}
        </div>
      )}

      {!isLoading && error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          Não foi possível carregar os alunos. Tente novamente.
        </div>
      )}

      {!isLoading && !error && (
        <StudentTable
          students={filtered}
          busyIds={busyIds}
          onToggleStatus={(s) => setToggleTarget(s)}
          onDelete={(s) => setDeleteTarget(s)}
        />
      )}

      <ConfirmModal
        open={toggleTarget !== null}
        title={toggleTarget?.status === 'active' ? 'Inativar aluno' : 'Ativar aluno'}
        message={
          toggleTarget?.status === 'active'
            ? `Inativar ${toggleTarget.name}? O aluno ficará impossibilitado de fazer check-in, mas o histórico será preservado.`
            : `Reativar ${toggleTarget?.name}?`
        }
        confirmLabel={toggleTarget?.status === 'active' ? 'Inativar' : 'Ativar'}
        loading={toggleTarget ? busyIds.has(toggleTarget.id) : false}
        onConfirm={() => toggleTarget && handleToggleStatus(toggleTarget)}
        onCancel={() => setToggleTarget(null)}
      />

      <ConfirmModal
        open={deleteTarget !== null}
        title="Excluir aluno"
        message={`Excluir ${deleteTarget?.name}? Esta ação é permanente e removerá também o histórico de check-ins, graduações e pagamentos do aluno.`}
        confirmLabel="Excluir permanentemente"
        danger
        loading={deleteTarget ? busyIds.has(deleteTarget.id) : false}
        onConfirm={() => deleteTarget && handleDelete(deleteTarget.id)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}

import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { StudentForm } from '@/components/admin/StudentForm'

export default async function EditarAlunoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: student, error } = await supabase
    .from('students')
    .select('*, profiles(email)')
    .eq('id', id)
    .single()

  if (error || !student) {
    notFound()
  }

  const email = (student as { profiles?: { email?: string } | null }).profiles?.email

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-zinc-900 mb-6">Editar aluno</h1>
      <StudentForm
        mode="edit"
        studentId={student.id}
        initialData={{
          name: student.name,
          email,
          phone: student.phone || '',
          birth_date: student.birth_date || '',
          weight: student.weight ? String(student.weight) : '',
          belt: student.belt,
          degree: String(student.degree),
          entry_date: student.entry_date,
          status: student.status,
          notes: student.notes || '',
        }}
      />
    </div>
  )
}

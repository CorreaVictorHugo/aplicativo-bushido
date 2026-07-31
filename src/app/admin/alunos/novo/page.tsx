import { StudentForm } from '@/components/admin/StudentForm'

export default function NovoAlunoPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-zinc-900 mb-6">Novo aluno</h1>
      <StudentForm mode="create" />
    </div>
  )
}

import { TrainingForm } from '@/components/admin/TrainingForm'

export default function NovoTreinoPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900 mb-6">Novo treino</h1>
      <TrainingForm mode="create" />
    </div>
  )
}

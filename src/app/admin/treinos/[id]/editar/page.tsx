import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { TrainingForm } from '@/components/admin/TrainingForm'

export default async function EditarTreinoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: training, error } = await supabase
    .from('trainings')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !training) {
    notFound()
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900 mb-6">Editar treino</h1>
      <TrainingForm
        mode="edit"
        trainingId={training.id}
        initialData={{
          modality: training.modality,
          weekday: String(training.weekday),
          time: training.time,
          location: training.location,
          capacity: String(training.capacity),
          status: training.status,
        }}
      />
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { trainingSchema, weekdayOptions, type TrainingFormData } from '@/lib/schemas/trainingSchema'
import { useAdminTrainings } from '@/hooks/useAdminTrainings'

interface TrainingFormProps {
  mode: 'create' | 'edit'
  trainingId?: string
  initialData?: Partial<TrainingFormData>
}

export function TrainingForm({ mode, trainingId, initialData }: TrainingFormProps) {
  const router = useRouter()
  const { createTraining, updateTraining } = useAdminTrainings()
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TrainingFormData>({
    resolver: zodResolver(trainingSchema),
    defaultValues: {
      modality: initialData?.modality || 'Jiu-Jitsu',
      weekday: initialData?.weekday ?? '1',
      time: initialData?.time || '19:00',
      location: initialData?.location || '',
      capacity: initialData?.capacity || '30',
      status: initialData?.status || 'active',
    },
  })

  const onSubmit = async (data: TrainingFormData) => {
    setSubmitError(null)
    const values = {
      modality: data.modality,
      weekday: Number(data.weekday),
      time: data.time,
      location: data.location,
      capacity: data.capacity ? Number(data.capacity) : 30,
      status: data.status,
    }

    try {
      if (mode === 'create') {
        await createTraining.mutateAsync(values)
      } else {
        if (!trainingId) return
        await updateTraining.mutateAsync({ id: trainingId, values })
      }
      router.push('/admin/treinos')
      router.refresh()
    } catch (err) {
      console.error('Erro ao salvar treino:', err)
      setSubmitError('Erro ao salvar. Tente novamente.')
    }
  }

  const inputClass =
    'w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm outline-none transition-colors focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900'

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5 max-w-lg">
      {submitError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {submitError}
        </div>
      )}

      <div className="flex flex-col gap-1">
        <label htmlFor="modality" className="text-sm font-medium text-zinc-900">
          Modalidade
        </label>
        <input id="modality" type="text" placeholder="Jiu-Jitsu" {...register('modality')} className={inputClass} />
        {errors.modality && <p className="text-xs text-red-600" role="alert">{errors.modality.message}</p>}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="weekday" className="text-sm font-medium text-zinc-900">
            Dia da semana
          </label>
          <select id="weekday" {...register('weekday')} className={inputClass}>
            {weekdayOptions.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
          {errors.weekday && <p className="text-xs text-red-600" role="alert">{errors.weekday.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="time" className="text-sm font-medium text-zinc-900">
            Horário
          </label>
          <input id="time" type="time" {...register('time')} className={inputClass} />
          {errors.time && <p className="text-xs text-red-600" role="alert">{errors.time.message}</p>}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="location" className="text-sm font-medium text-zinc-900">
          Local
        </label>
        <input id="location" type="text" placeholder="Tatame 1" {...register('location')} className={inputClass} />
        {errors.location && <p className="text-xs text-red-600" role="alert">{errors.location.message}</p>}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="capacity" className="text-sm font-medium text-zinc-900">
            Capacidade máxima
          </label>
          <input id="capacity" type="number" min="1" {...register('capacity')} className={inputClass} />
          {errors.capacity && <p className="text-xs text-red-600" role="alert">{errors.capacity.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="status" className="text-sm font-medium text-zinc-900">
            Status
          </label>
          <select id="status" {...register('status')} className={inputClass}>
            <option value="active">Ativo</option>
            <option value="inactive">Inativo</option>
          </select>
          {errors.status && <p className="text-xs text-red-600" role="alert">{errors.status.message}</p>}
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-2 sm:flex-row">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex h-12 items-center justify-center rounded-lg bg-zinc-900 px-6 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? 'Salvando...' : mode === 'create' ? 'Criar treino' : 'Salvar alterações'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/treinos')}
          disabled={isSubmitting}
          className="flex h-12 items-center justify-center rounded-lg border border-zinc-300 bg-white px-6 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-50"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}

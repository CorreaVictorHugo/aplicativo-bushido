'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { graduationSchema, type GraduationFormData } from '@/lib/schemas/graduationSchema'
import { useAdminGraduations } from '@/hooks/useAdminGraduations'
import { beltLabel } from '@/lib/belt'

const beltOptions = [
  { value: 'white', label: 'Branca' },
  { value: 'blue', label: 'Azul' },
  { value: 'purple', label: 'Roxa' },
  { value: 'brown', label: 'Marrom' },
  { value: 'black', label: 'Preta' },
  { value: 'red', label: 'Vermelha' },
  { value: 'coral', label: 'Coral' },
]

export function GraduationForm() {
  const router = useRouter()
  const { students, register } = useAdminGraduations()
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register: field,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<GraduationFormData>({
    resolver: zodResolver(graduationSchema),
    defaultValues: {
      belt: 'white',
      degree: '0',
      date: new Date().toISOString().split('T')[0],
    },
  })

  const onSubmit = async (data: GraduationFormData) => {
    setSubmitError(null)
    try {
      await register.mutateAsync({
        student_id: data.student_id,
        belt: data.belt,
        degree: Number(data.degree),
        date: data.date,
        responsible_name: data.responsible_name || undefined,
        notes: data.notes || undefined,
      })
      router.push('/admin/graduacoes')
      router.refresh()
    } catch (err) {
      console.error('Erro ao registrar graduação:', err)
      setSubmitError('Erro ao registrar a graduação. Tente novamente.')
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
        <label htmlFor="student_id" className="text-sm font-medium text-zinc-900">
          Aluno
        </label>
        <select id="student_id" {...field('student_id')} className={inputClass}>
          <option value="">Selecione o aluno...</option>
          {(students.data ?? []).map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} — {beltLabel(s.belt)}
              {s.degree > 0 ? ` ${s.degree}º` : ''}
            </option>
          ))}
        </select>
        {errors.student_id && <p className="text-xs text-red-600" role="alert">{errors.student_id.message}</p>}
        {students.isLoading && <p className="text-xs text-zinc-500">Carregando alunos...</p>}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="belt" className="text-sm font-medium text-zinc-900">
            Nova faixa
          </label>
          <select id="belt" {...field('belt')} className={inputClass}>
            {beltOptions.map((b) => (
              <option key={b.value} value={b.value}>
                {b.label}
              </option>
            ))}
          </select>
          {errors.belt && <p className="text-xs text-red-600" role="alert">{errors.belt.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="degree" className="text-sm font-medium text-zinc-900">
            Grau (0–4)
          </label>
          <select id="degree" {...field('degree')} className={inputClass}>
            {[0, 1, 2, 3, 4].map((d) => (
              <option key={d} value={String(d)}>
                {d}º Grau
              </option>
            ))}
          </select>
          {errors.degree && <p className="text-xs text-red-600" role="alert">{errors.degree.message}</p>}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="date" className="text-sm font-medium text-zinc-900">
          Data da graduação
        </label>
        <input id="date" type="date" {...field('date')} className={inputClass} />
        {errors.date && <p className="text-xs text-red-600" role="alert">{errors.date.message}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="responsible_name" className="text-sm font-medium text-zinc-900">
          Professor responsável (opcional)
        </label>
        <input id="responsible_name" type="text" {...field('responsible_name')} className={inputClass} />
        {errors.responsible_name && <p className="text-xs text-red-600" role="alert">{errors.responsible_name.message}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="notes" className="text-sm font-medium text-zinc-900">
          Observações (opcional)
        </label>
        <textarea id="notes" rows={3} {...field('notes')} className={inputClass} />
      </div>

      <div className="flex flex-col gap-3 pt-2 sm:flex-row">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex h-12 items-center justify-center rounded-lg bg-zinc-900 px-6 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? 'Salvando...' : 'Registrar graduação'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/graduacoes')}
          disabled={isSubmitting}
          className="flex h-12 items-center justify-center rounded-lg border border-zinc-300 bg-white px-6 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-50"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}

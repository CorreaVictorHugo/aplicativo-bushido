'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  studentFormSchema,
  type StudentFormData,
} from '@/lib/schemas/studentSchema'
import { useAdminStudents } from '@/hooks/useAdminStudents'
import { createStudent as createStudentAction } from '@/app/admin/alunos/actions'

const beltOptions = [
  { value: 'white', label: 'Branca' },
  { value: 'blue', label: 'Azul' },
  { value: 'purple', label: 'Roxa' },
  { value: 'brown', label: 'Marrom' },
  { value: 'black', label: 'Preta' },
  { value: 'red', label: 'Vermelha' },
  { value: 'coral', label: 'Coral' },
]

interface StudentFormProps {
  mode: 'create' | 'edit'
  studentId?: string
  initialData?: Partial<StudentFormData> & { email?: string }
}

export function StudentForm({ mode, studentId, initialData }: StudentFormProps) {
  const router = useRouter()
  const { updateStudent } = useAdminStudents()
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      birth_date: initialData?.birth_date || '',
      weight: initialData?.weight ? String(initialData.weight) : '',
      belt: initialData?.belt || 'white',
      degree: initialData?.degree != null ? String(initialData.degree) : '0',
      entry_date: initialData?.entry_date || new Date().toISOString().split('T')[0],
      status: initialData?.status || 'active',
      notes: initialData?.notes || '',
    },
  })

  const onSubmit = async (data: StudentFormData) => {
    setSubmitError(null)

    if (mode === 'create') {
      if (!data.email || !data.password) {
        setSubmitError('E-mail e senha são obrigatórios para criar um aluno.')
        return
      }
      const email = data.email
      const password = data.password
      const result = await createStudentAction({
        email,
        password,
        name: data.name,
        phone: data.phone || undefined,
        birth_date: data.birth_date || undefined,
        weight: data.weight || undefined,
        belt: data.belt,
        degree: Number(data.degree),
        entry_date: data.entry_date,
        status: data.status,
        notes: data.notes || undefined,
      })
      if (result.error) {
        setSubmitError(result.error)
        return
      }
      router.push('/admin/alunos')
      router.refresh()
      return
    }

    if (!studentId) return
    try {
      await updateStudent.mutateAsync({
        id: studentId,
        values: {
          name: data.name,
          phone: data.phone || null,
          birth_date: data.birth_date || null,
          weight: data.weight ? Number(data.weight) : null,
          belt: data.belt,
          degree: Number(data.degree),
          entry_date: data.entry_date,
          status: data.status,
          notes: data.notes || null,
        },
      })
      router.push('/admin/alunos')
      router.refresh()
    } catch (err) {
      console.error('Erro ao salvar:', err)
      setSubmitError('Erro ao salvar. Tente novamente.')
    }
  }

  const inputClass =
    'w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm outline-none transition-colors focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900'

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      {submitError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {submitError}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1 sm:col-span-2">
          <label htmlFor="name" className="text-sm font-medium text-zinc-900">
            Nome completo
          </label>
          <input id="name" type="text" autoComplete="name" {...register('name')} className={inputClass} />
          {errors.name && <p className="text-xs text-red-600" role="alert">{errors.name.message}</p>}
        </div>

        {mode === 'create' && (
          <>
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-sm font-medium text-zinc-900">
                E-mail
              </label>
              <input id="email" type="email" autoComplete="email" {...register('email')} className={inputClass} />
              {errors.email && <p className="text-xs text-red-600" role="alert">{errors.email.message}</p>}
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="text-sm font-medium text-zinc-900">
                Senha inicial
              </label>
              <input id="password" type="password" autoComplete="new-password" {...register('password')} className={inputClass} />
              {errors.password && <p className="text-xs text-red-600" role="alert">{errors.password.message}</p>}
            </div>
          </>
        )}

        <div className="flex flex-col gap-1">
          <label htmlFor="phone" className="text-sm font-medium text-zinc-900">
            Telefone
          </label>
          <input id="phone" type="tel" autoComplete="tel" placeholder="(11) 99999-9999" {...register('phone')} className={inputClass} />
          {errors.phone && <p className="text-xs text-red-600" role="alert">{errors.phone.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="birth_date" className="text-sm font-medium text-zinc-900">
            Data de nascimento
          </label>
          <input id="birth_date" type="date" {...register('birth_date')} className={inputClass} />
          {errors.birth_date && <p className="text-xs text-red-600" role="alert">{errors.birth_date.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="weight" className="text-sm font-medium text-zinc-900">
            Peso (kg)
          </label>
          <input id="weight" type="number" step="0.1" min="0" {...register('weight')} className={inputClass} />
          {errors.weight && <p className="text-xs text-red-600" role="alert">{errors.weight.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="belt" className="text-sm font-medium text-zinc-900">
            Faixa
          </label>
          <select id="belt" {...register('belt')} className={inputClass}>
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
          <select id="degree" {...register('degree')} className={inputClass}>
            {[0, 1, 2, 3, 4].map((d) => (
              <option key={d} value={d}>
                {d}º Grau
              </option>
            ))}
          </select>
          {errors.degree && <p className="text-xs text-red-600" role="alert">{errors.degree.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="entry_date" className="text-sm font-medium text-zinc-900">
            Data de entrada
          </label>
          <input id="entry_date" type="date" {...register('entry_date')} className={inputClass} />
          {errors.entry_date && <p className="text-xs text-red-600" role="alert">{errors.entry_date.message}</p>}
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

        <div className="flex flex-col gap-1 sm:col-span-2">
          <label htmlFor="notes" className="text-sm font-medium text-zinc-900">
            Observações
          </label>
          <textarea id="notes" rows={3} {...register('notes')} className={inputClass} />
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-2 sm:flex-row">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex h-12 items-center justify-center rounded-lg bg-zinc-900 px-6 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? 'Salvando...' : mode === 'create' ? 'Criar aluno' : 'Salvar alterações'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/alunos')}
          disabled={isSubmitting}
          className="flex h-12 items-center justify-center rounded-lg border border-zinc-300 bg-white px-6 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-50"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}

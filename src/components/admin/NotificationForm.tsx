'use client'

import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { notificationSchema, type NotificationFormData } from '@/lib/schemas/notificationSchema'
import { useAdminNotifications } from '@/hooks/useAdminNotifications'

interface NotificationFormProps {
  students: { id: string; name: string }[]
  onDone?: () => void
}

export function NotificationForm({ students, onDone }: NotificationFormProps) {
  const send = useAdminNotifications()
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<NotificationFormData>({
    resolver: zodResolver(notificationSchema),
    defaultValues: { target_profile: 'all', title: '', message: '' },
  })

  const target = useWatch({ control, name: 'target_profile' })

  const onSubmit = async (data: NotificationFormData) => {
    setSubmitError(null)
    try {
      await send.mutateAsync({
        target_profile: data.target_profile,
        target_student_id: data.target_profile === 'specific' ? data.target_student_id : undefined,
        title: data.title,
        message: data.message,
      })
      reset({ target_profile: 'all', title: '', message: '' })
      onDone?.()
    } catch (err) {
      console.error('Erro ao enviar notificação:', err)
      setSubmitError('Erro ao enviar a notificação. Tente novamente.')
    }
  }

  const inputClass =
    'w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm outline-none transition-colors focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900'

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      {submitError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {submitError}
        </div>
      )}

      <div className="flex flex-col gap-1">
        <label htmlFor="target_profile" className="text-sm font-medium text-zinc-900">
          Público
        </label>
        <select id="target_profile" {...register('target_profile')} className={inputClass}>
          <option value="all">Todos</option>
          <option value="students">Estudantes</option>
          <option value="admins">Administradores</option>
          <option value="specific">Aluno específico</option>
        </select>
        {errors.target_profile && <p className="text-xs text-red-600" role="alert">{errors.target_profile.message}</p>}
      </div>

      {target === 'specific' && (
        <div className="flex flex-col gap-1">
          <label htmlFor="target_student_id" className="text-sm font-medium text-zinc-900">
            Aluno
          </label>
          <select id="target_student_id" {...register('target_student_id')} className={inputClass}>
            <option value="">Selecione o aluno...</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          {errors.target_student_id && <p className="text-xs text-red-600" role="alert">{errors.target_student_id.message}</p>}
        </div>
      )}

      <div className="flex flex-col gap-1">
        <label htmlFor="title" className="text-sm font-medium text-zinc-900">
          Título
        </label>
        <input id="title" type="text" {...register('title')} className={inputClass} />
        {errors.title && <p className="text-xs text-red-600" role="alert">{errors.title.message}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="message" className="text-sm font-medium text-zinc-900">
          Mensagem
        </label>
        <textarea id="message" rows={3} {...register('message')} className={inputClass} />
        {errors.message && <p className="text-xs text-red-600" role="alert">{errors.message.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex h-11 items-center justify-center rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? 'Enviando...' : 'Enviar notificação'}
      </button>
    </form>
  )
}

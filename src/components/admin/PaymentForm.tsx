'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { paymentSchema, type PaymentFormData } from '@/lib/schemas/paymentSchema'
import { useAdminPayments } from '@/hooks/useAdminPayments'

interface PaymentFormProps {
  students: { id: string; name: string }[]
  defaultStudentId?: string
  onDone?: () => void
}

export function PaymentForm({ students, defaultStudentId, onDone }: PaymentFormProps) {
  const { createPayment } = useAdminPayments()
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      student_id: defaultStudentId || '',
      reference: new Date().toISOString().slice(0, 7),
      date: new Date().toISOString().split('T')[0],
      amount: '',
      status: 'paid',
    },
  })

  const onSubmit = async (data: PaymentFormData) => {
    setSubmitError(null)
    try {
      await createPayment.mutateAsync({
        student_id: data.student_id,
        reference: data.reference,
        date: data.date,
        amount: data.amount ? Number(data.amount) : undefined,
        status: data.status,
        notes: data.notes || undefined,
      })
      reset({ student_id: data.student_id, reference: '', date: new Date().toISOString().split('T')[0], amount: '', status: 'paid', notes: '' })
      onDone?.()
    } catch (err) {
      console.error('Erro ao registrar pagamento:', err)
      setSubmitError('Erro ao registrar o pagamento. Tente novamente.')
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
        <label htmlFor="student_id" className="text-sm font-medium text-zinc-900">
          Aluno
        </label>
        <select id="student_id" {...register('student_id')} disabled={!!defaultStudentId} className={inputClass}>
          <option value="">Selecione o aluno...</option>
          {students.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        {errors.student_id && <p className="text-xs text-red-600" role="alert">{errors.student_id.message}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="reference" className="text-sm font-medium text-zinc-900">
            Referência (competência)
          </label>
          <input id="reference" type="text" placeholder="2026-08" {...register('reference')} className={inputClass} />
          {errors.reference && <p className="text-xs text-red-600" role="alert">{errors.reference.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="date" className="text-sm font-medium text-zinc-900">
            Data de pagamento
          </label>
          <input id="date" type="date" {...register('date')} className={inputClass} />
          {errors.date && <p className="text-xs text-red-600" role="alert">{errors.date.message}</p>}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="amount" className="text-sm font-medium text-zinc-900">
            Valor (opcional)
          </label>
          <input id="amount" type="number" step="0.01" min="0" placeholder="150,00" {...register('amount')} className={inputClass} />
          {errors.amount && <p className="text-xs text-red-600" role="alert">{errors.amount.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="status" className="text-sm font-medium text-zinc-900">
            Status
          </label>
          <select id="status" {...register('status')} className={inputClass}>
            <option value="paid">Pago</option>
            <option value="pending">Pendente</option>
            <option value="overdue">Atrasado</option>
          </select>
          {errors.status && <p className="text-xs text-red-600" role="alert">{errors.status.message}</p>}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="notes" className="text-sm font-medium text-zinc-900">
          Observação (opcional)
        </label>
        <input id="notes" type="text" {...register('notes')} className={inputClass} />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex h-11 items-center justify-center rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? 'Salvando...' : 'Registrar pagamento'}
      </button>
    </form>
  )
}

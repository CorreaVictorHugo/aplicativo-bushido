'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { cadastroSchema, type CadastroData } from '@/lib/schemas/cadastroSchema'
import { useSupabase } from '@/hooks/useSupabase'
import { ResendConfirmation } from './ResendConfirmation'
import { PasswordField } from './PasswordField'

export function CadastroForm() {
  const router = useRouter()
  const supabase = useSupabase()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  // E-mail da conta criada aguardando confirmação
  const [signupSuccessEmail, setSignupSuccessEmail] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CadastroData>({
    resolver: zodResolver(cadastroSchema),
    shouldFocusError: true,
  })

  const onSubmit = async (data: CadastroData) => {
    if (isSubmitted) return
    setIsSubmitted(true)
    setSubmitError(null)

    const cleanPhone = data.phone.replace(/\D/g, '')

    try {
      const { data: authData, error: signUpError } =
        await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: {
              name: data.name,
              birth_date: data.birthDate,
              phone: cleanPhone,
            },
          },
        })

      if (signUpError) {
        setIsSubmitted(false)

        const message = signUpError.message.toLowerCase()

        if (message.includes('already registered') || message.includes('already exists') || message.includes('email already')) {
          setError('email', { message: 'Este e-mail já está cadastrado' })
          return
        }

        if (message.includes('weak password') || message.includes('password')) {
          setError('password', { message: 'Senha muito fraca. Escolha uma senha mais forte.' })
          return
        }

        if (message.includes('network') || message.includes('fetch') || message.includes('timeout')) {
          setSubmitError('Erro de conexão. Verifique sua internet e tente novamente.')
          return
        }

        setSubmitError('Ocorreu um erro ao criar sua conta. Tente novamente.')
        return
      }

      if (!authData.user) {
        setIsSubmitted(false)
        setSubmitError('Ocorreu um erro ao criar sua conta. Tente novamente.')
        return
      }

      // Se há sessão, cadastro concluído sem confirmação de e-mail
      if (authData.session) {
        router.push('/')
        router.refresh()
        return
      }

      // Sem sessão → e-mail precisa ser confirmado
      setSignupSuccessEmail(data.email)
      setIsSubmitted(false)
    } catch {
      setIsSubmitted(false)
      setSubmitError('Ocorreu um erro inesperado. Tente novamente.')
    }
  }

  // Estado de sucesso: conta criada, aguardando confirmação de e-mail
  if (signupSuccessEmail) {
    return (
      <div className="flex w-full max-w-md flex-col items-center gap-6 text-center">
        <div
          className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
          role="alert"
        >
          Conta criada! Confirme seu e-mail para entrar.
        </div>
        <ResendConfirmation email={signupSuccessEmail} />
        <p className="text-sm text-zinc-500">
          Já confirmou?{' '}
          <Link
            href="/login"
            className="font-medium text-zinc-900 underline underline-offset-2 hover:text-zinc-700"
          >
            Fazer login
          </Link>
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex w-full max-w-md flex-col gap-6"
    >
      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-sm font-medium text-zinc-900">
          Nome completo
        </label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          {...register('name')}
          className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm outline-none transition-colors focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
        />
        {errors.name && (
          <p className="text-xs text-red-600" role="alert">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium text-zinc-900">
          E-mail
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          {...register('email')}
          className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm outline-none transition-colors focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
        />
        {errors.email && (
          <p className="text-xs text-red-600" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      <PasswordField
        id="password"
        label="Senha"
        autoComplete="new-password"
        hint="Mínimo de 6 caracteres, 1 letra maiúscula e 1 número"
        error={errors.password?.message}
        registerProps={register('password')}
      />

      <PasswordField
        id="confirmPassword"
        label="Confirmar senha"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        registerProps={register('confirmPassword')}
      />

      <div className="flex flex-col gap-1">
        <label
          htmlFor="birthDate"
          className="text-sm font-medium text-zinc-900"
        >
          Data de nascimento
        </label>
        <input
          id="birthDate"
          type="date"
          {...register('birthDate')}
          className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm outline-none transition-colors focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
        />
        {errors.birthDate && (
          <p className="text-xs text-red-600" role="alert">
            {errors.birthDate.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="phone" className="text-sm font-medium text-zinc-900">
          Telefone
        </label>
        <input
          id="phone"
          type="tel"
          autoComplete="tel"
          placeholder="(11) 99999-9999"
          {...register('phone')}
          className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm outline-none transition-colors focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
        />
        {errors.phone && (
          <p className="text-xs text-red-600" role="alert">
            {errors.phone.message}
          </p>
        )}
      </div>

      {submitError && (
        <div
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          role="alert"
        >
          {submitError}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting || isSubmitted}
        className="flex h-12 items-center justify-center rounded-lg bg-zinc-900 px-6 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting || isSubmitted ? (
          <span className="flex items-center gap-2">
            <svg
              className="h-4 w-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Criando conta...
          </span>
        ) : (
          'Criar conta'
        )}
      </button>
    </form>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginData } from '@/lib/schemas/loginSchema'
import { useSupabase } from '@/hooks/useSupabase'
import { ResendConfirmation } from './ResendConfirmation'
import { PasswordField } from './PasswordField'

export function LoginForm() {
  const router = useRouter()
  const supabase = useSupabase()
  // Erro genérico de submissão (rede, erro inesperado)
  const [submitError, setSubmitError] = useState<string | null>(null)
  // Guarda manual para evitar double-submit
  const [isSubmitted, setIsSubmitted] = useState(false)
  // E-mail que precisa de confirmação (habilita reenvio)
  const [unconfirmedEmail, setUnconfirmedEmail] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    shouldFocusError: true,
  })

  const onSubmit = async (data: LoginData) => {
    // Evita double submit
    if (isSubmitted) return
    setIsSubmitted(true)
    setSubmitError(null)
    setUnconfirmedEmail(null)

    try {
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (signInError) {
        setIsSubmitted(false)

        const message = signInError.message.toLowerCase()

        // Credenciais inválidas
        if (
          message.includes('invalid login credentials') ||
          message.includes('invalid credentials') ||
          message.includes('email not confirmed') ||
          message.includes('wrong password')
        ) {
          // Se e-mail não confirmado, mensagem específica
          if (message.includes('email not confirmed')) {
            setSubmitError('Confirme seu e-mail antes de entrar.')
            setUnconfirmedEmail(data.email)
          } else {
            setSubmitError('Credenciais inválidas. Verifique seu e-mail e senha.')
          }
          return
        }

        // Erro de rede
        if (
          message.includes('network') ||
          message.includes('fetch') ||
          message.includes('timeout')
        ) {
          setSubmitError('Erro de conexão. Verifique sua internet e tente novamente.')
          return
        }

        // Erro genérico
        setSubmitError('Erro ao entrar. Tente novamente.')
        return
      }

      if (!authData.user) {
        setIsSubmitted(false)
        setSubmitError('Erro ao entrar. Tente novamente.')
        return
      }

      // Busca role do perfil para redirecionar corretamente
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', authData.user.id)
        .single()

      // Redireciona baseado no role
      if (profile?.role === 'admin') {
        router.push('/admin')
      } else {
        router.push('/')
      }
      router.refresh()
    } catch {
      setIsSubmitted(false)
      setSubmitError('Ocorreu um erro inesperado. Tente novamente.')
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex w-full max-w-md flex-col gap-6"
    >
      {/* Campo E-mail */}
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          E-mail
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          {...register('email')}
          className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm outline-none transition-colors focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-400 dark:focus:ring-zinc-400"
        />
        {errors.email && (
          <p className="text-xs text-red-600 dark:text-red-400" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      <PasswordField
        id="password"
        label="Senha"
        autoComplete="current-password"
        error={errors.password?.message}
        registerProps={register('password')}
      />

      {/* Erro geral de submissão */}
      {submitError && (
        <div
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          role="alert"
        >
          {submitError}
        </div>
      )}

      {/* Reenvio de e-mail de confirmação */}
      {unconfirmedEmail && <ResendConfirmation email={unconfirmedEmail} />}

      {/* Botão de submit com loading */}
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
            Entrando...
          </span>
        ) : (
          'Entrar'
        )}
      </button>

      {/* Links auxiliares */}
      <div className="flex flex-col items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
        <Link
          href="/recuperar-senha"
          className="font-medium text-zinc-900 dark:text-zinc-100 underline underline-offset-2 hover:text-zinc-700 dark:hover:text-zinc-300"
        >
          Esqueci minha senha
        </Link>
        <p>
          Não tem conta?{' '}
          <Link
            href="/cadastro"
            className="font-medium text-zinc-900 dark:text-zinc-100 underline underline-offset-2 hover:text-zinc-700 dark:hover:text-zinc-300"
          >
            Cadastre-se
          </Link>
        </p>
      </div>
    </form>
  )
}
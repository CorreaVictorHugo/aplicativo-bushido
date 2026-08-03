'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { recuperarSenhaSchema, type RecuperarSenhaData } from '@/lib/schemas/recuperarSenhaSchema'
import { useSupabase } from '@/hooks/useSupabase'

export function RecuperarSenhaForm() {
  const supabase = useSupabase()
  // Mensagem de sucesso/erro geral
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  // Guarda manual para evitar double-submit
  const [isSubmitted, setIsSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RecuperarSenhaData>({
    resolver: zodResolver(recuperarSenhaSchema),
    shouldFocusError: true,
  })

  const onSubmit = async (data: RecuperarSenhaData) => {
    if (isSubmitted) return
    setIsSubmitted(true)
    setSubmitMessage(null)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/redefinir-senha`,
      })

      if (error) {
        setIsSubmitted(false)

        const message = error.message.toLowerCase()

        // Erro de rede
        if (
          message.includes('network') ||
          message.includes('fetch') ||
          message.includes('timeout')
        ) {
          setSubmitMessage({
            type: 'error',
            text: 'Erro de conexão. Verifique sua internet e tente novamente.',
          })
          return
        }

        // Erro genérico (não expõe se email existe ou não)
        setSubmitMessage({
          type: 'error',
          text: 'Ocorreu um erro ao solicitar a recuperação. Tente novamente.',
        })
        return
      }

      // Sucesso: sempre mostra mensagem genérica por segurança
      setSubmitMessage({
        type: 'success',
        text: 'Se o e-mail estiver cadastrado, você receberá instruções para redefinir a senha.',
      })
    } catch {
      setIsSubmitted(false)
      setSubmitMessage({
        type: 'error',
        text: 'Ocorreu um erro inesperado. Tente novamente.',
      })
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

      {/* Mensagem de sucesso/erro */}
      {submitMessage && (
        <div
          className={`rounded-lg px-4 py-3 text-sm ${
            submitMessage.type === 'success'
              ? 'border border-green-200 bg-green-50 text-green-700 dark:border-green-700 dark:bg-green-900/30 dark:text-green-400'
              : 'border border-red-200 bg-red-50 text-red-700 dark:border-red-700 dark:bg-red-900/30 dark:text-red-400'
          }`}
          role="alert"
        >
          {submitMessage.text}
        </div>
      )}

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
            Enviando...
          </span>
        ) : (
          'Enviar instruções'
        )}
      </button>

      {/* Link de volta para login */}
      <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center">
        Lembrou a senha?{' '}
        <Link
          href="/login"
          className="font-medium text-zinc-900 dark:text-zinc-100 underline underline-offset-2 hover:text-zinc-700 dark:hover:text-zinc-300"
        >
          Voltar para o login
        </Link>
      </p>
    </form>
  )
}
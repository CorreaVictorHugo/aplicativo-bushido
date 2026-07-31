'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { redefinirSenhaSchema, type RedefinirSenhaData } from '@/lib/schemas/redefinirSenhaSchema'
import { useSupabase } from '@/hooks/useSupabase'
import { PasswordField } from './PasswordField'

export function RedefinirSenhaForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = useSupabase()
  // Mensagem de sucesso/erro geral
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  // Guarda manual para evitar double-submit
  const [isSubmitted, setIsSubmitted] = useState(false)
  // Flag para saber se já trocou o código por sessão
  const [sessionExchanged, setSessionExchanged] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RedefinirSenhaData>({
    resolver: zodResolver(redefinirSenhaSchema),
    shouldFocusError: true,
  })

  // Extrai o código da URL na inicialização
  const [initialCode] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null
    const hash = window.location.hash.substring(1)
    const hashParams = new URLSearchParams(hash)
    const hashCode = hashParams.get('code') || hashParams.get('access_token')
    const queryCode = searchParams.get('code')
    return hashCode || queryCode
  })

  // Troca o código por sessão (precisa acontecer antes do updateUser)
  useEffect(() => {
    let cancelled = false
    const initCode = initialCode
    if (initCode && !sessionExchanged) {
      const exchangeCode = async () => {
        const { error } = await supabase.auth.exchangeCodeForSession(initCode)
        if (cancelled) return
        if (error) {
          setSubmitMessage({
            type: 'error',
            text: 'Link inválido ou expirado. Solicite nova recuperação de senha.',
          })
        } else {
          setSessionExchanged(true)
        }
      }
      exchangeCode()
    }
    return () => { cancelled = true }
  }, [initialCode, supabase, sessionExchanged])

  const onSubmit = async (data: RedefinirSenhaData) => {
    if (isSubmitted) return
    if (!sessionExchanged) {
      setSubmitMessage({
        type: 'error',
        text: 'Sessão de recuperação não iniciada. Solicite novo link.',
      })
      return
    }
    setIsSubmitted(true)
    setSubmitMessage(null)

    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      })

      if (error) {
        setIsSubmitted(false)

        const message = error.message.toLowerCase()

        // Senha fraca
        if (message.includes('weak password') || message.includes('password')) {
          setSubmitMessage({
            type: 'error',
            text: 'Senha muito fraca. Escolha uma senha mais forte.',
          })
          return
        }

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

        // Erro genérico
        setSubmitMessage({
          type: 'error',
          text: 'Erro ao redefinir senha. Tente novamente.',
        })
        return
      }

      // Sucesso
      setSubmitMessage({
        type: 'success',
        text: 'Senha redefinida com sucesso! Redirecionando para o login...',
      })

      // Redireciona após 2 segundos
      setTimeout(() => {
        router.push('/login')
        router.refresh()
      }, 2000)
    } catch {
      setIsSubmitted(false)
      setSubmitMessage({
        type: 'error',
        text: 'Ocorreu um erro inesperado. Tente novamente.',
      })
    }
  }

  // Se não tem código, mostra erro
  if (!initialCode) {
    return (
      <div className="flex w-full max-w-md flex-col items-center gap-6 text-center">
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          Link de recuperação inválido ou expirado.
        </div>
        <p className="text-sm text-zinc-500">
          Solicite um novo link de recuperação de senha.
        </p>
        <Link
          href="/recuperar-senha"
          className="font-medium text-zinc-900 underline underline-offset-2 hover:text-zinc-700"
        >
          Solicitar novo link
        </Link>
        <Link
          href="/login"
          className="font-medium text-zinc-900 underline underline-offset-2 hover:text-zinc-700"
        >
          Voltar para o login
        </Link>
      </div>
    )
  }

  // Enquanto troca o código por sessão
  if (!sessionExchanged) {
    return (
      <div className="flex w-full max-w-md flex-col items-center gap-6 text-center">
        <p className="text-sm text-zinc-500">Validando link de recuperação...</p>
      </div>
    )
  }

  // Se sessão trocada mas já submetido com sucesso, mostra mensagem e redireciona
  if (submitMessage?.type === 'success') {
    return (
      <div className="flex w-full max-w-md flex-col items-center gap-6 text-center">
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700" role="alert">
          {submitMessage.text}
        </div>
        <Link
          href="/login"
          className="font-medium text-zinc-900 underline underline-offset-2 hover:text-zinc-700"
        >
          Ir para o login
        </Link>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex w-full max-w-md flex-col gap-6"
    >
      <PasswordField
        id="password"
        label="Nova senha"
        autoComplete="new-password"
        hint="Mínimo de 6 caracteres, 1 letra maiúscula e 1 número"
        error={errors.password?.message}
        registerProps={register('password')}
      />

      <PasswordField
        id="confirmPassword"
        label="Confirmar nova senha"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        registerProps={register('confirmPassword')}
      />

      {/* Mensagem de erro */}
      {submitMessage && submitMessage.type === 'error' && (
        <div
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          role="alert"
        >
          {submitMessage.text}
        </div>
      )}

      {/* Botão de submit com loading */}
      <button
        type="submit"
        disabled={isSubmitting || isSubmitted || !sessionExchanged}
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
            Redefinindo...
          </span>
        ) : (
          'Redefinir senha'
        )}
      </button>

      {/* Link de volta para login */}
      <p className="text-sm text-zinc-500 text-center">
        <Link
          href="/login"
          className="font-medium text-zinc-900 underline underline-offset-2 hover:text-zinc-700"
        >
          Voltar para o login
        </Link>
      </p>
    </form>
  )
}
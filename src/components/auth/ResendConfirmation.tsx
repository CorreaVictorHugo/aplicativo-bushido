'use client'

import { useState } from 'react'
import { useSupabase } from '@/hooks/useSupabase'

interface ResendConfirmationProps {
  email: string
}

export function ResendConfirmation({ email }: ResendConfirmationProps) {
  const supabase = useSupabase()
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [isResending, setIsResending] = useState(false)

  const handleResend = async () => {
    if (isResending) return
    setIsResending(true)
    setMessage(null)

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: window.location.origin,
        },
      })

      if (error) {
        setIsResending(false)

        const errorMessage = error.message.toLowerCase()
        const rateLimited =
          errorMessage.includes('rate limit') ||
          errorMessage.includes('over_request') ||
          error.status === 429

        if (rateLimited) {
          setMessage({
            type: 'error',
            text: 'Muitas solicitações. Tente novamente em alguns minutos.',
          })
          return
        }

        if (
          errorMessage.includes('network') ||
          errorMessage.includes('fetch') ||
          errorMessage.includes('timeout')
        ) {
          setMessage({
            type: 'error',
            text: 'Erro de conexão. Verifique sua internet e tente novamente.',
          })
          return
        }

        setMessage({
          type: 'error',
          text: 'Ocorreu um erro ao reenviar. Tente novamente.',
        })
        return
      }

      setMessage({
        type: 'success',
        text: 'E-mail de confirmação reenviado. Verifique sua caixa de entrada.',
      })
    } catch {
      setIsResending(false)
      setMessage({
        type: 'error',
        text: 'Ocorreu um erro inesperado. Tente novamente.',
      })
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={handleResend}
        disabled={isResending}
        className="text-sm font-medium text-zinc-900 underline underline-offset-2 hover:text-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isResending ? (
          <span className="flex items-center gap-2">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Reenviando...
          </span>
        ) : (
          'Reenviar e-mail de confirmação'
        )}
      </button>

      {message && (
        <p
          className={`text-sm text-center ${
            message.type === 'success' ? 'text-green-700' : 'text-red-600'
          }`}
          role="alert"
        >
          {message.text}
        </p>
      )}
    </div>
  )
}
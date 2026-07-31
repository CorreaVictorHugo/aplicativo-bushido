import { Suspense } from 'react'
import { RedefinirSenhaForm } from '@/components/auth/RedefinirSenhaForm'
import { ThemeToggle } from '@/components/ThemeToggle'

// Página de redefinição de senha (callback do email) - Server Component
export default function RedefinirSenhaPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
      <div className="fixed top-3 right-3 z-50">
        <ThemeToggle />
      </div>
      <div className="flex w-full max-w-md flex-col items-center gap-8">
        {/* Cabeçalho */}
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Redefinir senha
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Escolha uma nova senha para sua conta
          </p>
        </div>

        {/* Formulário de redefinição */}
        <Suspense fallback={<p className="text-sm text-zinc-500 dark:text-zinc-400">Carregando...</p>}>
          <RedefinirSenhaForm />
        </Suspense>
      </div>
    </div>
  )
}
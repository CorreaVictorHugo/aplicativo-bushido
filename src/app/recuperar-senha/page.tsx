import { RecuperarSenhaForm } from '@/components/auth/RecuperarSenhaForm'
import { ThemeToggle } from '@/components/ThemeToggle'

// Página de solicitação de recuperação de senha - Server Component
export default function RecuperarSenhaPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
      <div className="fixed top-3 right-3 z-50">
        <ThemeToggle />
      </div>
      <div className="flex w-full max-w-md flex-col items-center gap-8">
        {/* Cabeçalho */}
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Recuperar senha
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Digite seu e-mail para receber instruções
          </p>
        </div>

        {/* Formulário de solicitação */}
        <RecuperarSenhaForm />
      </div>
    </div>
  )
}
import Link from 'next/link'
import { CadastroForm } from '@/components/auth/CadastroForm'
import { ThemeToggle } from '@/components/ThemeToggle'

export default function CadastroPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
      <div className="fixed top-3 right-3 z-50">
        <ThemeToggle />
      </div>
      <div className="flex w-full max-w-md flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Criar conta
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Preencha os dados abaixo para se cadastrar
          </p>
        </div>

        <CadastroForm />

        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Já tem uma conta?{' '}
          <Link
            href="/login"
            className="font-medium text-zinc-900 underline underline-offset-2 hover:text-zinc-700 dark:text-white dark:hover:text-zinc-300"
          >
            Fazer login
          </Link>
        </p>
      </div>
    </div>
  )
}

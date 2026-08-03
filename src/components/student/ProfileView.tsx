'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useStudent } from '@/hooks/useStudent'
import { useSupabase } from '@/hooks/useSupabase'
import { ProfilePhoto } from './ProfilePhoto'
import { ProfileInfo } from './ProfileInfo'
import { StatusBadge } from './StatusBadge'
import { WeekSchedule } from './WeekSchedule'

export function ProfileView() {
  const router = useRouter()
  const supabase = useSupabase()
  const { data: student, isLoading, error, refetch } = useStudent()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleLogout = async () => {
    if (isSigningOut) return
    setIsSigningOut(true)

    try {
      await supabase.auth.signOut()
      router.push('/login')
      router.refresh()
    } catch (err) {
      console.error('Erro ao sair:', err)
      setIsSigningOut(false)
    }
  }

  return (
    <div className="flex flex-1 flex-col max-w-md mx-auto w-full px-4 py-16">
      {isLoading && (
        <div className="flex-1 flex flex-col items-center justify-center" role="status" aria-label="Carregando perfil">
          <div className="animate-pulse w-full max-w-md space-y-4">
            <div className="h-24 w-24 mx-auto rounded-full bg-zinc-200" />
            <div className="h-6 w-48 mx-auto bg-zinc-200 rounded" />
            <div className="h-4 w-32 mx-auto bg-zinc-200 rounded" />
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-12 bg-zinc-200 rounded" />
              ))}
            </div>
          </div>
        </div>
      )}

      {!isLoading && (error || !student) && (
        <div className="flex-1 flex flex-col items-center justify-center text-center" role="alert">
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mb-4">
            Não foi possível carregar o perfil. Tente novamente.
          </div>
          <button
            onClick={() => refetch()}
            className="text-sm font-medium text-zinc-900 underline hover:text-zinc-700"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {!isLoading && student && (
        <>
          <header className="flex flex-col items-center gap-4 mb-8">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Meu Perfil</h1>
            <ProfilePhoto photoUrl={student.photo_url} name={student.name} size={100} />
            <div className="flex flex-col items-center gap-1">
              <p className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">{student.name}</p>
              <StatusBadge status={student.status} />
            </div>
          </header>

          <section className="rounded-lg border border-zinc-200 bg-white mb-6" aria-labelledby="info-heading">
            <h2 id="info-heading" className="sr-only">Informações do perfil</h2>
            <ProfileInfo student={student} graduations={student.graduations || []} />
          </section>

          <section className="mb-6" aria-labelledby="agenda-heading">
            <h2 id="agenda-heading" className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
              Treinos da semana
            </h2>
            <WeekSchedule />
          </section>

          <Link
            href="/perfil/editar"
            className="flex h-12 w-full items-center justify-center rounded-lg bg-zinc-900 px-6 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
          >
            Editar perfil
          </Link>
        </>
      )}

      <button
        type="button"
        onClick={handleLogout}
        disabled={isSigningOut}
        className="mt-6 flex h-12 w-full items-center justify-center rounded-lg border border-red-200 bg-white px-6 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSigningOut ? (
          <span className="flex items-center gap-2">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Saindo...
          </span>
        ) : (
          'Sair da conta'
        )}
      </button>
    </div>
  )
}
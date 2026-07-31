import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function StudentHomePage() {
  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single()

  if (profile?.role === 'admin') {
    redirect('/admin')
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-zinc-900 mb-4">
          Bem-vindo ao Bushido
        </h1>
        <p className="text-zinc-500 mb-8">
          Use a navegação inferior para acessar as funcionalidades.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border border-zinc-200 bg-white p-6 text-center">
            <div className="text-3xl font-bold text-zinc-900">—</div>
            <div className="text-sm text-zinc-500 mt-1">Treinos hoje</div>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-6 text-center">
            <div className="text-3xl font-bold text-zinc-900">—</div>
            <div className="text-sm text-zinc-500 mt-1">Presenças no mês</div>
          </div>
        </div>
      </div>
    </div>
  )
}
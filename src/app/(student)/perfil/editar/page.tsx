import { Suspense } from 'react'
import { ProfileEdit } from '@/components/student/ProfileEdit'

export default function PerfilEditarPage() {
  return (
    <div className="flex flex-1 flex-col">
      <Suspense fallback={
        <div className="flex flex-1 flex-col items-center justify-center px-4 py-16" role="status" aria-label="Carregando edição de perfil">
          <div className="animate-pulse w-full max-w-md space-y-4">
            <div className="h-24 w-24 mx-auto rounded-full bg-zinc-200" />
            <div className="h-6 w-48 mx-auto bg-zinc-200 rounded" />
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-14 bg-zinc-200 rounded" />
              ))}
            </div>
          </div>
        </div>
      }>
        <ProfileEdit />
      </Suspense>
    </div>
  )
}
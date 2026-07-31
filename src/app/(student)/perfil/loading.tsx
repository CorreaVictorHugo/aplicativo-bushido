export default function PerfilLoading() {
  return (
    <div className="flex flex-1 flex-col max-w-md mx-auto w-full px-4 py-16" role="status" aria-label="Carregando perfil">
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
  )
}
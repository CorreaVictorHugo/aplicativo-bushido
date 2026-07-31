'use client'

import { useNotifications } from '@/hooks/useNotifications'

export function NotificationCenter() {
  const { data: notifications, isLoading, error, markAsRead } = useNotifications()

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-3" role="status" aria-label="Carregando notificações">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 rounded-lg bg-zinc-200" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
        Não foi possível carregar as notificações.
      </div>
    )
  }

  if (!notifications || notifications.length === 0) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center">
        <p className="text-sm text-zinc-500">Nenhuma notificação ainda.</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
      <ul className="divide-y divide-zinc-100" role="list" aria-label="Notificações">
        {notifications.map((n) => (
          <li key={n.id}>
            <button
              type="button"
              onClick={() => !n.read_at && markAsRead.mutate(n.id)}
              className={`flex w-full flex-col gap-1 p-4 text-left transition-colors ${
                n.read_at ? '' : 'bg-zinc-50 hover:bg-zinc-100'
              }`}
              aria-label={n.title}
            >
              <div className="flex items-center justify-between gap-2">
                <span className={`text-sm font-semibold ${n.read_at ? 'text-zinc-600' : 'text-zinc-900'}`}>{n.title}</span>
                {!n.read_at && <span className="h-2 w-2 rounded-full bg-blue-600" aria-hidden="true" />}
              </div>
              <p className="text-sm text-zinc-600">{n.message}</p>
              <span className="text-xs text-zinc-400">{formatDate(n.sent_at)}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
  } catch {
    return iso
  }
}

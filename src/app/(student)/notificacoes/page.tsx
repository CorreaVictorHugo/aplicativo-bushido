import { NotificationCenter } from '@/components/student/NotificationCenter'

export default function NotificacoesPage() {
  return (
    <div className="flex flex-1 flex-col max-w-md mx-auto w-full px-4 py-16">
      <h1 className="text-2xl font-bold text-zinc-900 mb-6">Notificações</h1>
      <NotificationCenter />
    </div>
  )
}

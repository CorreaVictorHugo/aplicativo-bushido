import { PublicationForm } from '@/components/admin/PublicationForm'

export default function NovaPublicacaoPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900 mb-6">Nova publicação</h1>
      <PublicationForm mode="create" />
    </div>
  )
}

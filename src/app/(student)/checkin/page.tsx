import { CheckinList } from '@/components/student/CheckinList'

export default function CheckinPage() {
  return (
    <div className="flex flex-1 flex-col max-w-md mx-auto w-full px-4 py-16">
      <h1 className="text-2xl font-bold text-zinc-900 mb-6">Check-in</h1>
      <p className="text-sm text-zinc-500 mb-4">
        Selecione o treino de hoje para registrar sua presença.
      </p>
      <CheckinList />
    </div>
  )
}

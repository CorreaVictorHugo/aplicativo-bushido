import { CheckinList } from '@/components/student/CheckinList'
import { WeekSchedule } from '@/components/student/WeekSchedule'

export default function CheckinPage() {
  return (
    <div className="flex flex-1 flex-col max-w-md mx-auto w-full px-4 py-16">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">Check-in</h1>

      <section aria-labelledby="hoje-heading">
        <h2 id="hoje-heading" className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
          Treinos de hoje
        </h2>
        <CheckinList />
      </section>

      <section className="mt-8" aria-labelledby="semana-heading">
        <h2 id="semana-heading" className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
          Treinos da semana
        </h2>
        <WeekSchedule />
      </section>
    </div>
  )
}

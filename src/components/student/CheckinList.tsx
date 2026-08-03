'use client'

import { useTodayTrainings } from '@/hooks/useTodayTrainings'

export function CheckinList() {
  const { data, isLoading, error, doCheckin } = useTodayTrainings()

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-3" role="status" aria-label="Carregando treinos do dia">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="h-20 rounded-lg bg-zinc-200" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
        Não foi possível carregar os treinos. Tente novamente.
      </div>
    )
  }

  if (!data || data.status === null) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
        Não foi possível identificar seu perfil de aluno.
      </div>
    )
  }

  if (data.status === 'inactive') {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800" role="alert">
        Seu cadastro está inativo. Fale com a administração para fazer check-in.
      </div>
    )
  }

  if (data.trainings.length === 0) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center">
        <p className="text-sm text-zinc-500">Nenhum treino disponível hoje.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {data.trainings.map((training) => {
        const checkin = training.checkin
        return (
          <div key={training.id} className="rounded-lg border border-zinc-200 bg-white p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium text-zinc-900">{training.modality}</p>
                <p className="mt-0.5 text-sm text-zinc-500">
                  {training.time} · {training.location}
                </p>
              </div>
              <CheckinState
                checkin={checkin}
                busy={doCheckin.isPending && doCheckin.variables === training.id}
                onCheckin={() => doCheckin.mutate(training.id)}
              />
            </div>
          </div>
        )
      })}

      {doCheckin.isError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-700 dark:bg-red-900/30 dark:text-red-400" role="alert">
          Erro ao fazer o check-in. {doCheckin.error instanceof Error ? doCheckin.error.message : ''}
        </div>
      )}
    </div>
  )
}

function CheckinState({
  checkin,
  busy,
  onCheckin,
}: {
  checkin: { status: string } | null
  busy: boolean
  onCheckin: () => void
}) {
  if (!checkin) {
    return (
      <button
        type="button"
        onClick={onCheckin}
        disabled={busy}
        className="flex h-10 items-center justify-center rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {busy ? 'Enviando...' : 'Fazer check-in'}
      </button>
    )
  }

  const styles: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-800',
    confirmed: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  }
  const labels: Record<string, string> = {
    pending: 'Aguardando confirmação',
    confirmed: 'Confirmado',
    rejected: 'Recusado',
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${styles[checkin.status] || 'bg-zinc-100 text-zinc-700'}`}
      role="status"
    >
      {labels[checkin.status] || checkin.status}
    </span>
  )
}

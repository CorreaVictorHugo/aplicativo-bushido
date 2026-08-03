'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { Training } from '@/lib/supabase/types'

export type NextTraining = {
  training: Training
  date: Date
  dateLabel: string
  weekdayLabel: string
  isToday: boolean
}

const weekdayLabels = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado']

function nextOccurrence(weekday: number, time: string, now: Date): Date {
  const [h, m] = time.split(':').map(Number)
  const candidate = new Date(now)
  candidate.setHours(h, m, 0, 0)
  let daysAhead = (weekday - now.getDay() + 7) % 7
  if (daysAhead === 0 && candidate.getTime() <= now.getTime()) daysAhead = 7
  candidate.setDate(candidate.getDate() + daysAhead)
  return candidate
}

async function fetchNextTraining(): Promise<NextTraining | null> {
  const supabase = createClient()
  const now = new Date()

  const { data: trainings, error } = await supabase
    .from('trainings')
    .select('*')
    .eq('status', 'active')
    .order('weekday', { ascending: true })
    .order('time', { ascending: true })

  if (error) {
    console.error('Erro ao buscar próximo treino:', JSON.stringify({ message: error.message, code: error.code }))
    throw error
  }

  if (!trainings || trainings.length === 0) return null

  let best: { training: Training; date: Date } | null = null
  for (const t of trainings) {
    const occ = nextOccurrence(t.weekday, t.time, now)
    if (!best || occ.getTime() < best.date.getTime()) {
      best = { training: t, date: occ }
    }
  }

  if (!best) return null

  return {
    training: best.training,
    date: best.date,
    dateLabel: best.date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
    weekdayLabel: weekdayLabels[best.date.getDay()],
    isToday: best.date.toDateString() === now.toDateString(),
  }
}

export function useNextTraining() {
  return useQuery({
    queryKey: ['next-training'],
    queryFn: fetchNextTraining,
    staleTime: 60 * 1000,
  })
}

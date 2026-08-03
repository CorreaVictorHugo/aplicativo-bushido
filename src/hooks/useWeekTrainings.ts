'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { Training, CheckIn } from '@/lib/supabase/types'

export type WeekTraining = Training & { checkin: CheckIn | null }

export type WeekDay = {
  weekday: number
  date: string
  label: string
  shortLabel: string
  trainings: WeekTraining[]
}

const weekdayLabels = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado']
const weekdayShort = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

export function getWeekDays(now = new Date()): { weekday: number; date: string; label: string; shortLabel: string }[] {
  const day = now.getDay()
  const mondayOffset = day === 0 ? -6 : 1 - day
  const monday = new Date(now)
  monday.setHours(12, 0, 0, 0)
  monday.setDate(now.getDate() + mondayOffset)

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    const weekday = (1 + i) % 7
    return {
      weekday,
      date: d.toISOString().split('T')[0],
      label: weekdayLabels[weekday],
      shortLabel: weekdayShort[weekday],
    }
  })
}

async function fetchWeek(): Promise<{ days: WeekDay[]; studentId: string | null }> {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) return { days: [], studentId: null }

  const { data: student } = await supabase
    .from('students')
    .select('id')
    .eq('profile_id', session.user.id)
    .maybeSingle()

  if (!student) return { days: [], studentId: null }

  const days = getWeekDays()
  const weekdays = days.map((d) => d.weekday)
  const dates = days.map((d) => d.date)

  const { data: trainings } = await supabase
    .from('trainings')
    .select('*')
    .in('weekday', weekdays)
    .eq('status', 'active')
    .order('time', { ascending: true })

  const { data: checkins } = await supabase
    .from('checkins')
    .select('*')
    .eq('student_id', student.id)
    .in('class_date', dates)

  const byWeekday = new Map<number, Training[]>()
  for (const t of trainings ?? []) {
    const list = byWeekday.get(t.weekday) || []
    list.push(t)
    byWeekday.set(t.weekday, list)
  }

  const checkinMap = new Map<string, CheckIn>()
  for (const c of checkins ?? []) {
    checkinMap.set(`${c.class_date}|${c.training_id}`, c)
  }

  return {
    days: days.map((d) => ({
      ...d,
      trainings: (byWeekday.get(d.weekday) || []).map((t) => ({
        ...t,
        checkin: checkinMap.get(`${d.date}|${t.id}`) ?? null,
      })),
    })),
    studentId: student.id,
  }
}

export function useWeekTrainings() {
  return useQuery({
    queryKey: ['week-trainings'],
    queryFn: fetchWeek,
    staleTime: 60 * 1000,
  })
}

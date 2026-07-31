'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export type DashboardData = {
  activeStudents: number
  newStudents: number
  checkins: { total: number; confirmed: number; rejected: number; pending: number }
  graduations: number
  beltDistribution: Record<string, number>
}

async function fetchDashboard(start: string, end: string): Promise<DashboardData> {
  const supabase = createClient()

  const [activeRes, newRes, checkinsRes, gradsRes, studentsRes] = await Promise.all([
    supabase.from('students').select('id', { count: 'exact', head: true }).eq('status', 'active'),
    supabase
      .from('students')
      .select('id', { count: 'exact', head: true })
      .gte('entry_date', start)
      .lte('entry_date', end),
    supabase.from('checkins').select('status').gte('class_date', start).lte('class_date', end),
    supabase
      .from('graduations')
      .select('id', { count: 'exact', head: true })
      .gte('date', start)
      .lte('date', end),
    supabase.from('students').select('belt'),
  ])

  if (checkinsRes.error) {
    console.error('Erro no dashboard:', JSON.stringify({ message: checkinsRes.error.message, code: checkinsRes.error.code }))
    throw checkinsRes.error
  }

  const checkins = checkinsRes.data ?? []
  const beltDistribution: Record<string, number> = {}
  for (const s of studentsRes.data ?? []) {
    beltDistribution[s.belt] = (beltDistribution[s.belt] || 0) + 1
  }

  return {
    activeStudents: activeRes.count ?? 0,
    newStudents: newRes.count ?? 0,
    checkins: {
      total: checkins.length,
      confirmed: checkins.filter((c) => c.status === 'confirmed').length,
      rejected: checkins.filter((c) => c.status === 'rejected').length,
      pending: checkins.filter((c) => c.status === 'pending').length,
    },
    graduations: gradsRes.count ?? 0,
    beltDistribution,
  }
}

export function useAdminDashboard(start: string, end: string) {
  return useQuery({
    queryKey: ['admin-dashboard', start, end],
    queryFn: () => fetchDashboard(start, end),
    staleTime: 60 * 1000,
  })
}

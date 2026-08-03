'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NotificationBell } from '@/components/student/NotificationBell'
import { ThemeToggle } from '@/components/ThemeToggle'

const navigation = [
  { href: '/', label: 'Início', icon: HomeIcon },
  { href: '/checkin', label: 'Check-in', icon: CheckinIcon },
  { href: '/frequencia', label: 'Frequência', icon: FrequenciaIcon },
  { href: '/graduacao', label: 'Graduação', icon: GraduacaoIcon },
  { href: '/financeiro', label: 'Financeiro', icon: FinanceiroIcon },
  { href: '/mural', label: 'Mural', icon: MuralIcon },
  { href: '/perfil', label: 'Perfil', icon: PerfilIcon },
]

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg className={`h-5 w-5 ${active ? 'fill-current' : ''}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

function CheckinIcon({ active }: { active: boolean }) {
  return (
    <svg className={`h-5 w-5 ${active ? 'fill-current' : ''}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}

function FrequenciaIcon({ active }: { active: boolean }) {
  return (
    <svg className={`h-5 w-5 ${active ? 'fill-current' : ''}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

function GraduacaoIcon({ active }: { active: boolean }) {
  return (
    <svg className={`h-5 w-5 ${active ? 'fill-current' : ''}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )
}

function FinanceiroIcon({ active }: { active: boolean }) {
  return (
    <svg className={`h-5 w-5 ${active ? 'fill-current' : ''}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
    </svg>
  )
}

function MuralIcon({ active }: { active: boolean }) {
  return (
    <svg className={`h-5 w-5 ${active ? 'fill-current' : ''}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  )
}

function PerfilIcon({ active }: { active: boolean }) {
  return (
    <svg className={`h-5 w-5 ${active ? 'fill-current' : ''}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
      <div className="fixed top-3 right-3 z-50 flex items-center gap-1">
        <ThemeToggle />
        <NotificationBell />
      </div>
      {children}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-200 bg-white py-1 dark:border-zinc-800 dark:bg-zinc-900"
        role="navigation"
        aria-label="Navegação principal"
      >
        <div className="mx-auto flex max-w-md items-stretch justify-center">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 overflow-hidden px-0.5 py-1.5 text-[10px] font-medium leading-tight transition-colors ${
                  isActive
                    ? 'text-zinc-900 dark:text-white'
                    : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'
                }`}
                aria-current={isActive ? 'page' : undefined}
                aria-label={item.label}
              >
                <item.icon active={isActive} />
                <span className="w-full truncate text-center">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
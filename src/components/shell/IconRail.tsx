'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Moon, Sun } from 'lucide-react'
import { navItems } from './navItems'
import { LogoMark } from '@/components/ui/Spinner'
import { useTheme } from '@/contexts/ThemeContext'

export function IconRail() {
  const { theme, toggle } = useTheme()
  const pathname = usePathname()

  return (
    <nav className="flex h-full w-16 shrink-0 flex-col items-center gap-1 border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 py-4">
      <Link href="/dashboard" className="mb-3 flex h-9 w-9 items-center justify-center">
        <LogoMark size={32} />
      </Link>
      <div className="flex flex-1 flex-col items-center gap-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = item.to === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(item.to)
          return (
            <Link
              key={item.to}
              href={item.to}
              title={item.label}
              className={`relative flex h-10 w-10 items-center justify-center rounded-xl transition ${
                isActive
                  ? 'bg-brand-600 text-white'
                  : 'text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              <item.icon size={20} strokeWidth={2} />
            </Link>
          )
        })}
      </div>
      <button
        onClick={toggle}
        title="Toggle theme"
        className="flex h-10 w-10 items-center justify-center rounded-xl text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
      >
        {theme === 'light' ? <Moon size={19} /> : <Sun size={19} />}
      </button>
    </nav>
  )
}

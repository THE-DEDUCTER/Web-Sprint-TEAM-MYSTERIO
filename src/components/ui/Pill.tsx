import type { ReactNode } from 'react'

const colors: Record<string, string> = {
  neutral: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200',
  blue: 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300',
  green: 'bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300',
  amber: 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300',
  purple: 'bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300',
  red: 'bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300',
}

export function Pill({ children, color = 'neutral', className = '' }: { children: ReactNode; color?: keyof typeof colors; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${colors[color]} ${className}`}>
      {children}
    </span>
  )
}

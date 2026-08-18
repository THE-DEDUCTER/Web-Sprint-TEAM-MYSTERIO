import type { ReactNode } from 'react'
import { DecorativeFigure } from './DecorativeFigure'

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="relative mb-6 flex items-start justify-between gap-4">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
          <DecorativeFigure className="h-7 w-7" variant={1} />
          c/{title}
        </h1>
        {subtitle && <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

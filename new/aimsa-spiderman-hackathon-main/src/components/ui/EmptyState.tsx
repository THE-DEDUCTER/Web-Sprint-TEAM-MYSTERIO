import type { ReactNode } from 'react'

export function EmptyState({ icon, title, body }: { icon?: ReactNode; title: string; body?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-700 py-14 px-6 text-center">
      {icon && <div className="text-neutral-300 dark:text-neutral-600 mb-1">{icon}</div>}
      <p className="italic text-neutral-500 dark:text-neutral-400">{title}</p>
      {body && <p className="text-sm text-neutral-400 dark:text-neutral-500 max-w-sm">{body}</p>}
    </div>
  )
}

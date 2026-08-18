import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ShoppingBag, type LucideIcon } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { navItems } from './navItems'

interface Entry {
  title: string
  description: string
  to?: string
  disabled?: boolean
  icon: LucideIcon
}

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const navigate = useNavigate()

  const entries: Entry[] = useMemo(
    () => [
      ...navItems.map((n) => ({ title: n.label, description: n.description, to: n.to, icon: n.icon })),
      { title: 'Shop', description: 'Buy, sell, and trade (coming soon)', disabled: true, icon: ShoppingBag },
    ],
    [],
  )

  const filtered = entries.filter(
    (e) => e.title.toLowerCase().includes(query.toLowerCase()) || e.description.toLowerCase().includes(query.toLowerCase()),
  )

  useEffect(() => {
    if (open) {
      setQuery('')
      setActive(0)
    }
  }, [open])

  useEffect(() => setActive(0), [query])

  function select(entry: Entry) {
    if (entry.disabled || !entry.to) return
    navigate(entry.to)
    onClose()
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => Math.min(a + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(a - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const entry = filtered[active]
      if (entry) select(entry)
    }
  }

  return (
    <Modal open={open} onClose={onClose} wide>
      <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 px-4 py-3">
        <Search size={16} className="text-neutral-400" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Search pages, communities, projects…"
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-neutral-400"
        />
      </div>
      <div className="max-h-80 overflow-y-auto py-2">
        <p className="px-4 pb-1 pt-2 text-[11px] font-bold uppercase tracking-wide text-neutral-400">Pages</p>
        {filtered.map((entry, i) => (
          <button
            key={entry.title}
            onClick={() => select(entry)}
            onMouseEnter={() => setActive(i)}
            disabled={entry.disabled}
            className={`flex w-full items-center gap-3 px-4 py-2.5 text-left ${
              i === active ? 'bg-neutral-100 dark:bg-neutral-800' : ''
            } ${entry.disabled ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            <entry.icon size={18} />
            <div className="min-w-0">
              <p className="text-sm font-medium">{entry.title}</p>
              <p className="truncate text-xs text-neutral-400">{entry.description}</p>
            </div>
            {entry.disabled && <span className="ml-auto shrink-0 text-[10px] font-semibold text-neutral-400">Coming soon</span>}
          </button>
        ))}
        {filtered.length === 0 && <p className="px-4 py-6 text-center text-sm text-neutral-400">No results</p>}
      </div>
      <div className="flex items-center gap-4 border-t border-neutral-200 dark:border-neutral-800 px-4 py-2 text-[11px] text-neutral-400">
        <span>↑↓ navigate</span>
        <span>↵ select</span>
        <span>esc close</span>
      </div>
    </Modal>
  )
}

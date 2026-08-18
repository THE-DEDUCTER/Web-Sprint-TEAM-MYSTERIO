import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { IconRail } from './IconRail'
import { RightSidebar } from './RightSidebar'
import { CommandPalette } from './CommandPalette'
import { BuddyWidget } from './BuddyWidget'
import { useCommandPaletteShortcut } from './useCommandPaletteShortcut'

export function AppShell() {
  const [paletteOpen, setPaletteOpen] = useState(false)
  useCommandPaletteShortcut(() => setPaletteOpen(true))

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      <IconRail />
      <main className="relative flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl px-6 py-6">
          <Outlet />
        </div>
      </main>
      <RightSidebar onOpenPalette={() => setPaletteOpen(true)} />
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
      <BuddyWidget />
    </div>
  )
}

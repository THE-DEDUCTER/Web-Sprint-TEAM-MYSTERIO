import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, ArrowRight, Info } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Card } from '@/components/ui/Card'
import { getCommunities, getUsers } from '@/lib/db'
import type { Community, AppUser } from '@/types'
import { useAuth } from '@/contexts/AuthContext'

export function RightSidebar({ onOpenPalette }: { onOpenPalette: () => void }) {
  const { user } = useAuth()
  const [communities, setCommunities] = useState<Community[]>([])
  const [friends, setFriends] = useState<AppUser[]>([])

  useEffect(() => {
    getCommunities().then((cs) => setCommunities(cs.slice(0, 3)))
    getUsers().then((us) => setFriends(us.filter((u) => u.id !== user?.id).slice(0, 3)))
  }, [user?.id])

  return (
    <aside className="hidden xl:flex h-full w-[280px] shrink-0 flex-col gap-4 overflow-y-auto border-l border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4">
      <button
        onClick={onOpenPalette}
        className="flex items-center gap-2 rounded-full border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 px-3.5 py-2 text-sm text-neutral-500 dark:text-neutral-400 hover:border-brand-300"
      >
        <Search size={15} />
        <span className="flex-1 text-left">Search cohort...</span>
        <kbd className="rounded border border-neutral-300 dark:border-neutral-600 px-1.5 py-0.5 text-[10px]">⌘K</kbd>
      </button>

      <SidebarWidget title="C/COMMUNITIES" seeAll="/dashboard/communities">
        {communities.length === 0 && <p className="text-xs text-neutral-400">No communities yet</p>}
        {communities.map((c) => (
          <Link key={c.id} to={`/dashboard/communities/${c.handle}`} className="flex items-center gap-2 py-1.5 text-sm hover:text-brand-600">
            <Avatar name={c.name} size={26} url={c.logoUrl} />
            <span className="truncate">{c.name}</span>
          </Link>
        ))}
      </SidebarWidget>

      <SidebarWidget title="C/FRIENDS" seeAll="/dashboard/network">
        {friends.length === 0 && <p className="text-xs text-neutral-400">No users yet</p>}
        {friends.map((f) => (
          <Link key={f.id} to={`/dashboard/profile/${f.handle}`} className="flex items-center gap-2 py-1.5 text-sm hover:text-brand-600">
            <Avatar name={f.displayName} size={26} url={f.avatarUrl} />
            <span className="truncate">{f.displayName}</span>
            <span className="ml-auto shrink-0 text-xs text-neutral-400">@{f.handle}</span>
          </Link>
        ))}
      </SidebarWidget>

      <SidebarWidget title="C/CONNECT">
        {friends.length === 0 && <p className="text-xs text-neutral-400">No conversations yet</p>}
        {friends.map((f) => (
          <Link key={f.id} to={`/dashboard/connect?user=${f.handle}`} className="flex items-center justify-between py-1.5 text-sm hover:text-brand-600">
            <span className="truncate">{f.displayName}</span>
            <span className="text-xs text-neutral-400">@{f.handle}</span>
          </Link>
        ))}
      </SidebarWidget>

      <SidebarWidget title="C/CALENDAR" seeAll="/dashboard/calendar">
        <p className="text-xs italic text-neutral-400">No upcoming events</p>
      </SidebarWidget>

      <Card className="p-3.5">
        <div className="flex items-start gap-2">
          <Info size={16} className="mt-0.5 shrink-0 text-blue-500" />
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wide text-blue-600">Important</p>
            <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
              Full access will soon require PCCOE account login.
            </p>
          </div>
        </div>
      </Card>
    </aside>
  )
}

function SidebarWidget({ title, seeAll, children }: { title: string; seeAll?: string; children: React.ReactNode }) {
  return (
    <Card className="p-3.5">
      <div className="mb-1 flex items-center justify-between">
        <p className="text-[11px] font-bold uppercase tracking-wide text-neutral-400">{title}</p>
        {seeAll && (
          <Link to={seeAll} className="text-neutral-400 hover:text-brand-600">
            <ArrowRight size={14} />
          </Link>
        )}
      </div>
      {children}
    </Card>
  )
}

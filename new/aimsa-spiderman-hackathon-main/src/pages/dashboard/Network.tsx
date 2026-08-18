import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Users2, UserSearch, Link2, Eye } from 'lucide-react'
import { PageHeader } from '@/components/shell/PageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { EmptyState } from '@/components/ui/EmptyState'
import { getUsers, getFollowing, toggleFollow } from '@/lib/db'
import { useAuth } from '@/contexts/AuthContext'
import type { AppUser } from '@/types'

const tiles = [
  { icon: Users2, label: 'Alumni Connect' },
  { icon: UserSearch, label: 'Discover Students' },
  { icon: Link2, label: 'Build Connections' },
  { icon: Eye, label: 'View Profiles' },
]

export default function Network() {
  const { user } = useAuth()
  const [users, setUsers] = useState<AppUser[]>([])
  const [following, setFollowing] = useState<Set<string>>(new Set())
  const [query, setQuery] = useState('')

  useEffect(() => {
    if (!user) return
    Promise.all([getUsers(), getFollowing(user.id)]).then(([us, f]) => {
      setUsers(us.filter((u) => u.id !== user.id))
      setFollowing(new Set(f))
    })
  }, [user])

  async function follow(id: string) {
    if (!user) return
    const isFollowing = await toggleFollow(user.id, id)
    setFollowing((f) => {
      const next = new Set(f)
      if (isFollowing) next.add(id)
      else next.delete(id)
      return next
    })
  }

  const filtered = users.filter(
    (u) => u.displayName.toLowerCase().includes(query.toLowerCase()) || u.handle.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <div>
      <PageHeader title="network" subtitle="Discover, connect, and build your campus network." />

      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {tiles.map((t) => (
          <Card key={t.label} className="flex flex-col items-center gap-2 p-5 text-center hover:shadow-md transition cursor-default">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-900/40 text-brand-600">
              <t.icon size={20} />
            </div>
            <p className="text-sm font-semibold">{t.label}</p>
          </Card>
        ))}
      </div>

      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-bold">Students</h2>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search students…"
            className="rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 py-1.5 pl-8 pr-3 text-sm outline-none"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No users yet" />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {filtered.map((u) => (
            <Card key={u.id} className="flex flex-col items-center gap-2 p-4 text-center">
              <Link to={`/dashboard/profile/${u.handle}`}>
                <Avatar name={u.displayName} url={u.avatarUrl} size={56} />
              </Link>
              <Link to={`/dashboard/profile/${u.handle}`} className="text-sm font-semibold hover:underline">
                {u.displayName}
              </Link>
              <p className="-mt-1 text-xs text-neutral-400">@{u.handle}</p>
              <Button
                variant={following.has(u.id) ? 'secondary' : 'primary'}
                className="!px-4 !py-1 !text-xs"
                onClick={() => follow(u.id)}
              >
                {following.has(u.id) ? 'Following' : 'Follow'}
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

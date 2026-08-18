import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import { PageHeader } from '@/components/shell/PageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Pill } from '@/components/ui/Pill'
import { Avatar } from '@/components/ui/Avatar'
import { Spinner } from '@/components/ui/Spinner'
import { DEPARTMENTS } from '@/lib/seed/communities'
import { getCommunities, getSubscriptions, toggleSubscription, subscribeAll } from '@/lib/db'
import { useAuth } from '@/contexts/AuthContext'
import type { Community } from '@/types'

export default function Communities() {
  const { user } = useAuth()
  const [communities, setCommunities] = useState<Community[]>([])
  const [subs, setSubs] = useState<Set<string>>(new Set())
  const [dept, setDept] = useState<string>('All Departments')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    Promise.all([getCommunities(), getSubscriptions(user.id)]).then(([cs, s]) => {
      setCommunities(cs)
      setSubs(new Set(s))
      setLoading(false)
    })
  }, [user])

  const grouped = useMemo(() => {
    const filtered = dept === 'All Departments' ? communities : communities.filter((c) => c.department === dept)
    const map = new Map<string, Community[]>()
    filtered.forEach((c) => {
      if (!map.has(c.department)) map.set(c.department, [])
      map.get(c.department)!.push(c)
    })
    return Array.from(map.entries())
  }, [communities, dept])

  async function subscribe(id: string) {
    if (!user) return
    const joined = await toggleSubscription(user.id, id)
    setSubs((s) => {
      const next = new Set(s)
      if (joined) next.add(id)
      else next.delete(id)
      return next
    })
  }

  async function subscribeAllInDept(deptName: string, ids: string[]) {
    if (!user) return
    await subscribeAll(user.id, ids)
    setSubs((s) => new Set([...s, ...ids]))
  }

  return (
    <div>
      <PageHeader
        title="communities"
        subtitle="Join discussions and connect with your peers."
        action={
          <div className="relative">
            <select
              value={dept}
              onChange={(e) => setDept(e.target.value)}
              className="appearance-none rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 py-2 pl-4 pr-9 text-sm outline-none"
            >
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          </div>
        }
      />

      {loading ? (
        <div className="flex items-center gap-2 py-10 text-sm text-neutral-400">
          <Spinner size={16} /> Loading communities…
        </div>
      ) : (
        <div className="space-y-8">
          {grouped.map(([department, list]) => {
            const allJoined = list.every((c) => subs.has(c.id))
            return (
              <div key={department}>
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="font-bold text-neutral-800 dark:text-neutral-100">{department}</h2>
                  {allJoined ? (
                    <Pill color="green">Subscribed</Pill>
                  ) : (
                    <Button variant="secondary" onClick={() => subscribeAllInDept(department, list.map((c) => c.id))}>
                      Subscribe All
                    </Button>
                  )}
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {list.map((c) => (
                    <Card key={c.id} className="p-4">
                      <div className="flex items-start gap-3">
                        <Link to={`/dashboard/communities/${c.handle}`}>
                          <Avatar name={c.name} url={c.logoUrl} size={44} />
                        </Link>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <Link to={`/dashboard/communities/${c.handle}`} className="truncate font-semibold hover:underline">
                              {c.name}
                            </Link>
                            {c.isNew && <Pill color="amber">NEW</Pill>}
                          </div>
                          <p className="text-xs text-neutral-400">@{c.handle}</p>
                          <p className="mt-1.5 text-sm text-neutral-500 dark:text-neutral-400">{c.description}</p>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-xs text-neutral-400">{c.memberCount} members</span>
                            <Button
                              variant={subs.has(c.id) ? 'secondary' : 'primary'}
                              className="!px-3 !py-1 !text-xs"
                              onClick={() => subscribe(c.id)}
                            >
                              {subs.has(c.id) ? 'Subscribed' : 'Subscribe'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

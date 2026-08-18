import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCheck, Users, Heart, MessageSquare, AtSign, CalendarClock, ExternalLink } from 'lucide-react'
import { PageHeader } from '@/components/shell/PageHeader'
import { Card } from '@/components/ui/Card'
import { Pill } from '@/components/ui/Pill'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { getNotifications, markNotificationRead, markAllNotificationsRead, getUserById } from '@/lib/db'
import { useAuth } from '@/contexts/AuthContext'
import type { AppNotification, NotificationType } from '@/types'

const ICONS: Record<NotificationType, any> = {
  people: Users,
  community: Users,
  mention: AtSign,
  like: Heart,
  reply: MessageSquare,
  event: CalendarClock,
}

const LABELS: Record<NotificationType, string> = {
  people: 'People',
  community: 'Community',
  mention: 'Mention',
  like: 'Like',
  reply: 'Reply',
  event: 'Event',
}

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime()
  const hours = Math.round(diffMs / 3600000)
  if (hours < 1) return 'just now'
  if (hours < 24) return `${hours}h ago`
  return `${Math.round(hours / 24)}d ago`
}

export default function Headsup() {
  const { user } = useAuth()
  const [items, setItems] = useState<AppNotification[]>([])
  const [refHandle, setRefHandle] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!user) return
    getNotifications(user.id).then(async (list) => {
      setItems(list)
      const handles: Record<string, string> = {}
      for (const n of list) {
        if (n.type === 'people' && n.refId) {
          const u = await getUserById(n.refId)
          if (u) handles[n.id] = u.handle
        }
      }
      setRefHandle(handles)
    })
  }, [user])

  async function markRead(id: string) {
    if (!user) return
    await markNotificationRead(user.id, id)
    setItems((its) => its.map((n) => (n.id === id ? { ...n, readAt: new Date().toISOString() } : n)))
  }

  async function markAll() {
    if (!user) return
    await markAllNotificationsRead(user.id)
    const now = new Date().toISOString()
    setItems((its) => its.map((n) => ({ ...n, readAt: n.readAt ?? now })))
  }

  const unread = items.filter((n) => !n.readAt).length

  return (
    <div>
      <PageHeader
        title={`headsup${unread ? ` · ${unread} unread` : ''}`}
        subtitle="Your personalized notifications, recommendations, and updates."
        action={
          <Button variant="secondary" onClick={markAll} className="gap-1.5">
            <CheckCheck size={14} /> Mark all read
          </Button>
        }
      />

      {items.length === 0 ? (
        <EmptyState title="No notifications yet" />
      ) : (
        <div className="space-y-3">
          {items.map((n) => {
            const Icon = ICONS[n.type]
            return (
              <Card key={n.id} className="flex items-start gap-3 p-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-900/40 text-brand-600">
                  <Icon size={17} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Pill>{LABELS[n.type]}</Pill>
                    <span className="flex items-center gap-1 text-xs text-neutral-400">
                      {!n.readAt && <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />}
                      {timeAgo(n.createdAt)}
                    </span>
                  </div>
                  <p className="mt-1 font-semibold">{n.title}</p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">{n.body}</p>
                  <div className="mt-2 flex gap-2">
                    {refHandle[n.id] && (
                      <Link to={`/dashboard/profile/${refHandle[n.id]}`}>
                        <Button className="!px-3 !py-1 !text-xs gap-1">
                          <ExternalLink size={12} /> View profile
                        </Button>
                      </Link>
                    )}
                    {!n.readAt && (
                      <Button variant="secondary" className="!px-3 !py-1 !text-xs" onClick={() => markRead(n.id)}>
                        Mark read
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

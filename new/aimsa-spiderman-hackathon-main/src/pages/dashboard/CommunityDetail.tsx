import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Share2, UserPlus, Users, Info, Instagram, Linkedin, Sparkles } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { Spinner } from '@/components/ui/Spinner'
import { getCommunityByHandle, getSubscriptions, toggleSubscription } from '@/lib/db'
import { useAuth } from '@/contexts/AuthContext'
import type { Community } from '@/types'

export default function CommunityDetail() {
  const { handle } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [community, setCommunity] = useState<Community | null>(null)
  const [subscribed, setSubscribed] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!handle || !user) return
    setLoading(true)
    Promise.all([getCommunityByHandle(handle), getSubscriptions(user.id)]).then(([c, subs]) => {
      setCommunity(c ?? null)
      if (c) setSubscribed(subs.includes(c.id))
      setLoading(false)
    })
  }, [handle, user])

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-16 text-sm text-neutral-400">
        <Spinner size={16} /> Loading community details…
      </div>
    )
  }

  if (!community) {
    return <EmptyState title="Community not found" body="It may have been renamed or removed." />
  }

  async function subscribe() {
    if (!user || !community) return
    const joined = await toggleSubscription(user.id, community.id)
    setSubscribed(joined)
  }

  return (
    <div>
      <button onClick={() => navigate('/dashboard/communities')} className="mb-4 flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200">
        <ArrowLeft size={15} /> Back
      </button>

      <div className="h-36 w-full rounded-2xl bg-gradient-to-r from-brand-500 via-purple-400 to-pink-400" />

      <div className="-mt-8 flex items-end justify-between px-2">
        <Avatar name={community.name} url={community.logoUrl} size={72} square />
        <div className="flex items-center gap-2 pb-1">
          <button className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-500 hover:text-brand-600">
            <Share2 size={14} />
          </button>
          <Button onClick={subscribe} variant={subscribed ? 'secondary' : 'primary'} className="gap-1.5">
            <UserPlus size={14} /> {subscribed ? 'Subscribed' : 'Subscribe'}
          </Button>
        </div>
      </div>

      <div className="mt-3 px-1">
        <h1 className="text-xl font-extrabold">{community.name}</h1>
        <div className="mt-0.5 flex items-center gap-2 text-sm text-neutral-400">
          <span>@{community.handle}</span>
          {community.instagramUrl && (
            <a href={community.instagramUrl} target="_blank" rel="noreferrer" className="hover:text-brand-600">
              <Instagram size={14} />
            </a>
          )}
          {community.linkedinUrl && (
            <a href={community.linkedinUrl} target="_blank" rel="noreferrer" className="hover:text-brand-600">
              <Linkedin size={14} />
            </a>
          )}
        </div>
        <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-300">{community.description}</p>
        <p className="mt-2 flex items-center gap-1.5 text-sm text-neutral-400">
          <Users size={14} /> {community.memberCount} members
        </p>
      </div>

      <Card className="mt-5 flex items-start gap-2.5 bg-blue-50/60 dark:bg-blue-950/30 p-4 border-blue-100 dark:border-blue-900">
        <Info size={16} className="mt-0.5 shrink-0 text-blue-500" />
        <p className="text-sm text-blue-700 dark:text-blue-300">
          Are you a club lead? If you are the official lead for this club, you can get admin access to manage this
          page. Contact the developers via the{' '}
          <Link to="/dashboard/contact" className="font-semibold underline">
            contact form
          </Link>{' '}
          to get started.
        </p>
      </Card>

      <div className="mt-8">
        <h2 className="mb-3 font-bold">Recent activity</h2>
        <EmptyState
          icon={<Sparkles size={22} />}
          title="Community posts starting soon!"
          body="Stay tuned for upcoming discussions, events, and announcements from this community."
        />
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { BadgeCheck, Camera, Linkedin, MessageCircle, Mail, LogOut, Pencil, Phone } from 'lucide-react'
import { PageHeader } from '@/components/shell/PageHeader'
import { Card } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Pill } from '@/components/ui/Pill'
import { EmptyState } from '@/components/ui/EmptyState'
import { PostCard } from '@/components/post/PostCard'
import { EditProfileModal } from '@/components/profile/EditProfileModal'
import { useAuth } from '@/contexts/AuthContext'
import { getUserByHandle, getUsers, getPosts, getFollowing, toggleFollow } from '@/lib/db'
import type { AppUser, Post } from '@/types'

export default function Profile() {
  const { handle } = useParams()
  const { user: me, signOut } = useAuth()
  const [profile, setProfile] = useState<AppUser | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [repliedPosts, setRepliedPosts] = useState<Post[]>([])
  const [allUsers, setAllUsers] = useState<AppUser[]>([])
  const [tab, setTab] = useState<'posts' | 'replies'>('posts')
  const [editing, setEditing] = useState(false)
  const [following, setFollowing] = useState(false)

  const isOwn = !handle || handle === me?.handle

  useEffect(() => {
    async function load() {
      const target = isOwn ? me : await getUserByHandle(handle!)
      if (!target) return
      setProfile(target)
      const [ownPosts, everyPost, users, followingIds] = await Promise.all([
        getPosts(target.id),
        getPosts(),
        getUsers(),
        me ? getFollowing(me.id) : Promise.resolve([]),
      ])
      setPosts(ownPosts)
      setRepliedPosts(everyPost.filter((p) => p.replies.some((r) => r.authorId === target.id)))
      setAllUsers(users)
      setFollowing(followingIds.includes(target.id))
    }
    load()
  }, [handle, me, isOwn])

  if (!profile) return null

  async function follow() {
    if (!me || isOwn) return
    const now = await toggleFollow(me.id, profile!.id)
    setFollowing(now)
  }

  return (
    <div>
      <PageHeader title={isOwn ? 'profile' : `profile/${profile.handle}`} />

      <div className="relative h-36 w-full overflow-hidden rounded-2xl bg-gradient-to-r from-brand-500 via-purple-400 to-pink-400">
        {profile.role === 'admin' && (
          <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-brand-700">
            <BadgeCheck size={13} /> COHORT ADMIN
          </span>
        )}
        {profile.role === 'user' && (
          <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-neutral-700">
            <BadgeCheck size={13} /> COHORT USER
          </span>
        )}
      </div>

      <div className="-mt-10 flex items-end justify-between px-2">
        <div className="relative">
          <Avatar name={profile.displayName} url={profile.avatarUrl} size={84} square />
          {isOwn && (
            <button className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-white ring-2 ring-white dark:ring-neutral-950">
              <Camera size={13} />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 pb-1">
          {profile.linkedinUsername && (
            <a href={`https://linkedin.com/in/${profile.linkedinUsername}`} target="_blank" rel="noreferrer" className="iconbtn">
              <Linkedin size={15} />
            </a>
          )}
          {!isOwn && profile.whatsapp && (
            <a href={`https://wa.me/${profile.whatsapp}`} target="_blank" rel="noreferrer" className="iconbtn">
              <Phone size={15} />
            </a>
          )}
          {!isOwn && (
            <a href={`/dashboard/connect?user=${profile.handle}`} className="iconbtn">
              <MessageCircle size={15} />
            </a>
          )}
          <a href="/dashboard/contact" className="iconbtn">
            <Mail size={15} />
          </a>
          {isOwn ? (
            <>
              <button onClick={() => setEditing(true)} className="iconbtn">
                <Pencil size={15} />
              </button>
              <Button variant="danger" onClick={signOut} className="gap-1.5">
                <LogOut size={14} /> Sign out
              </Button>
            </>
          ) : (
            <Button variant={following ? 'secondary' : 'primary'} onClick={follow}>
              {following ? 'Following' : 'Follow'}
            </Button>
          )}
        </div>
      </div>

      <div className="mt-3 px-1">
        <h1 className="text-xl font-extrabold">{profile.displayName}</h1>
        <div className="flex items-center gap-2 text-sm text-neutral-400">
          <span>@{profile.handle}</span>
          {profile.department && <Pill>{profile.department}</Pill>}
        </div>
        {profile.bio && <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">{profile.bio}</p>}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Communities" value={profile.communitiesCount} />
        <Stat label="Followers" value={profile.followersCount} />
        <Stat label="Following" value={profile.followingCount} />
        <Stat label="Flex" value={profile.flexCount} />
      </div>

      <div className="mt-8">
        <div className="mb-4 flex gap-2 border-b border-neutral-200 dark:border-neutral-800">
          <TabButton active={tab === 'posts'} onClick={() => setTab('posts')}>
            Posts ({posts.length})
          </TabButton>
          <TabButton active={tab === 'replies'} onClick={() => setTab('replies')}>
            Replies ({repliedPosts.length})
          </TabButton>
        </div>

        {tab === 'posts' ? (
          posts.length === 0 ? (
            <EmptyState title="No posts yet." />
          ) : (
            <div className="space-y-4">
              {posts.map((p) => (
                <PostCard key={p.id} post={p} users={allUsers} onChange={(updated) => setPosts((ps) => ps.map((x) => (x.id === updated.id ? updated : x)))} />
              ))}
            </div>
          )
        ) : repliedPosts.length === 0 ? (
          <EmptyState title="No replies yet." />
        ) : (
          <div className="space-y-4">
            {repliedPosts.map((p) => (
              <PostCard key={p.id} post={p} users={allUsers} onChange={(updated) => setRepliedPosts((ps) => ps.map((x) => (x.id === updated.id ? updated : x)))} />
            ))}
          </div>
        )}
      </div>

      {isOwn && profile && (
        <EditProfileModal
          open={editing}
          onClose={() => setEditing(false)}
          user={profile}
          onSaved={(u) => setProfile(u)}
        />
      )}
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <Card className="p-4 text-center">
      <p className="text-2xl font-extrabold text-brand-600">{value}</p>
      <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">{label}</p>
    </Card>
  )
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`border-b-2 px-3 pb-2.5 text-sm font-semibold ${active ? 'border-brand-600 text-brand-600' : 'border-transparent text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'}`}
    >
      {children}
    </button>
  )
}

'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import { Image as ImageIcon } from 'lucide-react'
import { PageHeader } from '@/components/shell/PageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { PostCard } from '@/components/post/PostCard'
import { useAuth } from '@/contexts/AuthContext'
import { getPosts, createPost, getUsers } from '@/lib/db'
import type { Post, AppUser } from '@/types'
import { Avatar } from '@/components/ui/Avatar'

export default function Home() {
  const { user } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [users, setUsers] = useState<AppUser[]>([])
  const [draft, setDraft] = useState('')
  const [loading, setLoading] = useState(true)
  const [posting, setPosting] = useState(false)

  useEffect(() => {
    Promise.all([getPosts(), getUsers()]).then(([p, u]) => {
      setPosts(p)
      setUsers(u)
      setLoading(false)
    })
  }, [])

  async function submit() {
    if (!user || !draft.trim()) return
    setPosting(true)
    const newPost = await createPost(user.id, draft.trim())
    setPosts((p) => [newPost, ...p])
    setDraft('')
    setPosting(false)
  }

  return (
    <div>
      <PageHeader title="home" subtitle="Your feed and posts." />

      <Card className="mb-6 p-4">
        <div className="flex gap-3">
          <Avatar name={user?.displayName ?? '?'} url={user?.avatarUrl} size={40} />
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="What's on your mind? Type @ to tag users or communities"
            rows={3}
            className="flex-1 resize-none rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 p-3 text-sm outline-none focus:border-brand-400"
          />
        </div>
        <div className="mt-3 flex items-center justify-between">
          <button className="flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200">
            <ImageIcon size={16} /> Attach
          </button>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setDraft('')} disabled={!draft}>
              Cancel
            </Button>
            <Button onClick={submit} disabled={!draft.trim() || posting}>
              Post
            </Button>
          </div>
        </div>
      </Card>

      {loading ? (
        <p className="py-10 text-center text-sm text-neutral-400">Loading feed…</p>
      ) : posts.length === 0 ? (
        <EmptyState title="No posts yet. Be the first to share something!" />
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} users={users} onChange={(updated) => setPosts((p) => p.map((x) => (x.id === updated.id ? updated : x)))} />
          ))}
        </div>
      )}
    </div>
  )
}

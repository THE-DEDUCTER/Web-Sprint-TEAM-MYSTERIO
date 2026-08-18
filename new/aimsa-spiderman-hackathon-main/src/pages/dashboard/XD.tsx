import { useEffect, useState } from 'react'
import { Hash, Share2, Shuffle, Heart, ExternalLink, ChevronDown } from 'lucide-react'
import { getXdItems, toggleXdLike } from '@/lib/db'
import type { XdItem } from '@/types'

export default function XD() {
  const [items, setItems] = useState<XdItem[]>([])
  const [index, setIndex] = useState(0)

  useEffect(() => {
    getXdItems().then(setItems)
  }, [])

  const item = items[index]

  function next() {
    setIndex((i) => (i + 1) % Math.max(items.length, 1))
  }

  function shuffle() {
    setIndex(Math.floor(Math.random() * items.length))
  }

  async function like() {
    if (!item) return
    await toggleXdLike(item.id)
    setItems((its) => its.map((i) => (i.id === item.id ? { ...i, likedByMe: !i.likedByMe, likeCount: i.likeCount + (i.likedByMe ? -1 : 1) } : i)))
  }

  async function share() {
    try {
      await navigator.clipboard.writeText(item?.sourceUrl ?? window.location.href)
    } catch {
      /* clipboard unavailable */
    }
  }

  if (!item) {
    return <div className="flex h-full items-center justify-center text-sm text-neutral-400">Loading XD…</div>
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black lg:left-16 xl:right-[280px]">
      <div className="relative h-full w-full max-w-md overflow-hidden bg-neutral-900">
        <img src={item.mediaUrl} alt={item.caption ?? item.tag} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40" />

        <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
          <Hash size={12} /> {item.tag}
        </div>

        <div className="absolute right-4 top-4 flex gap-2">
          <button onClick={share} className="flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur">
            <Share2 size={15} />
          </button>
          <button onClick={shuffle} className="flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur">
            <Shuffle size={15} />
          </button>
        </div>

        <div className="absolute bottom-24 right-4 flex flex-col items-center gap-5">
          <button onClick={like} className="flex flex-col items-center gap-1 text-white">
            <Heart size={26} fill={item.likedByMe ? '#ec4899' : 'none'} color={item.likedByMe ? '#ec4899' : 'white'} />
            <span className="text-[11px] font-semibold">{item.likeCount}</span>
          </button>
          <a href={item.sourceUrl} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1 text-white">
            <ExternalLink size={24} />
            <span className="text-[11px] font-semibold">Source</span>
          </a>
          <button onClick={share} className="flex flex-col items-center gap-1 text-white">
            <Share2 size={24} />
            <span className="text-[11px] font-semibold">Share</span>
          </button>
        </div>

        {item.caption && (
          <p className="absolute bottom-6 left-4 right-20 text-sm font-medium text-white">{item.caption}</p>
        )}

        <button
          onClick={next}
          className="absolute bottom-2 left-1/2 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur hover:bg-white/30"
        >
          <ChevronDown size={20} />
        </button>
      </div>
    </div>
  )
}

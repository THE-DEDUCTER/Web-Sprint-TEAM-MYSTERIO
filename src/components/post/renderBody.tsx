import { Link as LinkIcon } from 'lucide-react'
import Link from 'next/link'

const TOKEN_RE = /(@[\w]+|https?:\/\/[^\s]+)/g

export function renderBody(body: string): React.ReactNode[] {
  const parts = body.split(TOKEN_RE)
  return parts.map((part, i) => {
    if (part.startsWith('@')) {
      return (
        <Link key={i} href={`/dashboard/profile/${part.slice(1)}`} className="font-medium text-brand-600 hover:underline">
          {part}
        </Link>
      )
    }
    if (part.startsWith('http')) {
      let domain = part
      try {
        domain = new URL(part).hostname.replace('www.', '')
      } catch {
        /* noop */
      }
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noreferrer"
          className="mt-2 flex items-center gap-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3 py-2 text-xs text-neutral-500 hover:border-brand-300"
        >
          <LinkIcon size={13} className="shrink-0" />
          <span className="truncate">{domain}</span>
        </a>
      )
    }
    return <span key={i}>{part}</span>
  })
}

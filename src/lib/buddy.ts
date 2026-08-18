import { getCommunities, getUsers } from '@/lib/db'
import { navItems } from '@/components/shell/navItems'

export async function askBuddy(question: string): Promise<string> {
  const q = question.trim().toLowerCase()
  if (!q) return "Type something and I'll take a look. 👀"

  if (/^(hi|hey|hello|sup|yo)\b/.test(q)) {
    return "Hey — I'm Buddy. Ask me to find a user, a community, or a page, and I'll dig it up. No promises about being nice about it."
  }

  const [communities, users] = await Promise.all([getCommunities(), getUsers()])

  const pageHit = navItems.find((n) => q.includes(n.label.toLowerCase()))
  if (pageHit) {
    return `${pageHit.label} lives at ${pageHit.to} — ${pageHit.description.toLowerCase()}.`
  }

  const handleMatch = q.match(/@?([a-z0-9_]{3,})/)?.[1]

  const communityHit = communities.find(
    (c) => q.includes(c.name.toLowerCase()) || (handleMatch && c.handle.toLowerCase().includes(handleMatch)),
  )
  if (communityHit) {
    return `Found it — ${communityHit.name} (@${communityHit.handle}), ${communityHit.memberCount} members, in ${communityHit.department}. "${communityHit.description}"`
  }

  const userHit = users.find(
    (u) => q.includes(u.displayName.toLowerCase()) || (handleMatch && u.handle.toLowerCase().includes(handleMatch)),
  )
  if (userHit) {
    return `${userHit.displayName} (@${userHit.handle}) — ${userHit.department ?? 'Department unknown'}. You can find them at /dashboard/profile/${userHit.handle}.`
  }

  if (q.includes('marketplace') || q.includes('shop')) {
    return "The Marketplace is coming soon — buy, sell, and trade with fellow students. Not live yet, sorry."
  }

  return "Couldn't find that one. Try naming a community, a student's name, or a page like \"communities\" or \"map\"."
}

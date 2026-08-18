const COLORS = ['#4F46E5', '#EC4899', '#F59E0B', '#10B981', '#8B5CF6', '#0EA5E9', '#EF4444']

function colorFor(seed: string) {
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash)
  return COLORS[Math.abs(hash) % COLORS.length]
}

export function Avatar({ name, url, size = 40, square = false }: { name: string; url?: string; size?: number; square?: boolean }) {
  const initial = name?.trim()?.[0]?.toUpperCase() ?? '?'
  if (url) {
    return (
      <img
        src={url}
        alt={name}
        style={{ width: size, height: size }}
        className={`object-cover ${square ? 'rounded-xl' : 'rounded-full'}`}
      />
    )
  }
  return (
    <div
      style={{ width: size, height: size, backgroundColor: colorFor(name || 'x'), fontSize: size * 0.42 }}
      className={`flex items-center justify-center font-bold text-white shrink-0 ${square ? 'rounded-xl' : 'rounded-full'}`}
    >
      {initial}
    </div>
  )
}

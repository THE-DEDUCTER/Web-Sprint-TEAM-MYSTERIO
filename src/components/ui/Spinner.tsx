export function Spinner({ size = 28, className = '' }: { size?: number; className?: string }) {
  return (
    <div
      style={{ width: size, height: size, borderWidth: Math.max(2, size / 10) }}
      className={`animate-spin rounded-full border-brand-600 border-t-transparent ${className}`}
    />
  )
}

export function BrandSplash({ label }: { label?: string }) {
  return (
    <div className="flex h-full min-h-[50vh] w-full flex-col items-center justify-center gap-4">
      <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-neutral-50 dark:bg-neutral-800 shadow-sm">
        <LogoMark size={56} />
      </div>
      {label && <p className="text-sm text-neutral-500 dark:text-neutral-400">{label}</p>}
    </div>
  )
}

export function LogoMark({ size = 32, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={`${className} animate-pulse`}>
      <defs>
        <linearGradient id="logo-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4F46E5" />
          <stop offset="50%" stopColor="#EC4899" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill="url(#logo-grad)" />
      <circle cx="32" cy="32" r="14" fill="none" stroke="white" strokeWidth="4" />
      <circle cx="22" cy="26" r="4" fill="white" />
      <circle cx="42" cy="38" r="4" fill="white" />
    </svg>
  )
}

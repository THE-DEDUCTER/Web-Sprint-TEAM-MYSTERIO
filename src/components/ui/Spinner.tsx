export function Spinner({ size = 28, className = '' }: { size?: number; className?: string }) {
  return (
    <div
      style={{ width: size, height: size, borderWidth: Math.max(2, size / 10) }}
      className={`animate-spin rounded-full border-brand-600 border-t-transparent ${className}`}
    />
  )
}

export function VideoLoader({ size = 120, className = '' }: { size?: number; className?: string }) {
  return (
    <div className={`relative flex items-center justify-center overflow-hidden rounded-2xl ${className}`} style={{ width: size, height: size }}>
      <video
        src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/coh-loader-light_pmzlpg.mp4`}
        autoPlay
        loop
        muted
        playsInline
        className="h-full w-full object-cover rounded-2xl"
      />
    </div>
  )
}

export function BrandSplash({ label }: { label?: string }) {
  return (
    <div className="flex h-full min-h-[60vh] w-full flex-col items-center justify-center gap-4 bg-white dark:bg-neutral-950">
      <VideoLoader size={140} />
      {label && <p className="text-sm font-medium text-neutral-600 dark:text-neutral-300 animate-pulse">{label}</p>}
    </div>
  )
}

export function LogoMark({ size = 32, className = '' }: { size?: number; className?: string }) {
  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className}`} style={{ width: size, height: size }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/cohort-logo.png`}
        alt="Cohort Logo"
        width={size}
        height={size}
        className="h-full w-full object-contain"
      />
    </div>
  )
}


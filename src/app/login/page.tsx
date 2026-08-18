'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogoMark, Spinner } from '@/components/ui/Spinner'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { useAuth } from '@/contexts/AuthContext'
import { seedUsers, DEMO_PERSONAS } from '@/lib/seed/users'
import { AuthProvider } from '@/contexts/AuthContext'
import { ThemeProvider } from '@/contexts/ThemeContext'

function LoginPage() {
  const { user, loading, isDemoMode, signInWithGoogle, signInDemo } = useAuth()
  const router = useRouter()
  const [signingIn, setSigningIn] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && user) router.replace('/dashboard')
  }, [loading, user, router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50 dark:bg-neutral-950">
        <div className="rounded-2xl bg-white dark:bg-neutral-900 p-10 shadow-sm">
          <LogoMark size={80} />
        </div>
      </div>
    )
  }

  const personas = seedUsers.filter((u) => DEMO_PERSONAS.includes(u.id))

  async function pick(id: string) {
    setSigningIn(id)
    await signInDemo(id)
    router.push('/dashboard')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-neutral-50 dark:bg-neutral-950 px-6 py-16">
      <div className="flex flex-col items-center gap-3">
        <LogoMark size={64} />
        <h1 className="text-xl font-extrabold">Sign in to Cohort</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">A Social Platform for PCCOE</p>
      </div>

      {!isDemoMode ? (
        <Button variant="secondary" onClick={signInWithGoogle} className="gap-2 px-6 py-3 text-base">
          Sign in with Google
        </Button>
      ) : (
        <div className="w-full max-w-sm rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm">
          <p className="mb-1 text-sm font-semibold">Demo mode</p>
          <p className="mb-4 text-xs text-neutral-500 dark:text-neutral-400">
            Google sign-in isn&apos;t configured yet — pick a demo student to explore Cohort.
          </p>
          <div className="space-y-2">
            {personas.map((p) => (
              <button
                key={p.id}
                onClick={() => pick(p.id)}
                disabled={!!signingIn}
                className="flex w-full items-center gap-3 rounded-xl border border-neutral-200 dark:border-neutral-700 px-3 py-2.5 text-left hover:border-brand-400 hover:bg-brand-50/50 dark:hover:bg-brand-900/20 disabled:opacity-60"
              >
                <Avatar name={p.displayName} size={36} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{p.displayName}</p>
                  <p className="truncate text-xs text-neutral-400">@{p.handle} · {p.department}</p>
                </div>
                {signingIn === p.id && <Spinner size={16} className="ml-auto" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function LoginWithProviders() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    </ThemeProvider>
  )
}

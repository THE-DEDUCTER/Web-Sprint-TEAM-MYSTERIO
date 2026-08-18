'use client'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient'
import { store } from '@/lib/localStore'
import { getUserById } from '@/lib/db'
import type { AppUser } from '@/types'

interface AuthCtx {
  user: AppUser | null
  loading: boolean
  isDemoMode: boolean
  signInWithGoogle: () => Promise<void>
  signInDemo: (userId: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthCtx | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function loadDemoSession() {
      const id = store.currentUserId.get()
      if (id) {
        const u = await getUserById(id)
        if (mounted) setUser(u ?? null)
      }
      if (mounted) setLoading(false)
    }

    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(async ({ data }) => {
        const sessionUser = data.session?.user
        if (sessionUser) {
          const appUser = await getUserById(sessionUser.id)
          if (mounted) setUser(appUser ?? null)
        }
        if (mounted) setLoading(false)
      })
      const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          const appUser = await getUserById(session.user.id)
          if (mounted) setUser(appUser ?? null)
        } else if (mounted) {
          setUser(null)
        }
      })
      return () => {
        mounted = false
        sub.subscription.unsubscribe()
      }
    } else {
      loadDemoSession()
    }

    return () => {
      mounted = false
    }
  }, [])

  async function signInWithGoogle() {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/dashboard` },
      })
    }
  }

  async function signInDemo(userId: string) {
    store.currentUserId.set(userId)
    const u = await getUserById(userId)
    setUser(u ?? null)
  }

  async function signOut() {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut()
    }
    store.currentUserId.set(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, isDemoMode: !isSupabaseConfigured, signInWithGoogle, signInDemo, signOut }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

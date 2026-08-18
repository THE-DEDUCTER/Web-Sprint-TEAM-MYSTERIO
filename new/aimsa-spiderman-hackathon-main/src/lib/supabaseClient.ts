import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const isSupabaseConfigured = Boolean(url && anonKey)

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, anonKey as string)
  : null

export const isTomTomConfigured = Boolean(import.meta.env.VITE_TOMTOM_API_KEY)
export const tomtomKey = import.meta.env.VITE_TOMTOM_API_KEY as string | undefined

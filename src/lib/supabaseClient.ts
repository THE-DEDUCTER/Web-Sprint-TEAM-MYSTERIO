import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string | undefined
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string | undefined

export const isSupabaseConfigured = Boolean(url && anonKey)

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, anonKey as string)
  : null

export const isTomTomConfigured = Boolean(process.env.NEXT_PUBLIC_TOMTOM_API_KEY)
export const tomtomKey = process.env.NEXT_PUBLIC_TOMTOM_API_KEY as string | undefined

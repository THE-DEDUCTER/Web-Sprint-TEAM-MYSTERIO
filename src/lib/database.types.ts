export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          avatar_url: string | null
          website: string | null
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          avatar_url?: string | null
          website?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          avatar_url?: string | null
          website?: string | null
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: number
          created_at: string
          title: string
          description: string | null
          latitude: number
          longitude: number
          date_time: string
        }
        Insert: {
          id?: number
          created_at?: string
          title: string
          description?: string | null
          latitude: number
          longitude: number
          date_time: string
        }
        Update: {
          id?: number
          created_at?: string
          title?: string
          description?: string | null
          latitude?: number
          longitude?: number
          date_time?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

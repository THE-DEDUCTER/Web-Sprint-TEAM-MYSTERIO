'use client'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { InitialLoader } from '@/components/InitialLoader'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <InitialLoader />
        {children}
      </AuthProvider>
    </ThemeProvider>
  )
}


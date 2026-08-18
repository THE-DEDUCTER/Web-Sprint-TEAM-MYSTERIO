'use client'
import { AppShell } from '@/components/shell/AppShell'
import { ProtectedRoute } from '@/components/shell/ProtectedRoute'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <AppShell>{children}</AppShell>
    </ProtectedRoute>
  )
}

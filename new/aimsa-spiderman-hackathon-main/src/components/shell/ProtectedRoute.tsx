import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { BrandSplash } from '@/components/ui/Spinner'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) return <BrandSplash label="Loading Cohort…" />
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

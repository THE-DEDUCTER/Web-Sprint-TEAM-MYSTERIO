import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { AppShell } from '@/components/shell/AppShell'
import { ProtectedRoute } from '@/components/shell/ProtectedRoute'

import Landing from '@/pages/marketing/Landing'
import Login from '@/pages/auth/Login'
import Home from '@/pages/dashboard/Home'
import Communities from '@/pages/dashboard/Communities'
import CommunityDetail from '@/pages/dashboard/CommunityDetail'
import Network from '@/pages/dashboard/Network'
import Connect from '@/pages/dashboard/Connect'
import XD from '@/pages/dashboard/XD'
import CampusMap from '@/pages/dashboard/CampusMap'
import CalendarPage from '@/pages/dashboard/Calendar'
import Arcade from '@/pages/dashboard/Arcade'
import Headsup from '@/pages/dashboard/Headsup'
import Contact from '@/pages/dashboard/Contact'
import Profile from '@/pages/dashboard/Profile'

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <AppShell />
                </ProtectedRoute>
              }
            >
              <Route index element={<Home />} />
              <Route path="network" element={<Network />} />
              <Route path="communities" element={<Communities />} />
              <Route path="communities/:handle" element={<CommunityDetail />} />
              <Route path="connect" element={<Connect />} />
              <Route path="xd" element={<XD />} />
              <Route path="map" element={<CampusMap />} />
              <Route path="calendar" element={<CalendarPage />} />
              <Route path="arcade" element={<Arcade />} />
              <Route path="headsup" element={<Headsup />} />
              <Route path="contact" element={<Contact />} />
              <Route path="profile" element={<Profile />} />
              <Route path="profile/:handle" element={<Profile />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

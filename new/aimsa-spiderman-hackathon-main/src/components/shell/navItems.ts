import {
  Home, Users, Heart, MessageCircle, Zap, MapPin, Calendar, Gamepad2, Bell, Mail, User,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  description: string
}

export const navItems: NavItem[] = [
  { to: '/dashboard', label: 'Home', icon: Home, description: 'Your feed and posts' },
  { to: '/dashboard/network', label: 'Network', icon: Users, description: 'Alumni & student connections' },
  { to: '/dashboard/communities', label: 'Communities', icon: Heart, description: 'Join discussions and connect' },
  { to: '/dashboard/connect', label: 'Connect', icon: MessageCircle, description: 'Encrypted chats with cohort users' },
  { to: '/dashboard/xd', label: 'XD', icon: Zap, description: 'Anonymous exchange feed' },
  { to: '/dashboard/map', label: 'Campus Map', icon: MapPin, description: 'Navigate PCCOE campus' },
  { to: '/dashboard/calendar', label: 'Calendar', icon: Calendar, description: 'Academic events & schedule' },
  { to: '/dashboard/arcade', label: 'Arcade', icon: Gamepad2, description: 'Quick browser games' },
  { to: '/dashboard/headsup', label: 'Headsup', icon: Bell, description: 'Notifications & updates' },
  { to: '/dashboard/contact', label: 'Contact', icon: Mail, description: 'Reach the Cohort team' },
  { to: '/dashboard/profile', label: 'Profile', icon: User, description: 'Your profile & portfolio' },
]

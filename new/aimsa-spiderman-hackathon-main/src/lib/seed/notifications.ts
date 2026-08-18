import type { AppNotification } from '@/types'

const hoursAgo = (h: number) => new Date(Date.now() - h * 3600000).toISOString()

export function buildSeedNotifications(forUserId: string): AppNotification[] {
  return [
    {
      id: 'n-1',
      userId: forUserId,
      type: 'people',
      refId: 'u-shravan',
      title: 'You may know @shravan24',
      body: 'Shravan Kulkarni is active on Cohort. Follow to stay updated.',
      createdAt: hoursAgo(7),
    },
    {
      id: 'n-2',
      userId: forUserId,
      type: 'people',
      refId: 'u-isha',
      title: 'You may know @ishapatil',
      body: 'Isha Patil is active on Cohort. Follow to stay updated.',
      createdAt: hoursAgo(18),
    },
    {
      id: 'n-3',
      userId: forUserId,
      type: 'community',
      refId: 'com-gdgcpccoe',
      title: 'New activity in Google Developer Groups PCCoE',
      body: 'A new announcement was posted in a community you follow.',
      createdAt: hoursAgo(30),
    },
    {
      id: 'n-4',
      userId: forUserId,
      type: 'people',
      refId: 'u-om',
      title: 'You may know @omdeshmukh',
      body: 'Om Deshmukh is active on Cohort. Follow to stay updated.',
      createdAt: hoursAgo(50),
    },
  ]
}

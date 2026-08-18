import type { AcademicEvent } from '@/types'

function iso(y: number, m: number, d: number): string {
  return new Date(y, m - 1, d).toISOString().slice(0, 10)
}

const now = new Date()
const y = now.getFullYear()
const m = now.getMonth() + 1

export const seedAcademicEvents: AcademicEvent[] = [
  { id: 'ev-1', title: 'Unit Test 1 begins', date: iso(y, m, 20), type: 'exam', description: 'Unit Test 1 for all branches begins.' },
  { id: 'ev-2', title: 'Independence Day (observed)', date: iso(y, m, 15), type: 'holiday', description: 'College holiday.' },
  { id: 'ev-3', title: 'Assignment 2 submission deadline', date: iso(y, m, 25), type: 'deadline', description: 'Submit via department portal before 11:59 PM.' },
  { id: 'ev-4', title: 'GDGC DevFest Prep Meetup', date: iso(y, m, 28), type: 'event', description: 'Open meetup, Seminar Hall 2, 4 PM.' },
  { id: 'ev-5', title: 'Semester exam form fill-up deadline', date: iso(y, m + 1 > 12 ? 1 : m + 1, 5), type: 'deadline', description: 'Complete exam form fill-up online.' },
]

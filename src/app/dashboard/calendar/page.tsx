'use client'

import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { PageHeader } from '@/components/shell/PageHeader'
import { Card } from '@/components/ui/Card'
import { Pill } from '@/components/ui/Pill'
import { seedAcademicEvents } from '@/lib/seed/academicEvents'
import type { AcademicEvent, EventType } from '@/types'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const typeColor: Record<EventType, 'blue' | 'red' | 'amber' | 'purple' | 'green'> = {
  exam: 'red',
  holiday: 'green',
  deadline: 'amber',
  event: 'purple',
}

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10)
}

export default function CalendarPage() {
  const today = new Date()
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const [selected, setSelected] = useState<string | null>(null)

  const eventsByDate = useMemo(() => {
    const map = new Map<string, AcademicEvent[]>()
    seedAcademicEvents.forEach((e) => {
      if (!map.has(e.date)) map.set(e.date, [])
      map.get(e.date)!.push(e)
    })
    return map
  }, [])

  const cells = useMemo(() => {
    const year = cursor.getFullYear()
    const month = cursor.getMonth()
    const firstDay = new Date(year, month, 1)
    const startOffset = firstDay.getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7
    return Array.from({ length: totalCells }, (_, i) => {
      const date = new Date(year, month, i - startOffset + 1)
      return { date, inMonth: date.getMonth() === month }
    })
  }, [cursor])

  const monthLabel = cursor.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
  const todayIso = isoDate(today)
  const selectedEvents = selected ? eventsByDate.get(selected) ?? [] : []

  return (
    <div>
      <PageHeader title="calendar" subtitle="Academic events and important dates." />

      <Card className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">{monthLabel}</h2>
          <div className="flex gap-1.5">
            <button
              onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800"
            >
              <ChevronLeft size={15} />
            </button>
            <button
              onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-neutral-400">
          {WEEKDAYS.map((d) => <div key={d} className="py-1.5">{d}</div>)}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {cells.map(({ date, inMonth }, i) => {
            const iso = isoDate(date)
            const dayEvents = eventsByDate.get(iso) ?? []
            const isToday = iso === todayIso
            return (
              <button
                key={i}
                onClick={() => setSelected(iso)}
                className={`flex h-16 flex-col items-center justify-start gap-1 rounded-lg border p-1.5 text-sm transition ${
                  isToday ? 'border-brand-500' : selected === iso ? 'border-neutral-300 dark:border-neutral-600' : 'border-transparent hover:border-neutral-200 dark:hover:border-neutral-700'
                } ${inMonth ? '' : 'opacity-30'}`}
              >
                <span className={`flex h-6 w-6 items-center justify-center rounded-full ${isToday ? 'bg-brand-600 text-white' : ''}`}>
                  {date.getDate()}
                </span>
                {dayEvents.length > 0 && (
                  <span className="flex gap-0.5">
                    {dayEvents.slice(0, 3).map((e) => (
                      <span key={e.id} className={`h-1.5 w-1.5 rounded-full ${e.type === 'exam' ? 'bg-red-500' : e.type === 'holiday' ? 'bg-green-500' : e.type === 'deadline' ? 'bg-amber-500' : 'bg-purple-500'}`} />
                    ))}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </Card>

      <div className="mt-5">
        {selected && selectedEvents.length > 0 ? (
          <div className="space-y-2">
            {selectedEvents.map((e) => (
              <Card key={e.id} className="flex items-center gap-3 p-4">
                <Pill color={typeColor[e.type]}>{e.type}</Pill>
                <div>
                  <p className="font-semibold">{e.title}</p>
                  {e.description && <p className="text-sm text-neutral-500 dark:text-neutral-400">{e.description}</p>}
                </div>
              </Card>
            ))}
          </div>
        ) : selected ? (
          <p className="text-sm italic text-neutral-400">No events on this day.</p>
        ) : null}
      </div>
    </div>
  )
}

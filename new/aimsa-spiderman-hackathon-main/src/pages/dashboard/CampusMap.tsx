import { useEffect, useRef, useState } from 'react'
import { MapPin } from 'lucide-react'
import { PageHeader } from '@/components/shell/PageHeader'
import { Card } from '@/components/ui/Card'
import { isTomTomConfigured, tomtomKey } from '@/lib/supabaseClient'
import { seedMapPois, POI_COLORS, CAMPUS_CENTER } from '@/lib/seed/mapPois'
import '@tomtom-international/web-sdk-maps/dist/maps.css'

export default function CampusMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!isTomTomConfigured || !mapRef.current) return
    let map: any
    let markers: any[] = []

    async function init() {
      const tt = await import('@tomtom-international/web-sdk-maps')
      map = tt.map({
        key: tomtomKey as string,
        container: mapRef.current!,
        center: CAMPUS_CENTER,
        zoom: 16,
      })
      map.addControl(new tt.NavigationControl())

      seedMapPois.forEach((poi) => {
        const el = document.createElement('div')
        el.style.width = '18px'
        el.style.height = '18px'
        el.style.borderRadius = '50%'
        el.style.border = '2px solid white'
        el.style.boxShadow = '0 1px 4px rgba(0,0,0,0.4)'
        el.style.background = POI_COLORS[poi.category]
        el.title = poi.name

        const popup = new tt.Popup({ offset: 20 }).setHTML(
          `<strong>${poi.name}</strong><br/><span style="font-size:12px;color:#666">${poi.description ?? ''}</span>`,
        )
        const marker = new tt.Marker({ element: el }).setLngLat([poi.lng, poi.lat]).setPopup(popup).addTo(map)
        markers.push(marker)
      })
      setReady(true)
    }

    init()
    return () => {
      markers.forEach((m) => m.remove())
      map?.remove()
    }
  }, [])

  return (
    <div>
      <PageHeader title="maps" subtitle="Interactive internal campus map for PCCOE." />

      {!isTomTomConfigured ? (
        <Card className="p-8 text-center">
          <MapPin size={32} className="mx-auto mb-3 text-neutral-300" />
          <p className="font-semibold">Add a TomTom API key to enable the live map</p>
          <p className="mx-auto mt-1.5 max-w-md text-sm text-neutral-500 dark:text-neutral-400">
            Set <code className="rounded bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5">VITE_TOMTOM_API_KEY</code>{' '}
            in your <code className="rounded bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5">.env</code> file (see
            README) to load the interactive campus map. Below is the seeded POI list that will appear as markers.
          </p>
          <div className="mx-auto mt-6 grid max-w-lg gap-2 text-left sm:grid-cols-2">
            {seedMapPois.map((poi) => (
              <div key={poi.id} className="flex items-center gap-2 rounded-lg border border-neutral-100 dark:border-neutral-800 px-3 py-2 text-sm">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: POI_COLORS[poi.category] }} />
                <span className="truncate">{poi.name}</span>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <div className="relative h-[560px] w-full overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800">
          {!ready && <div className="absolute inset-0 flex items-center justify-center text-sm text-neutral-400">Loading map…</div>}
          <div ref={mapRef} className="h-full w-full" />
        </div>
      )}
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix for default marker icons in Leaflet with Webpack/Next.js
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function Map() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <div className="h-[400px] w-full bg-gray-200 animate-pulse rounded-xl" />

  // PCCOE Pune coordinates (as a placeholder for Cohort PCCOE)
  const position: [number, number] = [18.6517, 73.7616]

  return (
    <div className="h-[400px] w-full rounded-xl overflow-hidden border-2 border-[var(--spidey-blue)] shadow-[0_0_15px_var(--spidey-blue)]">
      <MapContainer center={position} zoom={15} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={icon}>
          <Popup>
            <div className="text-center font-bold text-[var(--spider-red)]">
              Cohort PCCOE <br /> Tech Hub
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}

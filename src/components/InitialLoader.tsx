'use client'

import { useEffect, useState } from 'react'

export function InitialLoader() {
  const [loading, setLoading] = useState(true)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setFading(true)
    }, 2200)

    const removeTimer = setTimeout(() => {
      setLoading(false)
    }, 2700)

    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(removeTimer)
    }
  }, [])

  if (!loading) return null

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-neutral-950 transition-opacity duration-500 ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="relative flex flex-col items-center gap-6 max-w-sm px-4 text-center">
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10 bg-neutral-900 flex items-center justify-center">
          <video
            src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/coh-loader-light_pmzlpg.mp4`}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/cohort-logo.png`} alt="Cohort Logo" className="w-8 h-8 object-contain" />
          <span className="text-xl font-bold tracking-tight text-white font-urbanist">
            Cohort PCCOE
          </span>
        </div>
      </div>
    </div>
  )
}

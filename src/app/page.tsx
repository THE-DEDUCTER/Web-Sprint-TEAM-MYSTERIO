'use client'

import dynamic from 'next/dynamic'
import { Calendar, MapPin, Users } from 'lucide-react'

// Dynamically import Map component with ssr: false
const MapComponent = dynamic(() => import('@/components/Map'), { 
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-gray-200 animate-pulse rounded-xl" />
})

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--background)] to-[var(--spidey-blue)] opacity-20"></div>
          {/* Decorative Web Lines */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `radial-gradient(circle at center, var(--spider-red) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto glass p-12 rounded-3xl glow-effect">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-[var(--foreground)]" style={{ fontFamily: 'var(--font-urbanist)' }}>
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--spider-red)] to-[var(--mysterio-purple)]">Team Mysterio</span>
          </h1>
          <p className="text-xl md:text-2xl text-[var(--text-muted)] mb-8">
            The ultimate student cohort platform. Connect, discover, and swing through your campus life with unparalleled ease.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="px-8 py-4 bg-[var(--spider-red)] text-white font-bold rounded-full hover:bg-[var(--primary-hover)] transition-all shadow-[0_0_15px_var(--spider-red)] hover:scale-105">
              Join the Web
            </button>
            <button className="px-8 py-4 border-2 border-[var(--mysterio-purple)] text-[var(--foreground)] font-bold rounded-full hover:bg-[var(--mysterio-purple)] hover:text-white transition-all shadow-[0_0_15px_var(--mysterio-purple)] hover:scale-105">
              Explore Events
            </button>
          </div>
        </div>
      </section>

      {/* Events / Map Section */}
      <section id="events" className="py-24 px-4 bg-[var(--surface)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-urbanist)' }}>Campus Radar</h2>
            <p className="text-lg text-[var(--text-muted)] max-w-2xl mx-auto">
              Locate technical events, hackathons, and cohort meetups happening around you in real-time.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <MapComponent />
            </div>
            <div className="glass p-6 rounded-xl space-y-6">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <MapPin className="text-[var(--spider-red)]" /> Upcoming Alerts
              </h3>
              
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 rounded-lg border border-[var(--surface-border)] hover:border-[var(--mysterio-purple)] transition-colors cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-[var(--foreground)]">Web Sprint Competition {i}</h4>
                      <span className="text-xs bg-[var(--spidey-blue)] text-white px-2 py-1 rounded-full">Active</span>
                    </div>
                    <div className="flex items-center text-sm text-[var(--text-muted)] gap-4">
                      <span className="flex items-center gap-1"><Calendar size={14}/> Today</span>
                      <span className="flex items-center gap-1"><Users size={14}/> 50+ Joined</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="team" className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8" style={{ fontFamily: 'var(--font-urbanist)' }}>Who is Team Mysterio?</h2>
          <div className="glass p-8 rounded-2xl text-lg text-[var(--text-muted)] leading-relaxed">
            <p className="mb-4">
              We are a collective of developers, designers, and innovators building the next generation of campus portals. Inspired by the duality of Spider-Man's agility and Mysterio's grand illusions, we craft web experiences that are both blazingly fast and visually spectacular.
            </p>
            <p>
              This platform aggregates technical discussions, event locations, and real-time community engagement without the clutter of traditional social media. Powered by Next.js, Supabase, and mapping technologies.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

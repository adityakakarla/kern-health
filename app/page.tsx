import locationsData from '../data/locations.json'
import type { Location } from './types'
import MapWrapper from './components/MapWrapper'

const FORM_URL =
  'https://docs.google.com/forms/d/1yh9D_6oNM78xp5Z5UdOnwmY3zBow89rC0N0JpS2Q-Gc/viewform'

const locations = locationsData as Location[]

export default function Home() {
  return (
    <div className="flex flex-col h-screen bg-slate-950">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-3 bg-slate-900 shrink-0 z-10"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        {/* Icon */}
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-500 shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.76a16 16 0 0 0 6 6l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16" />
          </svg>
        </div>

        {/* Title */}
        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-semibold text-white leading-tight tracking-tight">
            Kern Street Medicine
          </h1>
          <p className="text-xs text-white leading-tight">
            {locations.length} outreach sites
          </p>
        </div>

        {/* Add Site button */}
        <a
          href={FORM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-600 hover:bg-red-500 active:bg-red-700 text-white transition-colors"
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Site
        </a>
      </header>

      {/* Map */}
      <main className="flex-1 relative">
        <MapWrapper locations={locations} />
      </main>
    </div>
  )
}

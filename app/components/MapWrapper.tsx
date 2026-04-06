'use client'

import dynamic from 'next/dynamic'
import type { Location } from '../types'

const Map = dynamic(() => import('./Map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <p className="text-gray-500 text-sm">Loading map…</p>
    </div>
  ),
})

export default function MapWrapper({ locations }: { locations: Location[] }) {
  return <Map locations={locations} />
}

'use client'

import { useEffect, useRef, useState } from 'react'
import type { Location } from '../types'

interface MapProps {
  locations: Location[]
}

export default function Map({ locations }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<import('leaflet').Map | null>(null)
  const userMarkerRef = useRef<import('leaflet').Marker | null>(null)
  const [locating, setLocating] = useState(false)
  const [geoError, setGeoError] = useState<string | null>(null)

  useEffect(() => {
    if (!mapRef.current) return

    let cancelled = false

    const init = async () => {
      const L = (await import('leaflet')).default
      await import('leaflet/dist/leaflet.css')

      if (cancelled || !mapRef.current) return

      const container = mapRef.current as HTMLElement & { _leaflet_id?: number }
      if (container._leaflet_id) return

      const map = L.map(mapRef.current, { zoomControl: false }).setView([35.3733, -119.0187], 13)
      mapInstanceRef.current = map

      L.control.zoom({ position: 'topright' }).addTo(map)

      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        {
          attribution:
            '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://carto.com/">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 19,
        }
      ).addTo(map)

      const icon = L.divIcon({
        className: '',
        html: `
          <div style="position:relative;width:16px;height:16px;overflow:visible;">
            <div style="position:absolute;inset:0;background:#ef4444;border:2.5px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.35);z-index:1;"></div>
            <div style="position:absolute;inset:-8px;border-radius:50%;background:rgba(239,68,68,0.2);animation:pulse 2s ease-out infinite;"></div>
          </div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
        popupAnchor: [0, -14],
      })

      locations.forEach((loc) => {
        const badges = loc.services
          .map(
            (s) =>
              `<span style="display:inline-block;background:#f1f5f9;color:#334155;font-size:13px;padding:4px 10px;border-radius:99px;margin:3px 3px 0 0;white-space:nowrap;">${s}</span>`
          )
          .join('')

        const popup = `
          <div style="font-family:system-ui,sans-serif;width:280px;">
            <div style="background:#0f172a;padding:14px 16px 12px;">
              <p style="margin:0;font-size:15px;font-weight:600;color:#f8fafc;line-height:1.3;">${loc.name}</p>
            </div>
            <div style="padding:12px 14px 14px;">
              <p style="margin:0 0 8px;font-size:11px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:#94a3b8;">Services</p>
              <div>${badges}</div>
            </div>
          </div>
        `

        L.marker([loc.lat, loc.lng], { icon })
          .addTo(map)
          .bindPopup(popup, { maxWidth: 300 })
      })
    }

    init()

    return () => {
      cancelled = true
      mapInstanceRef.current?.remove()
      mapInstanceRef.current = null
      userMarkerRef.current = null
    }
  }, [locations])

  const locateUser = async () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.')
      return
    }
    setLocating(true)
    setGeoError(null)

    const L = (await import('leaflet')).default

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        const map = mapInstanceRef.current
        if (!map) return

        if (userMarkerRef.current) {
          userMarkerRef.current.setLatLng([latitude, longitude])
        } else {
          const userIcon = L.divIcon({
            className: '',
            html: `
              <div style="position:relative;width:16px;height:16px;overflow:visible;">
                <div style="position:absolute;inset:0;background:#3b82f6;border:2.5px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(59,130,246,0.5);z-index:1;"></div>
                <div style="position:absolute;inset:-8px;border-radius:50%;background:rgba(59,130,246,0.2);animation:pulse 2s ease-out infinite;"></div>
              </div>`,
            iconSize: [16, 16],
            iconAnchor: [8, 8],
            popupAnchor: [0, -14],
          })
          userMarkerRef.current = L.marker([latitude, longitude], { icon: userIcon })
            .addTo(map)
            .bindPopup('<div style="font-family:system-ui,sans-serif;padding:6px 4px;font-size:13px;font-weight:600;color:#0f172a;">You are here</div>')
        }

        map.flyTo([latitude, longitude], 14, { duration: 1.4 })
        setLocating(false)
      },
      (err) => {
        setLocating(false)
        if (err.code === err.PERMISSION_DENIED) {
          setGeoError('Location permission denied. Enable it in your browser settings.')
        } else {
          setGeoError('Could not get your location. Try again.')
        }
      },
      { timeout: 10000 }
    )
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full" />

      {/* Locate me button */}
      <button
        onClick={locateUser}
        disabled={locating}
        className="absolute bottom-6 right-3 z-[1000] flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 hover:bg-gray-50 active:bg-gray-100 transition-colors disabled:opacity-60"
        title="Show my location"
      >
        {locating ? (
          <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" fill="#3b82f6" />
            <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
            <circle cx="12" cy="12" r="8" strokeOpacity="0.3" />
          </svg>
        )}
      </button>

      {/* Error toast */}
      {geoError && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-[1000] flex items-center gap-2 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-full shadow-lg whitespace-nowrap">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke="#f87171" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {geoError}
          <button onClick={() => setGeoError(null)} className="ml-1 opacity-60 hover:opacity-100">✕</button>
        </div>
      )}
    </div>
  )
}

'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix the default marker icon path issue with webpack/Next.js bundling
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface MapPreviewProps {
  lat: number;
  lng: number;
  name: string;
}

export default function MapPreview({ lat, lng, name }: MapPreviewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView([lat, lng], 12);
    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    L.marker([lat, lng], { icon: defaultIcon })
      .addTo(map)
      .bindPopup(name);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [lat, lng, name]);

  return (
    <div
      ref={mapRef}
      className="w-full h-64 sm:h-80 rounded-xl overflow-hidden border border-sandy-gold/20"
    />
  );
}

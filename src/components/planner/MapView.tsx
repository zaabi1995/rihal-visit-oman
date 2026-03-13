'use client';

import { useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Itinerary, PlannedStop } from '@/lib/types';

const DAY_COLORS = ['#0891B2', '#C2410C', '#D4A574', '#059669', '#7C3AED', '#DB2777', '#EA580C'];

// Fix Leaflet default icon issue with Next.js bundling
function createNumberedIcon(num: number, color: string): L.DivIcon {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      background-color: ${color};
      color: white;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: bold;
      border: 2px solid white;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    ">${num}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16],
  });
}

interface MapViewProps {
  itinerary: Itinerary;
  activeDay: number; // 0 = all days
  onSelectStop?: (stop: PlannedStop) => void;
  selectedStopId?: string;
}

export default function MapView({ itinerary, activeDay, onSelectStop, selectedStopId }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layersRef = useRef<L.LayerGroup | null>(null);

  // Initialize map once
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [22.5, 57.5],
      zoom: 7,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    layersRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      layersRef.current = null;
    };
  }, []);

  // Update markers and polylines when activeDay or itinerary changes
  const updateMap = useCallback(() => {
    const map = mapInstanceRef.current;
    const layers = layersRef.current;
    if (!map || !layers) return;

    layers.clearLayers();

    const daysToShow = activeDay === 0
      ? itinerary.days
      : itinerary.days.filter((d) => d.day === activeDay);

    const allBounds: L.LatLng[] = [];
    let globalStopNum = 0;

    daysToShow.forEach((day) => {
      const color = DAY_COLORS[(day.day - 1) % DAY_COLORS.length];
      const points: L.LatLng[] = [];

      day.stops.forEach((stop) => {
        globalStopNum++;
        const latlng = L.latLng(stop.destination.lat, stop.destination.lng);
        points.push(latlng);
        allBounds.push(latlng);

        const marker = L.marker(latlng, {
          icon: createNumberedIcon(globalStopNum, color),
        });

        const isSelected = selectedStopId === stop.destination.id;
        if (isSelected) {
          marker.setZIndexOffset(1000);
        }

        marker.bindPopup(
          `<strong>${stop.destination.name.en}</strong><br/>` +
          `<span style="color: #666">${stop.arrivalTime} - ${stop.departureTime}</span>`
        );

        marker.on('click', () => {
          onSelectStop?.(stop);
        });

        layers.addLayer(marker);
      });

      // Polyline connecting stops for this day
      if (points.length > 1) {
        const polyline = L.polyline(points, {
          color,
          weight: 3,
          opacity: 0.7,
          dashArray: activeDay === 0 ? '5, 10' : undefined,
        });
        layers.addLayer(polyline);
      }
    });

    // Fit bounds
    if (allBounds.length > 0) {
      const bounds = L.latLngBounds(allBounds);
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 });
    }
  }, [itinerary, activeDay, onSelectStop, selectedStopId]);

  useEffect(() => {
    updateMap();
  }, [updateMap]);

  return (
    <div
      ref={mapRef}
      className="w-full h-[400px] lg:h-[500px] rounded-xl overflow-hidden border border-sandy-gold/20"
    />
  );
}

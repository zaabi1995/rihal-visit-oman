import { Destination, PlannedStop } from '../lib/types';
import { haversineKm } from './haversine';

const START_HOUR = 8;
const AVG_SPEED_KMH = 60;

export function scheduleDayStops(
  stops: Destination[],
  scored: Map<string, { component: string; value: number }[]>
): PlannedStop[] {
  const planned: PlannedStop[] = [];
  let currentMinutes = START_HOUR * 60;

  for (let i = 0; i < stops.length; i++) {
    const dest = stops[i];
    const driveKm = i === 0 ? 0 : haversineKm(stops[i - 1], dest);
    const driveMin = Math.round((driveKm / AVG_SPEED_KMH) * 60);

    currentMinutes += driveMin;
    const arrivalTime = formatTime(currentMinutes);
    currentMinutes += dest.avg_visit_duration_minutes;
    const departureTime = formatTime(currentMinutes);

    const breakdown = scored.get(dest.id) || [];
    const topTwo = [...breakdown]
      .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
      .slice(0, 2);

    planned.push({
      destination: dest,
      arrivalTime,
      departureTime,
      driveKmFromPrev: Math.round(driveKm * 10) / 10,
      driveMinFromPrev: driveMin,
      scoreBreakdown: topTwo,
    });
  }

  return planned;
}

function formatTime(minutes: number): string {
  const h = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

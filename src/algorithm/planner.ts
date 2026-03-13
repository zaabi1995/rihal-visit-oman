import { PlannerInput, Itinerary, DayPlan } from '../lib/types';
import { getDestinations } from '../lib/data';
import { INTENSITY_STOPS } from '../lib/constants';
import { scoreDestinations } from './scoring';
import { allocateRegions } from './region-allocator';
import { optimizeRoute } from './route-optimizer';
import { calculateCost } from './budget';
import { scheduleDayStops } from './scheduler';
import { totalRouteKm } from './haversine';

export function generateItinerary(input: PlannerInput): Itinerary {
  const allDestinations = getDestinations();

  const allScored = scoreDestinations(allDestinations, input, [], []);
  const scoredIds = allScored.map(s => s.destination.id);

  const regionAllocation = allocateRegions(allDestinations, input, scoredIds);

  const maxStopsPerDay = INTENSITY_STOPS[input.intensity];
  const days: DayPlan[] = [];
  const usedIds = new Set<string>();

  const scoreMap = new Map<string, { component: string; value: number }[]>();
  allScored.forEach(s => scoreMap.set(s.destination.id, s.breakdown));

  let dayNumber = 1;

  for (const allocation of regionAllocation) {
    const regionCandidates = allocation.destinations.filter(d => !usedIds.has(d.id));

    for (let rd = 0; rd < allocation.days; rd++) {
      const available = regionCandidates.filter(d => !usedIds.has(d.id));
      const optimized = optimizeRoute(available, input, maxStopsPerDay);

      optimized.forEach(d => usedIds.add(d.id));

      const stops = scheduleDayStops(optimized, scoreMap);
      const routePoints = optimized.map(d => ({ lat: d.lat, lng: d.lng }));

      days.push({
        day: dayNumber++,
        region: allocation.region,
        stops,
        totalKm: Math.round(totalRouteKm(routePoints) * 10) / 10,
        totalMinutes: stops.reduce((sum, s) =>
          sum + s.destination.avg_visit_duration_minutes + s.driveMinFromPrev, 0),
        totalCost: stops.reduce((sum, s) => sum + s.destination.ticket_cost_omr, 0),
      });
    }
  }

  const costBreakdown = calculateCost(days, input.budget, input.days);

  return {
    days,
    regionAllocation: regionAllocation.map(r => ({ region: r.region, days: r.days })),
    totalKm: days.reduce((sum, d) => sum + d.totalKm, 0),
    costBreakdown,
  };
}

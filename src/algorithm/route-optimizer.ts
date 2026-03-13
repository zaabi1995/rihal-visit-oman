import { Destination, PlannerInput } from '../lib/types';
import { haversineKm, totalRouteKm } from './haversine';
import { scoreDestinations } from './scoring';
import { MAX_DAILY_KM, MAX_DAILY_VISIT_MINUTES, MAX_SAME_CATEGORY_PER_DAY } from '../lib/constants';

export function optimizeRoute(
  candidates: Destination[],
  input: PlannerInput,
  maxStops: number
): Destination[] {
  if (candidates.length === 0) return [];

  const selected: Destination[] = [];
  const route: { lat: number; lng: number }[] = [];
  let remainingCandidates = [...candidates];

  for (let i = 0; i < maxStops && remainingCandidates.length > 0; i++) {
    const scored = scoreDestinations(remainingCandidates, input, selected, route);

    const pick = scored.find(s => {
      const d = s.destination;
      const catCount = selected.filter(sel =>
        sel.categories.some(c => d.categories.includes(c))
      ).length;
      if (catCount >= MAX_SAME_CATEGORY_PER_DAY) return false;

      const testRoute = [...route, { lat: d.lat, lng: d.lng }];
      if (totalRouteKm(testRoute) > MAX_DAILY_KM) return false;

      const totalVisitMin = [...selected, d].reduce((sum, s) => sum + s.avg_visit_duration_minutes, 0);
      if (totalVisitMin > MAX_DAILY_VISIT_MINUTES) return false;

      return true;
    });

    if (!pick) break;

    selected.push(pick.destination);
    route.push({ lat: pick.destination.lat, lng: pick.destination.lng });
    remainingCandidates = remainingCandidates.filter(c => c.id !== pick.destination.id);
  }

  // 2-opt improvement
  return twoOpt(selected);
}

// swap edges to minimize total driving distance
function twoOpt(stops: Destination[]): Destination[] {
  if (stops.length < 3) return stops;

  let route = [...stops];
  let improved = true;
  let iterations = 0;

  while (improved && iterations < 100) {
    improved = false;
    iterations++;

    for (let i = 0; i < route.length - 1; i++) {
      for (let j = i + 2; j < route.length; j++) {
        const currentDist =
          haversineKm(route[i], route[i + 1]) +
          (j + 1 < route.length ? haversineKm(route[j], route[j + 1]) : 0);

        const newDist =
          haversineKm(route[i], route[j]) +
          (j + 1 < route.length ? haversineKm(route[i + 1], route[j + 1]) : 0);

        if (newDist < currentDist) {
          const reversed = route.slice(i + 1, j + 1).reverse();
          route = [...route.slice(0, i + 1), ...reversed, ...route.slice(j + 1)];
          improved = true;
        }
      }
    }
  }

  return route;
}

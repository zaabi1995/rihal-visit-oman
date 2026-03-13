import { Destination, Category, PlannerInput } from '../lib/types';
import { SCORING_WEIGHTS } from '../lib/constants';
import { detourKm } from './haversine';

// Jaccard similarity between user prefs and destination categories
function jaccard(a: string[], b: string[]): number {
  const setA = new Set(a);
  const setB = new Set(b);
  const intersection = [...setA].filter(x => setB.has(x)).length;
  const union = new Set([...setA, ...setB]).size;
  return union === 0 ? 0 : intersection / union;
}

function seasonFit(month: number, recommended: number[]): number {
  if (recommended.includes(month)) return 1;
  // adjacent months get partial credit
  const adjacent = [(month % 12) + 1, ((month - 2 + 12) % 12) + 1];
  if (adjacent.some(m => recommended.includes(m))) return 0.3;
  return 0;
}

function normalize(value: number, min: number, max: number): number {
  if (max === min) return 0;
  return (value - min) / (max - min);
}

function diversityGain(dest: Destination, selected: Destination[]): number {
  const existingCats = new Set(selected.flatMap(d => d.categories));
  const newCats = dest.categories.filter(c => !existingCats.has(c));
  return newCats.length / 6;
}

export interface ScoredDestination {
  destination: Destination;
  score: number;
  breakdown: { component: string; value: number }[];
}

export function scoreDestinations(
  candidates: Destination[],
  input: PlannerInput,
  selected: Destination[],
  currentRoute: { lat: number; lng: number }[]
): ScoredDestination[] {
  const costs = candidates.map(d => d.ticket_cost_omr);
  const minCost = Math.min(...costs);
  const maxCost = Math.max(...costs);

  return candidates.map(dest => {
    const interestScore = jaccard(input.categories, dest.categories);
    const seasonScore = seasonFit(input.month, dest.recommended_months);
    const crowdScore = normalize(dest.crowd_level, 1, 5);
    const costScore = normalize(dest.ticket_cost_omr, minCost, maxCost);
    const detour = currentRoute.length > 0
      ? Math.min(detourKm(currentRoute, dest, currentRoute.length), 250) / 250
      : 0;
    const diversity = diversityGain(dest, selected);

    const w = SCORING_WEIGHTS;
    const score =
      w.interest * interestScore
      + w.season * seasonScore
      - w.crowd * crowdScore
      - w.cost * costScore
      - w.detour * detour
      + w.diversity * diversity;

    return {
      destination: dest,
      score,
      breakdown: [
        { component: 'interest', value: w.interest * interestScore },
        { component: 'season', value: w.season * seasonScore },
        { component: 'crowd', value: -w.crowd * crowdScore },
        { component: 'cost', value: -w.cost * costScore },
        { component: 'detour', value: -w.detour * detour },
        { component: 'diversity', value: w.diversity * diversity },
      ],
    };
  }).sort((a, b) => b.score - a.score);
}

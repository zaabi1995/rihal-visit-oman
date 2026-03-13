import type { PlannerInput, Itinerary } from './types';

const INTERESTS_KEY = 'visit-oman-interests';
const PLANNER_KEY = 'visit-oman-planner';
const ITINERARY_KEY = 'visit-oman-itinerary';

export function getSavedInterests(): string[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(INTERESTS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function toggleInterest(id: string): string[] {
  const current = getSavedInterests();
  const next = current.includes(id)
    ? current.filter(i => i !== id)
    : [...current, id];
  localStorage.setItem(INTERESTS_KEY, JSON.stringify(next));
  return next;
}

export function savePlannerInput(input: PlannerInput): void {
  localStorage.setItem(PLANNER_KEY, JSON.stringify(input));
}

export function getPlannerInput(): PlannerInput | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(PLANNER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function saveItinerary(itinerary: Itinerary): void {
  localStorage.setItem(ITINERARY_KEY, JSON.stringify(itinerary));
}

export function getItinerary(): Itinerary | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(ITINERARY_KEY);
  return raw ? JSON.parse(raw) : null;
}

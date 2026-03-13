export interface Destination {
  id: string;
  name: { en: string; ar: string };
  lat: number;
  lng: number;
  region: { en: string; ar: string };
  categories: Category[];
  company: { en: string; ar: string };
  avg_visit_duration_minutes: number;
  ticket_cost_omr: number;
  recommended_months: number[];
  crowd_level: 1 | 2 | 3 | 4 | 5;
}

export type Category = 'mountain' | 'beach' | 'culture' | 'desert' | 'nature' | 'food';
export type Region = 'muscat' | 'dakhiliya' | 'sharqiya' | 'dhofar' | 'batinah' | 'dhahira';
export type BudgetTier = 'low' | 'medium' | 'luxury';
export type Intensity = 'relaxed' | 'balanced' | 'packed';

export interface PlannerInput {
  days: number;
  budget: BudgetTier;
  month: number;
  intensity: Intensity;
  categories: Category[];
}

export interface DayPlan {
  day: number;
  region: string;
  stops: PlannedStop[];
  totalKm: number;
  totalMinutes: number;
  totalCost: number;
}

export interface PlannedStop {
  destination: Destination;
  arrivalTime: string;
  departureTime: string;
  driveKmFromPrev: number;
  driveMinFromPrev: number;
  scoreBreakdown: { component: string; value: number }[];
}

export interface Itinerary {
  days: DayPlan[];
  regionAllocation: { region: string; days: number }[];
  totalKm: number;
  costBreakdown: CostBreakdown;
}

export interface CostBreakdown {
  fuel: number;
  tickets: number;
  food: number;
  hotel: number;
  total: number;
}

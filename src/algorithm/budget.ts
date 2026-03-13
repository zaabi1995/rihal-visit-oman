import { CostBreakdown, BudgetTier, DayPlan } from '../lib/types';
import { FUEL_PRICE_PER_LITER, KM_PER_LITER, FOOD_PER_DAY, HOTEL_RATES } from '../lib/constants';

export function calculateCost(
  days: DayPlan[],
  budget: BudgetTier,
  tripDays: number
): CostBreakdown {
  const totalKm = days.reduce((sum, d) => sum + d.totalKm, 0);
  const fuel = (totalKm / KM_PER_LITER) * FUEL_PRICE_PER_LITER;
  const tickets = days.reduce((sum, d) =>
    sum + d.stops.reduce((s, stop) => s + stop.destination.ticket_cost_omr, 0), 0
  );
  const food = FOOD_PER_DAY * tripDays;
  const hotel = HOTEL_RATES[budget] * Math.max(tripDays - 1, 0);

  return {
    fuel: Math.round(fuel * 1000) / 1000,
    tickets: Math.round(tickets * 1000) / 1000,
    food,
    hotel,
    total: Math.round((fuel + tickets + food + hotel) * 1000) / 1000,
  };
}

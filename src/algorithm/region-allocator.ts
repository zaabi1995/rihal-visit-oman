import { Destination, PlannerInput } from '../lib/types';

interface RegionAllocation {
  region: string;
  days: number;
  destinations: Destination[];
}

export function allocateRegions(
  destinations: Destination[],
  input: PlannerInput,
  scoredIds: string[]
): RegionAllocation[] {
  const byRegion = new Map<string, Destination[]>();
  for (const dest of destinations) {
    const region = dest.region.en.toLowerCase();
    if (!byRegion.has(region)) byRegion.set(region, []);
    byRegion.get(region)!.push(dest);
  }

  const regionScores: { region: string; score: number; dests: Destination[] }[] = [];
  for (const [region, dests] of byRegion) {
    const topCount = dests.filter(d => scoredIds.indexOf(d.id) < scoredIds.length * 0.3).length;
    const seasonBonus = dests.filter(d => d.recommended_months.includes(input.month)).length / dests.length;
    regionScores.push({ region, score: topCount + seasonBonus * 10, dests });
  }

  regionScores.sort((a, b) => b.score - a.score);

  const totalDays = input.days;
  const maxPerRegion = Math.ceil(totalDays / 2);
  const minRegions = totalDays >= 3 ? 2 : 1;

  const allocations: RegionAllocation[] = [];
  let remainingDays = totalDays;

  for (const rs of regionScores) {
    if (remainingDays <= 0) break;
    const days = Math.min(remainingDays, maxPerRegion);
    allocations.push({ region: rs.region, days, destinations: rs.dests });
    remainingDays -= days;
  }

  if (allocations.length < minRegions && regionScores.length >= minRegions) {
    if (allocations[0].days > 1) {
      allocations[0].days -= 1;
      if (allocations.length < 2) {
        const nextRegion = regionScores.find(r => !allocations.some(a => a.region === r.region));
        if (nextRegion) {
          allocations.push({ region: nextRegion.region, days: 1, destinations: nextRegion.dests });
        }
      } else {
        allocations[1].days += 1;
      }
    }
  }

  return allocations;
}

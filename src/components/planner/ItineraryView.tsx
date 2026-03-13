'use client';

import { useTranslations } from 'next-intl';
import type { Itinerary, PlannedStop } from '@/lib/types';
import DayCard from './DayCard';
import CostBreakdown from './CostBreakdown';
import ExplanationPanel from './ExplanationPanel';

const DAY_COLORS = ['#0891B2', '#C2410C', '#D4A574', '#059669', '#7C3AED', '#DB2777', '#EA580C'];

interface ItineraryViewProps {
  itinerary: Itinerary;
  activeDay: number;
  onDayChange: (day: number) => void;
  onSelectStop?: (stop: PlannedStop) => void;
  selectedStop?: PlannedStop | null;
}

export default function ItineraryView({
  itinerary,
  activeDay,
  onDayChange,
  onSelectStop,
  selectedStop,
}: ItineraryViewProps) {
  const t = useTranslations('planner');

  // Region allocation summary
  const regionSummary = itinerary.regionAllocation.map((r) => {
    const startDay = itinerary.days.findIndex((d) => d.region === r.region) + 1;
    const endDay = startDay + r.days - 1;
    const label = startDay === endDay
      ? `${t('dayLabel', { day: startDay })}`
      : `${t('dayLabel', { day: startDay })} - ${startDay + r.days - 1}`;
    return { region: r.region, label };
  });

  const activeDayPlan = itinerary.days.find((d) => d.day === activeDay);

  return (
    <div className="space-y-4">
      {/* Region Allocation Summary */}
      <div className="bg-white rounded-xl border border-sandy-gold/10 shadow-sm p-4">
        <h3 className="text-sm font-semibold text-dark/70 mb-2">{t('regionAllocation')}</h3>
        <div className="flex flex-wrap gap-2">
          {regionSummary.map((r) => (
            <span
              key={r.region + r.label}
              className="text-xs px-3 py-1.5 rounded-full bg-cream text-dark/70 font-medium"
            >
              {r.label}: {r.region}
            </span>
          ))}
        </div>
      </div>

      {/* Day Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {itinerary.days.map((day) => {
          const color = DAY_COLORS[(day.day - 1) % DAY_COLORS.length];
          const isActive = day.day === activeDay;
          return (
            <button
              key={day.day}
              type="button"
              onClick={() => onDayChange(day.day)}
              className={`
                shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${isActive ? 'text-white shadow-sm' : 'bg-white text-dark/60 border border-sandy-gold/20 hover:border-sandy-gold/40'}
              `}
              style={isActive ? { backgroundColor: color } : undefined}
            >
              {t('dayLabel', { day: day.day })}
            </button>
          );
        })}
      </div>

      {/* Active Day Card */}
      {activeDayPlan && (
        <DayCard
          dayPlan={activeDayPlan}
          onSelectStop={onSelectStop}
          selectedStopId={selectedStop?.destination.id}
        />
      )}

      {/* Cost Breakdown */}
      <CostBreakdown cost={itinerary.costBreakdown} />

      {/* Explanation Panel */}
      {selectedStop && <ExplanationPanel stop={selectedStop} />}
    </div>
  );
}

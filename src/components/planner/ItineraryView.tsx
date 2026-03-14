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

const REGION_ICONS: Record<string, string> = {
  muscat: '🏙️',
  'musandam': '⛰️',
  'al batinah': '🌊',
  'ad dakhiliyah': '🏔️',
  'ash sharqiyah': '🏖️',
  'al wusta': '🌵',
  'dhofar': '🌿',
  default: '📍',
};

function getRegionIcon(region: string): string {
  const lower = region.toLowerCase();
  for (const [key, icon] of Object.entries(REGION_ICONS)) {
    if (lower.includes(key)) return icon;
  }
  return REGION_ICONS.default;
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
    return { region: r.region, label, days: r.days };
  });

  const activeDayPlan = itinerary.days.find((d) => d.day === activeDay);

  return (
    <div className="space-y-4">
      {/* Region Allocation Summary — visual journey timeline */}
      <div className="bg-white rounded-2xl border border-sandy-gold/10 shadow-sm overflow-hidden">
        <div className="px-5 pt-4 pb-3">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-4 h-4 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <h3 className="text-sm font-semibold text-dark">{t('regionAllocation')}</h3>
          </div>

          {/* Visual journey path */}
          <div className="relative">
            {/* Connecting line */}
            {regionSummary.length > 1 && (
              <div className="absolute top-4 left-4 right-4 h-0.5 bg-gradient-to-r from-teal/30 via-teal/10 to-teal/30" />
            )}

            <div className="relative flex flex-wrap gap-3">
              {regionSummary.map((r, idx) => (
                <div key={r.region + r.label} className="flex items-center gap-2">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-teal/10 border-2 border-teal/30 flex items-center justify-center text-sm z-10 relative">
                      {getRegionIcon(r.region)}
                    </div>
                    <div className="mt-1.5 text-center">
                      <p className="text-xs font-semibold text-dark leading-tight">{r.region}</p>
                      <p className="text-xs text-dark/40">{r.label}</p>
                    </div>
                  </div>

                  {idx < regionSummary.length - 1 && (
                    <div className="flex items-center gap-1 mb-5 text-teal/30">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Day Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {itinerary.days.map((day) => {
          const color = DAY_COLORS[(day.day - 1) % DAY_COLORS.length];
          const isActive = day.day === activeDay;
          const stopsCount = day.stops.length;
          return (
            <button
              key={day.day}
              type="button"
              onClick={() => onDayChange(day.day)}
              className={`
                shrink-0 flex flex-col items-center px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                ${isActive ? 'text-white shadow-md scale-[1.02]' : 'bg-white text-dark/60 border border-sandy-gold/20 hover:border-teal/30 hover:text-dark hover:shadow-sm'}
              `}
              style={isActive ? { backgroundColor: color, boxShadow: `0 4px 12px ${color}33` } : undefined}
            >
              <span className="font-semibold">{t('dayLabel', { day: day.day })}</span>
              <span className={`text-xs mt-0.5 ${isActive ? 'text-white/70' : 'text-dark/30'}`}>
                {stopsCount} stops
              </span>
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

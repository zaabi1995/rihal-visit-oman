'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import type { DayPlan, PlannedStop } from '@/lib/types';

const DAY_COLORS = ['#0891B2', '#C2410C', '#D4A574', '#059669', '#7C3AED', '#DB2777', '#EA580C'];

function formatMinutes(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = Math.round(mins % 60);
  if (h === 0) return `${m}m`;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

interface DayCardProps {
  dayPlan: DayPlan;
  onSelectStop?: (stop: PlannedStop) => void;
  selectedStopId?: string;
}

export default function DayCard({ dayPlan, onSelectStop, selectedStopId }: DayCardProps) {
  const [expanded, setExpanded] = useState(true);
  const t = useTranslations('planner');
  const tc = useTranslations('common');
  const locale = useLocale() as 'en' | 'ar';
  const color = DAY_COLORS[(dayPlan.day - 1) % DAY_COLORS.length];

  return (
    <div className="bg-white rounded-xl border border-sandy-gold/10 shadow-sm overflow-hidden">
      {/* Header */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-cream/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
            style={{ backgroundColor: color }}
          >
            {dayPlan.day}
          </div>
          <div className="text-start">
            <h3 className="font-semibold text-dark">
              {t('dayLabel', { day: dayPlan.day })}
            </h3>
            <p className="text-xs text-dark/50">{dayPlan.region}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs text-dark/50">
          <span>{dayPlan.stops.length} {t('stops')}</span>
          <span>{dayPlan.totalKm.toFixed(1)} {tc('km')}</span>
          <svg
            className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m19 9-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Stops */}
      {expanded && (
        <div className="border-t border-sandy-gold/10 divide-y divide-sandy-gold/5">
          {dayPlan.stops.length === 0 && (
            <p className="p-4 text-sm text-dark/40">{t('noStops')}</p>
          )}
          {dayPlan.stops.map((stop, idx) => (
            <button
              key={stop.destination.id}
              type="button"
              onClick={() => onSelectStop?.(stop)}
              className={`w-full text-start p-4 hover:bg-cream/30 transition-colors ${
                selectedStopId === stop.destination.id ? 'bg-teal/5 border-s-2 border-teal' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5"
                  style={{ backgroundColor: color }}
                >
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-dark truncate">
                    {stop.destination.name[locale]}
                  </p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-dark/50">
                    <span>{stop.arrivalTime} - {stop.departureTime}</span>
                    {stop.driveKmFromPrev > 0 && (
                      <span>
                        {t('driveFrom')}: {stop.driveKmFromPrev.toFixed(1)} {tc('km')}
                      </span>
                    )}
                    <span>
                      {t('visitDuration')}: {formatMinutes(stop.destination.avg_visit_duration_minutes)}
                    </span>
                  </div>
                </div>
                {stop.destination.ticket_cost_omr > 0 && (
                  <span className="text-xs font-medium text-terracotta shrink-0">
                    {stop.destination.ticket_cost_omr.toFixed(3)} {tc('omr')}
                  </span>
                )}
              </div>
            </button>
          ))}

          {/* Day totals */}
          <div className="p-4 bg-cream/30 flex items-center justify-between text-xs text-dark/60">
            <span>{t('totalDistance')}: {dayPlan.totalKm.toFixed(1)} {tc('km')}</span>
            <span>{t('totalTime')}: {formatMinutes(dayPlan.totalMinutes)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

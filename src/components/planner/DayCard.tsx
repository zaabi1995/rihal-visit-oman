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
    <div className="bg-white rounded-2xl border border-sandy-gold/10 shadow-sm overflow-hidden transition-all duration-200">
      {/* Colored top accent bar */}
      <div className="h-1" style={{ backgroundColor: color }} />

      {/* Header */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-cream/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-sm"
            style={{ backgroundColor: color }}
          >
            {dayPlan.day}
          </div>
          <div className="text-start">
            <h3 className="font-bold text-dark">
              {t('dayLabel', { day: dayPlan.day })}
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <svg className="w-3 h-3 text-dark/30" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <p className="text-xs text-dark/50">{dayPlan.region}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-3 text-xs text-dark/40">
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              {dayPlan.stops.length} {t('stops')}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              {dayPlan.totalKm.toFixed(1)} {tc('km')}
            </span>
          </div>

          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 ${
              expanded ? 'bg-dark/5 rotate-180' : 'bg-dark/5'
            }`}
          >
            <svg className="w-4 h-4 text-dark/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m19 9-7 7-7-7" />
            </svg>
          </div>
        </div>
      </button>

      {/* Stops — timeline layout */}
      {expanded && (
        <div className="px-4 sm:px-5 pb-4">
          {dayPlan.stops.length === 0 && (
            <p className="py-4 text-sm text-dark/40 text-center">{t('noStops')}</p>
          )}

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            {dayPlan.stops.length > 1 && (
              <div
                className="absolute left-4 top-3 bottom-3 w-0.5 rounded-full"
                style={{ backgroundColor: `${color}30` }}
              />
            )}

            <div className="space-y-1">
              {dayPlan.stops.map((stop, idx) => {
                const isSelected = selectedStopId === stop.destination.id;

                return (
                  <div key={stop.destination.id} className="relative">
                    {/* Drive distance connector */}
                    {idx > 0 && stop.driveKmFromPrev > 0 && (
                      <div className="flex items-center gap-2 py-1 ps-10">
                        <svg className="w-3 h-3 text-dark/20 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                        <span className="text-xs text-dark/30">{stop.driveKmFromPrev.toFixed(1)} {tc('km')} drive</span>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => onSelectStop?.(stop)}
                      className={`
                        relative w-full text-start rounded-xl p-3 transition-all duration-200
                        ${isSelected
                          ? 'shadow-sm'
                          : 'hover:bg-cream/60'
                        }
                      `}
                      style={isSelected ? { backgroundColor: `${color}08`, borderLeft: `3px solid ${color}` } : undefined}
                    >
                      <div className="flex items-start gap-3">
                        {/* Stop number bubble */}
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm z-10 relative"
                          style={{ backgroundColor: color }}
                        >
                          {idx + 1}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-semibold text-dark text-sm leading-snug">
                              {stop.destination.name[locale]}
                            </p>
                            {stop.destination.ticket_cost_omr > 0 && (
                              <span
                                className="shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full text-white"
                                style={{ backgroundColor: color }}
                              >
                                {stop.destination.ticket_cost_omr.toFixed(3)} {tc('omr')}
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
                            {/* Time */}
                            <div className="flex items-center gap-1 text-xs text-dark/40">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>{stop.arrivalTime} – {stop.departureTime}</span>
                            </div>

                            {/* Duration */}
                            <div className="flex items-center gap-1 text-xs text-dark/40">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>{formatMinutes(stop.destination.avg_visit_duration_minutes)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Day totals */}
          <div
            className="mt-3 p-3 rounded-xl flex items-center justify-between text-xs"
            style={{ backgroundColor: `${color}10` }}
          >
            <div className="flex items-center gap-1.5" style={{ color }}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span className="font-medium">{t('totalDistance')}: {dayPlan.totalKm.toFixed(1)} {tc('km')}</span>
            </div>
            <div className="flex items-center gap-1.5" style={{ color }}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">{t('totalTime')}: {formatMinutes(dayPlan.totalMinutes)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

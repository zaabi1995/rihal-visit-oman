'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useState, useEffect } from 'react';
import { getSavedInterests, toggleInterest } from '@/lib/storage';
import type { Destination } from '@/lib/types';

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
}

export default function DestinationCard({ destination }: { destination: Destination }) {
  const t = useTranslations();
  const locale = useLocale() as 'en' | 'ar';
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(getSavedInterests().includes(destination.id));
  }, [destination.id]);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const updated = toggleInterest(destination.id);
    setSaved(updated.includes(destination.id));
  };

  return (
    <Link
      href={`/destinations/${destination.id}`}
      className="group block rounded-xl bg-white border border-sandy-gold/10
                 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
    >
      <div className="h-1.5 bg-gradient-to-r from-teal to-sandy-gold" />

      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-semibold text-dark group-hover:text-teal transition-colors truncate">
              {destination.name[locale]}
            </h3>
            <p className="text-sm text-dark/50 mt-0.5">
              {destination.region[locale]}
            </p>
          </div>

          {/* Save button */}
          <button
            onClick={handleToggle}
            className={`shrink-0 p-1.5 rounded-lg transition-colors ${
              saved
                ? 'text-terracotta bg-terracotta/10'
                : 'text-dark/30 hover:text-terracotta hover:bg-terracotta/5'
            }`}
            aria-label={saved ? t('destinations.removeInterest') : t('destinations.saveInterest')}
          >
            <svg className="w-5 h-5" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        </div>

        {/* Category badges */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {destination.categories.map((cat) => (
            <span
              key={cat}
              className="text-xs px-2 py-0.5 rounded-full bg-teal/10 text-teal font-medium"
            >
              {t(`categories.${cat}`)}
            </span>
          ))}
        </div>

        {/* Info row */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-sandy-gold/10 text-sm">
          <span className="text-dark/50">
            {formatDuration(destination.avg_visit_duration_minutes)}
          </span>
          <span className="font-medium text-terracotta">
            {destination.ticket_cost_omr === 0
              ? t('common.free')
              : `${destination.ticket_cost_omr.toFixed(3)} ${t('common.omr')}`}
          </span>
        </div>

        {/* Crowd level */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs text-dark/40">{t('destinations.crowdLevel')}</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((level) => (
              <div
                key={level}
                className={`w-2 h-2 rounded-full ${
                  level <= destination.crowd_level ? 'bg-terracotta' : 'bg-dark/10'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { getSavedInterests, toggleInterest } from '@/lib/storage';

export function SaveInterestButtonClient({ destinationId }: { destinationId: string }) {
  const t = useTranslations('destinations');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(getSavedInterests().includes(destinationId));
  }, [destinationId]);

  const handleToggle = () => {
    const updated = toggleInterest(destinationId);
    setSaved(updated.includes(destinationId));
  };

  return (
    <button
      onClick={handleToggle}
      className={`w-full sm:w-auto px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
        saved
          ? 'bg-terracotta/10 text-terracotta border border-terracotta/20'
          : 'bg-teal text-white shadow-md shadow-teal/20 hover:shadow-lg hover:shadow-teal/30'
      }`}
    >
      <span className="inline-flex items-center gap-2">
        <svg className="w-5 h-5" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
        {saved ? t('removeInterest') : t('saveInterest')}
      </span>
    </button>
  );
}

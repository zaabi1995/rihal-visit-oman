'use client';

import { useTranslations } from 'next-intl';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { CATEGORIES, REGIONS } from '@/lib/constants';

const MONTH_KEYS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'] as const;

export default function FilterBar() {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const activeCategories = useMemo(
    () => searchParams.get('category')?.split(',').filter(Boolean) || [],
    [searchParams]
  );
  const activeRegion = searchParams.get('region') || '';
  const activeMonth = searchParams.get('month') || '';
  const activeSort = searchParams.get('sort') || '';

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname]
  );

  const toggleCategory = useCallback(
    (cat: string) => {
      let next: string[];
      if (activeCategories.includes(cat)) {
        next = activeCategories.filter((c) => c !== cat);
      } else {
        next = [...activeCategories, cat];
      }
      updateParam('category', next.join(','));
    },
    [activeCategories, updateParam]
  );

  return (
    <div className="space-y-4">
      {/* Category chips */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategories.includes(cat);
          return (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-150 ${
                isActive
                  ? 'bg-teal text-white'
                  : 'bg-white text-dark/60 border border-sandy-gold/20 hover:border-teal/40'
              }`}
            >
              {t(`categories.${cat}`)}
            </button>
          );
        })}
      </div>

      {/* Dropdowns row */}
      <div className="flex flex-wrap gap-3">
        {/* Region */}
        <select
          value={activeRegion}
          onChange={(e) => updateParam('region', e.target.value)}
          className="px-3 py-2 rounded-lg border border-sandy-gold/20 bg-white text-sm
                     text-dark/70 focus:outline-none focus:border-teal"
        >
          <option value="">{t('destinations.allRegions')}</option>
          {REGIONS.map((r) => (
            <option key={r} value={r}>
              {t(`regions.${r}`)}
            </option>
          ))}
        </select>

        {/* Month filter */}
        <select
          value={activeMonth}
          onChange={(e) => updateParam('month', e.target.value)}
          className="px-3 py-2 rounded-lg border border-sandy-gold/20 bg-white text-sm
                     text-dark/70 focus:outline-none focus:border-teal"
        >
          <option value="">{t('destinations.allSeasons')}</option>
          {MONTH_KEYS.map((m, i) => (
            <option key={m} value={String(i + 1)}>
              {t(`months.${m}`)}
            </option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={activeSort}
          onChange={(e) => updateParam('sort', e.target.value)}
          className="px-3 py-2 rounded-lg border border-sandy-gold/20 bg-white text-sm
                     text-dark/70 focus:outline-none focus:border-teal"
        >
          <option value="">{t('destinations.sort')}</option>
          <option value="crowd">{t('destinations.sortByCrowd')}</option>
          <option value="cost">{t('destinations.sortByCost')}</option>
        </select>
      </div>
    </div>
  );
}

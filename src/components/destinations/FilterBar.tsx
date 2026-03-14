'use client';

import { useTranslations } from 'next-intl';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { CATEGORIES, REGIONS } from '@/lib/constants';

const MONTH_KEYS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'] as const;

// Category visual config — colors matching DestinationCard
const CATEGORY_COLORS: Record<string, { active: string; icon: string }> = {
  beach:    { active: 'from-cyan-500 to-teal-400',   icon: '🏖️' },
  mountain: { active: 'from-emerald-600 to-green-500', icon: '⛰️' },
  desert:   { active: 'from-amber-500 to-orange-400', icon: '🏜️' },
  nature:   { active: 'from-teal-500 to-cyan-400',   icon: '🌿' },
  culture:  { active: 'from-amber-700 to-amber-500', icon: '🕌' },
  food:     { active: 'from-rose-500 to-orange-400', icon: '🍽️' },
};

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

  const hasFilters = activeCategories.length > 0 || activeRegion || activeMonth || activeSort;

  const clearAll = () => {
    router.push(pathname, { scroll: false });
  };

  return (
    <div className="space-y-4">
      {/* Category chips */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategories.includes(cat);
          const colors = CATEGORY_COLORS[cat] || { active: 'from-teal to-teal', icon: '📍' };
          return (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              className={`
                inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-semibold
                transition-all duration-200 border
                ${isActive
                  ? `bg-gradient-to-r ${colors.active} text-white border-transparent shadow-md scale-105`
                  : 'bg-white text-dark/60 border-gray-200 hover:border-teal/40 hover:text-dark hover:shadow-sm'
                }
              `}
            >
              <span className="text-base leading-none">{colors.icon}</span>
              <span>{t(`categories.${cat}`)}</span>
              {isActive && (
                <svg className="w-3.5 h-3.5 ml-0.5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          );
        })}
      </div>

      {/* Dropdowns row + clear */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Region */}
        <div className="relative">
          <select
            value={activeRegion}
            onChange={(e) => updateParam('region', e.target.value)}
            className={`
              pl-3 pr-8 py-2 rounded-xl border text-sm font-medium appearance-none cursor-pointer
              focus:outline-none focus:ring-2 focus:ring-teal/30 transition-colors
              ${activeRegion
                ? 'border-teal/50 bg-teal/5 text-dark'
                : 'border-gray-200 bg-white text-dark/60 hover:border-teal/30'
              }
            `}
          >
            <option value="">{t('destinations.allRegions')}</option>
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {t(`regions.${r}`)}
              </option>
            ))}
          </select>
          <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-dark/40 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Month filter */}
        <div className="relative">
          <select
            value={activeMonth}
            onChange={(e) => updateParam('month', e.target.value)}
            className={`
              pl-3 pr-8 py-2 rounded-xl border text-sm font-medium appearance-none cursor-pointer
              focus:outline-none focus:ring-2 focus:ring-teal/30 transition-colors
              ${activeMonth
                ? 'border-teal/50 bg-teal/5 text-dark'
                : 'border-gray-200 bg-white text-dark/60 hover:border-teal/30'
              }
            `}
          >
            <option value="">{t('destinations.allSeasons')}</option>
            {MONTH_KEYS.map((m, i) => (
              <option key={m} value={String(i + 1)}>
                {t(`months.${m}`)}
              </option>
            ))}
          </select>
          <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-dark/40 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Sort */}
        <div className="relative">
          <select
            value={activeSort}
            onChange={(e) => updateParam('sort', e.target.value)}
            className={`
              pl-3 pr-8 py-2 rounded-xl border text-sm font-medium appearance-none cursor-pointer
              focus:outline-none focus:ring-2 focus:ring-teal/30 transition-colors
              ${activeSort
                ? 'border-teal/50 bg-teal/5 text-dark'
                : 'border-gray-200 bg-white text-dark/60 hover:border-teal/30'
              }
            `}
          >
            <option value="">{t('destinations.sort')}</option>
            <option value="crowd">{t('destinations.sortByCrowd')}</option>
            <option value="cost">{t('destinations.sortByCost')}</option>
          </select>
          <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-dark/40 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Clear all */}
        {hasFilters && (
          <button
            onClick={clearAll}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium
                       text-dark/50 hover:text-dark hover:bg-gray-100 transition-colors border border-transparent"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear all
          </button>
        )}
      </div>
    </div>
  );
}

'use client';

import { useTranslations } from 'next-intl';
import type { CostBreakdown as CostBreakdownType } from '@/lib/types';

interface CostBreakdownProps {
  cost: CostBreakdownType;
}

const COST_META: Record<string, { color: string; bg: string; icon: string }> = {
  fuel:    { color: '#0891B2', bg: '#0891B210', icon: '⛽' },
  tickets: { color: '#C2410C', bg: '#C2410C10', icon: '🎟️' },
  food:    { color: '#D4A574', bg: '#D4A57410', icon: '🍽️' },
  hotel:   { color: '#059669', bg: '#05966910', icon: '🏨' },
};

export default function CostBreakdown({ cost }: CostBreakdownProps) {
  const t = useTranslations('planner');
  const tc = useTranslations('common');

  const items = [
    { key: 'fuel',    value: cost.fuel },
    { key: 'tickets', value: cost.tickets },
    { key: 'food',    value: cost.food },
    { key: 'hotel',   value: cost.hotel },
  ];

  const maxValue = Math.max(...items.map((i) => i.value), 1);

  return (
    <div className="bg-white rounded-2xl border border-sandy-gold/10 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-5 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="font-bold text-dark">{t('costBreakdown')}</h3>
        </div>
        <div className="text-xs text-dark/40 bg-cream px-2.5 py-1 rounded-full">
          Estimated
        </div>
      </div>

      <div className="px-5 pb-5 space-y-3">
        {items.map((item) => {
          const meta = COST_META[item.key];
          const pct = (item.value / maxValue) * 100;
          return (
            <div key={item.key} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
                    style={{ backgroundColor: meta.bg }}
                  >
                    {meta.icon}
                  </div>
                  <span className="text-sm font-medium text-dark/70">{t(item.key)}</span>
                </div>
                <span className="text-sm font-bold text-dark">
                  {item.value.toFixed(3)} <span className="text-xs font-normal text-dark/40">{tc('omr')}</span>
                </span>
              </div>
              <div className="h-2 bg-cream rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: meta.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Total */}
      <div className="mx-5 mb-5 p-4 rounded-xl bg-teal/5 border border-teal/20 flex items-center justify-between">
        <div>
          <p className="text-xs text-dark/40 mb-0.5">Estimated total</p>
          <span className="font-bold text-dark text-sm">{t('total')}</span>
        </div>
        <div className="text-end">
          <span className="text-2xl font-bold text-teal">
            {cost.total.toFixed(3)}
          </span>
          <span className="text-sm text-teal/60 ms-1">{tc('omr')}</span>
        </div>
      </div>
    </div>
  );
}

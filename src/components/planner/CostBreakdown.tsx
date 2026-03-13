'use client';

import { useTranslations } from 'next-intl';
import type { CostBreakdown as CostBreakdownType } from '@/lib/types';

interface CostBreakdownProps {
  cost: CostBreakdownType;
}

const COST_COLORS: Record<string, string> = {
  fuel: '#0891B2',
  tickets: '#C2410C',
  food: '#D4A574',
  hotel: '#059669',
};

export default function CostBreakdown({ cost }: CostBreakdownProps) {
  const t = useTranslations('planner');
  const tc = useTranslations('common');

  const items = [
    { key: 'fuel', value: cost.fuel },
    { key: 'tickets', value: cost.tickets },
    { key: 'food', value: cost.food },
    { key: 'hotel', value: cost.hotel },
  ];

  const maxValue = Math.max(...items.map((i) => i.value), 1);

  return (
    <div className="bg-white rounded-xl border border-sandy-gold/10 shadow-sm p-5">
      <h3 className="font-bold text-dark mb-4">{t('costBreakdown')}</h3>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.key} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-dark/70">{t(item.key)}</span>
              <span className="font-medium text-dark">
                {item.value.toFixed(3)} {tc('omr')}
              </span>
            </div>
            <div className="h-2 bg-cream rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(item.value / maxValue) * 100}%`,
                  backgroundColor: COST_COLORS[item.key],
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="mt-4 pt-4 border-t border-sandy-gold/20 flex items-center justify-between">
        <span className="font-bold text-dark">{t('total')}</span>
        <span className="text-lg font-bold text-teal">
          {cost.total.toFixed(3)} {tc('omr')}
        </span>
      </div>
    </div>
  );
}

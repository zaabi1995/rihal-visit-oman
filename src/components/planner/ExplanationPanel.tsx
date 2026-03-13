'use client';

import { useTranslations, useLocale } from 'next-intl';
import type { PlannedStop } from '@/lib/types';

const COMPONENT_LABELS: Record<string, { en: string; ar: string }> = {
  interest: { en: 'Category interest', ar: 'اهتمام الفئة' },
  season: { en: 'Season fit', ar: 'ملاءمة الموسم' },
  crowd: { en: 'Crowd avoidance', ar: 'تجنب الازدحام' },
  cost: { en: 'Cost efficiency', ar: 'كفاءة التكلفة' },
  detour: { en: 'Route efficiency', ar: 'كفاءة المسار' },
  diversity: { en: 'Variety bonus', ar: 'مكافأة التنوع' },
};

interface ExplanationPanelProps {
  stop: PlannedStop;
}

export default function ExplanationPanel({ stop }: ExplanationPanelProps) {
  const t = useTranslations('planner');
  const locale = useLocale() as 'en' | 'ar';

  // Get top 2 score components by absolute value
  const topComponents = [...stop.scoreBreakdown]
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
    .slice(0, 2);

  return (
    <div className="bg-white rounded-xl border border-sandy-gold/10 shadow-sm p-5">
      <h3 className="font-bold text-dark mb-1">{t('whyChosen')}</h3>
      <p className="text-sm font-medium text-teal mb-3">
        {stop.destination.name[locale]}
      </p>

      <div className="space-y-2">
        {topComponents.map((comp) => (
          <div
            key={comp.component}
            className="flex items-center justify-between p-3 rounded-lg bg-cream"
          >
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  comp.value >= 0 ? 'bg-teal' : 'bg-terracotta'
                }`}
              />
              <span className="text-sm text-dark/70">
                {COMPONENT_LABELS[comp.component]?.[locale] || comp.component}
              </span>
            </div>
            <span
              className={`text-sm font-mono font-medium ${
                comp.value >= 0 ? 'text-teal' : 'text-terracotta'
              }`}
            >
              {comp.value >= 0 ? '+' : ''}{comp.value.toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs text-dark/40">
        {t('strongMatch')}: {topComponents.map((c) =>
          `${COMPONENT_LABELS[c.component]?.[locale] || c.component} (${c.value >= 0 ? '+' : ''}${c.value.toFixed(2)})`
        ).join(', ')}
      </p>
    </div>
  );
}

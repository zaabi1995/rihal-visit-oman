'use client';

import { useTranslations, useLocale } from 'next-intl';
import type { PlannedStop } from '@/lib/types';

const COMPONENT_LABELS: Record<string, { en: string; ar: string; icon: string }> = {
  interest: { en: 'Category interest',  ar: 'اهتمام الفئة',  icon: '🎯' },
  season:   { en: 'Season fit',          ar: 'ملاءمة الموسم', icon: '🌤️' },
  crowd:    { en: 'Crowd avoidance',     ar: 'تجنب الازدحام', icon: '👥' },
  cost:     { en: 'Cost efficiency',     ar: 'كفاءة التكلفة', icon: '💰' },
  detour:   { en: 'Route efficiency',    ar: 'كفاءة المسار',  icon: '🗺️' },
  diversity:{ en: 'Variety bonus',       ar: 'مكافأة التنوع', icon: '✨' },
};

interface ExplanationPanelProps {
  stop: PlannedStop;
}

export default function ExplanationPanel({ stop }: ExplanationPanelProps) {
  const t = useTranslations('planner');
  const locale = useLocale() as 'en' | 'ar';

  // Get top 3 score components by absolute value
  const topComponents = [...stop.scoreBreakdown]
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
    .slice(0, 3);

  const totalScore = topComponents.reduce((sum, c) => sum + Math.abs(c.value), 0);

  return (
    <div className="bg-white rounded-2xl border border-sandy-gold/10 shadow-sm overflow-hidden">
      {/* Green accent top */}
      <div className="h-1 bg-gradient-to-r from-teal/40 via-teal to-teal/40" />

      <div className="p-5">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-teal/10 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-dark text-sm">{t('whyChosen')}</h3>
            <p className="text-sm font-semibold text-teal mt-0.5">
              {stop.destination.name[locale]}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {topComponents.map((comp) => {
            const meta = COMPONENT_LABELS[comp.component];
            const isPositive = comp.value >= 0;
            const barWidth = totalScore > 0 ? (Math.abs(comp.value) / totalScore) * 100 : 0;

            return (
              <div key={comp.component} className="rounded-xl overflow-hidden bg-cream">
                <div className="flex items-center justify-between p-3">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{meta?.icon || '📌'}</span>
                    <span className="text-sm text-dark/70">
                      {meta?.[locale] || comp.component}
                    </span>
                  </div>
                  <span className={`text-sm font-mono font-semibold px-2 py-0.5 rounded-full ${
                    isPositive
                      ? 'text-teal bg-teal/10'
                      : 'text-red-500 bg-red-50'
                  }`}>
                    {isPositive ? '+' : ''}{comp.value.toFixed(2)}
                  </span>
                </div>
                {/* Score bar */}
                <div className="h-1 bg-dark/5">
                  <div
                    className="h-full transition-all duration-500"
                    style={{
                      width: `${barWidth}%`,
                      backgroundColor: isPositive ? '#00DE51' : '#ef4444',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-3 text-xs text-dark/30 leading-relaxed">
          {t('strongMatch')}: {topComponents.map((c) =>
            `${COMPONENT_LABELS[c.component]?.[locale] || c.component} (${c.value >= 0 ? '+' : ''}${c.value.toFixed(2)})`
          ).join(', ')}
        </p>
      </div>
    </div>
  );
}

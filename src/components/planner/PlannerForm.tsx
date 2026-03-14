'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import type { PlannerInput, Category, BudgetTier, Intensity } from '@/lib/types';
import { CATEGORIES } from '@/lib/constants';
import { getSavedInterests } from '@/lib/storage';
import { getDestinations } from '@/lib/data';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Select from '@/components/ui/Select';
import Slider from '@/components/ui/Slider';

interface PlannerFormProps {
  input: PlannerInput;
  onUpdate: (partial: Partial<PlannerInput>) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

const BUDGET_OPTIONS: BudgetTier[] = ['low', 'medium', 'luxury'];
const INTENSITY_OPTIONS: Intensity[] = ['relaxed', 'balanced', 'packed'];

const BUDGET_ICONS: Record<BudgetTier, string> = {
  low: '💰',
  medium: '✈️',
  luxury: '👑',
};

const INTENSITY_ICONS: Record<Intensity, string> = {
  relaxed: '🌊',
  balanced: '⚖️',
  packed: '⚡',
};

// Step sections for visual clarity
const FORM_STEPS = [
  { id: 'duration', icon: '📅', label: 'Duration' },
  { id: 'preferences', icon: '⚙️', label: 'Preferences' },
  { id: 'interests', icon: '🎯', label: 'Interests' },
];

export default function PlannerForm({
  input,
  onUpdate,
  onGenerate,
  isGenerating,
}: PlannerFormProps) {
  const t = useTranslations('planner');
  const tCat = useTranslations('categories');
  const tMonths = useTranslations('months');

  // Pre-fill categories from saved interests on mount
  useEffect(() => {
    if (input.categories.length === 0) {
      const savedIds = getSavedInterests();
      if (savedIds.length > 0) {
        const allDests = getDestinations();
        const cats = new Set<Category>();
        savedIds.forEach((id) => {
          const dest = allDests.find((d) => d.id === id);
          if (dest) dest.categories.forEach((c) => cats.add(c));
        });
        if (cats.size > 0) {
          onUpdate({ categories: Array.from(cats) });
        }
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const monthKeys = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  const monthOptions = monthKeys.map((key, i) => ({
    value: i + 1,
    label: tMonths(key),
  }));

  const toggleCategory = (cat: Category) => {
    const next = input.categories.includes(cat)
      ? input.categories.filter((c) => c !== cat)
      : [...input.categories, cat];
    onUpdate({ categories: next });
  };

  // Completion progress
  const completedSteps = [
    input.days > 0,
    input.budget && input.month && input.intensity,
    input.categories.length > 0,
  ].filter(Boolean).length;

  return (
    <div className="bg-white rounded-2xl border border-sandy-gold/10 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="relative bg-dark px-5 pt-5 pb-6">
        {/* Decorative dots */}
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="form-dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#form-dots)" />
          </svg>
        </div>

        <div className="relative">
          <h2 className="text-white font-bold text-lg">{t('title')}</h2>
          <p className="text-white/40 text-xs mt-0.5">Customise your Oman trip</p>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-white/40 text-xs">Setup progress</span>
              <span className="text-teal text-xs font-semibold">{completedSteps}/{FORM_STEPS.length}</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-teal rounded-full transition-all duration-500"
                style={{ width: `${(completedSteps / FORM_STEPS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Step indicators */}
          <div className="mt-3 flex gap-2">
            {FORM_STEPS.map((step, i) => (
              <div
                key={step.id}
                className={`flex-1 flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs transition-all ${
                  i < completedSteps
                    ? 'bg-teal/20 text-teal'
                    : 'bg-white/5 text-white/30'
                }`}
              >
                <span>{step.icon}</span>
                <span className="font-medium truncate">{step.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-5 space-y-6">
        {/* Duration section */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-lg bg-teal/10 flex items-center justify-center text-xs">📅</div>
            <span className="text-xs font-semibold text-dark/40 uppercase tracking-wider">Duration</span>
          </div>

          {/* Days Slider */}
          <div className="bg-cream rounded-xl p-4">
            <Slider
              label={t('days')}
              value={input.days}
              min={1}
              max={7}
              onChange={(days) => onUpdate({ days })}
              displayValue={`${input.days} day${input.days > 1 ? 's' : ''}`}
            />
            {/* Day markers */}
            <div className="flex justify-between mt-1 px-0.5">
              {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                <div
                  key={d}
                  className={`w-1 h-1 rounded-full transition-all ${
                    d <= input.days ? 'bg-teal' : 'bg-dark/10'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Month */}
          <div className="mt-3">
            <Select
              label={t('month')}
              value={input.month}
              onChange={(e) => onUpdate({ month: Number(e.target.value) })}
              options={monthOptions}
            />
          </div>
        </div>

        {/* Preferences section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-lg bg-teal/10 flex items-center justify-center text-xs">⚙️</div>
            <span className="text-xs font-semibold text-dark/40 uppercase tracking-wider">Preferences</span>
          </div>

          {/* Budget */}
          <div className="space-y-2 mb-4">
            <label className="block text-sm font-medium text-dark/70">{t('budget')}</label>
            <div className="grid grid-cols-3 gap-2">
              {BUDGET_OPTIONS.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => onUpdate({ budget: b })}
                  className={`
                    flex flex-col items-center gap-1 py-3 px-2 rounded-xl text-xs font-medium transition-all duration-200
                    ${input.budget === b
                      ? 'bg-teal text-white shadow-md shadow-teal/20 scale-[1.02]'
                      : 'bg-cream text-dark/50 hover:bg-teal/5 hover:text-dark border border-transparent hover:border-teal/20'
                    }
                  `}
                >
                  <span className="text-base">{BUDGET_ICONS[b]}</span>
                  <span className="capitalize">{t(b)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Intensity */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-dark/70">{t('intensity')}</label>
            <div className="grid grid-cols-3 gap-2">
              {INTENSITY_OPTIONS.map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => onUpdate({ intensity: i })}
                  className={`
                    flex flex-col items-center gap-1 py-3 px-2 rounded-xl text-xs font-medium transition-all duration-200
                    ${input.intensity === i
                      ? 'bg-dark text-white shadow-md shadow-dark/20 scale-[1.02]'
                      : 'bg-cream text-dark/50 hover:bg-dark/5 hover:text-dark border border-transparent hover:border-dark/10'
                    }
                  `}
                >
                  <span className="text-base">{INTENSITY_ICONS[i]}</span>
                  <span className="capitalize">{t(i)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Interests section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-lg bg-teal/10 flex items-center justify-center text-xs">🎯</div>
            <span className="text-xs font-semibold text-dark/40 uppercase tracking-wider">Interests</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-dark/70">{t('categories')}</label>
              {input.categories.length > 0 && (
                <span className="text-xs text-teal font-medium">{input.categories.length} selected</span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <Badge
                  key={cat}
                  active={input.categories.includes(cat)}
                  onClick={() => toggleCategory(cat)}
                >
                  {tCat(cat)}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Generate */}
        <div className="pt-1">
          <Button
            onClick={onGenerate}
            loading={isGenerating}
            className="w-full py-3.5 text-base font-semibold rounded-xl shadow-lg shadow-teal/20"
          >
            {isGenerating ? t('generating') : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {t('generate')}
              </>
            )}
          </Button>

          {/* Trust indicators */}
          <div className="mt-3 flex items-center justify-center gap-4 text-xs text-dark/30">
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              AI-optimised
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Cost included
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Route mapped
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

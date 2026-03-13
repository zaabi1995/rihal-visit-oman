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

  return (
    <div className="bg-white rounded-xl border border-sandy-gold/10 shadow-sm p-5 sm:p-6 space-y-6">
      <h2 className="text-lg font-bold text-dark">{t('title')}</h2>

      {/* Days Slider */}
      <Slider
        label={t('days')}
        value={input.days}
        min={1}
        max={7}
        onChange={(days) => onUpdate({ days })}
        displayValue={`${input.days}`}
      />

      {/* Budget */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-dark/70">{t('budget')}</label>
        <div className="flex gap-2">
          {BUDGET_OPTIONS.map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => onUpdate({ budget: b })}
              className={`
                flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all
                ${input.budget === b
                  ? 'bg-teal text-white shadow-sm'
                  : 'bg-cream text-dark/60 hover:bg-teal/10 border border-sandy-gold/20'
                }
              `}
            >
              {t(b)}
            </button>
          ))}
        </div>
      </div>

      {/* Month */}
      <Select
        label={t('month')}
        value={input.month}
        onChange={(e) => onUpdate({ month: Number(e.target.value) })}
        options={monthOptions}
      />

      {/* Intensity */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-dark/70">{t('intensity')}</label>
        <div className="flex gap-2">
          {INTENSITY_OPTIONS.map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => onUpdate({ intensity: i })}
              className={`
                flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all
                ${input.intensity === i
                  ? 'bg-terracotta text-white shadow-sm'
                  : 'bg-cream text-dark/60 hover:bg-terracotta/10 border border-sandy-gold/20'
                }
              `}
            >
              {t(i)}
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-dark/70">{t('categories')}</label>
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

      {/* Generate */}
      <Button
        onClick={onGenerate}
        loading={isGenerating}
        className="w-full py-3 text-base"
      >
        {isGenerating ? t('generating') : t('generate')}
      </Button>
    </div>
  );
}

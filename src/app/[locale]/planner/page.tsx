'use client';

// TODO: add export to PDF feature

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { usePlanner } from '@/hooks/usePlanner';
import PlannerForm from '@/components/planner/PlannerForm';
import ItineraryView from '@/components/planner/ItineraryView';
import type { PlannedStop } from '@/lib/types';

const MapView = dynamic(() => import('@/components/planner/MapView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] lg:h-[500px] rounded-xl bg-cream border border-sandy-gold/20 flex items-center justify-center">
      <div className="animate-pulse text-dark/30">Loading map...</div>
    </div>
  ),
});

export default function PlannerPage() {
  const t = useTranslations('planner');
  const { input, updateInput, itinerary, generate, isGenerating, loaded } = usePlanner();
  const [activeDay, setActiveDay] = useState(1);
  const [selectedStop, setSelectedStop] = useState<PlannedStop | null>(null);

  const handleSelectStop = useCallback((stop: PlannedStop) => {
    setSelectedStop((prev) =>
      prev?.destination.id === stop.destination.id ? null : stop
    );
  }, []);

  const handleGenerate = useCallback(() => {
    setSelectedStop(null);
    setActiveDay(1);
    generate();
  }, [generate]);

  if (!loaded) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-cream rounded w-1/3" />
          <div className="h-64 bg-cream rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <h1 className="text-3xl sm:text-4xl font-bold text-dark mb-6">
        {t('title')}
      </h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: Form */}
        <div className="w-full lg:w-[340px] shrink-0">
          <PlannerForm
            input={input}
            onUpdate={updateInput}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
          />
        </div>

        {/* Right: Results */}
        <div className="flex-1 min-w-0">
          {!itinerary && !isGenerating && (
            <div className="bg-white rounded-xl border border-sandy-gold/10 shadow-sm p-8 sm:p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cream flex items-center justify-center">
                <svg className="w-8 h-8 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-dark mb-2">{t('configureTitle')}</h2>
              <p className="text-dark/50 text-sm">{t('configureSubtitle')}</p>
            </div>
          )}

          {isGenerating && (
            <div className="bg-white rounded-xl border border-sandy-gold/10 shadow-sm p-12 text-center">
              <div className="animate-spin w-10 h-10 mx-auto mb-4 border-3 border-teal border-t-transparent rounded-full" />
              <p className="text-dark/50">{t('generating')}</p>
            </div>
          )}

          {itinerary && !isGenerating && (
            <div className="space-y-6">
              {/* Map */}
              <MapView
                itinerary={itinerary}
                activeDay={activeDay}
                onSelectStop={handleSelectStop}
                selectedStopId={selectedStop?.destination.id}
              />

              {/* Day tabs for map: include "All Days" */}
              <div className="flex gap-2 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setActiveDay(0)}
                  className={`
                    shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all
                    ${activeDay === 0
                      ? 'bg-dark text-white shadow-sm'
                      : 'bg-white text-dark/60 border border-sandy-gold/20 hover:border-sandy-gold/40'
                    }
                  `}
                >
                  {t('allDays')}
                </button>
              </div>

              {/* Itinerary */}
              <ItineraryView
                itinerary={itinerary}
                activeDay={activeDay === 0 ? 1 : activeDay}
                onDayChange={setActiveDay}
                onSelectStop={handleSelectStop}
                selectedStop={selectedStop}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

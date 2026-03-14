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
    <div className="w-full h-[400px] lg:h-[500px] rounded-2xl bg-cream border border-sandy-gold/20 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="animate-spin w-8 h-8 border-2 border-teal border-t-transparent rounded-full" />
        <span className="text-dark/30 text-sm">Loading map...</span>
      </div>
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
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-cream rounded-xl w-1/3" />
          <div className="h-4 bg-cream rounded-lg w-1/4" />
          <div className="flex gap-6">
            <div className="w-[340px] h-[500px] bg-cream rounded-2xl shrink-0" />
            <div className="flex-1 h-[500px] bg-cream rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-cream/30 to-white">
      {/* Hero header */}
      <div className="relative overflow-hidden bg-dark">
        {/* Decorative travel SVG pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="planner-dots" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.5" fill="#00DE51" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#planner-dots)" />
          </svg>
        </div>

        {/* Decorative route lines */}
        <div className="absolute inset-0 opacity-10">
          <svg viewBox="0 0 1200 200" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="M0,100 Q200,20 400,100 T800,100 T1200,100" stroke="#00DE51" strokeWidth="2" fill="none" strokeDasharray="8,12" />
            <path d="M0,150 Q300,50 600,150 T1200,150" stroke="#00DE51" strokeWidth="1" fill="none" strokeDasharray="4,8" opacity="0.5" />
            {/* Pin icons */}
            <circle cx="200" cy="68" r="5" fill="#00DE51" opacity="0.8" />
            <circle cx="600" cy="100" r="5" fill="#00DE51" opacity="0.8" />
            <circle cx="1000" cy="68" r="5" fill="#00DE51" opacity="0.8" />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-0.5 bg-teal" />
                <span className="text-teal text-xs font-semibold tracking-widest uppercase">AI-Powered</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                {t('title')}
              </h1>
              <p className="mt-2 text-white/50 text-sm sm:text-base max-w-lg">
                {t('configureSubtitle')}
              </p>
            </div>

            {/* Travel compass decoration */}
            <div className="hidden lg:flex w-16 h-16 shrink-0 items-center justify-center rounded-2xl bg-teal/10 border border-teal/20">
              <svg className="w-8 h-8 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
          </div>

          {/* Progress indicator when itinerary exists */}
          {itinerary && !isGenerating && (
            <div className="mt-6 flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal/20 border border-teal/30">
                <div className="w-2 h-2 rounded-full bg-teal animate-pulse" />
                <span className="text-teal text-xs font-medium">{itinerary.days.length}-day itinerary generated</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10">
                <span className="text-white/60 text-xs">{itinerary.regionAllocation.length} regions</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: Form */}
          <div className="w-full lg:w-[360px] shrink-0">
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
              <div className="bg-white rounded-2xl border border-sandy-gold/10 shadow-sm overflow-hidden">
                {/* Top accent bar */}
                <div className="h-1 bg-gradient-to-r from-teal via-teal/70 to-teal/30" />
                <div className="p-10 sm:p-14 text-center">
                  {/* Oman map silhouette decoration */}
                  <div className="relative mx-auto mb-6 w-24 h-24">
                    <div className="absolute inset-0 rounded-full bg-teal/5 animate-ping opacity-30" />
                    <div className="absolute inset-2 rounded-full bg-teal/10" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-12 h-12 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold text-dark mb-2">{t('configureTitle')}</h2>
                  <p className="text-dark/40 text-sm max-w-sm mx-auto mb-8">{t('configureSubtitle')}</p>

                  {/* Feature highlights */}
                  <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto text-left">
                    {[
                      { icon: '🗺️', label: 'Smart Routes' },
                      { icon: '💰', label: 'Cost Planning' },
                      { icon: '📅', label: 'Day-by-Day' },
                    ].map(({ icon, label }) => (
                      <div key={label} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-cream">
                        <span className="text-xl">{icon}</span>
                        <span className="text-xs text-dark/50 font-medium text-center">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {isGenerating && (
              <div className="bg-white rounded-2xl border border-sandy-gold/10 shadow-sm overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-teal/30 via-teal to-teal/30 animate-pulse" />
                <div className="p-12 sm:p-16 text-center">
                  {/* Animated route planning visual */}
                  <div className="relative mx-auto mb-6 w-24 h-24">
                    <div className="absolute inset-0 rounded-full border-2 border-teal/20 animate-spin" style={{ animationDuration: '3s' }} />
                    <div className="absolute inset-3 rounded-full border-2 border-teal/40 animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }} />
                    <div className="absolute inset-6 rounded-full bg-teal/10 flex items-center justify-center">
                      <svg className="w-6 h-6 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-dark font-semibold text-lg mb-1">{t('generating')}</p>
                  <p className="text-dark/40 text-sm">Building your perfect Oman adventure...</p>

                  {/* Animated loading steps */}
                  <div className="mt-6 space-y-2 max-w-xs mx-auto">
                    {['Analysing your preferences', 'Optimising route', 'Calculating costs'].map((step, i) => (
                      <div key={step} className="flex items-center gap-3 p-2.5 rounded-lg bg-cream">
                        <div
                          className="w-4 h-4 rounded-full border-2 border-teal/40 border-t-teal animate-spin shrink-0"
                          style={{ animationDelay: `${i * 0.3}s` }}
                        />
                        <span className="text-xs text-dark/50">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {itinerary && !isGenerating && (
              <div className="space-y-5">
                {/* Map */}
                <MapView
                  itinerary={itinerary}
                  activeDay={activeDay}
                  onSelectStop={handleSelectStop}
                  selectedStopId={selectedStop?.destination.id}
                />

                {/* Day tabs for map: include "All Days" */}
                <div className="flex gap-2 overflow-x-auto pb-1">
                  <button
                    type="button"
                    onClick={() => setActiveDay(0)}
                    className={`
                      shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                      ${activeDay === 0
                        ? 'bg-dark text-white shadow-md shadow-dark/20'
                        : 'bg-white text-dark/60 border border-sandy-gold/20 hover:border-teal/30 hover:text-dark'
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
    </div>
  );
}

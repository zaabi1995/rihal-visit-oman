import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Link } from '@/i18n/routing';
import { getDestinations, getDestinationById } from '@/lib/data';

const MapPreview = dynamic(
  () => import('@/components/destinations/MapPreview'),
  { ssr: false, loading: () => <div className="w-full h-64 sm:h-80 rounded-xl bg-dark/5 animate-pulse" /> }
);

const MONTH_KEYS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'] as const;

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
}

export function generateStaticParams() {
  return getDestinations().map((d) => ({ id: d.id }));
}

export default async function DestinationDetailPage({
  params,
}: {
  params: { locale: string; id: string };
}) {
  setRequestLocale(params.locale);
  const t = await getTranslations();
  const locale = params.locale as 'en' | 'ar';

  const destination = getDestinationById(params.id);
  if (!destination) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Back link */}
      <Link
        href="/destinations"
        className="inline-flex items-center text-sm text-dark/50 hover:text-teal transition-colors mb-6"
      >
        <svg className="w-4 h-4 me-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        {t('common.backToDestinations')}
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-dark">
          {destination.name[locale]}
        </h1>
        {/* Show the other language name as subtitle */}
        <p className="text-lg text-dark/40 mt-1">
          {destination.name[locale === 'en' ? 'ar' : 'en']}
        </p>
        <p className="text-dark/60 mt-2">
          {destination.region[locale]} &middot; {destination.company[locale]}
        </p>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-4 border border-sandy-gold/10">
          <p className="text-xs text-dark/40 uppercase tracking-wide">
            {t('destinations.visitDuration')}
          </p>
          <p className="text-lg font-semibold text-dark mt-1">
            {formatDuration(destination.avg_visit_duration_minutes)}
          </p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-sandy-gold/10">
          <p className="text-xs text-dark/40 uppercase tracking-wide">
            {t('destinations.ticketCost')}
          </p>
          <p className="text-lg font-semibold text-terracotta mt-1">
            {destination.ticket_cost_omr === 0
              ? t('common.free')
              : `${destination.ticket_cost_omr.toFixed(3)} ${t('common.omr')}`}
          </p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-sandy-gold/10">
          <p className="text-xs text-dark/40 uppercase tracking-wide">
            {t('destinations.crowdLevel')}
          </p>
          <div className="flex gap-1.5 mt-2">
            {[1, 2, 3, 4, 5].map((level) => (
              <div
                key={level}
                className={`w-3 h-3 rounded-full ${
                  level <= destination.crowd_level ? 'bg-terracotta' : 'bg-dark/10'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-sandy-gold/10">
          <p className="text-xs text-dark/40 uppercase tracking-wide">
            {t('destinations.crowdLevel')}
          </p>
          <p className="text-lg font-semibold text-dark mt-1">
            {destination.crowd_level}/5
          </p>
        </div>
      </div>

      {/* Category badges */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {destination.categories.map((cat) => (
            <span
              key={cat}
              className="px-3 py-1 rounded-full bg-teal/10 text-teal text-sm font-medium"
            >
              {t(`categories.${cat}`)}
            </span>
          ))}
        </div>
      </div>

      {/* Recommended months - visual bar */}
      <div className="bg-white rounded-xl p-5 border border-sandy-gold/10 mb-8">
        <h2 className="text-sm font-medium text-dark/70 mb-3">
          {t('destinations.recommendedMonths')}
        </h2>
        <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5">
          {MONTH_KEYS.map((key, i) => {
            const isRecommended = destination.recommended_months.includes(i + 1);
            return (
              <div key={key} className="text-center">
                <div
                  className={`h-8 rounded-md mb-1 transition-colors ${
                    isRecommended
                      ? 'bg-teal/80'
                      : 'bg-dark/5'
                  }`}
                />
                <span className={`text-xs ${isRecommended ? 'text-teal font-medium' : 'text-dark/30'}`}>
                  {t(`months.${key}`).slice(0, 3)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Map */}
      <div className="mb-8">
        <h2 className="text-sm font-medium text-dark/70 mb-3">Location</h2>
        <MapPreview
          lat={destination.lat}
          lng={destination.lng}
          name={destination.name[locale]}
        />
      </div>

      {/* TODO: add a "similar destinations" section based on shared categories */}

      {/* Save interest button */}
      <SaveInterestButton destinationId={destination.id} />
    </div>
  );
}

// Client component for the save button
import { SaveInterestButtonClient } from './SaveInterestButton';
function SaveInterestButton({ destinationId }: { destinationId: string }) {
  return <SaveInterestButtonClient destinationId={destinationId} />;
}

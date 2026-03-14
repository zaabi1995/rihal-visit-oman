import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { getDestinations } from '@/lib/data';
import { CATEGORIES } from '@/lib/constants';
import type { Category, Destination } from '@/lib/types';

// emoji icons for each category
const categoryIcons: Record<Category, string> = {
  mountain: '⛰️',
  beach: '🏖️',
  culture: '🕌',
  desert: '🏜️',
  nature: '🌿',
  food: '🍽️',
};

function getFeaturedDestinations(): Destination[] {
  const destinations = getDestinations();
  const currentMonth = new Date().getMonth() + 1;

  // Sort by: in-season first, then lowest crowd, take top 6
  return [...destinations]
    .sort((a, b) => {
      const aInSeason = a.recommended_months.includes(currentMonth) ? 0 : 1;
      const bInSeason = b.recommended_months.includes(currentMonth) ? 0 : 1;
      if (aInSeason !== bInSeason) return aInSeason - bInSeason;
      return a.crowd_level - b.crowd_level;
    })
    .slice(0, 6);
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
}

export default async function HomePage({
  params,
}: {
  params: { locale: string };
}) {
  setRequestLocale(params.locale);
  const t = await getTranslations();
  const featured = getFeaturedDestinations();
  const locale = params.locale as 'en' | 'ar';

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal/10 text-teal text-sm font-medium mb-6">
              <svg className="w-4 h-4" viewBox="0 0 40 32" fill="none"><path d="M2 2L12 28L22 2" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="30" cy="16" r="9" stroke="currentColor" strokeWidth="3.5"/></svg>
              Visit Oman
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold text-dark tracking-tight">
              {t('hero.title')}
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-dark/50 leading-relaxed">
              {t('hero.subtitle')}
            </p>
            <div className="mt-10">
              <Link
                href="/planner"
                className="inline-flex items-center px-8 py-3.5 rounded-full bg-teal text-dark
                           font-semibold text-lg shadow-lg shadow-teal/25 hover:shadow-xl hover:shadow-teal/30
                           transition-all duration-200"
              >
                {t('hero.cta')}
                <svg className="w-5 h-5 ms-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Category Explorer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <h2 className="text-3xl font-bold text-dark text-center mb-12">
          {t('landing.categoriesTitle')}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/destinations?category=${cat}`}
              className="group flex flex-col items-center gap-3 p-6 rounded-2xl bg-white
                         border border-gray-100 shadow-sm hover:shadow-md
                         hover:border-teal/40 transition-all duration-200"
            >
              <span className="text-4xl group-hover:scale-110 transition-transform duration-200">
                {categoryIcons[cat]}
              </span>
              <span className="text-sm font-medium text-dark/70 group-hover:text-teal transition-colors">
                {t(`categories.${cat}`)}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="bg-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-dark">
              {t('landing.featuredTitle')}
            </h2>
            <p className="mt-3 text-dark/50 max-w-xl mx-auto">
              {t('landing.featuredSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((dest) => (
              <Link
                key={dest.id}
                href={`/destinations/${dest.id}`}
                className="group block rounded-xl bg-white border border-sandy-gold/10
                           shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                {/* Color strip based on first category */}
                <div className="h-2 bg-gradient-to-r from-teal to-sandy-gold" />

                <div className="p-5">
                  <h3 className="font-semibold text-dark group-hover:text-teal transition-colors">
                    {dest.name[locale]}
                  </h3>
                  <p className="text-sm text-dark/50 mt-1">
                    {dest.region[locale]}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {dest.categories.map((cat) => (
                      <span
                        key={cat}
                        className="text-xs px-2 py-0.5 rounded-full bg-teal/10 text-teal font-medium"
                      >
                        {t(`categories.${cat}`)}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-sandy-gold/10">
                    <span className="text-sm text-dark/50">
                      {formatDuration(dest.avg_visit_duration_minutes)}
                    </span>
                    <span className="text-sm font-medium text-terracotta">
                      {dest.ticket_cost_omr === 0
                        ? t('common.free')
                        : `${dest.ticket_cost_omr.toFixed(3)} ${t('common.omr')}`}
                    </span>
                  </div>

                  {/* Crowd level dots */}
                  <div className="flex gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`w-2 h-2 rounded-full ${
                          level <= dest.crowd_level
                            ? 'bg-terracotta'
                            : 'bg-dark/10'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

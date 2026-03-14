import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getDestinations } from '@/lib/data';
import { CATEGORIES } from '@/lib/constants';
import type { Destination } from '@/lib/types';
import { HeroSection, CategorySection, FeaturedSection } from '@/components/home/HomeClient';

function getFeaturedDestinations(): Destination[] {
  const destinations = getDestinations();
  const currentMonth = new Date().getMonth() + 1;

  return [...destinations]
    .sort((a, b) => {
      const aInSeason = a.recommended_months.includes(currentMonth) ? 0 : 1;
      const bInSeason = b.recommended_months.includes(currentMonth) ? 0 : 1;
      if (aInSeason !== bInSeason) return aInSeason - bInSeason;
      return a.crowd_level - b.crowd_level;
    })
    .slice(0, 6);
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

  // Serialise translations into a plain object — functions can't cross server→client boundary
  const translations: Record<string, string> = {
    'landing.categoriesTitle': t('landing.categoriesTitle'),
    'landing.featuredTitle': t('landing.featuredTitle'),
    'landing.featuredSubtitle': t('landing.featuredSubtitle'),
    'common.free': t('common.free'),
    'common.omr': t('common.omr'),
    ...Object.fromEntries(CATEGORIES.map(c => [`categories.${c}`, t(`categories.${c}` as Parameters<typeof t>[0])])),
  };

  return (
    <div>
      <HeroSection
        heroTitle={t('hero.title')}
        heroSubtitle={t('hero.subtitle')}
        heroCta={t('hero.cta')}
      />

      <CategorySection
        categories={CATEGORIES}
        translations={translations}
      />

      <FeaturedSection
        featured={featured}
        locale={locale}
        translations={translations}
      />
    </div>
  );
}

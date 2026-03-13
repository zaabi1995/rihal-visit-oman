import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getDestinations } from '@/lib/data';
import FilterBar from '@/components/destinations/FilterBar';
import DestinationGrid from '@/components/destinations/DestinationGrid';
import type { Destination, Category } from '@/lib/types';

// TODO: add pagination if the list grows beyond 300
function filterDestinations(
  destinations: Destination[],
  params: { [key: string]: string | string[] | undefined }
): Destination[] {
  let result = [...destinations];

  // Filter by categories
  const categoryParam = typeof params.category === 'string' ? params.category : '';
  if (categoryParam) {
    const cats = categoryParam.split(',').filter(Boolean) as Category[];
    if (cats.length > 0) {
      result = result.filter((d) =>
        d.categories.some((c) => cats.includes(c))
      );
    }
  }

  // Filter by region
  const regionParam = typeof params.region === 'string' ? params.region : '';
  if (regionParam) {
    result = result.filter(
      (d) => d.region.en.toLowerCase() === regionParam.toLowerCase()
    );
  }

  // Filter by recommended month
  const monthParam = typeof params.month === 'string' ? params.month : '';
  if (monthParam) {
    const month = parseInt(monthParam);
    if (!isNaN(month)) {
      result = result.filter((d) => d.recommended_months.includes(month));
    }
  }

  // Sort
  const sortParam = typeof params.sort === 'string' ? params.sort : '';
  if (sortParam === 'crowd') {
    result.sort((a, b) => a.crowd_level - b.crowd_level);
  } else if (sortParam === 'cost') {
    result.sort((a, b) => a.ticket_cost_omr - b.ticket_cost_omr);
  }

  return result;
}

export default async function DestinationsPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  setRequestLocale(params.locale);
  const t = await getTranslations('destinations');

  const allDestinations = getDestinations();
  const filtered = filterDestinations(allDestinations, searchParams);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <h1 className="text-3xl sm:text-4xl font-bold text-dark mb-8">
        {t('title')}
      </h1>

      <FilterBar />

      <p className="text-sm text-dark/50 mt-6 mb-4">
        {t('results', { count: filtered.length })}
      </p>

      <DestinationGrid destinations={filtered} />
    </div>
  );
}

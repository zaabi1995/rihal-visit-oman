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
    <div>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-dark">
        {/* Scenic background: Oman landscape gradient */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628] via-[#1a2d1a] to-[#0d1f0d]" />
          {/* SVG scene - mountains + desert + sky */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 1200 320"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Stars */}
            {[
              [100,30],[200,15],[350,45],[500,20],[650,35],[800,10],[950,40],[1100,25],
              [150,60],[420,55],[700,65],[900,50],[1050,70],[60,80],[280,75],
            ].map(([x,y], i) => (
              <circle key={i} cx={x} cy={y} r="1.5" fill="white" opacity="0.6" />
            ))}
            {/* Moon */}
            <circle cx="1100" cy="55" r="28" fill="#fef9c3" opacity="0.18" />
            <circle cx="1112" cy="48" r="22" fill="#0a1628" opacity="0.9" />

            {/* Background mountain range */}
            <polygon points="0,180 120,80 240,130 350,60 480,110 600,50 720,100 850,45 970,95 1100,40 1200,80 1200,320 0,320"
              fill="#1a3a1a" opacity="0.7" />
            {/* Mid mountain range */}
            <polygon points="0,220 80,140 200,170 320,110 440,155 560,100 680,145 800,90 920,140 1040,80 1150,130 1200,110 1200,320 0,320"
              fill="#1e4a1e" opacity="0.6" />
            {/* Desert dunes foreground */}
            <path d="M0 260 Q150 220 300 240 Q450 260 600 235 Q750 210 900 238 Q1050 265 1200 245 L1200 320 L0 320Z"
              fill="#2d1a00" opacity="0.8" />
            <path d="M0 290 Q100 275 250 280 Q400 285 550 272 Q700 259 850 276 Q1000 293 1200 278 L1200 320 L0 320Z"
              fill="#1a1000" opacity="0.9" />

            {/* Teal accent glow on horizon */}
            <ellipse cx="600" cy="185" rx="400" ry="40" fill="#00DE51" opacity="0.06" />
          </svg>
        </div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-2xl">
            {/* Eyebrow label */}
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-5 h-[2px] bg-teal" />
              <span className="text-teal text-sm font-semibold uppercase tracking-widest">
                Visit Oman
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
              {t('title')}
            </h1>

            {/* Subtitle */}
            <p className="text-white/60 text-lg sm:text-xl leading-relaxed mb-8 max-w-xl">
              From turquoise wadis to golden dunes, ancient forts to mountain peaks —
              discover Oman&apos;s most extraordinary places.
            </p>

            {/* Stats strip */}
            <div className="flex flex-wrap gap-6">
              {[
                { value: String(allDestinations.length), label: 'Destinations' },
                { value: '6', label: 'Regions' },
                { value: '6', label: 'Categories' },
              ].map(({ value, label }) => (
                <div key={label} className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-teal">{value}</span>
                  <span className="text-white/50 text-sm">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#F5F5F5] to-transparent" />
      </div>

      {/* Filter + Grid */}
      <div className="bg-cream min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          {/* Filter card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-4 h-4 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
              </svg>
              <span className="text-sm font-semibold text-dark/70 uppercase tracking-wide">Filter & Sort</span>
            </div>
            <FilterBar />
          </div>

          {/* Results count */}
          <p className="text-sm text-dark/40 mb-5 font-medium">
            {t('results', { count: filtered.length })}
          </p>

          {/* Grid */}
          <DestinationGrid destinations={filtered} />
        </div>
      </div>
    </div>
  );
}

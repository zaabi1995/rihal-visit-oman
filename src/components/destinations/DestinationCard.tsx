'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useState, useEffect } from 'react';
import { getSavedInterests, toggleInterest } from '@/lib/storage';
import type { Destination, Category } from '@/lib/types';

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
}

// Scenic gradient + SVG shape per category type
const CATEGORY_VISUALS: Record<Category, {
  gradient: string;
  accentColor: string;
  borderColor: string;
  badgeBg: string;
  badgeText: string;
  icon: string;
  shape: string; // SVG path for decorative scene
}> = {
  beach: {
    gradient: 'from-cyan-400 via-teal-300 to-amber-200',
    accentColor: '#0891b2',
    borderColor: '#06b6d4',
    badgeBg: 'rgba(6,182,212,0.12)',
    badgeText: '#0e7490',
    icon: '🏖️',
    shape: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 160" preserveAspectRatio="none">
        <defs>
          <linearGradient id="beachSky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#38bdf8;stop-opacity:0.9"/>
            <stop offset="60%" style="stop-color:#7dd3fc;stop-opacity:0.6"/>
            <stop offset="100%" style="stop-color:#bae6fd;stop-opacity:0.3"/>
          </linearGradient>
          <linearGradient id="beachWater" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#0891b2;stop-opacity:0.7"/>
            <stop offset="100%" style="stop-color:#06b6d4;stop-opacity:0.4"/>
          </linearGradient>
          <linearGradient id="beachSand" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#fde68a;stop-opacity:0.8"/>
            <stop offset="100%" style="stop-color:#f59e0b;stop-opacity:0.5"/>
          </linearGradient>
        </defs>
        <rect width="400" height="160" fill="url(#beachSky)"/>
        <!-- Sun -->
        <circle cx="340" cy="35" r="22" fill="#fbbf24" opacity="0.6"/>
        <circle cx="340" cy="35" r="14" fill="#fde68a" opacity="0.8"/>
        <!-- Water waves -->
        <path d="M0 90 Q50 75 100 90 Q150 105 200 90 Q250 75 300 90 Q350 105 400 90 L400 160 L0 160Z" fill="url(#beachWater)"/>
        <path d="M0 105 Q60 92 120 105 Q180 118 240 105 Q300 92 360 105 Q380 110 400 105 L400 160 L0 160Z" fill="url(#beachSand)" opacity="0.8"/>
        <!-- Wave lines -->
        <path d="M20 80 Q70 68 120 80 Q170 92 220 80" stroke="#ffffff" stroke-width="1.5" fill="none" opacity="0.5"/>
        <path d="M150 95 Q200 83 250 95 Q300 107 350 95" stroke="#ffffff" stroke-width="1" fill="none" opacity="0.4"/>
        <!-- Palm tree -->
        <rect x="55" y="55" width="5" height="45" fill="#92400e" opacity="0.5" rx="2"/>
        <ellipse cx="48" cy="50" rx="18" ry="10" fill="#065f46" opacity="0.5" transform="rotate(-20,48,50)"/>
        <ellipse cx="68" cy="48" rx="18" ry="10" fill="#047857" opacity="0.5" transform="rotate(15,68,48)"/>
        <ellipse cx="57" cy="44" rx="16" ry="9" fill="#059669" opacity="0.5" transform="rotate(-5,57,44)"/>
      </svg>
    `,
  },
  mountain: {
    gradient: 'from-emerald-700 via-green-500 to-slate-400',
    accentColor: '#059669',
    borderColor: '#10b981',
    badgeBg: 'rgba(16,185,129,0.12)',
    badgeText: '#065f46',
    icon: '⛰️',
    shape: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 160" preserveAspectRatio="none">
        <defs>
          <linearGradient id="mtnSky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#bfdbfe;stop-opacity:0.8"/>
            <stop offset="100%" style="stop-color:#dbeafe;stop-opacity:0.4"/>
          </linearGradient>
          <linearGradient id="mtnBack" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#6ee7b7;stop-opacity:0.5"/>
            <stop offset="100%" style="stop-color:#a7f3d0;stop-opacity:0.3"/>
          </linearGradient>
          <linearGradient id="mtnFront" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#059669;stop-opacity:0.8"/>
            <stop offset="100%" style="stop-color:#047857;stop-opacity:0.6"/>
          </linearGradient>
        </defs>
        <rect width="400" height="160" fill="url(#mtnSky)"/>
        <!-- Background peaks -->
        <polygon points="50,80 140,20 230,80" fill="url(#mtnBack)"/>
        <polygon points="180,80 280,10 380,80" fill="url(#mtnBack)" opacity="0.7"/>
        <!-- Snow caps -->
        <polygon points="140,20 125,40 155,40" fill="white" opacity="0.7"/>
        <polygon points="280,10 265,32 295,32" fill="white" opacity="0.7"/>
        <!-- Front peaks -->
        <polygon points="-20,160 80,40 180,160" fill="url(#mtnFront)"/>
        <polygon points="120,160 220,55 320,160" fill="url(#mtnFront)" opacity="0.85"/>
        <polygon points="260,160 360,70 460,160" fill="url(#mtnFront)" opacity="0.7"/>
        <!-- Ground -->
        <rect x="0" y="140" width="400" height="20" fill="#065f46" opacity="0.5" rx="0"/>
      </svg>
    `,
  },
  desert: {
    gradient: 'from-amber-500 via-orange-400 to-yellow-300',
    accentColor: '#d97706',
    borderColor: '#f59e0b',
    badgeBg: 'rgba(245,158,11,0.12)',
    badgeText: '#92400e',
    icon: '🏜️',
    shape: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 160" preserveAspectRatio="none">
        <defs>
          <linearGradient id="desertSky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#fed7aa;stop-opacity:0.9"/>
            <stop offset="100%" style="stop-color:#fde68a;stop-opacity:0.5"/>
          </linearGradient>
          <linearGradient id="desertDune1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#f59e0b;stop-opacity:0.9"/>
            <stop offset="50%" style="stop-color:#fbbf24;stop-opacity:0.7"/>
            <stop offset="100%" style="stop-color:#d97706;stop-opacity:0.8"/>
          </linearGradient>
          <linearGradient id="desertDune2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#d97706;stop-opacity:0.95"/>
            <stop offset="60%" style="stop-color:#f59e0b;stop-opacity:0.8"/>
            <stop offset="100%" style="stop-color:#b45309;stop-opacity:0.9"/>
          </linearGradient>
        </defs>
        <rect width="400" height="160" fill="url(#desertSky)"/>
        <!-- Sun glow -->
        <circle cx="320" cy="30" r="35" fill="#fbbf24" opacity="0.25"/>
        <circle cx="320" cy="30" r="20" fill="#fde68a" opacity="0.5"/>
        <circle cx="320" cy="30" r="12" fill="#fef3c7" opacity="0.7"/>
        <!-- Back dune -->
        <path d="M-20 160 Q80 60 200 90 Q280 110 420 70 L420 160Z" fill="url(#desertDune1)"/>
        <!-- Front dune -->
        <path d="M-20 160 Q60 110 150 100 Q250 88 320 115 Q370 130 420 110 L420 160Z" fill="url(#desertDune2)"/>
        <!-- Camel silhouette hint -->
        <ellipse cx="170" cy="88" rx="18" ry="9" fill="#92400e" opacity="0.3"/>
        <circle cx="162" cy="79" r="6" fill="#92400e" opacity="0.3"/>
        <rect x="165" y="82" width="3" height="10" fill="#92400e" opacity="0.3"/>
        <rect x="175" y="84" width="3" height="10" fill="#92400e" opacity="0.3"/>
      </svg>
    `,
  },
  nature: {
    gradient: 'from-blue-500 via-teal-400 to-green-400',
    accentColor: '#0d9488',
    borderColor: '#14b8a6',
    badgeBg: 'rgba(20,184,166,0.12)',
    badgeText: '#0f766e',
    icon: '🌿',
    shape: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 160" preserveAspectRatio="none">
        <defs>
          <linearGradient id="natureSky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#67e8f9;stop-opacity:0.7"/>
            <stop offset="100%" style="stop-color:#a5f3fc;stop-opacity:0.4"/>
          </linearGradient>
          <linearGradient id="natureWater" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#0891b2;stop-opacity:0.8"/>
            <stop offset="100%" style="stop-color:#06b6d4;stop-opacity:0.5"/>
          </linearGradient>
          <linearGradient id="natureGround" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#4ade80;stop-opacity:0.6"/>
            <stop offset="100%" style="stop-color:#16a34a;stop-opacity:0.8"/>
          </linearGradient>
        </defs>
        <rect width="400" height="160" fill="url(#natureSky)"/>
        <!-- Rock cliff -->
        <polygon points="0,160 0,60 60,40 100,55 80,160" fill="#78716c" opacity="0.4"/>
        <polygon points="300,160 320,50 370,35 400,60 400,160" fill="#78716c" opacity="0.4"/>
        <!-- Wadi water pool -->
        <ellipse cx="200" cy="120" rx="160" ry="35" fill="url(#natureWater)"/>
        <!-- Water shimmer -->
        <path d="M80 115 Q130 108 180 115 Q220 122 270 115" stroke="white" stroke-width="1.5" fill="none" opacity="0.5"/>
        <path d="M120 125 Q160 118 200 125 Q240 132 280 125" stroke="white" stroke-width="1" fill="none" opacity="0.4"/>
        <!-- Ground / greenery -->
        <path d="M0 140 Q100 130 200 138 Q300 146 400 135 L400 160 L0 160Z" fill="url(#natureGround)"/>
        <!-- Trees -->
        <rect x="92" y="80" width="4" height="30" fill="#166534" opacity="0.5"/>
        <ellipse cx="94" cy="72" rx="14" ry="18" fill="#16a34a" opacity="0.5"/>
        <rect x="298" y="75" width="4" height="35" fill="#166534" opacity="0.5"/>
        <ellipse cx="300" cy="67" rx="14" ry="18" fill="#15803d" opacity="0.5"/>
      </svg>
    `,
  },
  culture: {
    gradient: 'from-amber-800 via-amber-600 to-yellow-500',
    accentColor: '#92400e',
    borderColor: '#d97706',
    badgeBg: 'rgba(146,64,14,0.10)',
    badgeText: '#78350f',
    icon: '🕌',
    shape: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 160" preserveAspectRatio="none">
        <defs>
          <linearGradient id="cultSky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#fed7aa;stop-opacity:0.8"/>
            <stop offset="100%" style="stop-color:#fef3c7;stop-opacity:0.5"/>
          </linearGradient>
          <linearGradient id="cultWall" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#d97706;stop-opacity:0.6"/>
            <stop offset="100%" style="stop-color:#b45309;stop-opacity:0.8"/>
          </linearGradient>
        </defs>
        <rect width="400" height="160" fill="url(#cultSky)"/>
        <!-- Mosque dome -->
        <ellipse cx="200" cy="55" rx="45" ry="32" fill="url(#cultWall)"/>
        <rect x="155" y="55" width="90" height="65" fill="url(#cultWall)" opacity="0.9"/>
        <!-- Crescent on top -->
        <circle cx="200" cy="25" r="10" fill="#fbbf24" opacity="0.7"/>
        <circle cx="205" cy="22" r="8" fill="url(#cultSky)"/>
        <!-- Minarets -->
        <rect x="110" y="60" width="18" height="70" fill="url(#cultWall)" rx="2"/>
        <ellipse cx="119" cy="58" rx="10" ry="14" fill="#d97706" opacity="0.7"/>
        <rect x="272" y="60" width="18" height="70" fill="url(#cultWall)" rx="2"/>
        <ellipse cx="281" cy="58" rx="10" ry="14" fill="#d97706" opacity="0.7"/>
        <!-- Arched doorway -->
        <path d="M183 120 Q183 95 200 95 Q217 95 217 120 Z" fill="#92400e" opacity="0.6"/>
        <!-- Windows -->
        <rect x="165" y="70" width="12" height="16" rx="6" fill="#92400e" opacity="0.5"/>
        <rect x="223" y="70" width="12" height="16" rx="6" fill="#92400e" opacity="0.5"/>
        <!-- Ground -->
        <rect x="0" y="140" width="400" height="20" fill="#d97706" opacity="0.25"/>
      </svg>
    `,
  },
  food: {
    gradient: 'from-rose-400 via-orange-300 to-amber-300',
    accentColor: '#e11d48',
    borderColor: '#fb7185',
    badgeBg: 'rgba(225,29,72,0.10)',
    badgeText: '#9f1239',
    icon: '🍽️',
    shape: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 160" preserveAspectRatio="none">
        <defs>
          <linearGradient id="foodBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#fda4af;stop-opacity:0.7"/>
            <stop offset="100%" style="stop-color:#fed7aa;stop-opacity:0.6"/>
          </linearGradient>
        </defs>
        <rect width="400" height="160" fill="url(#foodBg)"/>
        <!-- Decorative plate -->
        <circle cx="200" cy="90" r="55" fill="white" opacity="0.35"/>
        <circle cx="200" cy="90" r="45" fill="white" opacity="0.25"/>
        <!-- Fork -->
        <rect x="152" y="50" width="4" height="60" fill="#9f1239" opacity="0.4" rx="2"/>
        <rect x="146" y="50" width="2" height="25" fill="#9f1239" opacity="0.4" rx="1"/>
        <rect x="158" y="50" width="2" height="25" fill="#9f1239" opacity="0.4" rx="1"/>
        <!-- Spoon -->
        <ellipse cx="248" cy="58" rx="8" ry="12" fill="#9f1239" opacity="0.4"/>
        <rect x="246" y="68" width="4" height="44" fill="#9f1239" opacity="0.4" rx="2"/>
        <!-- Steam wisps -->
        <path d="M185 45 Q182 35 188 25 Q194 15 190 5" stroke="#e11d48" stroke-width="2" fill="none" opacity="0.3" stroke-linecap="round"/>
        <path d="M200 48 Q197 38 203 28 Q209 18 205 8" stroke="#e11d48" stroke-width="2" fill="none" opacity="0.3" stroke-linecap="round"/>
        <path d="M215 45 Q212 35 218 25 Q224 15 220 5" stroke="#e11d48" stroke-width="2" fill="none" opacity="0.3" stroke-linecap="round"/>
        <!-- Decorative pattern circles -->
        <circle cx="80" cy="40" r="20" fill="#fb7185" opacity="0.15"/>
        <circle cx="330" cy="130" r="28" fill="#f97316" opacity="0.15"/>
      </svg>
    `,
  },
};

function getPrimaryCategory(categories: Category[]): Category {
  const priority: Category[] = ['desert', 'beach', 'mountain', 'nature', 'culture', 'food'];
  for (const cat of priority) {
    if (categories.includes(cat)) return cat;
  }
  return categories[0] || 'culture';
}

function StarRating({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < Math.round(value);
        return (
          <svg
            key={i}
            className={`w-3.5 h-3.5 transition-colors ${filled ? 'text-amber-400' : 'text-gray-200'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      })}
    </div>
  );
}

// Map crowd level (1–5) to a star-friendly rating (1=quiet=5stars, 5=crowded=1star)
function crowdToStars(crowdLevel: number): number {
  return 6 - crowdLevel;
}

export default function DestinationCard({ destination }: { destination: Destination }) {
  const t = useTranslations();
  const locale = useLocale() as 'en' | 'ar';
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(getSavedInterests().includes(destination.id));
  }, [destination.id]);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const updated = toggleInterest(destination.id);
    setSaved(updated.includes(destination.id));
  };

  const primaryCat = getPrimaryCategory(destination.categories);
  const visuals = CATEGORY_VISUALS[primaryCat];
  const starsValue = crowdToStars(destination.crowd_level);

  return (
    <Link
      href={`/destinations/${destination.id}`}
      className="group block rounded-2xl bg-white overflow-hidden
                 shadow-sm hover:shadow-xl
                 transition-all duration-300 ease-out
                 hover:-translate-y-1.5 hover:scale-[1.01]"
      style={{
        border: `1px solid ${visuals.borderColor}22`,
      }}
    >
      {/* Scenic illustration */}
      <div className="relative h-36 overflow-hidden">
        {/* Gradient base */}
        <div className={`absolute inset-0 bg-gradient-to-br ${visuals.gradient}`} />

        {/* SVG scene overlay */}
        <div
          className="absolute inset-0 w-full h-full"
          dangerouslySetInnerHTML={{ __html: visuals.shape }}
        />

        {/* Subtle vignette at bottom for text readability */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/20 to-transparent" />

        {/* Category icon badge */}
        <div
          className="absolute top-3 left-3 w-9 h-9 rounded-xl flex items-center justify-center text-lg backdrop-blur-sm"
          style={{ background: 'rgba(255,255,255,0.25)', border: '1px solid rgba(255,255,255,0.4)' }}
        >
          {visuals.icon}
        </div>

        {/* Save button */}
        <button
          onClick={handleToggle}
          className={`absolute top-3 right-3 w-9 h-9 rounded-xl flex items-center justify-center
                      backdrop-blur-sm transition-all duration-200
                      ${saved
                        ? 'bg-white/90 text-red-500 shadow-md'
                        : 'bg-white/25 text-white hover:bg-white/40'
                      }`}
          style={{ border: '1px solid rgba(255,255,255,0.4)' }}
          aria-label={saved ? t('destinations.removeInterest') : t('destinations.saveInterest')}
        >
          <svg className="w-4.5 h-4.5 w-[18px] h-[18px]" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>

        {/* Cost pill - bottom right of image */}
        <div
          className="absolute bottom-2.5 right-3 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-sm"
          style={{ background: 'rgba(0,0,0,0.35)', color: 'white' }}
        >
          {destination.ticket_cost_omr === 0
            ? t('common.free')
            : `${destination.ticket_cost_omr.toFixed(3)} ${t('common.omr')}`}
        </div>
      </div>

      {/* Colored accent bar */}
      <div
        className="h-[3px] w-full"
        style={{ background: `linear-gradient(to right, ${visuals.accentColor}, ${visuals.borderColor})` }}
      />

      {/* Content */}
      <div className="p-4">
        {/* Name + region */}
        <div className="mb-2.5">
          <h3
            className="font-bold text-[15px] leading-snug truncate transition-colors duration-200 group-hover:text-teal"
            style={{ color: '#1A1A1A' }}
          >
            {destination.name[locale]}
          </h3>
          <p className="text-xs text-dark/50 mt-0.5 flex items-center gap-1">
            <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {destination.region[locale]}
          </p>
        </div>

        {/* Category badges */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {destination.categories.map((cat) => (
            <span
              key={cat}
              className="text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide"
              style={{
                background: CATEGORY_VISUALS[cat]?.badgeBg || 'rgba(0,222,81,0.1)',
                color: CATEGORY_VISUALS[cat]?.badgeText || '#1A1A1A',
              }}
            >
              {t(`categories.${cat}`)}
            </span>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 pt-3">
          {/* Stars + duration row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <StarRating value={starsValue} />
              <span className="text-[10px] text-dark/40 font-medium">
                {starsValue.toFixed(1)}
              </span>
            </div>
            <span className="text-xs text-dark/50 flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-dark/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {formatDuration(destination.avg_visit_duration_minutes)}
            </span>
          </div>

          {/* Crowd bar */}
          <div className="flex items-center gap-2 mt-2.5">
            <span className="text-[10px] text-dark/40 whitespace-nowrap">{t('destinations.crowdLevel')}</span>
            <div className="flex gap-1 flex-1">
              {[1, 2, 3, 4, 5].map((level) => (
                <div
                  key={level}
                  className="flex-1 h-1.5 rounded-full transition-colors"
                  style={{
                    background: level <= destination.crowd_level
                      ? visuals.accentColor
                      : '#e5e7eb',
                    opacity: level <= destination.crowd_level ? (0.4 + level * 0.12) : 1,
                  }}
                />
              ))}
            </div>
            <span className="text-[10px] text-dark/40">
              {destination.crowd_level}/5
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

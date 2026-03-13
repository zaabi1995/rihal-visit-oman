'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
  const t = useTranslations('nav');
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-cream/80 backdrop-blur-md border-b border-sandy-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-teal">Visit Oman</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/destinations"
              className="text-dark/70 hover:text-teal transition-colors text-sm font-medium"
            >
              {t('destinations')}
            </Link>
            <Link
              href="/planner"
              className="text-dark/70 hover:text-teal transition-colors text-sm font-medium"
            >
              {t('planner')}
            </Link>
            <LanguageSwitcher />
          </nav>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-dark/70"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-sandy-gold/10">
            <nav className="flex flex-col gap-3 pt-3">
              <Link
                href="/destinations"
                onClick={() => setMobileOpen(false)}
                className="text-dark/70 hover:text-teal transition-colors text-sm font-medium px-2"
              >
                {t('destinations')}
              </Link>
              <Link
                href="/planner"
                onClick={() => setMobileOpen(false)}
                className="text-dark/70 hover:text-teal transition-colors text-sm font-medium px-2"
              >
                {t('planner')}
              </Link>
              <div className="px-2">
                <LanguageSwitcher />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

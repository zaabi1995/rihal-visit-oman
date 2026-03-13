'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLocale = () => {
    const next = locale === 'en' ? 'ar' : 'en';
    router.replace(pathname, { locale: next });
  };

  return (
    <button
      onClick={toggleLocale}
      className="px-3 py-1.5 text-sm font-medium rounded-lg border border-sandy-gold/30
                 hover:bg-sandy-gold/10 transition-colors duration-200"
      aria-label="Switch language"
    >
      {locale === 'en' ? 'العربية' : 'English'}
    </button>
  );
}

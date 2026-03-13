import { getRequestConfig } from 'next-intl/server';
import { locales, type Locale } from './config';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  // Validate that the incoming locale is supported
  if (!locale || !locales.includes(locale as Locale)) {
    locale = 'en';
  }

  return {
    locale,
    messages: (await import(`../i18n/${locale}.json`)).default,
  };
});

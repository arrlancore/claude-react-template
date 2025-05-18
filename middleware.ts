import createMiddleware from 'next-intl/middleware';
import { i18nConfig } from './config';

export default createMiddleware({
  // A list of all locales that are supported
  locales: i18nConfig.locales,

  // If this locale is matched, pathname will not be modified
  defaultLocale: i18nConfig.defaultLocale,

  // This instructs next-intl to not add the locale prefix for the default locale
  localePrefix: 'as-needed'
});

export const config = {
  // Match only internationalized pathnames
  matcher: ['/((?!api|_next|.*\\..*).*)', '/']
};

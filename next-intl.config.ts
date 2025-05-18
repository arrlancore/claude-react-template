import { i18nConfig } from './config';

export const defaultTimeZone = i18nConfig.timeZone;

export const timeZoneConfig = {
  getDefaultTimeZone: () => defaultTimeZone,
};

export const localeConfig = {
  defaultLocale: i18nConfig.defaultLocale,
  locales: i18nConfig.locales,
  localeNames: i18nConfig.localeNames,
};

export const dateTimeFormatOptions: Intl.DateTimeFormatOptions = {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: defaultTimeZone,
};

export const numberFormatOptions: Intl.NumberFormatOptions = {
  style: 'decimal',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
};

export const currencyFormatOptions: Intl.NumberFormatOptions = {
  style: 'currency',
  currency: 'USD',
  currencyDisplay: 'symbol',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
};

// Configuration for next-intl
const nextIntlConfig = {
  locales: i18nConfig.locales,
  defaultLocale: i18nConfig.defaultLocale,
  timeZone: defaultTimeZone,
  formats: {
    dateTime: {
      short: {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      },
      medium: dateTimeFormatOptions,
      long: {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        timeZoneName: 'short',
      },
      relative: {
        style: 'long',
        numeric: 'auto',
      },
    },
    number: {
      decimal: numberFormatOptions,
      currency: currencyFormatOptions,
      percent: {
        style: 'percent',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      },
    },
  },
};

export default nextIntlConfig;

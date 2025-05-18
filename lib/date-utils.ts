import { format as dateFnsFormat } from "date-fns";
import * as locales from "date-fns/locale";
import { dateConfig, i18nConfig } from "@/config";
import { getTimeZone } from "./timezone";

// Helper function to get the locale object from the locale string
export const getLocale = (localeKey: string = dateConfig.locale) => {
  // @ts-ignore - We know the locale exists in date-fns
  return locales[localeKey] || locales.enUS; // Fallback to enUS if the locale doesn't exist
};

// Format a date using the default format and locale from config
export const formatDate = (
  date: Date | string | number,
  timeZone?: string
) => {
  const dateObject = typeof date === "string" || typeof date === "number" ? new Date(date) : date;

  // For basic formatting without timezone concerns, use date-fns
  return dateFnsFormat(dateObject, dateConfig.format, {
    locale: getLocale(),
  });
};

// Format a date with month name using the format from config
export const formatDateWithMonth = (
  date: Date | string | number,
  timeZone?: string
) => {
  const dateObject = typeof date === "string" || typeof date === "number" ? new Date(date) : date;

  // For basic formatting without timezone concerns, use date-fns
  return dateFnsFormat(dateObject, dateConfig.formatWithMonth, {
    locale: getLocale(),
  });
};

// Format a date with a custom format
export const formatCustomDate = (
  date: Date | string | number,
  format: string,
  timeZone?: string
) => {
  const dateObject = typeof date === "string" || typeof date === "number" ? new Date(date) : date;

  // For basic formatting without timezone concerns, use date-fns
  return dateFnsFormat(dateObject, format, {
    locale: getLocale(),
  });
};

// Format a date with timezone consideration using Intl.DateTimeFormat API
export const formatDateWithTimeZone = (
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = {},
  timeZone: string = getTimeZone()
): string => {
  const dateObject = typeof date === "string" || typeof date === "number"
    ? new Date(date)
    : date;

  return new Intl.DateTimeFormat(dateConfig.locale, {
    ...options,
    timeZone,
  }).format(dateObject);
};

// Get a formatted relative time (e.g., "2 hours ago", "yesterday")
export const getRelativeTime = (
  date: Date | string | number,
  localeKey: string = dateConfig.locale
): string => {
  const dateObject = typeof date === "string" || typeof date === "number"
    ? new Date(date)
    : date;

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObject.getTime()) / 1000);

  // Use Intl.RelativeTimeFormat for localized relative time
  const rtf = new Intl.RelativeTimeFormat(localeKey, { numeric: 'auto' });

  if (diffInSeconds < 60) {
    return rtf.format(-diffInSeconds, 'second');
  } else if (diffInSeconds < 3600) {
    return rtf.format(-Math.floor(diffInSeconds / 60), 'minute');
  } else if (diffInSeconds < 86400) {
    return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour');
  } else if (diffInSeconds < 604800) {
    return rtf.format(-Math.floor(diffInSeconds / 86400), 'day');
  } else if (diffInSeconds < 2592000) {
    return rtf.format(-Math.floor(diffInSeconds / 604800), 'week');
  } else if (diffInSeconds < 31536000) {
    return rtf.format(-Math.floor(diffInSeconds / 2592000), 'month');
  } else {
    return rtf.format(-Math.floor(diffInSeconds / 31536000), 'year');
  }
};

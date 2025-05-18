import { format as dateFnsFormat } from "date-fns";
import * as locales from "date-fns/locale";
import { dateConfig } from "@/config";

// Helper function to get the locale object from the locale string
export const getLocale = (localeKey: string = dateConfig.locale) => {
  // @ts-ignore - We know the locale exists in date-fns
  return locales[localeKey] || locales.enUS; // Fallback to enUS if the locale doesn't exist
};

// Format a date using the default format and locale from config
export const formatDate = (date: Date | string | number) => {
  const dateObject = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
  return dateFnsFormat(dateObject, dateConfig.format, {
    locale: getLocale(),
  });
};

// Format a date with month name using the format from config
export const formatDateWithMonth = (date: Date | string | number) => {
  const dateObject = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
  return dateFnsFormat(dateObject, dateConfig.formatWithMonth, {
    locale: getLocale(),
  });
};

// Format a date with a custom format
export const formatCustomDate = (date: Date | string | number, format: string) => {
  const dateObject = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
  return dateFnsFormat(dateObject, format, {
    locale: getLocale(),
  });
};

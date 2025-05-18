"use client";

import { i18nConfig, appUrl } from "@/config";
import { usePathname } from "next/navigation";

interface LanguageAlternatesProps {
  currentLocale: string;
  pathWithoutLocale?: string;
}

/**
 * Generates alternates metadata including canonical and hreflang tags
 */
export function generateAlternatesMetadata({
  currentLocale,
  pathWithoutLocale = "",
}: LanguageAlternatesProps) {
  const { locales, defaultLocale } = i18nConfig;
  const languages: Record<string, string> = {};

  // Generate hreflang URLs for each locale
  locales.forEach((locale) => {
    const path = locale === defaultLocale
      ? `${appUrl}${pathWithoutLocale}`
      : `${appUrl}/${locale}${pathWithoutLocale}`;

    languages[locale] = path;
  });

  // Add x-default (points to default locale)
  languages["x-default"] = `${appUrl}${pathWithoutLocale}`;

  // Define the canonical URL (current locale)
  const canonical = currentLocale === defaultLocale
    ? `${appUrl}${pathWithoutLocale}`
    : `${appUrl}/${currentLocale}${pathWithoutLocale}`;

  return {
    // Canonical URL should be returned as a string
    canonical: canonical,
    // Languages should be returned as an object
    languages: languages
  };
}

/**
 * Hook to extract path without locale
 * e.g., /en/blog/post-1 -> /blog/post-1
 */
export function usePathWithoutLocale() {
  const pathname = usePathname();
  const { locales, defaultLocale } = i18nConfig;

  // Check if the current path starts with a locale
  for (const locale of locales) {
    if (pathname.startsWith(`/${locale}/`)) {
      return pathname.substring(locale.length + 1); // Remove /locale/ from the path
    }
  }

  // If path doesn't start with a locale, return as is
  return pathname;
}

/**
 * Hook to get alternates metadata for the current page
 */
export function useAlternates() {
  const pathname = usePathname();
  const { locales, defaultLocale } = i18nConfig;

  let currentLocale = defaultLocale;
  let pathWithoutLocale = pathname;

  // Extract locale and path
  for (const locale of locales) {
    if (pathname.startsWith(`/${locale}/`)) {
      currentLocale = locale;
      pathWithoutLocale = pathname.substring(locale.length + 1);
      break;
    }
  }

  // If we're at the root path without locale
  if (pathname === "/") {
    pathWithoutLocale = "";
  }

  return generateAlternatesMetadata({ currentLocale, pathWithoutLocale });
}

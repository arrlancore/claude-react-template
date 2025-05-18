import { Metadata } from 'next';
import { i18nConfig, brandName, appUrl } from '@/config';

/**
 * Generates alternates metadata including canonical and hreflang tags
 */
export function generateAlternatesMetadata({
  currentLocale,
  pathWithoutLocale = "",
}: {
  currentLocale: string;
  pathWithoutLocale?: string;
}) {
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
    canonical,
    languages,
  };
}

/**
 * Generate base metadata for pages with improved SEO
 * @param title Page title
 * @param description Page description
 * @param path Relative URL path (e.g., '/blog')
 * @param locale Current locale
 * @param openGraphType Open Graph type (default: 'website')
 * @param imageUrl Custom image URL for Open Graph
 * @returns Metadata object
 */
export function generateMetadata(
  title: string,
  description: string,
  path: string = '',
  locale: string = i18nConfig.defaultLocale,
  openGraphType: 'website' | 'article' | 'profile' = 'website',
  imageUrl?: string
): Metadata {
  // Get URL with correct locale handling
  const rawPath = path.startsWith('/') ? path : `/${path}`;
  const url = locale === i18nConfig.defaultLocale
    ? `${appUrl}${rawPath}`
    : `${appUrl}/${locale}${rawPath}`;

  // Generate alternates for language tags
  const pathWithoutLocale = path;
  const { canonical, languages } = generateAlternatesMetadata({
    currentLocale: locale,
    pathWithoutLocale
  });

  // Default image
  const ogImage = imageUrl || `${appUrl}/og-image.jpg`;

  return {
    title,
    description,
    // Added alternates for canonical and hreflang
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: brandName,
      locale,
      type: openGraphType,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

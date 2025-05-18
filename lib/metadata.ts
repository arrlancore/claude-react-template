import { Metadata } from 'next';
import { i18nConfig, brandName, appUrl } from '@/config';

/**
 * Generate base metadata for pages
 * @param title Page title
 * @param description Page description
 * @param path Relative URL path (e.g., '/blog')
 * @returns Metadata object
 */
export function generateMetadata(
  title: string,
  description: string,
  path: string = '',
  locale: string = i18nConfig.defaultLocale
): Metadata {
  const url = `${appUrl}/${locale}${path}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: brandName,
      locale: locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${appUrl}/og-image.jpg`],
    },
  };
}

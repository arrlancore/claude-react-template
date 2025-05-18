import { notFound } from 'next/navigation';
import { getAuthorBySlug } from '@/lib/author-utils';
import { getPostsByAuthor } from '@/lib/mdx/mdx-utils';
import { Metadata } from 'next';
import { appLocale, appUrl, brandName, i18nConfig } from '@/config';
import AuthorPageClient from './client';

export async function generateMetadata({
  params: { slug, locale }
}: {
  params: { slug: string, locale: string }
}): Promise<Metadata> {
  // Validate locale
  if (!i18nConfig.locales.includes(locale)) {
    notFound();
  }

  const author = await getAuthorBySlug(slug);

  if (!author) {
    return {
      title: "Author Not Found",
    };
  }

  const authorName = author.name;
  const authorBio = author.summary;
  const authorImage = author.avatar || `${appUrl}/default-avatar.jpg`;

  return {
    title: `${authorName} | Author at ${brandName}`,
    description: authorBio,
    openGraph: {
      title: `${authorName} | Author at ${brandName}`,
      description: authorBio,
      url: `${appUrl}/${locale}/authors/${slug}`,
      siteName: brandName,
      images: [
        {
          url: authorImage,
          width: 1200,
          height: 630,
          alt: authorName,
        },
      ],
      locale: appLocale,
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: `${authorName} | Author at ${brandName}`,
      description: authorBio,
      images: [authorImage],
    },
  };
}

export default async function Page({
  params: { slug, locale }
}: {
  params: { slug: string, locale: string }
}) {
  // Validate locale
  if (!i18nConfig.locales.includes(locale)) {
    notFound();
  }

  const author = await getAuthorBySlug(slug);

  if (!author) {
    notFound();
  }

  const authorPosts = await getPostsByAuthor(slug);

  return <AuthorPageClient author={author} posts={authorPosts} locale={locale} />;
}

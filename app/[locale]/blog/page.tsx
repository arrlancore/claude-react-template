// server component
import { notFound } from 'next/navigation';
import { getAllPosts } from "@/lib/mdx/mdx-utils";
import { Metadata } from "next";
import {
  appLocale,
  blogDescription,
  blogTitle,
  blogUrl,
  brandName,
  i18nConfig
} from "@/config";
import { getMessages } from '@/lib/i18n';
import BlogPageClient from './client';

export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: string }
}): Promise<Metadata> {
  // Validate locale
  if (!i18nConfig.locales.includes(locale)) {
    notFound();
  }

  const messages = await getMessages(locale);

  return {
    title: messages.blog?.title || blogTitle,
    description: blogDescription,
    openGraph: {
      title: messages.blog?.title || blogTitle,
      description: blogDescription,
      url: blogUrl,
      siteName: brandName,
      locale: appLocale,
      type: "website",
    },
  };
}

export default async function Page({ params }: { params: { locale: string } }) {
  // Validate locale
  if (!i18nConfig.locales.includes(params.locale)) {
    notFound();
  }

  // Get all posts
  const posts = await getAllPosts();

  // Pass data to the client component
  return <BlogPageClient posts={posts} />;
}

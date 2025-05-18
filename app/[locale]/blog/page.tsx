// server component
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getAllPosts } from "@/lib/mdx/mdx-utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MainLayout from "@/components/layout/main-layout";
import { Metadata } from "next";
import {
  appLocale,
  blogDescription,
  blogTitle,
  blogUrl,
  brandName,
  i18nConfig,
  paginationConfig,
} from "@/config";
import { formatDate } from "@/lib/date-utils";
import BlogPagination from "@/components/blog/BlogPagination";
import { getMessages } from "@/lib/i18n";
import BlogPageClient from "./client";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
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

export default async function Page({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Validate locale
  if (!i18nConfig.locales.includes(params.locale)) {
    notFound();
  }

  // Get all posts
  const pageParam = searchParams.page;
  const currentPage =
    typeof pageParam === "string" ? parseInt(pageParam, 10) || 1 : 1;

  // Get posts with pagination
  const { posts, total, totalPages } = await getAllPosts(
    currentPage,
    paginationConfig.postsPerPage
  );

  // Pass data to the client component
  return (
    <BlogPageClient
      posts={posts}
      total={total}
      totalPages={totalPages}
      currentPage={currentPage}
    />
  );
}

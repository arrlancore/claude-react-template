import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/mdx/mdx-utils";
import { appLocale, appUrl, blogUrl, brandName, i18nConfig } from "@/config";
import { format } from "date-fns";
import BlogPost from "@/components/blog/BlogPost";
import MainLayout from "@/components/layout/main-layout";

interface PageProps {
  params: {
    slug: string;
    locale: string;
  };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  // Validate locale
  if (!i18nConfig.locales.includes(params.locale)) {
    notFound();
  }

  const post = await getPostBySlug(params.slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: `${post.title}`,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      url: `${blogUrl}/${post.slug}`,
      siteName: brandName,
      images: [
        {
          url: post.image || `${appUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      locale: appLocale,
      type: "article",
      authors: post.author.name,
      publishedTime: format(
        new Date(post.publishedAt),
        "yyyy-MM-dd'T'HH:mm:ssXXX"
      ),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary,
      images: [post.image || `${appUrl}/og-image.jpg`],
    },
  };
}

export default async function Page({ params }: PageProps) {
  // Validate locale
  if (!i18nConfig.locales.includes(params.locale)) {
    notFound();
  }

  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <MainLayout className="py-8 md:py-12">
      <article>
        <BlogPost post={post} locale={params.locale} />
      </article>
    </MainLayout>
  );
}

import { getPostBySlug } from "@/lib/mdx/mdx-utils";
import { Metadata } from "next";
import { appLocale, appUrl, blogUrl, brandName, i18nConfig } from "@/config";
import { format } from "date-fns";
import BlogPost from "@/components/blog/BlogPost";
import MainLayout from "@/components/layout/main-layout";
import { notFound } from "next/navigation";
import { generateAlternatesMetadata } from "@/lib/metadata";

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  // Generate alternates for this specific blog post
  const { canonical, languages } = generateAlternatesMetadata({
    currentLocale: i18nConfig.defaultLocale,
    pathWithoutLocale: `/blog/${post.slug}`,
  });

  return {
    title: `${post.title}`,
    description: post.summary,
    // Add canonical URL and hreflang tags
    alternates: {
      canonical,
      languages,
    },
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

export default async function BlogPostPage({ params }: PageProps) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <MainLayout className="py-8 md:py-12">
      <article>
        <BlogPost post={post} locale="en" />
      </article>
    </MainLayout>
  );
}

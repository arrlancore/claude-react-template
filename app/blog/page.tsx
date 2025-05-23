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
  paginationConfig,
  appUrl,
  i18nConfig,
} from "@/config";
import { formatDate } from "@/lib/date-utils";
import BlogPagination from "@/components/blog/BlogPagination";
import { WebsiteJsonLd } from "@/components/json-ld";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { generateAlternatesMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  title: blogTitle,
  description: blogDescription,
  // Add alternates for canonical and hreflang
  alternates: {
    ...generateAlternatesMetadata({
      currentLocale: i18nConfig.defaultLocale,
      pathWithoutLocale: "/blog",
    }),
  },
  openGraph: {
    title: blogTitle,
    description: blogDescription,
    url: blogUrl,
    siteName: brandName,
    locale: appLocale,
    type: "website",
    images: [
      {
        url: `${appUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: blogTitle,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: blogTitle,
    description: blogDescription,
    images: [`${appUrl}/og-image.jpg`],
  },
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Get page from query or default to 1
  const pageParam = searchParams.page;
  const currentPage = typeof pageParam === 'string' ? parseInt(pageParam, 10) || 1 : 1;

  // Get posts with pagination
  const { posts, total, totalPages } = await getAllPosts(currentPage, paginationConfig.postsPerPage);

  // Prepare breadcrumb items
  const breadcrumbItems = [
    {
      label: "Blog",
      href: "/blog",
      isCurrent: true,
    },
  ];

  return (
    <MainLayout>
      {/* Add WebsiteJsonLd for blog section */}
      <WebsiteJsonLd />

      <div className="py-12">
        {/* Add breadcrumbs for navigation and SEO */}
        <div className="container mx-auto mb-8 px-4">
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-6 md:mb-12 text-center">Blog</h1>

        {total > 0 && (
          <div className="text-center mb-6 text-muted-foreground">
            Showing {posts.length} of {total} posts
          </div>
        )}

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No blog posts found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {posts.map((post) => (
              <Card
                key={post.slug}
                className="flex flex-col h-full overflow-hidden hover:shadow-md transition-shadow"
              >
                {post.image && (
                  <div className="relative w-full h-48">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover"
                      quality={75}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      loading="lazy"
                    />
                  </div>
                )}
                <CardHeader className="pb-2">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {post.tags?.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <CardTitle className="text-xl mb-2">
                    <Link href={`/blog/${post.slug}`} className="hover:underline">
                      {post.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow pt-0">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                    <p className="text-muted-foreground text-sm">
                      by {post.author.name}
                    </p>

                    <p className="text-muted-foreground text-sm whitespace-nowrap">
                      {formatDate(post.publishedAt)}{" "}
                      • {post.readingTime}
                    </p>
                  </div>

                  <p className="text-muted-foreground line-clamp-3">{post.summary}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        <BlogPagination totalPages={totalPages} currentPage={currentPage} />
      </div>
    </MainLayout>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MainLayout from "@/components/layout/main-layout";
import { formatDate } from "@/lib/date-utils";
import BlogPagination from "@/components/blog/BlogPagination";
import { PostMeta } from "@/types/blog";
import { useTranslations } from "next-intl";

interface BlogPageClientProps {
  posts: PostMeta[];
  totalPages: number;
  currentPage: number;
  total?: number;
}

export default function BlogPageClient({
  posts,
  totalPages,
  currentPage,
  total,
}: BlogPageClientProps) {
  const t = useTranslations("blog.header");

  return (
    <MainLayout>
      <div className="relative py-24">
        {/* Modern geometric shapes backdrop */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-1/4 w-64 h-64 rounded-full bg-primary/30 mix-blend-multiply blur-xl"></div>
          <div className="absolute top-10 right-1/4 w-64 h-64 rounded-full bg-secondary/30 mix-blend-multiply blur-xl"></div>
        </div>

        <div className="relative container mx-auto px-4">
          {/* Layered heading with modern typography */}
          <div className="relative">
            <h2 className="absolute -top-8 left-1/2 -translate-x-1/2 text-8xl font-black text-muted-foreground/5 select-none">
              {t("insights")}
            </h2>
            <h1 className="relative text-4xl md:text-6xl font-bold text-center tracking-tight">
              {t("mainTitle")}
            </h1>
          </div>

          {/* Modern styled description */}
          <p className="mt-6 text-center text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("description")}
          </p>

          {/* Refined stats display */}
          {total && total > 0 && (
            <div className="mt-12 flex items-center justify-center gap-8">
              <div className="flex items-center gap-3">
                <div className="h-8 w-1 bg-primary rounded-full"></div>
                <div>
                  <span className="block text-2xl font-bold">{total}</span>
                  <span className="text-sm text-muted-foreground">
                    {t("stats.totalPosts")}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-1 bg-secondary rounded-full"></div>
                <div>
                  <span className="block text-2xl font-bold">
                    {posts.length}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {t("stats.showingNow")}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{t("list.noPosts")}</p>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {posts.map((post) => (
              <Card
                key={post.slug}
                className="group flex flex-col h-full overflow-hidden hover:shadow-xl transition-all duration-300 rounded-xl border-0 bg-card/50 backdrop-blur-sm"
              >
                {/* Image Container with Overlay */}
                {post.image && (
                  <div className="relative w-full aspect-[16/9] overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      quality={85}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                )}

                {/* Content */}
                <div className="flex flex-col flex-grow p-6">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags?.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="px-3 py-1 text-xs font-medium rounded-full bg-secondary/10 text-secondary-foreground/80"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold leading-tight mb-3 group-hover:text-primary transition-colors">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="hover:underline"
                    >
                      {post.title}
                    </Link>
                  </h3>

                  {/* Summary */}
                  <p className="text-muted-foreground line-clamp-2 mb-4 text-sm">
                    {post.summary}
                  </p>

                  {/* Meta Info */}
                  <div className="mt-auto pt-4 border-t border-muted/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {t("byAuthor")} {post.author.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <time dateTime={post.publishedAt}>
                          {formatDate(post.publishedAt)}
                        </time>
                        <span>•</span>
                        <span>{post.readingTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Pagination */}
      <BlogPagination totalPages={totalPages} currentPage={currentPage} />
    </MainLayout>
  );
}

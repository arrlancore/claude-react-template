"use client";

import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MainLayout from "@/components/layout/main-layout";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

import type { Post, PostMeta } from "@/types/blog";
import BlogPagination from "@/components/blog/BlogPagination";

export default function BlogPageClient({
  posts,
  totalPages,
  currentPage,
}: {
  posts: PostMeta[];
  totalPages: number;
  currentPage: number;
}) {
  const t = useTranslations("blog");
  const params = useParams();
  const locale = params.locale as string;

  return (
    <MainLayout>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="pt-12" />
        <h1 className="text-4xl font-bold mb-12 text-center">{t("title")}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Card
              key={post.slug}
              className="flex flex-col h-full overflow-hidden"
            >
              {post.image && (
                <div className="relative w-full h-48">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                    quality={75}
                    sizes="(max-width: 300px) 100vw, 300px"
                    loading="lazy"
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex flex-wrap gap-2 mb-2">
                  {post.tags?.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <CardTitle className="text-xl mb-2">
                  <Link
                    href={`/${locale}/blog/${post.slug}`}
                    className="hover:underline"
                  >
                    {post.title}
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-muted-foreground text-sm">
                    {t("writtenBy")} {post.author.name}
                  </p>

                  <p className="text-muted-foreground text-sm">
                    {format(new Date(post.publishedAt), "dd-MM-yyyy", {
                      locale: id,
                    })}{" "}
                    • {post.readingTime}
                  </p>
                </div>

                <p className="text-muted-foreground">{post.summary}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <BlogPagination totalPages={totalPages} currentPage={currentPage} />
      </div>
    </MainLayout>
  );
}

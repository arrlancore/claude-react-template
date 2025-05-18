"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Calendar,
  Clock,
  Github,
  Linkedin,
  Twitter,
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import MainLayout from "@/components/layout/main-layout";
import { useTranslations } from "next-intl";
import { Author, PostMeta } from "@/types/blog";
import BlogPagination from "@/components/blog/BlogPagination";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { formatDateWithMonth } from "@/lib/date-utils";

export default function AuthorPageClient({
  author,
  posts,
  locale,
  total,
  totalPages,
  currentPage,
}: {
  author: Author;
  posts: PostMeta[];
  locale: string;
  total: number;
  totalPages: number;
  currentPage: number;
}) {
  const t = useTranslations("blog");

  return (
    <MainLayout>
      <div className="py-12">
        {/* Author Profile Card */}
        <div className="max-w-2xl mx-auto mb-16">
          <Card className="border-0 shadow-none overflow-hidden">
            <CardHeader className="pb-4 pt-6">
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4 border-2 border-background shadow-sm">
                  <AvatarImage src={author.avatar} alt={author.name} />
                  <AvatarFallback className="text-xl">
                    {author.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-2xl md:text-3xl font-bold text-center flex items-center gap-2">
                  {author.name}
                </CardTitle>
                <CardDescription className="mt-1 text-center max-w-md">
                  {author.summary}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm sm:prose dark:prose-invert max-w-none my-4">
                {author.bio}
              </div>

              <div className="flex justify-center gap-2 mt-6">
                {author.socialLinks?.twitter && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full h-8 px-3 transition-all hover:shadow-md hover:-translate-y-0.5"
                    asChild
                  >
                    <Link
                      href={author.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Twitter"
                    >
                      <Twitter className="h-3.5 w-3.5 mr-1.5" />
                      <span className="text-xs">Twitter</span>
                    </Link>
                  </Button>
                )}
                {author.socialLinks?.github && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full h-8 px-3 transition-all hover:shadow-md hover:-translate-y-0.5"
                    asChild
                  >
                    <Link
                      href={author.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="GitHub"
                    >
                      <Github className="h-3.5 w-3.5 mr-1.5" />
                      <span className="text-xs">GitHub</span>
                    </Link>
                  </Button>
                )}
                {author.socialLinks?.linkedin && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full h-8 px-3 transition-all hover:shadow-md hover:-translate-y-0.5"
                    asChild
                  >
                    <Link
                      href={author.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="h-3.5 w-3.5 mr-1.5" />
                      <span className="text-xs">LinkedIn</span>
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Author's Posts Section */}
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-center mb-8">
            <BookOpen className="h-5 w-5 mr-2" />
            <h2 className="text-xl font-semibold">Articles by {author.name}</h2>
          </div>
          <Separator className="mb-8" />

          {total > 0 && (
            <div className="text-center mb-6 text-sm text-muted-foreground">
              Showing {posts.length} of {total} posts
            </div>
          )}

          {posts.length === 0 ? (
            <div className="text-center py-12 bg-muted/20 rounded-lg">
              <p className="text-muted-foreground">
                No articles published yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Card
                  key={post.slug}
                  className="flex flex-col h-full overflow-hidden hover:shadow-md transition-all hover:-translate-y-0.5 border border-border/40"
                >
                  <Link href={`/blog/${post.slug}`} className="block h-full">
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
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {post.tags?.slice(0, 3).map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs px-2 py-0.5 rounded-full"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <CardTitle className="text-lg mb-2 line-clamp-2 h-14 hover:underline">
                        {post.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow pt-0">
                      <div className="flex items-center text-xs text-muted-foreground mb-3 gap-3">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{formatDateWithMonth(post.publishedAt)}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{post.readingTime}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {post.summary}
                      </p>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          <BlogPagination totalPages={totalPages} currentPage={currentPage} />
        </div>
      </div>
    </MainLayout>
  );
}

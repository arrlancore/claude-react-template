"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, Twitter } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import MainLayout from "@/components/layout/main-layout";
import { useTranslations } from 'next-intl';
import { Author, PostMeta } from "@/types/blog";

export default function AuthorPageClient({
  author,
  posts,
  locale
}: {
  author: Author;
  posts: PostMeta[];
  locale: string;
}) {
  const t = useTranslations('blog');

  return (
    <MainLayout>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="mb-12 text-center max-w-screen-md mx-auto">
          <Avatar className="h-32 w-32 mx-auto mb-4">
            <AvatarImage src={author.avatar} alt={author.name} />
            <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <h1 className="text-2xl font-bold mb-4">{author.name}</h1>
          <div className="prose prose-lg dark:prose-invert max-w-none my-4">
            {author.bio}
          </div>
          <div className="flex justify-center space-x-4">
            {author.socialLinks?.twitter && (
              <Button size="icon" variant="ghost" asChild>
                <Link
                  href={author.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Twitter className="h-5 w-5" />
                </Link>
              </Button>
            )}
            {author.socialLinks?.github && (
              <Button size="icon" variant="ghost" asChild>
                <Link
                  href={author.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="h-5 w-5" />
                </Link>
              </Button>
            )}
            {author.socialLinks?.linkedin && (
              <Button size="icon" variant="ghost" asChild>
                <Link
                  href={author.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin className="h-5 w-5" />
                </Link>
              </Button>
            )}
          </div>
        </div>

        <h2 className="text-3xl font-bold mb-8 text-center">
          Posts by {author.name}
        </h2>
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
                  <Link href={`/${locale}/blog/${post.slug}`} className="hover:underline">
                    {post.title}
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground text-sm mb-4">
                  {format(new Date(post.publishedAt), "dd-MM-yyyy", {
                    locale: id,
                  })}{" "}
                  • {post.readingTime}
                </p>
                <p className="text-muted-foreground">{post.summary}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}

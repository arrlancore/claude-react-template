import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Post } from "@/types/blog";
import ShareButtons from "../share-button";
import { extractDomain } from "@/lib/utils";
import Link from "next/link";
import {
  Github,
  Linkedin,
  Twitter,
  BookOpen,
  Clock,
  ListOrdered,
} from "lucide-react";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import TableOfContents from "./TableOfContents";

export default async function BlogPost(props: { post: Post }) {
  const { post } = props;
  const hasToc = post.toc && post.toc.length > 0 && post.showToc !== false;

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="mb-8 md:mb-10">
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {post.tags?.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-center leading-tight">
          {post.title}
        </h1>

        {/* Author info (mini) and post metadata */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={post.author.avatar} alt={post.author.name} />
              <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <Link
              href={`/authors/${post.author.slug}`}
              className="text-sm font-medium hover:underline"
            >
              {post.author.name}
            </Link>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{post.readingTime}</span>
            </div>
            <span>•</span>
            <time dateTime={new Date(post.publishedAt).toISOString()}>
              {format(new Date(post.publishedAt), "MMMM d, yyyy", {
                locale: id,
              })}
            </time>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      {post.image && (
        <div className="relative w-full aspect-video mb-8 md:mb-10 rounded-xl overflow-hidden shadow-md">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 1336px) 100vw, 1336px"
            priority={true}
          />

          {/* Image credit - moved inside the image container */}
          <div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs">
            <Link
              href={post.image}
              target="_blank"
              rel="nofollow noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Photo: {extractDomain(post.image)}
            </Link>
          </div>
        </div>
      )}

      {/* Table of Contents - only show if there are headings */}
      {hasToc && (
        <div className="mb-8 flex items-center gap-2 p-4 bg-muted/30 rounded-lg">
          <ListOrdered className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          <div className="font-medium">In this article:</div>
          <div className="flex flex-wrap gap-2 ml-2">
            {post.toc?.slice(0, 3).map((item, index) => (
              <a
                key={item.slug}
                href={`#${item.slug}`}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.text}
                {index < Math.min(2, (post.toc?.length || 1) - 1) && ","}
              </a>
            ))}
            {(post.toc?.length || 0) > 3 && (
              <span className="text-sm text-muted-foreground">and more...</span>
            )}
          </div>
        </div>
      )}

      {/* Content area with improved layout */}
      <div className="relative mx-auto max-w-5xl">
        <div className="flex flex-col lg:flex-row lg:gap-8">
          {/* Main content area */}
          <div className="flex-grow lg:max-w-2xl order-2 lg:order-1 mx-auto w-full">
            <div className="blog-content prose prose-sm sm:prose lg:prose-lg dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-h2:text-2xl prose-h3:text-xl prose-p:text-pretty prose-p:leading-relaxed prose-a:text-primary hover:prose-a:text-primary/90 prose-blockquote:border-l-primary prose-blockquote:not-italic prose-blockquote:font-normal">
              {post.content}
            </div>
          </div>

          {/* TOC sidebar for large screens */}
          {hasToc && post.toc && post.toc.length >= 3 && (
            <div className="hidden lg:block lg:w-60 flex-shrink-0 order-1 lg:order-2">
              <div className="sticky top-24">
                <TableOfContents toc={post.toc} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Share and Author Sections Container */}
      <div className="mt-16 space-y-12">
        {/* Share Section */}
        <div className="max-w-2xl mx-auto">
          <ShareButtons
            title={post.title}
            description="Share this article if you found it helpful"
          />
        </div>

        <Separator className="my-4 w-[30%] mx-auto" />

        {/* Author Section */}
        {post.author && (
          <div className="max-w-2xl mx-auto">
            <Card className="border-0 shadow-none overflow-hidden">
              <CardHeader className="pb-2 pt-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  About the Author
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  <Avatar className="h-16 w-16 border-2 border-background">
                    <AvatarImage
                      src={post.author.avatar}
                      alt={post.author.name}
                    />
                    <AvatarFallback>
                      {post.author.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-grow text-center sm:text-left">
                    <Link
                      href={`/authors/${post.author.slug}`}
                      className="text-lg font-semibold hover:underline inline-flex items-center gap-1"
                    >
                      {post.author.name}
                    </Link>
                    <div className="text-sm text-muted-foreground mt-2 mb-4 max-w-prose">
                      {post.author.summary}
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                      {post.author.socialLinks?.twitter && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-full h-8 px-3 transition-all hover:shadow-md hover:-translate-y-0.5"
                          asChild
                        >
                          <Link
                            href={post.author.socialLinks.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Twitter"
                          >
                            <Twitter className="h-3.5 w-3.5 mr-1.5" />
                            <span className="text-xs">Twitter</span>
                          </Link>
                        </Button>
                      )}
                      {post.author.socialLinks?.github && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-full h-8 px-3 transition-all hover:shadow-md hover:-translate-y-0.5"
                          asChild
                        >
                          <Link
                            href={post.author.socialLinks.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="GitHub"
                          >
                            <Github className="h-3.5 w-3.5 mr-1.5" />
                            <span className="text-xs">GitHub</span>
                          </Link>
                        </Button>
                      )}
                      {post.author.socialLinks?.linkedin && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-full h-8 px-3 transition-all hover:shadow-md hover:-translate-y-0.5"
                          asChild
                        >
                          <Link
                            href={post.author.socialLinks.linkedin}
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
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

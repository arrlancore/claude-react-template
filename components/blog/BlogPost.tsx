import { Badge } from "@/components/ui/badge";
import Image from "next/image";
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
import { formatCustomDate } from "@/lib/date-utils";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import TableOfContents from "./TableOfContents";
import { i18nConfig, appUrl } from "@/config";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ArticleJsonLd } from "@/components/json-ld";

export default async function BlogPost(props: { post: Post; locale: string }) {
  const { post, locale } = props;
  const hasToc = post.toc && post.toc.length > 0 && post.showToc !== false;
  const { defaultLocale } = i18nConfig;

  // Generate author link based on locale
  const getAuthorLink = (authorSlug: string) => {
    return locale === defaultLocale
      ? `/authors/${authorSlug}`
      : `/${locale}/authors/${authorSlug}`;
  };

  // Generate article URL
  const articleUrl =
    locale === defaultLocale
      ? `${appUrl}/blog/${post.slug}`
      : `${appUrl}/${locale}/blog/${post.slug}`;

  // Generate breadcrumb items
  const breadcrumbItems = [
    {
      label: "Blog",
      href: locale === defaultLocale ? "/blog" : `/${locale}/blog`,
    },
    {
      label: post.title,
      href:
        locale === defaultLocale
          ? `/blog/${post.slug}`
          : `/${locale}/blog/${post.slug}`,
      isCurrent: true,
    },
  ];

  return (
    <div className="w-full">
      {/* Add structured data for article */}
      <ArticleJsonLd
        title={post.title}
        description={post.summary}
        publishedTime={new Date(post.publishedAt).toISOString()}
        authorName={post.author.name}
        url={articleUrl}
        imageUrl={post.image}
      />

      {/* Add breadcrumbs for navigation and SEO */}
      <div className="max-w-4xl mx-auto mb-8 px-4">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      {/* Header Section */}
      <div className="relative mb-16">
        {/* Background decorative elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
          <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-primary/5 mix-blend-multiply blur-3xl" />
          <div className="absolute top-0 right-1/4 w-64 h-64 rounded-full bg-secondary/5 mix-blend-multiply blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto px-4">
          {/* Title with improved typography */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center leading-tight mb-8 bg-clip-text">
            {post.title}
          </h1>

          {/* Author info and metadata with modern layout */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
            {/* Author section */}
            <div className="flex items-center gap-3 group">
              <div className="relative">
                <Avatar className="h-12 w-12 ring-2 ring-background shadow-lg">
                  <AvatarImage
                    src={post.author.avatar}
                    alt={post.author.name}
                  />
                  <AvatarFallback className="font-medium">
                    {post.author.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-primary ring-2 ring-background" />
              </div>
              <Link
                href={getAuthorLink(post.author.slug)}
                className="text-base font-medium group-hover:text-primary transition-colors"
              >
                {post.author.name}
              </Link>
            </div>

            {/* Vertical separator for larger screens */}
            <div className="hidden sm:block h-6 w-px bg-border/60" />

            {/* Post metadata with icons */}
            <div className="flex items-center gap-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-sm">{post.readingTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <time
                  dateTime={new Date(post.publishedAt).toISOString()}
                  className="text-sm font-medium"
                >
                  {formatCustomDate(post.publishedAt, "MMMM d, yyyy")}
                </time>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Image with enhanced presentation */}
      {post.image && (
        <div className="relative w-full max-w-5xl mx-auto aspect-[21/9] mb-16 rounded-xl overflow-hidden shadow-2xl">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 1336px) 100vw, 1336px"
            priority={true}
          />

          {/* Enhanced image credit */}
          <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm px-3 py-2 rounded-full text-xs font-medium shadow-lg">
            <Link
              href={post.image}
              target="_blank"
              rel="nofollow noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              <span className="text-primary">Photo:</span>{" "}
              {extractDomain(post.image)}
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

      {/* Tags with enhanced styling */}
      <div className="flex flex-wrap justify-center gap-2 my-6">
        {post.tags?.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="px-4 py-1 text-sm font-medium rounded-full bg-secondary/10 text-secondary-foreground/80 backdrop-blur-sm"
          >
            {tag}
          </Badge>
        ))}
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
                      href={getAuthorLink(post.author.slug)}
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

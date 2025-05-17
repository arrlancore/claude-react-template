import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Post } from "@/types/blog";
import ShareButtons from "../share-button";
import { extractDomain } from "@/lib/utils";
import Link from "next/link";
import { Github, Linkedin, Twitter, BookOpen, Clock, ListOrdered } from "lucide-react";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../ui/button";
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
            sizes="(max-width: 768px) 100vw, 768px"
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
                {item.text}{index < Math.min(2, (post.toc?.length || 1) - 1) && ","}
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

      {/* Share Section */}
      <div className="mb-12 border-t border-b py-8 bg-muted/10 mt-12">
        <div className="max-w-2xl mx-auto">
          <ShareButtons
            title={post.title}
            description="Share this article if you found it helpful"
          />
        </div>
      </div>

      {/* Author Section */}
      {post.author && (
        <div className="mb-12 max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            <span>About the Author</span>
          </h2>
          <div className="flex flex-col sm:flex-row items-start gap-6 bg-muted/20 rounded-xl p-6">
            <Avatar className="h-20 w-20 border-2 border-background">
              <AvatarImage src={post.author.avatar} alt={post.author.name} />
              <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-grow">
              <Link
                href={`/authors/${post.author.slug}`}
                className="text-xl font-semibold hover:underline"
              >
                {post.author.name}
              </Link>
              <div className="text-sm text-muted-foreground mt-2 mb-4">
                {post.author.summary}
              </div>
              <div className="flex flex-wrap gap-2">
                {post.author.socialLinks?.twitter && (
                  <Button size="sm" variant="outline" className="rounded-full" asChild>
                    <Link
                      href={post.author.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Twitter"
                    >
                      <Twitter className="h-4 w-4 mr-1" />
                      <span>Twitter</span>
                    </Link>
                  </Button>
                )}
                {post.author.socialLinks?.github && (
                  <Button size="sm" variant="outline" className="rounded-full" asChild>
                    <Link
                      href={post.author.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="GitHub"
                    >
                      <Github className="h-4 w-4 mr-1" />
                      <span>GitHub</span>
                    </Link>
                  </Button>
                )}
                {post.author.socialLinks?.linkedin && (
                  <Button size="sm" variant="outline" className="rounded-full" asChild>
                    <Link
                      href={post.author.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="h-4 w-4 mr-1" />
                      <span>LinkedIn</span>
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

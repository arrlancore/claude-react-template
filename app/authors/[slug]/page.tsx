import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, Twitter } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { getAuthorBySlug } from "@/lib/author-utils";
import { getPostsByAuthor } from "@/lib/mdx/mdx-utils";
import { Metadata } from "next";
import { appLocale, appUrl, brandName } from "@/config";
import MainLayout from "@/components/layout/main-layout";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const author = await getAuthorBySlug(params.slug);

  if (!author) {
    return {
      title: "Author Not Found",
    };
  }

  const authorName = author.name;
  const authorBio = author.summary;
  const authorImage = author.avatar || `${appUrl}/default-avatar.jpg`;

  return {
    title: `${authorName} | Author at ${brandName}`,
    description: authorBio,
    openGraph: {
      title: `${authorName} | Author at ${brandName}`,
      description: authorBio,
      url: `${appUrl}/authors/${params.slug}`,
      siteName: brandName,
      images: [
        {
          url: authorImage,
          width: 1200,
          height: 630,
          alt: authorName,
        },
      ],
      locale: appLocale,
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: `${authorName} | Author at ${brandName}`,
      description: authorBio,
      images: [authorImage],
    },
  };
}

export default async function AuthorPage({
  params,
}: {
  params: { slug: string };
}) {
  const author = await getAuthorBySlug(params.slug);
  const authorPosts = await getPostsByAuthor(params.slug);

  if (!author) {
    notFound();
  }

  return (
    <MainLayout>
      <div className="py-12">
        <div className="mb-12 text-center max-w-screen-md mx-auto">
          <Avatar className="h-24 w-24 md:h-32 md:w-32 mx-auto mb-4">
            <AvatarImage src={author.avatar} alt={author.name} />
            <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <h1 className="text-2xl md:text-3xl font-bold mb-4">{author.name}</h1>
          <div className="prose prose-sm sm:prose dark:prose-invert max-w-none my-4">
            {author.bio}
          </div>
          <div className="flex justify-center gap-3">
            {author.socialLinks?.twitter && (
              <Button size="icon" variant="ghost" asChild>
                <Link
                  href={author.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
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
                  aria-label="GitHub"
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
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </Link>
              </Button>
            )}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center">
            Posts by {author.name}
          </h2>

          {authorPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No posts found by this author.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {authorPosts.map((post) => (
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
                    <p className="text-muted-foreground text-sm mb-4">
                      {format(new Date(post.publishedAt), "dd-MM-yyyy", {
                        locale: id,
                      })}{" "}
                      • {post.readingTime}
                    </p>
                    <p className="text-muted-foreground line-clamp-3">{post.summary}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

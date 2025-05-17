import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { id } from "date-fns/locale";
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
} from "@/config";

export const metadata: Metadata = {
  title: blogTitle,
  description: blogDescription,
  openGraph: {
    title: blogTitle,
    description: blogDescription,
    url: blogUrl,
    siteName: brandName,
    locale: appLocale,
    type: "website",
  },
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <MainLayout>
      <div className="py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 md:mb-12 text-center">Blog</h1>

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
                      {format(new Date(post.publishedAt), "dd-MM-yyyy", {
                        locale: id,
                      })}{" "}
                      • {post.readingTime}
                    </p>
                  </div>

                  <p className="text-muted-foreground line-clamp-3">{post.summary}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

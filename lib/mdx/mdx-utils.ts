import path from "path";
import fs from "fs";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import readingTime from "reading-time";
import { Post, PostMeta, TableOfContents } from "@/types/blog";
import { ReactElement } from "react";
import components from "./mdx-components";
import { getAuthorBySlug } from "../author-utils";
import { paginationConfig } from "@/config";

const POSTS_PATH = path.join(process.cwd(), "content/posts");

const randomImage = "https://unsplash.it/640/425?";

function getPostFilePaths(): string[] {
  return fs.readdirSync(POSTS_PATH).filter((path) => /\.mdx?$/.test(path));
}

// Function to extract headings from markdown content
function extractHeadings(content: string): TableOfContents[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings: TableOfContents[] = [];

  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length; // Number of # symbols (2 for h2, 3 for h3)
    const text = match[2].trim();
    const slug = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/^-+|-+$/g, ""); // Remove leading and trailing hyphens

    headings.push({ level, text, slug });
  }

  return headings;
}

export async function getAllPosts(
  page: number = 1,
  limit: number = paginationConfig.postsPerPage
): Promise<{ posts: PostMeta[]; total: number; totalPages: number }> {
  const currentDate = new Date();

  const mapPost = async (filePath: string) => {
    const source = fs.readFileSync(path.join(POSTS_PATH, filePath), "utf8");
    const { data } = matter(source);

    let author = await getAuthorBySlug(data.author);

    if (!author) {
      console.warn(`Author not found for slug: ${data.author}`);
      const defaultAuthorName = data.author
        ? data.author.split("-").join(" ")
        : "Tim Redaksi";
      author = {
        name: defaultAuthorName,
        slug: "tim-redaksi",
        bio: null as any,
        summary: "",
      };
    }

    const randomImageUrl =
      randomImage + data.tags ? randomImage + data.tags[0] : "";

    return {
      ...data,
      author,
      slug: filePath.replace(/\.mdx?$/, ""),
      readingTime: readingTime(source).text,
      image: data.image || randomImageUrl,
    } as PostMeta;
  };

  let allPosts = await Promise.all(getPostFilePaths().map(mapPost));

  allPosts = allPosts
    .filter((post) => post.draft !== true)
    .filter((post) => new Date(post.publishedAt) <= currentDate)
    .sort((a, b) => {
      return (
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    });

  const total = allPosts.length;
  const totalPages = Math.ceil(total / limit);

  // Handle pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedPosts = allPosts.slice(startIndex, endIndex);

  return {
    posts: paginatedPosts,
    total,
    totalPages,
  };
}

export async function getPostsByAuthor(
  authorSlug: string,
  page: number = 1,
  limit: number = paginationConfig.authorPostsPerPage
): Promise<{ posts: PostMeta[]; total: number; totalPages: number }> {
  const { posts: allPosts } = await getAllPosts(1, Number.MAX_SAFE_INTEGER);

  const filteredPosts = allPosts.filter(
    (post) => post.author.slug === authorSlug
  );
  const total = filteredPosts.length;
  const totalPages = Math.ceil(total / limit);

  // Handle pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

  return {
    posts: paginatedPosts,
    total,
    totalPages,
  };
}

export async function getPostBySlug(slug: string): Promise<Post> {
  const postFilePath = path.join(POSTS_PATH, `${slug}.mdx`);
  const source = fs.readFileSync(postFilePath, "utf8");

  const { content, data } = matter(source);
  let author = await getAuthorBySlug(data.author);

  if (!author) {
    console.warn(`Author not found for slug: ${data.author}`);
    const defaultAuthorName = data.author
      ? data.author.split("-").join(" ")
      : "Tim Redaksi";
    author = {
      name: defaultAuthorName,
      slug: "tim-redaksi",
      bio: null as any,
      summary: "",
    };
  }

  // Extract table of contents from the markdown content
  const toc = extractHeadings(content);

  const mdxContent = await MDXRemote({
    source: content,
    components: components,
  });

  const randomImageUrl =
    randomImage + data.tags ? randomImage + data.tags[0] : "";

  // Set showToc to true by default if not explicitly defined in frontmatter
  const showToc = data.showToc !== undefined ? data.showToc : true;

  return {
    content: mdxContent,
    ...data,
    slug,
    author,
    readingTime: readingTime(content).text,
    image: data.image || randomImageUrl,
    toc,
    showToc,
  } as Post;
}

export async function convertMDToContent(
  source: string,
  components = {} as any
): Promise<ReactElement> {
  const mdxContent = await MDXRemote({
    source,
    components,
  });

  return mdxContent;
}

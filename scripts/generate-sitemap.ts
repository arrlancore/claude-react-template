// scripts/generate-sitemap.ts
import { readdirSync, readFileSync } from "fs";
import { writeFile } from "fs/promises";
import path from "path";
import prettier from "prettier";
import matter from "gray-matter";
import { i18nConfig, appUrl } from "../config";

// Get the domain from config
const domain = appUrl || "https://brand.ai";

async function generateSitemap() {
  try {
    // Dynamic import for globby
    const { globby } = await import("globby");

    // Get all static pages - only include actual pages, not components or layout files
    const pages = await globby([
      "app/page.tsx", // Root page
      "app/blog/page.tsx", // Blog index
      "app/blog/[slug]/page.tsx", // Blog post templates
      "app/auth/page.tsx", // Auth page
      "app/i18n-example/page.tsx", // i18n example page
      "app/authors/[slug]/page.tsx", // Author page template
      "!app/**/client.tsx", // Exclude client components
      "!app/**/layout.tsx", // Exclude layout files
      "!app/**/loading.tsx", // Exclude loading states
      "!app/**/error.tsx", // Exclude error pages
      "!app/**/route.ts", // Exclude API routes
    ]);

    // Get locale pages that we'll need to map to each supported locale
    const localePages = await globby([
      "app/[locale]/page.tsx", // Localized home page
      "app/[locale]/blog/page.tsx", // Localized blog index
      "app/[locale]/auth/page.tsx", // Localized auth page
      "app/[locale]/i18n-example/page.tsx", // Localized i18n example
      "app/[locale]/styleguide/page.tsx", // Styleguide (only in dev)
    ]);

    // Prepare content paths
    const POSTS_PATH = path.join(process.cwd(), "content/posts");
    const AUTHORS_PATH = path.join(process.cwd(), "content/authors");

    // Process blog posts
    const getPostFilePaths = (): string[] => {
      try {
        return readdirSync(POSTS_PATH).filter((path) => /\.mdx?$/.test(path));
      } catch (error) {
        console.error("Error reading posts directory:", error);
        return [];
      }
    };

    const postFiles = getPostFilePaths();
    const currentDate = new Date();
    const posts = postFiles
      .map((fileName) => {
        try {
          const filePath = path.join(POSTS_PATH, fileName);
          const fileContents = readFileSync(filePath, "utf8");
          const { data } = matter(fileContents);
          return {
            slug: fileName.replace(/\.mdx?$/, ""),
            publishedAt:
              data.publishedAt && data.publishedAt.length === 10
                ? data.publishedAt + "T07:00:00+07:00"
                : data.publishedAt,
            draft: data.draft || false,
          };
        } catch (error) {
          console.error(`Error processing post ${fileName}:`, error);
          return null;
        }
      })
      .filter((post): post is NonNullable<typeof post> => post !== null)
      .filter((post) => !post.draft)
      .filter((post) => new Date(post.publishedAt) <= currentDate);

    // Process authors
    const getAuthorFilePaths = (): string[] => {
      try {
        return readdirSync(AUTHORS_PATH).filter((path) => /\.mdx?$/.test(path));
      } catch (error) {
        console.error("Error reading authors directory:", error);
        return [];
      }
    };

    const authorFiles = getAuthorFilePaths();
    const authors = authorFiles
      .map((fileName) => {
        try {
          const filePath = path.join(AUTHORS_PATH, fileName);
          const fileContents = readFileSync(filePath, "utf8");
          const { data } = matter(fileContents);
          return {
            slug: fileName.replace(/\.mdx?$/, ""),
            name: data.name,
          };
        } catch (error) {
          console.error(`Error processing author ${fileName}:`, error);
          return null;
        }
      })
      .filter((author): author is NonNullable<typeof author> => author !== null);

    // Helper to format route paths properly
    const formatPagePath = (pagePath: string): string => {
      return pagePath
        .replace(/^app/, "")
        .replace(/\.tsx?$/, "")
        .replace(/\/page$/, "")
        .replace(/\/index$/, "");
    };

    // Begin generating sitemap XML
    const sitemapUrls: string[] = [];

    // Add the root URL (homepage)
    sitemapUrls.push(`
      <url>
        <loc>${domain}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
      </url>
    `);

    // Process localized pages for each locale
    const { locales, defaultLocale } = i18nConfig;

    // Define regular routes for localization
    const regularRoutes = [
      "", // Home page
      "/blog",
      "/auth",
      "/i18n-example"
    ];

    // Generate URLs for regular routes with locales
    regularRoutes.forEach(route => {
      locales.forEach(locale => {
        if (locale === defaultLocale) {
          // Default locale URLs don't include the locale prefix
          sitemapUrls.push(`
            <url>
              <loc>${domain}${route}</loc>
              <lastmod>${new Date().toISOString()}</lastmod>
              <changefreq>daily</changefreq>
              <priority>${route === "" ? "1.0" : "0.7"}</priority>
            </url>
          `);
        } else {
          // Non-default locale URLs include the locale prefix
          sitemapUrls.push(`
            <url>
              <loc>${domain}/${locale}${route}</loc>
              <lastmod>${new Date().toISOString()}</lastmod>
              <changefreq>daily</changefreq>
              <priority>${route === "" ? "0.9" : "0.7"}</priority>
            </url>
          `);
        }
      });
    });

    // Process author pages for each locale
    authors.forEach((author) => {
      // Generate URL for each locale
      locales.forEach((locale) => {
        // For default locale, don't include locale in URL
        const localePrefix = locale === defaultLocale ? "" : `/${locale}`;

        sitemapUrls.push(`
          <url>
            <loc>${domain}${localePrefix}/authors/${author.slug}</loc>
            <lastmod>${new Date().toISOString()}</lastmod>
            <changefreq>monthly</changefreq>
            <priority>0.5</priority>
          </url>
        `);
      });
    });

    // Process blog posts for each locale
    posts.forEach((post) => {
      // Generate URL for each locale
      locales.forEach((locale) => {
        // For default locale, don't include locale in URL
        const localePrefix = locale === defaultLocale ? "" : `/${locale}`;

        sitemapUrls.push(`
          <url>
            <loc>${domain}${localePrefix}/blog/${post.slug}</loc>
            <lastmod>${post.publishedAt}</lastmod>
            <changefreq>weekly</changefreq>
            <priority>0.6</priority>
          </url>
        `);
      });
    });

    // Add styleguide page (only in development, but we'll include it anyway)
    sitemapUrls.push(`
      <url>
        <loc>${domain}/styleguide</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.3</priority>
      </url>
    `);

    // De-duplicate URLs in case we have any duplicates
    const uniqueUrlsSet = new Set(sitemapUrls);
    const uniqueUrls = Array.from(uniqueUrlsSet);

    // Complete sitemap XML structure
    const sitemap = `
      <?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${uniqueUrls.join("")}
      </urlset>
    `;

    // Format with prettier
    const formatted = await prettier.format(sitemap, {
      parser: "html",
    });

    // Write the sitemap
    await writeFile(
      path.join(process.cwd(), "public", "sitemap.xml"),
      formatted
    );

    console.log("✅ Sitemap generated successfully!");
    console.log(
      `✅ Generated sitemap for ${uniqueUrls.length} total URLs (including localized variants)`
    );
  } catch (error) {
    console.error("Error generating sitemap:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message);
    }
    process.exit(1);
  }
}

generateSitemap();

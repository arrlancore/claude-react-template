"use client";

import { brandName, appUrl } from "@/config";

interface JsonLdProps {
  type?: "Organization" | "WebSite" | "WebPage" | "Article" | "BreadcrumbList";
  data?: Record<string, any>;
}

/**
 * Generic component for JSON-LD structured data
 */
export default function JsonLd({ type, data }: JsonLdProps) {
  // If data is provided, use it directly
  if (data) {
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      />
    );
  }

  // Otherwise, generate structured data based on type
  let structuredData: Record<string, any> = {};

  switch (type) {
    case "Organization":
      structuredData = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": brandName,
        "url": appUrl,
        "logo": `${appUrl}/og-image.jpg`, // Using og-image for now, could be replaced with a proper logo
        "sameAs": [
          // Add social profiles here when available
          // "https://twitter.com/yourbrand",
          // "https://github.com/yourbrand"
        ]
      };
      break;

    case "WebSite":
      structuredData = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": brandName,
        "url": appUrl,
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${appUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      };
      break;

    case "WebPage":
      structuredData = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Build Better, Ship Faster",
        "description": "The complete development platform for building and scaling your next project.",
        "url": appUrl,
        "provider": {
          "@type": "Organization",
          "name": brandName,
          "url": appUrl
        }
      };
      break;

    default:
      structuredData = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": brandName,
        "url": appUrl
      };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

/**
 * Organization schema JSON-LD component
 */
export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": brandName,
    "url": appUrl,
    "logo": `${appUrl}/og-image.jpg`,
    "sameAs": [
      // Add social profiles here when available
      // "https://twitter.com/yourbrand",
      // "https://github.com/yourbrand"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * WebSite schema JSON-LD component
 */
export function WebsiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": brandName,
    "url": appUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${appUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * Landing page specific JSON-LD component
 */
export function LandingPageJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Build Better, Ship Faster",
    "description": "The complete development platform for building and scaling your next project.",
    "url": appUrl,
    "provider": {
      "@type": "Organization",
      "name": brandName,
      "url": appUrl
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * Article JSON-LD component for blog posts
 */
export function ArticleJsonLd({
  title,
  description,
  publishedTime,
  modifiedTime,
  authorName,
  url,
  imageUrl,
}: {
  title: string;
  description: string;
  publishedTime: string;
  modifiedTime?: string;
  authorName: string;
  url: string;
  imageUrl?: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "datePublished": publishedTime,
    "dateModified": modifiedTime || publishedTime,
    "author": {
      "@type": "Person",
      "name": authorName
    },
    "publisher": {
      "@type": "Organization",
      "name": brandName,
      "logo": {
        "@type": "ImageObject",
        "url": `${appUrl}/og-image.jpg`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    },
    "image": imageUrl ? imageUrl : `${appUrl}/og-image.jpg`
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

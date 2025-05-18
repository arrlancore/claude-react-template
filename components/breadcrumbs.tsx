"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { usePathname } from "next/navigation";
import { i18nConfig, appUrl } from "@/config";

type BreadcrumbItem = {
  label: string;
  href: string;
  isCurrent?: boolean;
};

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  homeLabel?: string;
  className?: string;
}

/**
 * Breadcrumbs component with structured data
 */
export function Breadcrumbs({
  items,
  homeLabel = "Home",
  className = "",
}: BreadcrumbsProps) {
  const pathname = usePathname();
  const { defaultLocale } = i18nConfig;

  // Check if we're on a localized path
  const pathParts = pathname.split('/').filter(Boolean);
  const isLocalizedPath = i18nConfig.locales.includes(pathParts[0]);
  const locale = isLocalizedPath ? pathParts[0] : defaultLocale;

  // Home page link depends on locale
  const homeHref = locale === defaultLocale ? '/' : `/${locale}`;

  // Prepare items including home
  const allItems = [
    { label: homeLabel, href: homeHref, isCurrent: pathname === homeHref },
    ...items,
  ];

  // JSON-LD Structured Data for breadcrumbs
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": allItems.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      "item": item.href.startsWith('http') ? item.href : `${appUrl}${item.href}`
    }))
  };

  return (
    <>
      <nav aria-label="Breadcrumbs" className={`flex items-center text-sm ${className}`}>
        <ol className="flex items-center space-x-1">
          {allItems.map((item, index) => (
            <li key={item.href} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="mx-1 h-4 w-4 text-muted-foreground" />
              )}

              {item.isCurrent ? (
                <span aria-current="page" className="text-muted-foreground">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-primary hover:text-primary/90 transition-colors"
                >
                  {index === 0 ? (
                    <span className="flex items-center">
                      <Home className="h-3.5 w-3.5 mr-1" />
                      <span className="sr-only sm:not-sr-only">{item.label}</span>
                    </span>
                  ) : (
                    item.label
                  )}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* Add structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </>
  );
}

/**
 * Simple hook to generate breadcrumb items from current path
 * @returns Breadcrumb items based on URL path
 */
export function useBreadcrumbItems() {
  const pathname = usePathname();
  const { locales, defaultLocale } = i18nConfig;

  // Split path into segments
  const segments = pathname.split('/').filter(Boolean);

  // Check if first segment is a locale
  const hasLocale = segments.length > 0 && locales.includes(segments[0]);
  const locale = hasLocale ? segments[0] : defaultLocale;

  // Remove locale from segments if present
  const pathSegments = hasLocale ? segments.slice(1) : segments;

  // Generate breadcrumb items
  const items: BreadcrumbItem[] = [];
  let currentPath = '';

  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const fullPath = hasLocale ? `/${locale}${currentPath}` : currentPath;

    // Format the label (capitalize, replace hyphens with spaces)
    let label = segment.replace(/-/g, ' ');
    label = label.charAt(0).toUpperCase() + label.slice(1);

    items.push({
      label,
      href: fullPath,
      isCurrent: index === pathSegments.length - 1,
    });
  });

  return items;
}

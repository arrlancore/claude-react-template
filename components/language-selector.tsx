"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GlobeIcon } from "lucide-react";
import { i18nConfig } from "@/config";
import Link from "next/link";

export function LanguageSelector() {
  const [mounted, setMounted] = React.useState(false);
  const pathname = usePathname();

  // Only render the component on the client to avoid hydration issues
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Extract the current locale from the pathname or use default
  const pathnameLocale = pathname.split("/")[1];
  const isOnDefaultLocale =
    !pathnameLocale || !i18nConfig.locales.includes(pathnameLocale);
  const currentLocale = isOnDefaultLocale
    ? i18nConfig.defaultLocale
    : pathnameLocale;

  // Function to get localized path
  const getLocalizedPath = (locale: string) => {
    // For default locale, remove locale prefix
    if (locale === i18nConfig.defaultLocale) {
      const segments = pathname.split("/");
      // If we're already on a localized path, remove the locale segment
      if (i18nConfig.locales.includes(segments[1])) {
        segments.splice(1, 1);
      }
      return segments.join("/") || "/";
    }
    // For non-default locales, add the locale prefix
    else {
      const segments = pathname.split("/");
      // If we're on default locale (no locale in path), add the locale
      if (!i18nConfig.locales.includes(segments[1])) {
        segments.splice(1, 0, locale);
      }
      // If we're on another locale path, replace it
      else {
        segments[1] = locale;
      }
      return segments.join("/");
    }
  };

  // Don't render dropdown if only one locale exists
  if (i18nConfig.locales?.length === 1) {
    return null;
  }

  // If not mounted yet, return a placeholder but with the icon
  if (!mounted) {
    // Return a placeholder with the icon to prevent layout shift
    return (
      <Button variant="outline" size="icon">
        <GlobeIcon className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Switch language</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <GlobeIcon className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Switch language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="mt-4">
        {i18nConfig.locales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            className={`cursor-pointer ${currentLocale === locale ? "font-bold" : ""}`}
            asChild
          >
            <Link href={getLocalizedPath(locale)}>
              {
                i18nConfig.localeNames[
                  locale as keyof typeof i18nConfig.localeNames
                ]
              }
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

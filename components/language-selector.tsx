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
  const pathname = usePathname();

  // Extract the current locale from the pathname
  const currentLocale = pathname.split('/')[1] || i18nConfig.defaultLocale;

  // Function to get localized path
  const getLocalizedPath = (locale: string) => {
    const segments = pathname.split('/');
    segments[1] = locale;
    return segments.join('/');
  };

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
            className={`cursor-pointer ${currentLocale === locale ? 'font-bold' : ''}`}
            asChild
          >
            <Link href={getLocalizedPath(locale)}>
              {i18nConfig.localeNames[locale as keyof typeof i18nConfig.localeNames]}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

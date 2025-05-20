"use client";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "../ui/button";
import Link from "next/link";
import { brand, i18nConfig } from "@/config";
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { LanguageSelector } from "../language-selector";
import { useEffect, useState } from "react";

export function BlogHeader() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const t = useTranslations('blog');
  const params = useParams();
  const locale = params.locale as string || 'en';
  const { defaultLocale } = i18nConfig;

  // Only render theme-related UI on the client to avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate homepage link based on locale
  const homeLink = locale === defaultLocale ? '/' : `/${locale}`;

  // Generate blog link based on locale
  const blogLink = locale === defaultLocale ? '/blog' : `/${locale}/blog`;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-2">
        <Link href={homeLink}>
          <h1 className="text-xl md:text-2xl font-extrabold">
            <span>{brand.title}</span>
            {brand.domain && (
              <span className="bg-gradient-to-tr from-primary to-primary-foreground bg-clip-text text-transparent">
                .{brand.domain}
              </span>
            )}
          </h1>
        </Link>
        <div className="flex items-center space-x-2">
          <Link href={blogLink}>
            <Button variant="ghost">{t('title')}</Button>
          </Link>
          <LanguageSelector />
          {mounted ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          ) : (
            <Button variant="ghost" size="icon">
              <SunIcon className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

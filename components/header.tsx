"use client";

import Link from "next/link";
import { useState } from "react";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import { brand } from "@/config";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { LanguageSelector } from "./language-selector";
import { useParams } from "next/navigation";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = useTranslations("common");
  const params = useParams();
  // Get locale from params or use default if we're on the root route
  const locale = (params.locale as string) || "en";
  const { defaultLocale } = i18nConfig;

  // Generate link paths based on the locale
  const getLocalizedLink = (path: string) => {
    // For default locale, don't include the locale in the path
    if (locale === defaultLocale) {
      return path;
    }
    // For other locales, include the locale in the path
    return `/${locale}${path}`;
  };

  // Generate homepage link based on locale
  const homeLink = locale === defaultLocale ? '/' : `/${locale}`;

  // Generate blog link based on locale
  const blogLink = locale === defaultLocale ? '/blog' : `/${locale}/blog`;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo section */}
        <div className="flex items-center">
          <Link href={homeLink} className="flex items-center">
            <h1 className="text-xl md:text-2xl font-extrabold">
              <span>{brand.title}</span>
              {brand.domain && (
                <span className="bg-gradient-to-tr from-primary to-primary-foreground bg-clip-text text-transparent">
                  .{brand.domain}
                </span>
              )}
            </h1>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <a
            href="#features"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {t("nav.features")}
          </a>
          <a
            href="#pricing"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {t("nav.pricing")}
          </a>
          <a
            href="#about"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {t("nav.about")}
          </a>
          <a
            href="#contact"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {t("nav.contact")}
          </a>
          <Link
            href={blogLink}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {t("nav.blog")}
          </Link>
        </nav>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost">{t("nav.signIn")}</Button>
          <Button>{t("nav.getStarted")}</Button>
          <LanguageSelector />
          <ModeToggle />
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-4 md:hidden">
          <LanguageSelector />
          <ModeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMenu}
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-b">
          <div className="container py-4 px-4 sm:px-6">
            <nav className="flex flex-col space-y-4">
              <a
                href="#features"
                className="py-2 text-muted-foreground hover:text-foreground"
                onClick={toggleMenu}
              >
                {t("nav.features")}
              </a>
              <a
                href="#pricing"
                className="py-2 text-muted-foreground hover:text-foreground"
                onClick={toggleMenu}
              >
                {t("nav.pricing")}
              </a>
              <a
                href="#about"
                className="py-2 text-muted-foreground hover:text-foreground"
                onClick={toggleMenu}
              >
                {t("nav.about")}
              </a>
              <a
                href="#contact"
                className="py-2 text-muted-foreground hover:text-foreground"
                onClick={toggleMenu}
              >
                {t("nav.contact")}
              </a>
              <Link
                href={blogLink}
                className="py-2 text-muted-foreground hover:text-foreground"
                onClick={toggleMenu}
              >
                {t("nav.blog")}
              </Link>

              <div className="pt-4 flex flex-col space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-center"
                  onClick={toggleMenu}
                >
                  {t("nav.signIn")}
                </Button>
                <Button className="w-full justify-center" onClick={toggleMenu}>
                  {t("home.hero.getStarted")}
                </Button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;

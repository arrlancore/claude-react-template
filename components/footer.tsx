"use client";

import { Github, Twitter, Linkedin } from "lucide-react";
import Link from "next/link";
import { Separator } from "./ui/separator";
import { brand } from "@/config";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("common.footer");

  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div>
            <h3 className="font-semibold mb-3 md:mb-4">{t("company")}</h3>
            <ul className="space-y-2 md:space-y-3 text-sm text-muted-foreground">
              <li>
                <a
                  href="#about"
                  className="hover:text-foreground transition-colors"
                >
                  {t("about")}
                </a>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="hover:text-foreground transition-colors"
                >
                  {t("blog")}
                </Link>
              </li>
            </ul>
          </div>
          <div></div>
        </div>

        <Separator className="my-6 md:my-8" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            © 2025 {brand.title}
          </div>
          <div className="flex gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

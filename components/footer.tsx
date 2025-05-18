"use client";

import { Github, Twitter, Linkedin } from "lucide-react";
import Link from "next/link";
import { Separator } from "./ui/separator";
import { brand } from "@/config";
import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('common.footer');

  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          <div>
            <h3 className="font-semibold mb-3 md:mb-4">{t('product')}</h3>
            <ul className="space-y-2 md:space-y-3 text-sm text-muted-foreground">
              <li>
                <a href="#features" className="hover:text-foreground transition-colors">
                  {t('features')}
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-foreground transition-colors">
                  {t('pricing')}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  {t('updates')}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  {t('beta')}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3 md:mb-4">{t('company')}</h3>
            <ul className="space-y-2 md:space-y-3 text-sm text-muted-foreground">
              <li>
                <a href="#about" className="hover:text-foreground transition-colors">
                  {t('about')}
                </a>
              </li>
              <li>
                <Link href="/blog" className="hover:text-foreground transition-colors">
                  {t('blog')}
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  {t('careers')}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  {t('press')}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3 md:mb-4">{t('resources')}</h3>
            <ul className="space-y-2 md:space-y-3 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  {t('documentation')}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  {t('helpCenter')}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  {t('support')}
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-foreground transition-colors">
                  {t('contact')}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3 md:mb-4">{t('legal')}</h3>
            <ul className="space-y-2 md:space-y-3 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  {t('privacy')}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  {t('terms')}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  {t('security')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-6 md:my-8" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {brand.title}
            {brand.domain ? "." + brand.domain : ""} {t('allRightsReserved')}
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

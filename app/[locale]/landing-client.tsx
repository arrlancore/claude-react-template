"use client";

import MainLayout from "@/components/layout/main-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { brand, newsletterConfig } from "@/config";
import { ArrowRight, CheckCircle2, Sparkles, Zap, Shield } from "lucide-react";
import { useTranslations } from "next-intl";
import { LandingPageJsonLd } from "@/components/json-ld";
import NewsletterForm from "@/components/newsletter-form";
import HeroSection from "@/components/hero-section";

export default function ClientLandingPage() {
  const t = useTranslations();

  return (
    <MainLayout showHeader={false} fullWidth>
      {/* Add structured data specific to the landing page */}
      <LandingPageJsonLd />

      <HeroSection />

      {/* Core Features Section */}
      <section id="core-features" className="py-12 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              How PatternLift Transforms Your Learning
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              Experience a personalized path to DSA mastery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            {/* Adaptive AI Learning Engine */}
            <div className="flex flex-col items-center text-center gap-2 p-2">
              <Zap className="h-8 w-8 text-primary flex-shrink-0" />
              <h3 className="font-semibold">
                Experience Learning That Adapts to You
              </h3>
              <p className="text-sm text-muted-foreground">
                The platform understands your current level and learning style,
                guiding you with personalized questions and hints.
              </p>
            </div>

            {/* Interactive Learning Components */}
            <div className="flex flex-col items-center text-center gap-2 p-2">
              <Sparkles className="h-8 w-8 text-primary flex-shrink-0" />
              <h3 className="font-semibold">
                Learn by Doing with Interactive Visualizations
              </h3>
              <p className="text-sm text-muted-foreground">
                Don't just read about algorithms; see them in action and
                interact with them. This hands-on approach helps build a deeper
                understanding.
              </p>
            </div>

            {/* Modular Two Pointer Pattern System */}
            <div className="flex flex-col items-center text-center gap-2 p-2">
              <Shield className="h-8 w-8 text-primary flex-shrink-0" />
              <h3 className="font-semibold">
                Master Core Patterns, Not Just Random Problems
              </h3>
              <p className="text-sm text-muted-foreground">
                Learn the fundamental building blocks that solve a vast majority
                of coding interview problems.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-12 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                {t("home.about.title")}
              </h2>
              <p className="text-muted-foreground mb-4">
                {brand.title}.{brand.domain} {t("home.about.description1")}
              </p>
              <p className="text-muted-foreground mb-4">
                {t("home.about.description2")}
              </p>
              <p className="text-muted-foreground">
                {t("home.about.description3")}
              </p>
            </div>
            <div className="order-first md:order-last">
              <div className="relative aspect-video rounded-xl overflow-hidden bg-muted">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-4xl font-bold text-muted-foreground/30">
                    {t("home.about.videoDescription")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        id="contact"
        className="bg-primary text-primary-foreground py-12 md:py-20"
      >
        <div className="mx-auto max-w-4xl text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Dive In?
          </h2>
          <p className="mb-8 text-base md:text-lg opacity-90">
            Start your DSA journey today!
          </p>
          <Button
            size="lg"
            variant="outline"
            className="w-full text-primary sm:w-auto"
          >
            Get Started for Free
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>
    </MainLayout>
  );
}

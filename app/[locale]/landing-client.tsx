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

      {/* Feature Highlights */}
      <section id="features" className="bg-muted/50 py-12 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              {t("home.featureHighlights.title")}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              {t("home.featureHighlights.description")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
            {[
              "deployments",
              "versionControl",
              "analytics",
              "collaboration",
              "support",
              "domains",
              "api",
              "uptime",
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-2 p-2">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                <span>{t(`home.featureHighlights.features.${feature}`)}</span>
              </div>
            ))}
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
                    About Video
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-muted/50 py-12 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              {t("home.pricing.title")}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("home.pricing.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {["starter", "pro", "enterprise"].map((plan) => (
              <Card
                key={plan}
                className={`flex flex-col h-full ${
                  plan === "pro" ? "relative border-primary" : ""
                }`}
              >
                {plan === "pro" && (
                  <div className="absolute -top-4 inset-x-0 flex justify-center">
                    <Badge className="bg-primary text-primary-foreground">
                      {t("home.pricing.mostPopular")}
                    </Badge>
                  </div>
                )}
                <div className="p-6 flex-grow">
                  <h3 className="text-lg font-medium mb-2">
                    {t(`home.pricing.plans.${plan}.name`)}
                  </h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">
                      {t(`home.pricing.plans.${plan}.price`)}
                    </span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    {t(`home.pricing.plans.${plan}.description`)}
                  </p>
                  <ul className="space-y-3 mb-6">
                    {t(`home.pricing.plans.${plan}.features`)
                      .split(",")
                      .map((feature: string) => (
                        <li key={feature} className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                  </ul>
                </div>
                <div className="p-6 pt-0 mt-auto">
                  <Button className="w-full">
                    {plan === "enterprise"
                      ? t("home.pricing.contactSales")
                      : t("home.pricing.getStarted")}
                  </Button>
                </div>
              </Card>
            ))}
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
            {t("home.cta.title")}
          </h2>
          <p className="mb-8 text-base md:text-lg opacity-90">
            {t("home.cta.description")}
          </p>
          <Button size="lg" variant="secondary" className="w-full sm:w-auto">
            {t("home.cta.button")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          {/* Newsletter Section - Only show if Brevo is configured */}
          {newsletterConfig.brevo.enabled && (
            <div className="mt-16 max-w-md mx-auto">
              <div className="bg-background/10 backdrop-blur-sm rounded-lg p-6">
                <NewsletterForm variant="inline" />
              </div>
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
}

"use client";

import MainLayout from "@/components/layout/main-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, CheckCircle2, Sparkles, Zap, Shield } from "lucide-react";
import { useTranslations } from 'next-intl';

function LandingPage() {
  const t = useTranslations();

  return (
    <MainLayout fullWidth>
      {/* Hero Section */}
      <section className="mx-auto max-w-6xl py-12 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <Badge variant="outline" className="mb-4">
            {t('home.hero.badge')}
          </Badge>
          <h1 className="mb-4 text-4xl md:text-5xl font-bold tracking-tight">
            {t('home.hero.title')}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t('home.hero.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="w-full sm:w-auto">
              {t('home.hero.getStarted')} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              {t('home.hero.liveDemo')}
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-16">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Zap className="h-12 w-12 mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">{t('home.features.speed.title')}</h3>
            <p className="text-muted-foreground">
              {t('home.features.speed.description')}
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Shield className="h-12 w-12 mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">{t('home.features.security.title')}</h3>
            <p className="text-muted-foreground">
              {t('home.features.security.description')}
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Sparkles className="h-12 w-12 mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">{t('home.features.ai.title')}</h3>
            <p className="text-muted-foreground">
              {t('home.features.ai.description')}
            </p>
          </Card>
        </div>

        {/* Social Proof */}
        <Card className="p-6 md:p-8 text-center bg-muted/50">
          <CardContent>
            <h2 className="text-xl md:text-2xl font-bold mb-6">
              {t('home.socialProof.title')}
            </h2>
            <div className="flex flex-wrap justify-center gap-4 md:gap-8 items-center text-muted-foreground">
              <div className="text-lg md:text-xl font-semibold">Microsoft</div>
              <div className="text-lg md:text-xl font-semibold">Google</div>
              <div className="text-lg md:text-xl font-semibold">Amazon</div>
              <div className="text-lg md:text-xl font-semibold">Meta</div>
              <div className="text-lg md:text-xl font-semibold">Apple</div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Feature Highlights */}
      <section id="features" className="bg-muted/50 py-12 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              {t('home.featureHighlights.title')}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              {t('home.featureHighlights.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
            {[
              'deployments',
              'versionControl',
              'analytics',
              'collaboration',
              'support',
              'domains',
              'api',
              'uptime'
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-2 p-2">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                <span>{t(`home.featureHighlights.features.${feature}`)}</span>
              </div>
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
            {t('home.cta.title')}
          </h2>
          <p className="mb-8 text-base md:text-lg opacity-90">
            {t('home.cta.description')}
          </p>
          <Button size="lg" variant="secondary" className="w-full sm:w-auto">
            {t('home.cta.button')}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>
    </MainLayout>
  );
}

export default LandingPage;

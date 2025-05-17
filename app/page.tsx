import MainLayout from "@/components/layout/main-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { appDescription, appSlogan, appTitle, appUrl, brand } from "@/config";
import { ArrowRight, CheckCircle2, Sparkles, Zap, Shield } from "lucide-react";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: appTitle,
  description: appDescription,
  openGraph: {
    title: appSlogan,
    description: appDescription,
    images: [{ url: `${appUrl}/og-image.jpg` }],
  },
};

function LandingPage() {
  return (
    <MainLayout fullWidth>
      {/* Hero Section */}
      <section className="mx-auto max-w-6xl py-12 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <Badge variant="outline" className="mb-4">
            ✨ Now in Beta
          </Badge>
          <h1 className="mb-4 text-4xl md:text-5xl font-bold tracking-tight">
            Build Better, Ship Faster
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            The complete development platform for building and scaling your next
            project. Trusted by over 20,000 developers worldwide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="w-full sm:w-auto">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Live Demo
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-16">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Zap className="h-12 w-12 mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
            <p className="text-muted-foreground">
              Built for speed and performance, deploy in seconds not minutes.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Shield className="h-12 w-12 mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Enterprise Security</h3>
            <p className="text-muted-foreground">
              Bank-grade security with end-to-end encryption and compliance.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Sparkles className="h-12 w-12 mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">AI-Powered</h3>
            <p className="text-muted-foreground">
              Smart automation and insights powered by latest AI technology.
            </p>
          </Card>
        </div>

        {/* Social Proof */}
        <Card className="p-6 md:p-8 text-center bg-muted/50">
          <CardContent>
            <h2 className="text-xl md:text-2xl font-bold mb-6">
              Trusted by Industry Leaders
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
              Everything You Need
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              All the tools and features you need to build amazing products
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
            {[
              "Automatic deployments",
              "Version control",
              "Advanced analytics",
              "Team collaboration",
              "24/7 support",
              "Custom domains",
              "API access",
              "99.9% uptime",
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-2 p-2">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                <span>{feature}</span>
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
                About Our Platform
              </h2>
              <p className="text-muted-foreground mb-4">
                {brand.title}.{brand.domain} was founded with a simple but
                powerful mission: to make development more accessible,
                efficient, and enjoyable for teams of all sizes.
              </p>
              <p className="text-muted-foreground mb-4">
                Our platform combines cutting-edge technology with intuitive
                design, enabling developers to focus on what matters
                most—building exceptional software that solves real problems.
              </p>
              <p className="text-muted-foreground">
                Whether you're a startup or an enterprise, our scalable
                solutions grow with you, providing the tools and support you
                need at every stage of your journey.
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
              Simple, Transparent Pricing
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that's right for you and your team. All plans
              include a 14-day free trial.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Starter Plan */}
            <Card className="flex flex-col h-full">
              <div className="p-6 flex-grow">
                <h3 className="text-lg font-medium mb-2">Starter</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold">$29</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-muted-foreground mb-6">
                  Perfect for individuals and small teams getting started.
                </p>
                <ul className="space-y-3 mb-6">
                  {[
                    "5 team members",
                    "20GB storage",
                    "Basic analytics",
                    "24/7 support",
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-6 pt-0 mt-auto">
                <Button className="w-full">Get Started</Button>
              </div>
            </Card>

            {/* Pro Plan */}
            <Card className="flex flex-col h-full relative border-primary">
              <div className="absolute -top-4 inset-x-0 flex justify-center">
                <Badge className="bg-primary text-primary-foreground">
                  Most Popular
                </Badge>
              </div>
              <div className="p-6 flex-grow">
                <h3 className="text-lg font-medium mb-2">Pro</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold">$79</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-muted-foreground mb-6">
                  For growing teams needing more power and features.
                </p>
                <ul className="space-y-3 mb-6">
                  {[
                    "Unlimited team members",
                    "100GB storage",
                    "Advanced analytics",
                    "Priority support",
                    "Custom domains",
                    "API access",
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-6 pt-0 mt-auto">
                <Button className="w-full">Get Started</Button>
              </div>
            </Card>

            {/* Enterprise Plan */}
            <Card className="flex flex-col h-full">
              <div className="p-6 flex-grow">
                <h3 className="text-lg font-medium mb-2">Enterprise</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold">$199</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-muted-foreground mb-6">
                  For large organizations with advanced requirements.
                </p>
                <ul className="space-y-3 mb-6">
                  {[
                    "Unlimited everything",
                    "500GB storage",
                    "Enterprise analytics",
                    "Dedicated support",
                    "Custom integrations",
                    "SLA guarantees",
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-6 pt-0 mt-auto">
                <Button className="w-full">Contact Sales</Button>
              </div>
            </Card>
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
            Ready to Get Started?
          </h2>
          <p className="mb-8 text-base md:text-lg opacity-90">
            Join thousands of developers building the future of web development.
          </p>
          <Button size="lg" variant="secondary" className="w-full sm:w-auto">
            Start Building Now
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>
    </MainLayout>
  );
}

export default LandingPage;

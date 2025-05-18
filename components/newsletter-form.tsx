"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface NewsletterFormProps {
  className?: string;
  variant?: "default" | "inline" | "card";
}

/**
 * Newsletter subscription form component
 *
 * @param {string} className - Optional custom className
 * @param {string} variant - Form display variant: 'default', 'inline', or 'card'
 */
export default function NewsletterForm({
  className = "",
  variant = "default",
}: NewsletterFormProps) {
  const t = useTranslations("newsletter");
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate email
      if (!email || !email.includes("@")) {
        toast({
          title: t("error.title"),
          description: t("error.invalidEmail"),
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Send subscription request
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        // Success
        setIsSuccess(true);
        setEmail("");
        toast({
          title: t("success.title"),
          description: t("success.message"),
        });
      } else {
        // Handle specific error cases
        if (response.status === 409) {
          toast({
            title: t("error.title"),
            description: t("error.alreadySubscribed"),
            variant: "destructive",
          });
        } else {
          // General error
          toast({
            title: t("error.title"),
            description: data.error || t("error.message"),
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: t("error.title"),
        description: t("error.message"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Inline variant - simple form with input and button side by side
  if (variant === "inline") {
    return (
      <form
        onSubmit={handleSubscribe}
        className={`flex flex-col sm:flex-row gap-2 items-center ${className}`}
      >
        <div className="relative flex-grow w-full">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="email"
            placeholder={t("emailPlaceholder")}
            className="pl-10 w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading || isSuccess}
            required
          />
        </div>
        <Button
          type="submit"
          disabled={isLoading || isSuccess}
          className="w-full sm:w-auto"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("subscribeButtonLoading")}
            </>
          ) : isSuccess ? (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              {t("success.title")}
            </>
          ) : (
            <>
              {t("subscribeButton")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>
    );
  }

  // Card variant - full card with title, description, and form
  if (variant === "card") {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubscribe} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder={t("emailPlaceholder")}
                className="pl-10 w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading || isSuccess}
                required
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading || isSuccess}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("subscribeButtonLoading")}
                </>
              ) : isSuccess ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  {t("success.title")}
                </>
              ) : (
                <>
                  {t("subscribeButton")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  // Default variant
  return (
    <div className={`${className}`}>
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold mb-2">{t("title")}</h3>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>
      <form onSubmit={handleSubscribe} className="space-y-4 max-w-md mx-auto">
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="email"
            placeholder={t("emailPlaceholder")}
            className="pl-10 w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading || isSuccess}
            required
          />
        </div>
        <Button
          type="submit"
          disabled={isLoading || isSuccess}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("subscribeButtonLoading")}
            </>
          ) : isSuccess ? (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              {t("success.title")}
            </>
          ) : (
            <>
              {t("subscribeButton")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>
    </div>
  );
}

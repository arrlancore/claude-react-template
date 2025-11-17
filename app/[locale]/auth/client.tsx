"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, Lock, User, ArrowRight, Github } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";
import withSuspense from "@/lib/with-suspense";

const _AuthForm = () => {
  const t = useTranslations("auth");
  // Use a more descriptive name for context loading to avoid confusion
  const { user, loading: authContextLoading, signInWithGitHub } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [authLoading, setAuthLoading] = useState(false);

  // Add client-side only rendering flag
  const [isClient, setIsClient] = useState(false);
  const [searchParamsData, setSearchParamsData] = useState({
    form: null as string | null,
    error: null as string | null,
    errorDescription: null as string | null,
  });

  // Only use useSearchParams on client side to avoid hydration issues
  const searchParams = useSearchParams();

  // Initialize authMode with a stable default
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [showEmailVerification, setShowEmailVerification] = useState(false);

  // Extract search params data only on client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const formParam = urlParams.get("form");
      const errorParam = urlParams.get("error");
      const errorDescriptionParam = urlParams.get("error_description");

      setSearchParamsData({
        form: formParam,
        error: errorParam,
        errorDescription: errorDescriptionParam,
      });

      // Set auth mode based on form parameter
      if (formParam === "signup") {
        setAuthMode("signup");
      } else {
        setAuthMode("login");
      }
    }
  }, []);

  // Display OAuth errors if present
  useEffect(() => {
    if (searchParamsData.error && isClient) {
      let errorMessage = "Authentication failed";

      switch (searchParamsData.error) {
        case "session_exchange_failed":
          errorMessage = "Failed to establish session. Please try again.";
          break;
        case "unexpected_error":
          errorMessage = "An unexpected error occurred. Please try again.";
          break;
        case "access_denied":
          errorMessage =
            "Access was denied. Please authorize the application to continue.";
          break;
        default:
          errorMessage =
            searchParamsData.errorDescription ||
            searchParamsData.error ||
            "Authentication failed";
      }

      toast({
        title: "Authentication Error",
        description: errorMessage,
        variant: "destructive",
      });

      // Clear error from URL
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("error");
      newUrl.searchParams.delete("error_description");
      window.history.replaceState({}, "", newUrl.toString());
    }
  }, [
    searchParamsData.error,
    searchParamsData.errorDescription,
    isClient,
    toast,
  ]);

  // Mark that we're on the client - this prevents hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Login form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Additional signup form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // REDIRECTION LOGIC:
  // This effect handles redirecting the user if they are authenticated.
  // It waits until authContextLoading is false AND isClient is true.
  useEffect(() => {
    if (user && !authContextLoading && isClient) {
      const currentSearchParams = new URLSearchParams(window.location.search);
      const redirectTo = currentSearchParams.get("redirect") || "/dashboard";
      router.push(redirectTo);
    }
  }, [user, authContextLoading, isClient, router]);

  const handleGitHubSignIn = async () => {
    setAuthLoading(true);
    const { error } = await signInWithGitHub();

    if (error) {
      toast({
        title: "GitHub Sign-In Failed",
        description: error.message,
        variant: "destructive",
      });
    }
    setAuthLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Get redirect URL from query params or default to dashboard
      const searchParams = new URLSearchParams(window.location.search);
      const redirectTo = searchParams.get("redirect") || "/dashboard";
      router.push(redirectTo);
    } catch (error: any) {
      toast({
        title: t("login.failure.title"),
        description: error.message || t("login.failure.description"),
        variant: "destructive",
      });
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (error) throw error;

      toast({
        title: t("signup.success.title"),
        description: t("signup.success.description"),
      });

      // Show email verification state and switch to login
      setShowEmailVerification(true);
      setAuthMode("login");
    } catch (error: any) {
      toast({
        title: t("signup.failure.title"),
        description: error.message || t("signup.failure.description"),
        variant: "destructive",
      });
    } finally {
      setAuthLoading(false);
    }
  };

  // LOADING STATE RENDERING:
  // Show skeleton if AuthContext is still loading OR if we haven't confirmed client-side yet.
  if (authContextLoading || !isClient) {
    return (
      <div className="w-full max-w-md">
        {/* Mock the tabs structure for consistent loading */}
        <div className="w-full">
          <div className="h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground grid w-full grid-cols-2 mb-6">
            <div className="animate-pulse bg-muted-foreground/20 h-6 rounded"></div>
            <div className="animate-pulse bg-muted-foreground/20 h-6 rounded"></div>
          </div>
          <div className="border shadow-sm rounded-lg">
            <div className="p-6 space-y-4">
              <div className="text-center space-y-2">
                <div className="animate-pulse bg-muted h-8 w-32 mx-auto rounded"></div>
                <div className="animate-pulse bg-muted h-4 w-48 mx-auto rounded"></div>
              </div>
              <div className="animate-pulse bg-muted h-10 w-full rounded"></div>
              <div className="animate-pulse bg-muted h-10 w-full rounded"></div>
              <div className="animate-pulse bg-muted h-10 w-full rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // USER ALREADY AUTHENTICATED AND REDIRECT SHOULD BE IN PROGRESS:
  // If user exists at this point (and authContextLoading is false, isClient is true),
  // the useEffect above should have initiated a redirect.
  // We can return null or a minimal loader here to prevent rendering the form
  // while the redirect is happening.
  if (user) {
    // Optionally, show a very minimal "Redirecting..." message or just null
    return (
      <div className="w-full max-w-md text-center p-8">Redirecting...</div>
    );
    // return null; // Or just null
  }

  return (
    <div className="w-full max-w-md">
      <Tabs
        value={authMode}
        onValueChange={(v) => setAuthMode(v as "login" | "signup")}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="login">{t("login.tabLabel")}</TabsTrigger>
          <TabsTrigger value="signup">{t("signup.tabLabel")}</TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <Card className="border shadow-sm">
            {showEmailVerification && (
              <div className="bg-blue-50 border-b border-blue-200 p-4 rounded-t-lg">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-900">
                      Please check your email for verification
                    </p>
                    <p className="text-xs text-blue-700 mt-1">
                      Click the verification link in your email before logging in. Check spam if you don't see it.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowEmailVerification(false)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center font-bold">
                {t("login.title")}
              </CardTitle>
              <CardDescription className="text-center">
                {showEmailVerification
                  ? "Enter your credentials after verifying your email"
                  : t("login.description")
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleGitHubSignIn}
                  disabled={authLoading}
                >
                  <Github className="mr-2 h-4 w-4" />
                  Continue with GitHub
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with email
                    </span>
                  </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">{t("login.email")}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder={t("login.emailPlaceholder")}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">{t("login.password")}</Label>
                      <Link
                        href="#"
                        className="text-xs text-primary hover:underline"
                      >
                        {t("login.forgotPassword")}
                      </Link>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder={t("login.passwordPlaceholder")}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={authLoading}
                  >
                    {authLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("login.loading")}
                      </>
                    ) : (
                      <>
                        {t("login.button")}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="signup">
          <Card className="border shadow-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center font-bold">
                {t("signup.title")}
              </CardTitle>
              <CardDescription className="text-center">
                {t("signup.description")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleGitHubSignIn}
                  disabled={authLoading}
                >
                  <Github className="mr-2 h-4 w-4" />
                  Continue with GitHub
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or create account with email
                    </span>
                  </div>
                </div>

                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">{t("signup.firstName")}</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="firstName"
                          placeholder={t("signup.firstNamePlaceholder")}
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">{t("signup.lastName")}</Label>
                      <Input
                        id="lastName"
                        placeholder={t("signup.lastNamePlaceholder")}
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">{t("signup.email")}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder={t("signup.emailPlaceholder")}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">
                      {t("signup.password")}
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder={t("signup.passwordPlaceholder")}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={authLoading}
                  >
                    {authLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("signup.loading")}
                      </>
                    ) : (
                      <>
                        {t("signup.button")}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export const AuthForm = withSuspense(
  _AuthForm,
  <Loader2 className="animate-spin" />
);

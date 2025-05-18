"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
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
import { Loader2, Mail, Lock, User, ArrowRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";

export const AuthForm = () => {
  const t = useTranslations("auth");
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [authLoading, setAuthLoading] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

  const searchParams = useSearchParams();
  const form = searchParams.get("form");

  // Set initial auth mode based on form parameter
  useEffect(() => {
    if (form === "signup") {
      setAuthMode("signup");
    } else {
      setAuthMode("login");
    }
  }, [form]);

  // Login form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Additional signup form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (user && !loading) {
      router.push("/profile");
    }
  }, [user, loading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);

    try {
      // Mock login for demo purposes
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Login Success",
        description: "Welcome back!",
        variant: "default",
      });
      // In a real app, you would use supabase.auth.signInWithPassword
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
      // Mock signup for demo purposes
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: t("signup.success.title"),
        description: t("signup.success.description"),
      });

      // Switch to login tab
      setAuthMode("login");
      // In a real app, you would use supabase.auth.signUp
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

  // If already authenticated
  if (user) {
    router.push("/profile");
    return null;
  }

  // If still loading auth state, show minimal loading indicator
  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <Tabs
        defaultValue={authMode}
        value={authMode}
        onValueChange={(value) => setAuthMode(value as "login" | "signup")}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="login">{t("login.tabLabel") || "Login"}</TabsTrigger>
          <TabsTrigger value="signup">{t("signup.tabLabel") || "Sign Up"}</TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <Card className="border shadow-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center font-bold">
                {t("login.title") || "Sign In"}
              </CardTitle>
              <CardDescription className="text-center">
                {t("login.description") || "Enter your credentials to sign in to your account"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t("login.email") || "Email"}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder={t("login.emailPlaceholder") || "name@example.com"}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">{t("login.password") || "Password"}</Label>
                    <Link
                      href="#"
                      className="text-xs text-primary hover:underline"
                    >
                      {t("login.forgotPassword") || "Forgot Password?"}
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder={t("login.passwordPlaceholder") || "••••••••"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={authLoading}>
                  {authLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("login.loading") || "Signing in..."}
                    </>
                  ) : (
                    <>
                      {t("login.button") || "Sign In"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="signup">
          <Card className="border shadow-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center font-bold">
                {t("signup.title") || "Create Account"}
              </CardTitle>
              <CardDescription className="text-center">
                {t("signup.description") || "Enter your information to create an account"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">{t("signup.firstName") || "First Name"}</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="firstName"
                        placeholder={t("signup.firstNamePlaceholder") || "John"}
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">{t("signup.lastName") || "Last Name"}</Label>
                    <Input
                      id="lastName"
                      placeholder={t("signup.lastNamePlaceholder") || "Doe"}
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">{t("signup.email") || "Email"}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder={t("signup.emailPlaceholder") || "name@example.com"}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">
                    {t("signup.password") || "Password"}
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder={t("signup.passwordPlaceholder") || "••••••••"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={authLoading}>
                  {authLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("signup.loading") || "Creating account..."}
                    </>
                  ) : (
                    <>
                      {t("signup.button") || "Create Account"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

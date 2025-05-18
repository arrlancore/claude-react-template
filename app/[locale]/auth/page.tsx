import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import MainLayout from "@/components/layout/main-layout";
import { AuthForm } from "./client";
import { i18nConfig, appUrl, brandName } from "@/config";
import { getMessages } from "@/lib/i18n";

interface Props {
  params: { locale: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  // Validate locale
  if (!i18nConfig.locales.includes(locale)) {
    notFound();
  }

  const messages = await getMessages(locale);
  const authMessages = messages.auth || {};

  return {
    title: "Authentication",
    description: "Sign in or create a new account",
    openGraph: {
      title: "Authentication - " + brandName,
      description: "Sign in or create a new account",
      url: `${appUrl}/${locale}/auth`,
      siteName: brandName,
      locale: locale,
      type: "website",
    },
  };
}

export default function AuthPage({ params, searchParams }: Props) {
  // Validate locale
  if (!i18nConfig.locales.includes(params.locale)) {
    notFound();
  }

  return (
    <MainLayout fullWidth>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-16rem)] py-12">
        <AuthForm />
      </div>
    </MainLayout>
  );
}

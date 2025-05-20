import { Metadata } from "next";
import { appDescription, appUrl, appSlogan, appLocale } from "@/config";
import { generateMetadata as baseGenerateMetadata } from "@/lib/metadata";
import { getMessages } from "@/lib/i18n";
import { i18nConfig } from "@/config";
import { notFound } from "next/navigation";
import ClientLandingPage from "./landing-client";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  // Validate locale
  if (!i18nConfig.locales.includes(locale)) {
    notFound();
  }

  // Get localized messages
  const messages = await getMessages(locale);

  // Use the appTitle and appDescription from config
  return baseGenerateMetadata(
    appSlogan,
    appDescription,
    "", // Path is empty for the homepage
    locale,
    "website",
    `${appUrl}/og-image.jpg`
  );
}

export default async function LandingPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  // Validate locale
  if (!i18nConfig.locales.includes(locale)) {
    notFound();
  }

  // Get messages for the current locale
  const messages = await getMessages(locale);

  return <ClientLandingPage />;
}

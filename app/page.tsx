import { redirect } from "next/navigation";
import { i18nConfig, appDescription, appUrl, appSlogan } from "@/config";
import { Metadata } from "next";
import { generateMetadata as baseGenerateMetadata } from "@/lib/metadata";

// Generate metadata for the root page
export const metadata: Metadata = {
  ...baseGenerateMetadata(
    appSlogan,
    appDescription,
    "", // Empty path for homepage
    i18nConfig.defaultLocale,
    "website",
    `${appUrl}/og-image.jpg`
  ),
  // Make sure robots can index this page
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// This is the root page which will redirect to the default locale
export default function RootPage() {
  const { defaultLocale } = i18nConfig;
  redirect(`/${defaultLocale}`);
}

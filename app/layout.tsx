import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { SafeToaster } from "@/components/ui/safe-toaster";
import { NavigationEvents } from "@/components/navigation-events";
import { OrganizationJsonLd, WebsiteJsonLd } from "@/components/json-ld";
import { generateAlternatesMetadata } from "@/lib/metadata";
import localFont from "next/font/local";
import "./globals.css";
import {
  appTitle,
  appDescription,
  appUrl,
  brandName,
  defaultAuthor,
  appLocale,
  i18nConfig,
} from "@/config";

// Generate metadata for the root layout
export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: appTitle,
    template: `%s | ${brandName}`,
  },
  description: appDescription,
  authors: [{ name: defaultAuthor }],
  creator: defaultAuthor,
  // Generate canonical and hreflang tags
  alternates: {
    ...generateAlternatesMetadata({
      currentLocale: i18nConfig.defaultLocale,
      pathWithoutLocale: "",
    }),
  },
  openGraph: {
    type: "website",
    locale: appLocale,
    url: appUrl,
    title: appTitle,
    description: appDescription,
    siteName: brandName,
    images: [
      {
        url: `${appUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: appTitle,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: appTitle,
    description: appDescription,
    images: [`${appUrl}/og-image.jpg`],
  },
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

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Add structured data for the website and organization */}
        <OrganizationJsonLd />
        <WebsiteJsonLd />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <SafeToaster />
          <NavigationEvents />
        </ThemeProvider>
      </body>
    </html>
  );
}

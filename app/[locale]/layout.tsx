import { notFound } from "next/navigation";
import { getMessages } from "@/lib/i18n";
import { i18nConfig, appUrl } from "@/config";
import { I18nProvider } from "@/components/i18n-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { SafeToaster } from "@/components/ui/safe-toaster";
import { NavigationEvents } from "@/components/navigation-events";
import { OrganizationJsonLd, WebsiteJsonLd } from "@/components/json-ld";
import { generateAlternatesMetadata } from "@/lib/metadata";
import { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export function generateStaticParams() {
  return i18nConfig.locales.map((locale) => ({ locale }));
}

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

// Generate metadata for localized pages
export async function generateMetadata({
  params: { locale }
}: { params: { locale: string } }): Promise<Metadata> {
  // Validate locale
  if (!i18nConfig.locales.includes(locale)) {
    return {};
  }

  // Generate alternates for canonical and hreflang
  const { canonical, languages } = generateAlternatesMetadata({
    currentLocale: locale,
    pathWithoutLocale: ""
  });

  return {
    alternates: {
      canonical,
      languages
    }
  };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: Props) {
  // Validate locale
  if (!i18nConfig.locales.includes(locale)) {
    notFound();
  }

  // Get messages for the selected locale
  const messages = await getMessages(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
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
          <AuthProvider>
            <I18nProvider locale={locale} messages={messages}>
              {children}
              <SafeToaster />
              <NavigationEvents />
            </I18nProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

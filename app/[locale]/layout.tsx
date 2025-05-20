import { notFound } from "next/navigation";
import { getMessages } from "@/lib/i18n";
import { i18nConfig, appUrl } from "@/config";
import { I18nProvider } from "@/components/i18n-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import { generateAlternatesMetadata } from "@/lib/metadata";
import { Metadata } from "next";

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
    <AuthProvider>
      <I18nProvider locale={locale} messages={messages}>
        {children}
      </I18nProvider>
    </AuthProvider>
  );
}

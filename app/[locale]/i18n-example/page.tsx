import { notFound } from "next/navigation";
import { i18nConfig } from "@/config";
import { Metadata } from "next";
import { getMessages } from "@/lib/i18n";
import MainLayout from "@/components/layout/main-layout";
import DateTimeExample from "@/components/examples/DateTimeExample";

interface Props {
  params: { locale: string };
}

export async function generateMetadata({
  params: { locale },
}: Props): Promise<Metadata> {
  // Validate locale
  if (!i18nConfig.locales.includes(locale)) {
    notFound();
  }

  const messages = await getMessages(locale);

  return {
    title: "Internationalization Example",
    description: "Example page demonstrating internationalization features with timezone support",
  };
}

export default async function I18nExamplePage({ params }: Props) {
  // Validate locale
  if (!i18nConfig.locales.includes(params.locale)) {
    notFound();
  }

  return (
    <MainLayout>
      <div className="container py-8">
        <DateTimeExample />
      </div>
    </MainLayout>
  );
}

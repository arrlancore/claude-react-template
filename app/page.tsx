import { i18nConfig } from "@/config";
import RootLayout from "./[locale]/layout";
import HomePage from "./[locale]/page";
import { getMessages } from "@/lib/i18n";

// This is the root page which will render the default locale content
export default async function RootPage() {
  const locale = i18nConfig.defaultLocale;
  const messages = await getMessages(locale);

  return (
    <RootLayout params={{ locale }} messages={messages}>
      <HomePage params={{ locale }} />
    </RootLayout>
  );
}

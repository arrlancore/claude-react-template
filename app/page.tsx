import { i18nConfig } from "@/config";
import RootLayout from "./[locale]/layout";
import HomePage from "./[locale]/page";

// This is the root page which will render the default locale content
export default async function RootPage() {
  const locale = i18nConfig.defaultLocale;

  return (
    <RootLayout params={{ locale }}>
      <HomePage />
    </RootLayout>
  );
}

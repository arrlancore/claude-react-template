import { i18nConfig } from "@/config";
import RootLayout from "../[locale]/layout";
import I18nExamplePage from "../[locale]/i18n-example/page";

// This is the root i18n example page which will render the default locale content
export default async function RootI18nExamplePage() {
  const locale = i18nConfig.defaultLocale;

  return (
    <RootLayout params={{ locale }}>
      <I18nExamplePage params={{ locale }} />
    </RootLayout>
  );
}

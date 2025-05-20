import { i18nConfig } from "@/config";
import AuthPage from "../[locale]/auth/page";
import RootLayout from "../[locale]/layout";

// This is the root auth page which will render the default locale content
export default async function RootAuthPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const locale = i18nConfig.defaultLocale;

  return (
    <RootLayout params={{ locale }}>
      <AuthPage params={{ locale }} searchParams={searchParams} />
    </RootLayout>
  );
}

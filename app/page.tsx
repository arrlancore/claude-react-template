import { redirect } from "next/navigation";
import { i18nConfig } from "@/config";

// This is the root page which will redirect to the default locale
export default function RootPage() {
  const { defaultLocale } = i18nConfig;
  redirect(`/${defaultLocale}`);
}

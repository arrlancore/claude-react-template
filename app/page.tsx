import { redirect } from 'next/navigation';
import { i18nConfig } from '@/config';

// This page redirects to the default locale
export default function RootPage() {
  redirect(`/${i18nConfig.defaultLocale}`);
}

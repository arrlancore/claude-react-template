import { i18nConfig } from '@/config';

export async function getMessages(locale: string) {
  try {
    return (await import(`@/messages/${locale}.json`)).default;
  } catch (error) {
    // If the requested locale is not found, fallback to default locale
    return (await import(`@/messages/${i18nConfig.defaultLocale}.json`)).default;
  }
}

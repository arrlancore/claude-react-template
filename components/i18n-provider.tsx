'use client';

import { NextIntlClientProvider } from 'next-intl';
import { ReactNode } from 'react';
import nextIntlConfig from '@/next-intl.config';

export function I18nProvider({
  locale,
  messages,
  children,
}: {
  locale: string;
  messages: any;
  children: ReactNode;
}) {
  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
      timeZone={nextIntlConfig.timeZone || 'UTC'} // Ensure we always have a timezone
      formats={nextIntlConfig.formats}
      // Optional: You can provide a now date to ensure consistent rendering
      now={new Date()}
      onError={(error) => {
        // Log internationalization errors in development
        if (process.env.NODE_ENV !== 'production') {
          console.error('[i18n error]:', error);
        }
      }}
    >
      {children}
    </NextIntlClientProvider>
  );
}

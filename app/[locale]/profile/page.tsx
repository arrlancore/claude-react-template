import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import MainLayout from '@/components/layout/main-layout';
import { ProfileClient } from './client';
import { i18nConfig } from '@/config';

interface Props {
  params: { locale: string };
}

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  if (!i18nConfig.locales.includes(locale)) {
    notFound();
  }

  return {
    title: 'Profile - DSA Pattern Master',
    description: 'Manage your account settings and preferences',
  };
}

export default function ProfilePage({ params }: Props) {
  if (!i18nConfig.locales.includes(params.locale)) {
    notFound();
  }

  return (
    <MainLayout>
      <ProfileClient />
    </MainLayout>
  );
}

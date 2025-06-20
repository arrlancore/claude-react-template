# DSA Pattern Master

**Master Data Structures and Algorithms through AI-powered pattern learning**

DSA Pattern Master is an innovative platform that teaches you to master the 8 essential algorithm patterns that unlock 90% of coding interviews. Using a personal AI Socratic mentor, you'll learn to think algorithmically rather than memorize solutions.

## 🎯 Key Features

- **AI-Powered Socratic Learning**: Your personal mentor that asks the right questions to build deep understanding
- **Pattern-First Approach**: Master 8 core patterns instead of grinding hundreds of problems
- **Adaptive Curriculum**: AI adjusts to your learning pace and style in real-time
- **Interview Simulation**: Practice with real questions from Google, Meta, Microsoft, and Amazon
- **Progress Tracking**: Detailed analytics and mastery scores for each pattern

## 🚀 Technology Stack

Built with modern technologies for optimal performance:

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** + **Shadcn/ui** for beautiful, consistent UI
- **Supabase** for authentication and data storage
- **Google AI (Gemini)** for intelligent tutoring
- **MDX** for rich content and interactive components
- **Next-intl** for internationalization support

## 🏗️ Project Structure

```
dsa-pattern-master/
├── app/                    # Next.js App Router pages
├── components/             # Reusable UI components
├── lib/                   # Utility functions and configurations
├── patterns/              # DSA pattern configurations and content
├── public/                # Static assets
└── content/               # Blog and educational content
```

## Getting Started

### Database Setup (Required)

Before running the application, you need to set up the database:

```bash
# For local development
./supabase/setup/local-setup.sh

# For production deployment
export SUPABASE_PROJECT_REF="your-project-ref"
./supabase/setup/remote-setup.sh
```

See the [Supabase Setup Guide](./supabase/README.md) for detailed instructions.

### Development Server

After setting up the database, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/[locale]/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Style Guide

This project includes a comprehensive style guide that showcases all UI components, typography, colors, and design patterns. The style guide is only accessible in development mode.

To access the style guide:

1. Run the development server
2. Navigate to [http://localhost:3000/styleguide](http://localhost:3000/styleguide)
3. You can also click the "Style Guide" link in the main navigation (only visible in development mode)

The style guide serves as:
- A visual reference for all UI components
- A design system documentation
- A tool to ensure UI consistency

## Navigation Progress Indicator

This project includes a navigation progress indicator that appears at the top of the page during navigation between routes. This provides visual feedback to users that the page is loading, even when the navigation happens quickly.

Key features:
- Slim, animated progress bar that appears at the top of the screen during navigation
- Automatically detects navigation events including link clicks and browser back/forward actions
- Provides visual feedback even for very quick navigations with minimum display time
- Smooth transition effects when appearing and disappearing
- Uses a shared context to manage navigation state across components

The implementation uses:
- React Context API for state management
- Tailwind CSS for styling and animations
- Custom hooks for detecting navigation events in Next.js App Router

Note: We've deliberately disabled the default Next.js loading UI (in `app/loading.tsx`) since the progress bar provides a less intrusive loading indication.

## Internationalization (i18n)

This project is set up with internationalization support using [next-intl](https://next-intl-docs.vercel.app/). The current setup includes:

- Localized routing with the `/[locale]/` parameter
- Translation files in the `messages/` directory
- English (en) as the default language

### Adding a new language

1. Update the `i18nConfig` in `config.ts` to include your new locale:

```typescript
export const i18nConfig = {
  defaultLocale: "en",
  locales: ["en", "es"],  // Add new locales here
  localeNames: {
    en: "English",
    es: "Español",       // Add the locale's display name
  },
}
```

2. Run the script to create a new language file:

```bash
npm run i18n:create
```

3. Edit the generated language file in the `messages/` directory to add your translations.

### Using translations

In client components:

```tsx
'use client';
import { useTranslations } from 'next-intl';

export default function MyComponent() {
  const t = useTranslations('namespace');

  return <h1>{t('title')}</h1>;
}
```

In server components:

```tsx
import { getTranslations } from 'next-intl/server';

export default async function MyServerComponent() {
  const t = await getTranslations('namespace');

  return <h1>{t('title')}</h1>;
}
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

# Components can be added using the CLI (example)
```bash
npx shadcn@latest add <component-name>
```

## Newsletter Subscription

This template includes a newsletter subscription feature powered by Brevo (formerly Sendinblue). To set it up:

1. Create a Brevo account and obtain your API key
2. Create a contact list and note the List ID
3. Add the following to your `.env.local` file:
   ```
   BREVO_API_KEY=your_brevo_api_key_here
   BREVO_LIST_ID=your_list_id_here
   ```

The newsletter subscription form will automatically be enabled when these variables are present. For more details, see the [Newsletter documentation](./docs/newsletter.md).

## Production Deployment

### Prerequisites
Before deploying your Next.js app, you must set up the production database:

1. **Set up Supabase Database**:
   ```bash
   export SUPABASE_PROJECT_REF="your-project-ref"
   ./supabase/setup/remote-setup.sh
   ```

2. **Configure Environment Variables**: Use the output from the setup script to configure your deployment platform with the required environment variables.

### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

**Important**: Make sure to set up your Supabase database first using the remote-setup script, then add all the environment variables to your Vercel project settings.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

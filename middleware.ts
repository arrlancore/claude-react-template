import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createIntlMiddleware from "next-intl/middleware";
import nextIntlConfig from "./next-intl.config";

// Create the internationalization middleware
const intlMiddleware = createIntlMiddleware({
  locales: nextIntlConfig.locales,
  defaultLocale: nextIntlConfig.defaultLocale,
  localePrefix: "as-needed",
});

export async function middleware(request: NextRequest) {
  // Handle internationalization first
  const intlResponse = intlMiddleware(request);

  // Create a Supabase client configured to use cookies
  const response = intlResponse || NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res: response });

  // Refresh session if expired - required for Server Components
  await supabase.auth.getSession();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/profile', '/learn', '/patterns'];

  // Auth routes that should redirect if already logged in
  const authRoutes = ['/auth'];

  const pathname = request.nextUrl.pathname;

  // Remove locale prefix to check the actual path
  const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '') || '/';

  // Redirect authenticated users away from auth pages
  if (user && authRoutes.some(route => pathWithoutLocale.startsWith(route))) {
    const redirectUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect unauthenticated users to auth page for protected routes
  if (!user && protectedRoutes.some(route => pathWithoutLocale.startsWith(route))) {
    const redirectUrl = new URL('/auth', request.url);
    redirectUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: [
    // Match all pathnames except for:
    // - api (API routes)
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    // - public files (public folder)
    // - auth/callback (OAuth callback route)
    // - auth/callback-client (Client-side OAuth callback)
    '/((?!api|_next/static|_next/image|favicon.ico|auth/callback|.*\\..*).*)',
    '/',
  ]
};

import createMiddleware from "next-intl/middleware";
import nextIntlConfig from "./next-intl.config";

export default createMiddleware({
  // A list of all locales that are supported
  locales: nextIntlConfig.locales,

  // If this locale is matched, pathname will not be modified
  defaultLocale: nextIntlConfig.defaultLocale,

  // This instructs next-intl to not add the locale prefix for the default locale
  localePrefix: "as-needed",
});

export const config = {
  // Match only internationalized pathnames
  matcher: ["/((?!api|_next|.*\\..*).*)", "/"],
};

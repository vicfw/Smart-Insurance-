import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "./lib/i18n";

export default createMiddleware({
  // A list of all locales that are supported
  locales: locales as unknown as string[],

  // Used when no locale matches
  defaultLocale,

  // This is the default: locales are represented as separate URL paths
  localePrefix: "as-needed",
});

export const config = {
  // Match all pathnames except for
  // - files with extensions (e.g. static files)
  // - api routes
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};

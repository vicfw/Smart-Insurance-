import { createSharedPathnamesNavigation } from "next-intl/navigation";

export const locales = ["en", "de"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export function getLocaleFromString(locale: string): Locale {
  if (locales.includes(locale as Locale)) {
    return locale as Locale;
  }
  return defaultLocale;
}

// For client components
export function getClientMessages(locale: Locale = defaultLocale) {
  try {
    // Using dynamic import for client-side
    return import(`./locales/${locale}.json`).then((module) => module.default);
  } catch (error) {
    console.error("Failed to load messages:", error);
    // Fallback to English if there's an error
    return import("./locales/en.json").then((module) => module.default);
  }
}

export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation({ locales });

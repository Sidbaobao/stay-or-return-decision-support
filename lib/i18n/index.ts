import { en } from "@/lib/i18n/en";
import { zh } from "@/lib/i18n/zh";

// Two languages, one site. The preference lives in localStorage like the
// rest of the app's state; nothing about it reaches a server. English is
// what the static HTML carries; the provider switches after hydration, and
// the boot script in the root layout keeps a Chinese reader from seeing an
// English flash in between.

export type Locale = "en" | "zh";

export const LOCALES: Locale[] = ["en", "zh"];

export type Dictionary = typeof en;

export const dictionaries: Record<Locale, Dictionary> = { en, zh };

export function isLocale(value: unknown): value is Locale {
  return value === "en" || value === "zh";
}

// Any Chinese browser language (zh-CN, zh-Hans, zh-TW, zh-HK) starts in
// the Simplified UI: it is the only Chinese the site has, and this audience
// reads it. The root layout's boot script uses the same pattern.
export const CHINESE_LANGUAGE_PATTERN = /^zh/i;

// First visit only: a Chinese browser gets Chinese until the reader chooses.
export function detectLocale(): Locale {
  if (typeof navigator === "undefined") {
    return "en";
  }

  return CHINESE_LANGUAGE_PATTERN.test(navigator.language) ? "zh" : "en";
}

export function getLanguageTag(locale: Locale) {
  return locale === "zh" ? "zh-CN" : "en";
}

export function formatDate(locale: Locale, isoDate: string) {
  const parsed = new Date(isoDate);

  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat(dictionaries[locale].tag, {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(parsed);
}

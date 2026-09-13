// The reader's language. A preference, not personal data: "Erase
// everything" leaves it alone, and the export does not include it.

import { isLocale, Locale } from "@/lib/i18n";
import { readJson, STORAGE_KEYS, writeJson } from "@/lib/storage/local-store";

export function loadLocale(): Locale | null {
  return readJson(STORAGE_KEYS.locale, (value) => (isLocale(value) ? value : null));
}

export function saveLocale(locale: Locale) {
  writeJson(STORAGE_KEYS.locale, locale);
}

"use client";

import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { detectLocale, dictionaries, Dictionary, getLanguageTag, Locale } from "@/lib/i18n";
import { loadLocale, saveLocale, STORAGE_KEYS, subscribeToStorageKey } from "@/lib/storage";

type LocaleContextValue = {
  locale: Locale;
  t: Dictionary;
  setLocale: (locale: Locale) => void;
  // False until the stored preference has been read on the client.
  isResolved: boolean;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [isResolved, setIsResolved] = useState(false);

  useEffect(() => {
    const adopt = () => setLocaleState(loadLocale() ?? detectLocale());

    adopt();
    setIsResolved(true);

    // Switching in one tab switches every tab.
    return subscribeToStorageKey(STORAGE_KEYS.locale, adopt);
  }, []);

  useEffect(() => {
    if (!isResolved) {
      return;
    }

    const root = document.documentElement;

    root.lang = getLanguageTag(locale);
    root.dataset.locale = locale;
    // Lifts the boot script's veil (see globals.css) now that the page is
    // rendered in the reader's language.
    root.dataset.hydrated = "true";
  }, [locale, isResolved]);

  const setLocale = useCallback((next: Locale) => {
    saveLocale(next);
    setLocaleState(next);
  }, []);

  const value = useMemo<LocaleContextValue>(
    () => ({ locale, t: dictionaries[locale], setLocale, isResolved }),
    [locale, setLocale, isResolved]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);

  if (!context) {
    throw new Error("useLocale must be used inside LocaleProvider");
  }

  return context;
}

// The static metadata carries the English title; this follows the reader's
// language once known. Pass null for the home page (brand only).
export function useLocalizedTitle(title: string | null) {
  const { t, isResolved } = useLocale();

  useEffect(() => {
    if (!isResolved) {
      return;
    }

    const localized = title ? `${title} · ${t.brand}` : t.brand;
    const apply = () => {
      if (document.title !== localized) {
        document.title = localized;
      }
    };

    apply();

    // Next.js writes its own (English) <title> again once its metadata
    // boundary hydrates, on every client-side navigation, and when a
    // segment's error page renders (that one lands in the body, not the
    // head). Watch the whole document, react only to changes that touch a
    // <title>, and put the reader's language back.
    const isTitle = (node: Node | null) =>
      node !== null && (node.nodeType === Node.TEXT_NODE ? node.parentElement : (node as Element))?.tagName === "TITLE";
    const observer = new MutationObserver((records) => {
      const touchesTitle = records.some(
        (record) => isTitle(record.target) || Array.from(record.addedNodes).some(isTitle)
      );

      if (touchesTitle) {
        apply();
      }
    });

    observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true });

    return () => observer.disconnect();
  }, [title, t, isResolved]);
}

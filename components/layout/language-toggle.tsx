"use client";

import { Fragment } from "react";
import { getLanguageTag, LOCALES } from "@/lib/i18n";
import { useLocale } from "@/lib/i18n/provider";

type LanguageToggleProps = {
  variant?: "light" | "default";
};

// Two words with a dot between them; the current one is simply darker.
export function LanguageToggle({ variant = "default" }: LanguageToggleProps) {
  const { locale, setLocale, t } = useLocale();
  const isLight = variant === "light";

  return (
    <div role="group" aria-label={t.languageToggle.label} className="flex items-center gap-1 text-sm">
      {LOCALES.map((option, index) => {
        const isCurrent = option === locale;
        const toneClassName = isLight
          ? isCurrent
            ? "font-medium text-surface-strong"
            : "text-surface-strong/60 hover:text-surface-strong"
          : isCurrent
            ? "font-medium text-ink"
            : "text-ink/60 hover:text-ink";

        return (
          <Fragment key={option}>
            {index > 0 ? (
              <span aria-hidden="true" className={isLight ? "text-surface-strong/30" : "text-ink/30"}>
                ·
              </span>
            ) : null}
            <button
              type="button"
              lang={getLanguageTag(option)}
              aria-pressed={isCurrent}
              onClick={() => setLocale(option)}
              className={`interaction-quiet rounded-control px-1 py-1 ${toneClassName}`}
            >
              {t.languageToggle[option]}
            </button>
          </Fragment>
        );
      })}
    </div>
  );
}

"use client";

import { useLocale, useLocalizedTitle } from "@/lib/i18n/provider";
import { Band } from "@/components/ui/band";
import { PrimaryButtonLink } from "@/components/ui/primary-button";
import { SecondaryButtonLink } from "@/components/ui/secondary-button";

// Reached only when the middleware could not make sense of the path either.
// The number is the page's one big thing; the two useful pages sit beside it.
export default function NotFound() {
  const { t } = useLocale();

  useLocalizedTitle(t.notFound.title);

  return (
    <Band as="div" className="flex min-h-[70svh] items-center">
      <div className="grid gap-8 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-center lg:gap-16">
        <p aria-hidden="true" className="num text-hero-number text-gradient-stay">
          404
        </p>
        <div>
          <h1 className="text-display text-ink">{t.notFound.title}</h1>
          <p className="mt-5 text-body-lg text-ink/65">{t.notFound.body}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <PrimaryButtonLink href="/">{t.notFound.home}</PrimaryButtonLink>
            <SecondaryButtonLink href="/questionnaire">{t.notFound.start}</SecondaryButtonLink>
          </div>
        </div>
      </div>
    </Band>
  );
}

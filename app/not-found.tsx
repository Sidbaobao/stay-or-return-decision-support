"use client";

import { useLocale, useLocalizedTitle } from "@/lib/i18n/provider";
import { PrimaryButtonLink } from "@/components/ui/primary-button";
import { SecondaryButtonLink } from "@/components/ui/secondary-button";

// Reached only when the middleware could not make sense of the path either.
// Speaks the reader's language and puts the two useful pages one tap away.
export default function NotFound() {
  const { t } = useLocale();

  useLocalizedTitle(t.notFound.title);

  return (
    <section className="mx-auto py-16 text-center sm:py-24">
      <p className="text-eyebrow text-ink-accent">404</p>
      <h1 className="mt-3 font-serif text-page-title text-ink">{t.notFound.title}</h1>
      <p className="mt-3 text-body text-ink/70">{t.notFound.body}</p>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <PrimaryButtonLink href="/">{t.notFound.home}</PrimaryButtonLink>
        <SecondaryButtonLink href="/questionnaire">{t.notFound.start}</SecondaryButtonLink>
      </div>
    </section>
  );
}

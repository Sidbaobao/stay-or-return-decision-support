"use client";

import { useEffect } from "react";
import { useLocale, useLocalizedTitle } from "@/lib/i18n/provider";
import { Band } from "@/components/ui/band";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButtonLink } from "@/components/ui/secondary-button";

type ErrorPageProps = {
  error: Error & { digest?: string };
};

// Shown inside the shell when a page throws, in the reader's language.
// Reloading fetches the current build, which also cures a page whose
// scripts belonged to an earlier deployment. The message is shown under a
// fold so a screenshot says what happened.
export default function ErrorPage({ error }: ErrorPageProps) {
  const { t } = useLocale();

  useLocalizedTitle(t.appError.title);

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Band as="div" className="flex min-h-[70svh] items-center">
      <div>
        <h1 className="text-display text-ink">{t.appError.title}</h1>
        <div className="mt-5 space-y-1 text-body-lg text-ink/65">
          {t.appError.body.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        <div className="mt-9 flex flex-wrap gap-3">
          <PrimaryButton type="button" onClick={() => window.location.reload()}>
            {t.appError.reload}
          </PrimaryButton>
          <SecondaryButtonLink href="/">{t.appError.home}</SecondaryButtonLink>
        </div>
        <details className="mt-10 text-label text-ink/60">
          <summary className="cursor-pointer">{t.appError.details}</summary>
          <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-words rounded-control bg-surface-raised p-3 text-left font-mono">
            {error.name}: {error.message}
            {error.digest ? `\n${error.digest}` : ""}
          </pre>
        </details>
      </div>
    </Band>
  );
}

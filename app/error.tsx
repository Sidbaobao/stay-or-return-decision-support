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
// scripts belonged to an earlier deployment. The message is shown so a
// screenshot says what happened.
export default function ErrorPage({ error }: ErrorPageProps) {
  const { t } = useLocale();

  useLocalizedTitle(t.appError.title);

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Band as="div">
    <section className="mx-auto py-8 text-center sm:py-16">
      <h1 className="font-serif text-page-title text-ink">{t.appError.title}</h1>
      <p className="mt-3 text-body text-ink/70">{t.appError.body}</p>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <PrimaryButton type="button" onClick={() => window.location.reload()}>
          {t.appError.reload}
        </PrimaryButton>
        <SecondaryButtonLink href="/">{t.appError.home}</SecondaryButtonLink>
      </div>
      <details className="mx-auto mt-10 text-label text-ink/60">
        <summary className="cursor-pointer">{t.appError.details}</summary>
        <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-words rounded-control bg-surface-strong/60 p-3 text-left font-mono">
          {error.name}: {error.message}
          {error.digest ? `\n${error.digest}` : ""}
        </pre>
      </details>
    </section>
    </Band>
  );
}

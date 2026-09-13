"use client";

import { useEffect, useMemo, useState } from "react";
import { Link2 } from "lucide-react";
import { scoreDecision } from "@/lib/scoring";
import { decodeSharePayload, DecodedShare } from "@/lib/share";
import { useRevealOnReady } from "@/lib/run-state";
import { useLocale, useLocalizedTitle } from "@/lib/i18n/provider";
import { DecisionBalance } from "@/components/results/decision-balance";
import { DimensionLeanRows } from "@/components/results/dimension-lean-rows";
import { PrimaryButtonLink } from "@/components/ui/primary-button";

// Read-only view of a shared run. Everything on this page is decoded from the
// URL fragment (which browsers never send to any server) and recomputed
// locally. It reads and writes nothing about the visitor's own run.

function ErrorCard({ title, body, cta }: { title: string; body: string; cta: string }) {
  return (
    <section className="mx-auto py-16 text-center">
      <p className="font-serif text-card-title text-ink">{title}</p>
      <p className="mx-auto mt-2 text-body-sm text-ink/65">{body}</p>
      <div className="mt-6 flex justify-center">
        <PrimaryButtonLink href="/">{cta}</PrimaryButtonLink>
      </div>
    </section>
  );
}

export default function SharedResultPage() {
  const { t } = useLocale();
  useLocalizedTitle(t.titles.shared);
  const [decoded, setDecoded] = useState<DecodedShare | null>(null);

  useEffect(() => {
    const readFragment = () => {
      const payload = window.location.hash.replace(/^#/, "");
      setDecoded(payload ? decodeSharePayload(payload) : { status: "invalid" });
    };

    readFragment();
    // Hash-only navigation (e.g. following a corrected link from an error
    // state) doesn't remount the page, so re-decode on hash changes too.
    window.addEventListener("hashchange", readFragment);

    return () => window.removeEventListener("hashchange", readFragment);
  }, []);

  const sharedResult = useMemo(() => {
    if (!decoded || decoded.status !== "ok") {
      return null;
    }

    return scoreDecision(decoded.answers, decoded.weights);
  }, [decoded]);

  const isRevealed = useRevealOnReady(Boolean(sharedResult));

  if (!decoded) {
    return null;
  }

  if (decoded.status === "version-mismatch") {
    return <ErrorCard title={t.shared.versionTitle} body={t.shared.versionBody} cta={t.shared.explore} />;
  }

  if (decoded.status === "invalid" || !sharedResult) {
    return <ErrorCard title={t.shared.invalidTitle} body={t.shared.invalidBody} cta={t.shared.explore} />;
  }

  const isStayLeading = sharedResult.recommendedScenario === "stay_us";
  const accentColor = isStayLeading ? "rgb(var(--color-path-stay))" : "rgb(var(--color-path-return))";

  return (
    <>
      <p className="flex items-start gap-2 text-body-sm text-ink/65">
        <Link2 aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.8} />
        {t.shared.intro}
      </p>

      <section className="rounded-feature border border-border bg-surface p-6 shadow-soft sm:p-8">
        <p className="text-eyebrow text-ink-accent">{t.shared.eyebrow}</p>

        <h1 className="mt-4 font-serif text-display" style={{ color: accentColor }}>
          {t.shared.headline(
            sharedResult.recommendedScenario,
            sharedResult.confidence,
            sharedResult.weightedTotals.difference
          )}
        </h1>

        <div className="mt-8 max-w-xl">
          <DecisionBalance
            difference={sharedResult.weightedTotals.difference}
            recommendedScenario={sharedResult.recommendedScenario}
            isRevealed={isRevealed}
          />
        </div>
      </section>

      <section className="border-t border-hairline pt-6 sm:pt-8">
        <p className="text-eyebrow text-ink-accent">{t.results.keyDrivers}</p>
        <h2 className="mt-2 font-serif text-section-title text-ink">{t.results.wherePulls}</h2>

        <div className="mt-6">
          <DimensionLeanRows
            contributions={sharedResult.contributions}
            uncertainDimensionIds={sharedResult.uncertainDimensions}
            footnote={t.shared.footnote}
          />
        </div>
      </section>

      <footer className="flex flex-col gap-5 border-t border-hairline pt-6 sm:flex-row sm:items-center sm:justify-between sm:pt-8">
        <div>
          <h2 className="font-serif text-section-title text-ink">{t.shared.cta}</h2>
          <p className="mt-2 text-body-sm text-ink/70">{t.shared.ctaBody}</p>
        </div>
        <div className="shrink-0">
          <PrimaryButtonLink href="/questionnaire">{t.shared.tryIt}</PrimaryButtonLink>
        </div>
      </footer>
    </>
  );
}

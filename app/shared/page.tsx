"use client";

import { useEffect, useMemo, useState } from "react";
import { scoreDecision } from "@/lib/scoring";
import { decodeSharePayload, DecodedShare } from "@/lib/share";
import { useRevealOnReady } from "@/lib/run-state";
import { useContent } from "@/lib/i18n/content";
import { useLocale, useLocalizedTitle } from "@/lib/i18n/provider";
import { strongestReason } from "@/lib/reasons";
import { DecisionBalance } from "@/components/results/decision-balance";
import { DimensionLeanRows } from "@/components/results/dimension-lean-rows";
import { VerdictHeader } from "@/components/results/verdict-header";
import { Band, OffsetGrid } from "@/components/ui/band";
import { PrimaryButtonLink } from "@/components/ui/primary-button";

// Read-only view of a shared run. Everything on this page is decoded from the
// URL fragment (which browsers never send to any server) and recomputed
// locally. It reads and writes nothing about the visitor's own run.

type ErrorCardProps = {
  eyebrow: string;
  title: string;
  body: string[];
  cta: string;
};

// A link that cannot be shown: a large title in the upper part of the
// page, the lines under it, one way out.
function ErrorCard({ eyebrow, title, body, cta }: ErrorCardProps) {
  return (
    <Band as="div" className="flex min-h-[60svh] items-center">
      <div>
        <p className="num text-label text-ink/45">{eyebrow}</p>
        <h1 className="mt-4 text-display text-ink">{title}</h1>
        <div className="mt-5 space-y-1 text-body-lg text-ink/65">
          {body.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        <div className="mt-9">
          <PrimaryButtonLink href="/">{cta}</PrimaryButtonLink>
        </div>
      </div>
    </Band>
  );
}

export default function SharedResultPage() {
  const { t } = useLocale();
  const { questions } = useContent();
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
    return (
      <ErrorCard eyebrow={t.shared.eyebrow} title={t.shared.versionTitle} body={t.shared.versionBody} cta={t.shared.explore} />
    );
  }

  if (decoded.status === "invalid" || !sharedResult) {
    return (
      <ErrorCard eyebrow={t.shared.eyebrow} title={t.shared.invalidTitle} body={t.shared.invalidBody} cta={t.shared.explore} />
    );
  }

  const direction = sharedResult.recommendedScenario;
  const difference = sharedResult.weightedTotals.difference;

  return (
    <>
      <Band>
        <VerdictHeader
          eyebrow={
            <>
              {t.shared.eyebrow} · {t.shared.intro}
            </>
          }
          headline={t.shared.headline(direction, sharedResult.confidence, difference)}
          direction={direction}
          difference={difference}
          confidence={sharedResult.confidence}
          isRevealed={isRevealed}
        />
      </Band>

      <Band tone="white">
        <OffsetGrid
          aside={
            <div className="lg:sticky lg:top-8">
              <p className="num text-label text-ink/45">{t.results.keyDrivers}</p>
              <h2 className="mt-2 text-section-title text-ink">{t.results.wherePulls}</h2>
              <div className="mt-8 max-w-sm">
                <DecisionBalance difference={difference} recommendedScenario={direction} isRevealed={isRevealed} />
              </div>
            </div>
          }
        >
          <DimensionLeanRows
            contributions={sharedResult.contributions}
            uncertainDimensionIds={sharedResult.uncertainDimensions}
            reasonFor={(dimensionId, scenario) => strongestReason(questions, decoded.answers, dimensionId, scenario)}
          />
        </OffsetGrid>
      </Band>

      <Band tone="warm" as="footer">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-10">
          <div className="min-w-0">
            <h2 className="text-section-title text-ink">{t.shared.cta}</h2>
            <p className="mt-2 text-body-sm text-ink/60">{t.shared.ctaBody}</p>
          </div>
          <div className="shrink-0">
            <PrimaryButtonLink href="/questionnaire">{t.shared.tryIt}</PrimaryButtonLink>
          </div>
        </div>
      </Band>
    </>
  );
}

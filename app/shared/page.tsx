"use client";

import { useEffect, useMemo, useState } from "react";
import { scoreDecision } from "@/lib/scoring";
import { decodeSharePayload, DecodedShare } from "@/lib/share";
import { useRevealOnReady } from "@/lib/run-state";
import { useContent } from "@/lib/i18n/content";
import { useLocale, useLocalizedTitle } from "@/lib/i18n/provider";
import { strongestReason } from "@/lib/reasons";
import { DecisionBalance } from "@/components/results/decision-balance";
import { PartTiles } from "@/components/results/part-tiles";
import { SplitBar } from "@/components/results/split-bar";
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

  // The way in for the reader: in the heading column on a wide screen,
  // under the tiles on a phone.
  const invitation = (
    <>
      <p className="text-body font-medium text-ink">{t.shared.cta}</p>
      <p className="mt-1 text-body-sm text-ink/60">{t.shared.ctaBody}</p>
      <div className="mt-5">
        <PrimaryButtonLink href="/questionnaire">{t.shared.tryIt}</PrimaryButtonLink>
      </div>
    </>
  );

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
            <div>
              <h2 className="text-section-title text-ink">{t.results.splitHeading}</h2>
              <div className="mt-6 hidden lg:block">
                <DecisionBalance difference={difference} recommendedScenario={direction} isRevealed={isRevealed} />
              </div>
            </div>
          }
        >
          <SplitBar
            stay={sharedResult.weightedTotals.stay_us}
            goBack={sharedResult.weightedTotals.return_china}
            isRevealed={isRevealed}
          />
          <div className="mt-8 lg:hidden">
            <DecisionBalance difference={difference} recommendedScenario={direction} isRevealed={isRevealed} />
          </div>
        </OffsetGrid>
      </Band>

      <Band>
        <OffsetGrid
          aside={
            <div className="lg:sticky lg:top-8">
              <h2 className="text-section-title text-ink">{t.results.partsHeading}</h2>
              <div className="mt-7 hidden lg:block">{invitation}</div>
            </div>
          }
        >
          <PartTiles
            contributions={sharedResult.contributions}
            normalized={sharedResult.normalizedByDimension}
            uncertainDimensionIds={sharedResult.uncertainDimensions}
            isRevealed={isRevealed}
            reasonFor={(dimensionId, scenario) => strongestReason(questions, decoded.answers, dimensionId, scenario)}
          />
          <div className="mt-10 lg:hidden">{invitation}</div>
        </OffsetGrid>
      </Band>
    </>
  );
}

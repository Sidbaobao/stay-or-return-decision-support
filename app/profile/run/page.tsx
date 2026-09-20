"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { scoreDecision } from "@/lib/scoring";
import { getRunHistoryEntry, QUESTIONS_VERSION } from "@/lib/storage";
import { formatDate } from "@/lib/i18n";
import { useContent } from "@/lib/i18n/content";
import { useLocale, useLocalizedTitle } from "@/lib/i18n/provider";
import { strongestReason } from "@/lib/reasons";
import { PartTiles } from "@/components/results/part-tiles";
import { SplitBar } from "@/components/results/split-bar";
import { VerdictHeader } from "@/components/results/verdict-header";
import { RestoreRunButton } from "@/components/profile/restore-run-button";
import { Band, OffsetGrid } from "@/components/ui/band";
import { QuietLink } from "@/components/ui/quiet-button";
import { HistoryEntry } from "@/types";

function RunSnapshotContent() {
  const searchParams = useSearchParams();
  const snapshotId = searchParams.get("id") ?? "";
  const { t, locale } = useLocale();
  const { questions } = useContent();
  useLocalizedTitle(t.titles.snapshot);
  const [entry, setEntry] = useState<HistoryEntry | null>(null);
  const [isMissing, setIsMissing] = useState(false);

  useEffect(() => {
    const loaded = snapshotId ? getRunHistoryEntry(snapshotId) : null;

    // Both are set every time: navigating from a missing id to a good one used
    // to leave the "not on this device" card showing.
    setEntry(loaded);
    setIsMissing(!loaded);
  }, [snapshotId]);

  const isCurrentVersion = entry?.questionsVersion === QUESTIONS_VERSION;

  // Read-only recomputation from the snapshot's own answers and weights. The
  // current run's storage is never read or written here.
  const snapshotResult = useMemo(() => {
    if (!entry || entry.questionsVersion !== QUESTIONS_VERSION) {
      return null;
    }

    return scoreDecision(entry.answers, entry.weights);
  }, [entry]);

  if (isMissing) {
    return (
      <Band as="div" className="flex min-h-[60svh] items-center">
        <div>
          <p className="num text-label text-ink/45">{t.titles.snapshot}</p>
          <h1 className="mt-4 text-display text-ink">{t.snapshot.missingTitle}</h1>
          <p className="mt-5 text-body-lg text-ink/65">{t.snapshot.missingBody}</p>
          <div className="mt-9">
            <QuietLink href="/profile" tone="primary" className="-mx-2">
              {t.snapshot.backProfile}
            </QuietLink>
          </div>
        </div>
      </Band>
    );
  }

  if (!entry) {
    return null;
  }

  const completedDate = formatDate(locale, entry.completedAt);
  // A snapshot from an older set of questions keeps the direction, the
  // confidence and the gap it showed at the time; nothing else can be shown.
  const direction = snapshotResult ? snapshotResult.recommendedScenario : entry.direction;
  const difference = snapshotResult ? snapshotResult.weightedTotals.difference : entry.difference;
  const confidence = snapshotResult ? snapshotResult.confidence : entry.confidence;
  const headline = snapshotResult
    ? t.results.headline(direction, confidence, difference)
    : t.snapshot.pastHeadline(entry.direction, entry.confidence, entry.difference);

  return (
    <>
      <Band>
        <VerdictHeader
          eyebrow={
            <>
              {t.titles.snapshot} · {t.snapshot.eyebrow(completedDate)}
            </>
          }
          headline={headline}
          direction={direction}
          difference={difference}
          confidence={confidence}
          isRevealed
          aside={isCurrentVersion ? <RestoreRunButton entry={entry} /> : null}
        >
          <div className="space-y-2 text-body-sm text-ink/65">
            <p>{snapshotResult ? t.snapshot.restoreNote : t.snapshot.earlierVersionBody}</p>
            <QuietLink href="/profile" className="-mx-2">
              {t.snapshot.backProfile}
            </QuietLink>
          </div>
        </VerdictHeader>
      </Band>

      {snapshotResult ? (
        <>
          <Band tone="white">
            <OffsetGrid aside={<h2 className="text-section-title text-ink">{t.results.splitHeading}</h2>}>
              <SplitBar
                stay={snapshotResult.weightedTotals.stay_us}
                goBack={snapshotResult.weightedTotals.return_china}
                isRevealed
              />
            </OffsetGrid>
          </Band>

          <Band>
            <OffsetGrid
              aside={
                <div>
                  <h2 className="text-section-title text-ink">{t.results.partsHeading}</h2>
                  <p className="num mt-3 text-label text-ink/45">{t.snapshot.asOf(completedDate)}</p>
                </div>
              }
            >
              <PartTiles
                contributions={snapshotResult.contributions}
                normalized={snapshotResult.normalizedByDimension}
                uncertainDimensionIds={snapshotResult.uncertainDimensions}
                isRevealed
                reasonFor={(dimensionId, scenario) => strongestReason(questions, entry.answers, dimensionId, scenario)}
              />
            </OffsetGrid>
          </Band>
        </>
      ) : null}
    </>
  );
}

export default function RunSnapshotPage() {
  return (
    <Suspense fallback={null}>
      <RunSnapshotContent />
    </Suspense>
  );
}

"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { History } from "lucide-react";
import { scoreDecision } from "@/lib/scoring";
import { getRunHistoryEntry, QUESTIONS_VERSION } from "@/lib/storage";
import { formatDate } from "@/lib/i18n";
import { useLocale, useLocalizedTitle } from "@/lib/i18n/provider";
import { DecisionBalance } from "@/components/results/decision-balance";
import { DimensionLeanRows } from "@/components/results/dimension-lean-rows";
import { MiniBalance } from "@/components/profile/mini-balance";
import { RestoreRunButton } from "@/components/profile/restore-run-button";
import { Band, OffsetGrid } from "@/components/ui/band";
import { QuietLink } from "@/components/ui/quiet-button";
import { HistoryEntry } from "@/types";

function RunSnapshotContent() {
  const searchParams = useSearchParams();
  const snapshotId = searchParams.get("id") ?? "";
  const { t, locale } = useLocale();
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
      <Band as="div">
        <section className="mx-auto py-8 text-center sm:py-16">
          <p className="text-body text-ink/70">{t.snapshot.missingTitle}</p>
          <p className="mt-2 text-body-sm text-ink/60">{t.snapshot.missingBody}</p>
          <div className="mt-5">
            <QuietLink href="/profile" tone="primary">
              {t.snapshot.backProfile}
            </QuietLink>
          </div>
        </section>
      </Band>
    );
  }

  if (!entry) {
    return null;
  }

  const completedDate = formatDate(locale, entry.completedAt);
  const accentColor =
    entry.direction === "stay_us" ? "rgb(var(--color-path-stay))" : "rgb(var(--color-path-return))";

  return (
    <>
      <Band padding="header" as="div">
        <div className="flex flex-wrap items-center justify-between gap-3 text-body-sm text-ink/65">
          <p className="inline-flex items-center gap-2">
            <History aria-hidden="true" className="h-4 w-4 shrink-0" strokeWidth={1.8} />
            {t.snapshot.intro(completedDate)}
          </p>
          <QuietLink href="/profile" className="-mr-2">
            {t.snapshot.backProfile}
          </QuietLink>
        </div>
      </Band>

      <Band padding="none" className="pb-band pt-2">
        <section className="rounded-feature bg-surface p-6 shadow-soft sm:p-8">
          <p className="text-eyebrow text-ink-accent">{t.snapshot.eyebrow(completedDate)}</p>

          {snapshotResult ? (
            <>
              <h1 className="mt-4 font-serif text-display" style={{ color: accentColor }}>
                {t.results.headline(
                  snapshotResult.recommendedScenario,
                  snapshotResult.confidence,
                  snapshotResult.weightedTotals.difference
                )}
              </h1>

              <div className="mt-8 max-w-xl">
                <DecisionBalance
                  difference={snapshotResult.weightedTotals.difference}
                  recommendedScenario={snapshotResult.recommendedScenario}
                  isRevealed
                />
              </div>
            </>
          ) : (
            <>
              <h1 className="mt-4 font-serif text-display" style={{ color: accentColor }}>
                {t.snapshot.pastHeadline(entry.direction, entry.confidence, entry.difference)}
              </h1>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <span className="rounded-pill bg-surface-strong/80 px-3 py-1.5 text-eyebrow text-ink/65">
                  {t.snapshot.confidence(t.results.confidenceLevel[entry.confidence])}
                </span>
                <MiniBalance direction={entry.direction} difference={entry.difference} />
                <span className="text-body-sm text-ink/65">{t.snapshot.gap(entry.difference)}</span>
              </div>
              <p className="mt-5 text-body-sm text-ink/65">{t.snapshot.earlierVersionBody}</p>
            </>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
            <p className="text-label text-ink/65">{t.snapshot.restoreNote}</p>
            {isCurrentVersion ? <RestoreRunButton entry={entry} /> : null}
          </div>
        </section>
      </Band>

      {snapshotResult ? (
        <Band>
          <OffsetGrid
            aside={
              <>
                <p className="text-eyebrow text-ink-accent">{t.snapshot.keyDrivers}</p>
                <h2 className="mt-2 font-serif text-section-title text-ink">{t.snapshot.wherePulled}</h2>
                <p className="mt-3 text-body-sm text-ink/70">{t.snapshot.asOf(completedDate)}</p>
              </>
            }
          >
            <DimensionLeanRows
              contributions={snapshotResult.contributions}
              uncertainDimensionIds={snapshotResult.uncertainDimensions}
            />
          </OffsetGrid>
        </Band>
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

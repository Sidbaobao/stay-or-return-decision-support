"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { History } from "lucide-react";
import { scoreDecision } from "@/lib/scoring";
import { getRunHistoryEntry, QUESTIONS_VERSION } from "@/lib/storage";
import { DecisionBalance } from "@/components/results/decision-balance";
import { DimensionLeanRows } from "@/components/results/dimension-lean-rows";
import { getConclusionHeadline, getPastRunStatement } from "@/components/results/verdict-copy";
import { MiniBalance } from "@/components/profile/mini-balance";
import { RestoreRunButton } from "@/components/profile/restore-run-button";
import { formatFriendlyDate } from "@/components/profile/profile-utils";
import { HistoryEntry } from "@/types";

function RunSnapshotContent() {
  const searchParams = useSearchParams();
  const snapshotId = searchParams.get("id") ?? "";
  const [entry, setEntry] = useState<HistoryEntry | null>(null);
  const [isMissing, setIsMissing] = useState(false);

  useEffect(() => {
    const loaded = snapshotId ? getRunHistoryEntry(snapshotId) : null;

    if (loaded) {
      setEntry(loaded);
    } else {
      setIsMissing(true);
    }
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
      <section className="rounded-feature border border-border bg-surface p-8 text-center shadow-legacy-sm">
        <p className="text-body text-ink/70">This snapshot isn&apos;t on this device anymore.</p>
        <p className="mt-2 text-body-sm text-ink/60">
          It may have been deleted, or saved in a different browser.
        </p>
        <div className="mt-5">
          <Link
            href="/profile"
            className="interaction-quiet rounded-control px-1.5 py-1 text-sm font-medium text-action-primary hover:text-action-primary-hover"
          >
            Back to my profile
          </Link>
        </div>
      </section>
    );
  }

  if (!entry) {
    return null;
  }

  const accentColor =
    entry.direction === "stay_us" ? "rgb(var(--color-path-stay))" : "rgb(var(--color-path-return))";

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-tile border border-border bg-surface px-4 py-3 shadow-legacy-sm">
        <p className="inline-flex items-center gap-2 text-body-sm text-ink/70">
          <History aria-hidden="true" className="h-4 w-4 shrink-0" strokeWidth={1.8} />
          A snapshot saved on this device on {formatFriendlyDate(entry.completedAt)} — viewing it
          doesn&apos;t change your current run.
        </p>
        <Link
          href="/profile"
          className="interaction-quiet rounded-control px-1.5 py-1 text-sm font-medium text-ink/70 hover:text-ink"
        >
          Back to my profile
        </Link>
      </div>

      <section className="rounded-feature border border-border bg-surface p-6 shadow-soft sm:p-8">
        <p className="text-eyebrow text-ink-accent">Snapshot · {formatFriendlyDate(entry.completedAt)}</p>

        {snapshotResult ? (
          <>
            <h1 className="mt-4 max-w-3xl font-serif text-display" style={{ color: accentColor }}>
              {getConclusionHeadline(
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
            <h1 className="mt-4 max-w-3xl font-serif text-display" style={{ color: accentColor }}>
              {getPastRunStatement(entry.direction, entry.confidence, entry.difference)}.
            </h1>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className="rounded-pill border border-memo-badge-border bg-surface-strong/55 px-3 py-1.5 text-eyebrow text-ink/65 capitalize">
                {entry.confidence} confidence
              </span>
              <MiniBalance direction={entry.direction} difference={entry.difference} />
              <span className="text-body-sm text-ink/65">Gap {entry.difference} points</span>
            </div>
            <p className="mt-5 max-w-measure text-body-sm text-ink/65">
              This snapshot was made with an earlier version of the questionnaire, so the full
              dimension breakdown can&apos;t be recomputed. The direction, confidence, and gap above
              are exactly what it showed at the time.
            </p>
          </>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-border pt-5">
          {isCurrentVersion ? <RestoreRunButton entry={entry} /> : null}
          <p className="text-label text-ink/65">
            Restoring makes this snapshot your current run again.
          </p>
        </div>
      </section>

      {snapshotResult ? (
        <section className="rounded-feature border border-border bg-surface p-6 shadow-legacy-sm sm:p-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-eyebrow text-ink-accent">Key drivers</p>
              <h2 className="mt-2 font-serif text-section-title text-ink">
                Where each dimension pulled
              </h2>
            </div>
            <p className="text-body-sm text-ink/70">As of {formatFriendlyDate(entry.completedAt)}.</p>
          </div>

          <div className="mt-6">
            <DimensionLeanRows
              contributions={snapshotResult.contributions}
              uncertainDimensionIds={snapshotResult.uncertainDimensions}
            />
          </div>
        </section>
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

"use client";

import Link from "next/link";
import { useState } from "react";
import { dimensions } from "@/data/dimensions";
import { dimensionIcons } from "@/components/results/dimension-icons";
import { getPastRunStatement } from "@/components/results/verdict-copy";
import { MiniBalance } from "@/components/profile/mini-balance";
import { RestoreRunButton } from "@/components/profile/restore-run-button";
import { formatFriendlyDate } from "@/components/profile/profile-utils";
import { deleteRunHistoryEntry, QUESTIONS_VERSION } from "@/lib/storage";
import { HistoryEntry } from "@/types";
import { PrimaryButtonLink } from "@/components/ui/primary-button";

type HistoryListProps = {
  entries: HistoryEntry[];
  onEntriesChange: (entries: HistoryEntry[]) => void;
};

export function HistoryList({ entries, onEntriesChange }: HistoryListProps) {
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);

  if (entries.length === 0) {
    return (
      <div className="rounded-tile border border-dashed border-hairline-strong bg-surface-strong/50 p-6 text-center">
        <p className="text-body text-ink/70">No decisions saved on this device yet.</p>
        <p className="mt-1 text-body-sm text-ink/60">
          Finish the questionnaire and your result will appear here automatically.
        </p>
        <div className="mt-5 flex justify-center">
          <PrimaryButtonLink href="/questionnaire">Start questionnaire</PrimaryButtonLink>
        </div>
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {entries.map((entry) => {
        const isStay = entry.direction === "stay_us";
        const accent = isStay ? "rgb(var(--color-path-stay))" : "rgb(var(--color-path-return))";
        const statement = getPastRunStatement(entry.direction, entry.confidence, entry.difference);
        const topDimension = entry.topDimensionId
          ? dimensions.find((dimension) => dimension.id === entry.topDimensionId)
          : null;
        const Icon = entry.topDimensionId ? dimensionIcons[entry.topDimensionId] : null;
        const isCurrentVersion = entry.questionsVersion === QUESTIONS_VERSION;
        const isConfirmingDelete = confirmingDeleteId === entry.id;

        return (
          <li
            key={entry.id}
            className="grid gap-3 rounded-tile border border-surface-strong/80 bg-surface-strong/75 p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
          >
            <div className="min-w-0">
              <p className="text-label text-ink/65">{formatFriendlyDate(entry.completedAt)}</p>

              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                <p className="text-body font-medium" style={{ color: accent }}>
                  {statement}
                  <span className="sr-only">, gap {Math.abs(entry.difference)} points</span>
                </p>
                <MiniBalance direction={entry.direction} difference={entry.difference} />
              </div>

              <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                {topDimension && Icon ? (
                  <p className="inline-flex items-center gap-1.5 text-body-sm text-ink/65">
                    <Icon aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={1.8} />
                    Driven by {topDimension.label}
                  </p>
                ) : null}
                {!isCurrentVersion ? (
                  <span className="rounded-pill border border-border bg-surface px-2.5 py-0.5 text-label text-ink/65">
                    Earlier questionnaire version
                  </span>
                ) : null}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-1 gap-y-1 sm:justify-end">
              {isConfirmingDelete ? (
                <span className="inline-flex flex-wrap items-center gap-2">
                  <span className="text-sm text-ink/70">Remove from this device?</span>
                  <button
                    type="button"
                    onClick={() => {
                      onEntriesChange(deleteRunHistoryEntry(entry.id));
                      setConfirmingDeleteId(null);
                    }}
                    className="interaction-quiet rounded-control px-1.5 py-1 text-sm font-medium text-path-return"
                  >
                    Remove
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmingDeleteId(null)}
                    className="interaction-quiet rounded-control px-1.5 py-1 text-sm font-medium text-ink/60 hover:text-ink"
                  >
                    Keep
                  </button>
                </span>
              ) : (
                <>
                  <Link
                    href={`/profile/run?id=${entry.id}`}
                    className="interaction-quiet rounded-control px-1.5 py-1 text-sm font-medium text-ink/70 hover:text-ink"
                  >
                    View
                  </Link>
                  {isCurrentVersion ? <RestoreRunButton entry={entry} /> : null}
                  <button
                    type="button"
                    onClick={() => setConfirmingDeleteId(entry.id)}
                    className="interaction-quiet rounded-control px-1.5 py-1 text-sm font-medium text-ink/60 hover:text-ink"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

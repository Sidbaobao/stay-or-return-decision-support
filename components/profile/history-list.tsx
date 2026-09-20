"use client";

import { useEffect, useRef, useState } from "react";
import { dimensionIcons } from "@/components/results/dimension-icons";
import { MiniBalance } from "@/components/profile/mini-balance";
import { RestoreRunButton } from "@/components/profile/restore-run-button";
import { InlineConfirm, useConfirmFocus } from "@/components/ui/inline-confirm";
import { PrimaryButtonLink } from "@/components/ui/primary-button";
import { QuietButton, QuietLink } from "@/components/ui/quiet-button";
import { deleteRunHistoryEntry, QUESTIONS_VERSION } from "@/lib/storage";
import { formatDate } from "@/lib/i18n";
import { useContent } from "@/lib/i18n/content";
import { useLocale } from "@/lib/i18n/provider";
import { HistoryEntry } from "@/types";

type HistoryListProps = {
  entries: HistoryEntry[];
  onEntriesChange: (entries: HistoryEntry[]) => void;
};

type HistoryRowProps = {
  entry: HistoryEntry;
  index: number;
  onDelete: (id: string, index: number) => void;
};

function HistoryRow({ entry, index, onDelete }: HistoryRowProps) {
  const { t, locale } = useLocale();
  const { dimensionPhrase } = useContent();
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const deleteTriggerRef = useConfirmFocus(isConfirmingDelete);

  const isTie = entry.difference === 0;
  const accent = isTie
    ? "rgb(var(--color-ink) / 0.7)"
    : entry.direction === "stay_us"
      ? "rgb(var(--color-path-stay))"
      : "rgb(var(--color-path-return))";
  const statement = t.history.pastStatement(entry.direction, entry.confidence, entry.difference);
  const Icon = entry.topDimensionId ? dimensionIcons[entry.topDimensionId] : null;
  const isCurrentVersion = entry.questionsVersion === QUESTIONS_VERSION;

  return (
    <li
      className="reveal-row group -mx-3 grid gap-3 rounded-tile px-3 py-3 transition-colors duration-motion-standard ease-interaction hover:bg-surface-raised/60 motion-reduce:transition-none sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div className="min-w-0">
        <p className="num text-label text-ink/55">{formatDate(locale, entry.completedAt)}</p>

        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
          <p className="text-body font-medium" style={{ color: accent }}>
            {statement}
            <span className="sr-only">{t.history.srGap(Math.abs(entry.difference))}</span>
          </p>
          <MiniBalance direction={entry.direction} difference={entry.difference} />
        </div>

        {entry.topDimensionId && Icon ? (
          <p className="mt-1.5 flex flex-wrap items-center gap-x-2 text-body-sm text-ink/65">
            <span className="inline-flex items-center gap-1.5">
              <Icon aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={1.8} />
              {t.history.drivenBy(dimensionPhrase(entry.topDimensionId))}
            </span>
            {!isCurrentVersion ? <span>· {t.history.earlierVersion}</span> : null}
          </p>
        ) : !isCurrentVersion ? (
          <p className="mt-1.5 text-body-sm text-ink/65">{t.history.earlierVersion}</p>
        ) : null}
      </div>

      <div className="row-actions flex flex-wrap items-center gap-x-1 gap-y-1 sm:justify-end">
        {isConfirmingDelete ? (
          <InlineConfirm
            prompt={t.history.removePrompt}
            confirmLabel={t.history.remove}
            onConfirm={() => {
              setIsConfirmingDelete(false);
              onDelete(entry.id, index);
            }}
            onCancel={() => setIsConfirmingDelete(false)}
          />
        ) : (
          <>
            <QuietLink href={`/profile/run?id=${entry.id}`}>{t.history.view}</QuietLink>
            {isCurrentVersion ? <RestoreRunButton entry={entry} /> : null}
            <QuietButton
              ref={deleteTriggerRef}
              data-history-delete=""
              onClick={() => setIsConfirmingDelete(true)}
            >
              {t.history.delete}
            </QuietButton>
          </>
        )}
      </div>
    </li>
  );
}

export function HistoryList({ entries, onEntriesChange }: HistoryListProps) {
  const { t } = useLocale();
  const listRef = useRef<HTMLUListElement>(null);
  const focusAfterDeleteRef = useRef<number | null>(null);

  // A removed row takes its Delete button with it. Focus moves to the row
  // that took its place (or the last one), and to the section heading once
  // the list is empty, instead of dropping to <body>.
  useEffect(() => {
    const index = focusAfterDeleteRef.current;

    if (index === null) {
      return;
    }

    focusAfterDeleteRef.current = null;
    const triggers = listRef.current?.querySelectorAll<HTMLButtonElement>("[data-history-delete]");
    const next = triggers && triggers.length > 0 ? triggers[Math.min(index, triggers.length - 1)] : null;
    (next ?? document.getElementById("history-heading"))?.focus();
  }, [entries]);

  const handleDelete = (id: string, index: number) => {
    focusAfterDeleteRef.current = index;
    onEntriesChange(deleteRunHistoryEntry(id));
  };

  if (entries.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-body text-ink/70">{t.history.emptyTitle}</p>
        <p className="mt-1 text-body-sm text-ink/60">{t.history.emptyBody}</p>
        <div className="mt-5 flex justify-center">
          <PrimaryButtonLink href="/questionnaire">{t.history.start}</PrimaryButtonLink>
        </div>
      </div>
    );
  }

  return (
    <ul ref={listRef} className="space-y-3">
      {entries.map((entry, index) => (
        <HistoryRow key={entry.id} entry={entry} index={index} onDelete={handleDelete} />
      ))}
    </ul>
  );
}

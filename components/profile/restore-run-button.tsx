"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { readRunStatus, restoreSnapshotAsCurrentRun } from "@/lib/run-state";
import { HistoryEntry } from "@/types";

type RestoreRunButtonProps = {
  entry: HistoryEntry;
};

const quietButtonClassName =
  "interaction-quiet rounded-control px-1.5 py-1 text-sm font-medium text-action-primary hover:text-action-primary-hover";

// Restoring replaces the current run with the snapshot. A complete current run
// is saved to history first so nothing is lost; a partially answered one would
// be destroyed, so that case asks before replacing.
export function RestoreRunButton({ entry }: RestoreRunButtonProps) {
  const router = useRouter();
  const [isConfirming, setIsConfirming] = useState(false);
  const [hasFailed, setHasFailed] = useState(false);

  const performRestore = () => {
    if (restoreSnapshotAsCurrentRun(entry.id)) {
      router.push("/results");
      return;
    }

    setIsConfirming(false);
    setHasFailed(true);
  };

  const handleClick = () => {
    const status = readRunStatus();

    if (status.answeredCount > 0 && !status.isComplete) {
      setIsConfirming(true);
      return;
    }

    performRestore();
  };

  if (hasFailed) {
    return (
      <span className="inline-flex flex-wrap items-center gap-2">
        <span aria-live="polite" className="text-sm text-ink/70">
          This snapshot can&apos;t be restored on this device.
        </span>
        <button
          type="button"
          onClick={() => {
            setHasFailed(false);
            handleClick();
          }}
          className={quietButtonClassName}
        >
          Try again
        </button>
      </span>
    );
  }

  if (isConfirming) {
    return (
      <span className="inline-flex flex-wrap items-center gap-2">
        <span className="text-sm text-ink/70">Replace your in-progress run?</span>
        <button type="button" onClick={performRestore} className={quietButtonClassName}>
          Replace
        </button>
        <button
          type="button"
          onClick={() => setIsConfirming(false)}
          className="interaction-quiet rounded-control px-1.5 py-1 text-sm font-medium text-ink/60 hover:text-ink"
        >
          Keep current
        </button>
      </span>
    );
  }

  return (
    <button type="button" onClick={handleClick} className={quietButtonClassName}>
      Restore
    </button>
  );
}

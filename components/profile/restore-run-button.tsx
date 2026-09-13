"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { readRunStatus, restoreSnapshotAsCurrentRun } from "@/lib/run-state";
import { InlineConfirm, useConfirmFocus } from "@/components/ui/inline-confirm";
import { QuietButton } from "@/components/ui/quiet-button";
import { HistoryEntry } from "@/types";

type RestoreRunButtonProps = {
  entry: HistoryEntry;
};

// Restoring replaces the current run with the snapshot. A complete current run
// is saved to history first so nothing is lost; a partially answered one would
// be destroyed, so that case asks before replacing.
export function RestoreRunButton({ entry }: RestoreRunButtonProps) {
  const router = useRouter();
  const [isConfirming, setIsConfirming] = useState(false);
  const [hasFailed, setHasFailed] = useState(false);
  const triggerRef = useConfirmFocus(isConfirming);

  const performRestore = () => {
    setIsConfirming(false);

    if (restoreSnapshotAsCurrentRun(entry.id)) {
      router.push("/results");
      return;
    }

    setHasFailed(true);
  };

  const handleClick = () => {
    setHasFailed(false);
    const status = readRunStatus();

    if (status.answeredCount > 0 && !status.isComplete) {
      setIsConfirming(true);
      return;
    }

    performRestore();
  };

  if (isConfirming) {
    return (
      <InlineConfirm
        prompt="Replace your in-progress run?"
        confirmLabel="Replace"
        cancelLabel="Keep current"
        tone="primary"
        onConfirm={performRestore}
        onCancel={() => setIsConfirming(false)}
      />
    );
  }

  return (
    <span className="inline-flex flex-wrap items-center gap-x-1 gap-y-1">
      <QuietButton ref={triggerRef} tone="primary" onClick={handleClick}>
        {hasFailed ? "Try again" : "Restore"}
      </QuietButton>
      {/* Always mounted: a live region only announces changes to content
          that was already there. */}
      <span aria-live="polite" className="text-sm text-ink/70">
        {hasFailed ? "This snapshot can't be restored here." : ""}
      </span>
    </span>
  );
}

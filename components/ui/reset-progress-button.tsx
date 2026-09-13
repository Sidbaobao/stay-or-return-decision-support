"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { resetCurrentRun, useRunStatus } from "@/lib/run-state";
import { useLocale } from "@/lib/i18n/provider";
import { InlineConfirm, useConfirmFocus } from "@/components/ui/inline-confirm";
import { QuietButton } from "@/components/ui/quiet-button";

type ResetProgressButtonProps = {
  // Runs before the run is read for its snapshot. The weights page uses it
  // to flush a debounced autosave, so the snapshot carries what is on screen.
  onBeforeReset?: () => void;
};

// Lives in the header of the pages that hold the run (questionnaire, weights)
// rather than in the global nav: a destructive action next to the thing it
// destroys, and absent for a shared-link recipient who has no run at all.
//
// Empty run: nothing to reset, so nothing to show. Complete run: saved to
// history first, so it can be restored. Partial run: unfinished answers would
// be lost, so it asks in place.
export function ResetProgressButton({ onBeforeReset }: ResetProgressButtonProps) {
  const router = useRouter();
  const status = useRunStatus();
  const { t } = useLocale();
  const [isConfirming, setIsConfirming] = useState(false);
  const triggerRef = useConfirmFocus(isConfirming);
  const hasRun = status !== null && status.answeredCount > 0;

  // If the run empties underneath an open question (a reset in another tab),
  // the question is moot. Drop it so it cannot reappear with the next answer.
  useEffect(() => {
    if (!hasRun) {
      setIsConfirming(false);
    }
  }, [hasRun]);

  if (!status || !hasRun) {
    return null;
  }

  const performReset = () => {
    setIsConfirming(false);
    onBeforeReset?.();
    resetCurrentRun();
    // This button unmounts with the run, so focus is parked on the page
    // title before it goes; on the questionnaire that is where the
    // navigation lands anyway.
    document.querySelector<HTMLElement>("main h1")?.focus();
    router.push("/questionnaire");
  };

  if (isConfirming) {
    return (
      <InlineConfirm
        prompt={t.confirm.discardPrompt}
        confirmLabel={t.confirm.discard}
        onConfirm={performReset}
        onCancel={() => setIsConfirming(false)}
      />
    );
  }

  return (
    <QuietButton
      ref={triggerRef}
      onClick={() => (status.isComplete ? performReset() : setIsConfirming(true))}
    >
      {t.reset}
    </QuietButton>
  );
}

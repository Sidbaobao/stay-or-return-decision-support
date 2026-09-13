"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loadRunHistory } from "@/lib/storage";
import { resetCurrentRun, useRunStatus } from "@/lib/run-state";
import { InlineConfirm, useConfirmFocus } from "@/components/ui/inline-confirm";
import { PrimaryButton, PrimaryButtonLink } from "@/components/ui/primary-button";
import { QuietButton, QuietLink } from "@/components/ui/quiet-button";

type ProgressState = "fresh" | "partial" | "completed";

type HomeProgressCtaProps = {
  align?: "center" | "end";
};

export function HomeProgressCta({ align = "center" }: HomeProgressCtaProps) {
  const router = useRouter();
  const status = useRunStatus();
  const [hasHistory, setHasHistory] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const startOverTriggerRef = useConfirmFocus(isConfirming);
  const alignmentClassName = align === "end" ? "items-center lg:items-end" : "items-center";

  const progressState: ProgressState = !status
    ? "fresh"
    : status.isComplete
      ? "completed"
      : status.answeredCount > 0
        ? "partial"
        : "fresh";
  const canReviewResults = status?.canScore ?? false;

  useEffect(() => {
    setHasHistory(loadRunHistory().length > 0);
  }, []);

  // A question about a partial run is moot once the run is no longer partial
  // (cleared or finished in another tab).
  useEffect(() => {
    if (progressState !== "partial") {
      setIsConfirming(false);
    }
  }, [progressState]);

  // Same contract as the header's reset: a finished run is saved to history
  // first; a half-finished one asks before it is discarded.
  const startOver = () => {
    setIsConfirming(false);
    resetCurrentRun();
    router.push("/questionnaire");
  };

  if (progressState === "completed") {
    return (
      <div className={`flex flex-col gap-2 ${alignmentClassName}`}>
        <PrimaryButton type="button" onClick={startOver}>
          Start a new questionnaire
        </PrimaryButton>
        {canReviewResults ? (
          <QuietLink href="/results" tone="inherit" size="xs">
            Or review your last results
          </QuietLink>
        ) : null}
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-2 ${alignmentClassName}`}>
      <PrimaryButtonLink href="/questionnaire">
        {progressState === "partial" ? "Continue questionnaire" : "Start questionnaire"}
      </PrimaryButtonLink>
      {progressState === "partial" ? (
        isConfirming ? (
          <InlineConfirm
            prompt="Discard your in-progress answers?"
            confirmLabel="Discard"
            tone="inherit"
            size="xs"
            onConfirm={startOver}
            onCancel={() => setIsConfirming(false)}
          />
        ) : (
          <QuietButton
            ref={startOverTriggerRef}
            tone="inherit"
            size="xs"
            onClick={() => setIsConfirming(true)}
          >
            Or start over
          </QuietButton>
        )
      ) : null}
      {progressState === "fresh" && hasHistory ? (
        <QuietLink href="/profile" tone="inherit" size="xs">
          Or revisit a past decision
        </QuietLink>
      ) : null}
    </div>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loadRunHistory } from "@/lib/storage";
import { resetCurrentRun, useRunStatus } from "@/lib/run-state";
import { InlineConfirm, useConfirmFocus } from "@/components/ui/inline-confirm";
import { QuietButton } from "@/components/ui/quiet-button";

type ProgressState = "fresh" | "partial" | "completed";

type HomeProgressCtaProps = {
  align?: "center" | "end";
};

const buttonClassName =
  "interaction-primary inline-flex min-h-11 max-w-full items-center justify-center rounded-control bg-action-primary px-5 py-3 text-center text-sm font-semibold leading-5 text-surface-strong";

const quietClassName =
  "interaction-quiet rounded-control px-1 text-xs font-medium leading-5 text-current opacity-65 hover:opacity-100";

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
        <button type="button" onClick={startOver} className={buttonClassName}>
          Start a new questionnaire
        </button>
        {canReviewResults ? (
          <Link href="/results" className={quietClassName}>
            Or review your last results
          </Link>
        ) : null}
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-2 ${alignmentClassName}`}>
      <Link href="/questionnaire" className={buttonClassName}>
        {progressState === "partial" ? "Continue questionnaire" : "Start questionnaire"}
      </Link>
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
        <Link href="/profile" className={quietClassName}>
          Or revisit a past decision
        </Link>
      ) : null}
    </div>
  );
}

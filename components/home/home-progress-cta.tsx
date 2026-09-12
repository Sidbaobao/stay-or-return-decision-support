"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loadRunHistory, resetAppState } from "@/lib/storage";
import { useRunStatus } from "@/lib/run-state";

type ProgressState = "fresh" | "partial" | "completed";

type HomeProgressCtaProps = {
  align?: "center" | "end";
};

const buttonClassName =
  "interaction-primary inline-flex min-h-11 max-w-full items-center justify-center rounded-control bg-action-primary px-5 py-3 text-center text-sm font-semibold leading-5 text-surface-strong";

export function HomeProgressCta({ align = "center" }: HomeProgressCtaProps) {
  const router = useRouter();
  const status = useRunStatus();
  const [hasHistory, setHasHistory] = useState(false);
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

  const handleStartOver = () => {
    resetAppState();
    router.push("/questionnaire");
  };

  if (progressState === "completed") {
    return (
      <div className={`flex flex-col gap-2 ${alignmentClassName}`}>
        <button type="button" onClick={handleStartOver} className={buttonClassName}>
          Start a new questionnaire
        </button>
        {canReviewResults ? (
          <Link
            href="/results"
            className="interaction-quiet rounded-control px-1 text-xs font-medium leading-5 text-current opacity-65 hover:opacity-100"
          >
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
        <button
          type="button"
          onClick={handleStartOver}
          className="interaction-quiet rounded-control px-1 text-xs font-medium leading-5 text-current opacity-65 hover:opacity-100"
        >
          Or start over
        </button>
      ) : null}
      {progressState === "fresh" && hasHistory ? (
        <Link
          href="/profile"
          className="interaction-quiet rounded-control px-1 text-xs font-medium leading-5 text-current opacity-65 hover:opacity-100"
        >
          Or revisit a past decision
        </Link>
      ) : null}
    </div>
  );
}

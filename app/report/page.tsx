"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { questions } from "@/data/questions";
import { filterAnswersToCurrent, loadAppState } from "@/lib/storage";
import { usePrerequisiteGuard } from "@/lib/guards";
import { scoreDecision } from "@/lib/scoring";
import { buildRecommendationReport } from "@/lib/report";
import { AppState } from "@/types";
import { ReportSummary } from "@/components/report/report-summary";
import { ShareResultButton } from "@/components/share/share-result-button";

export default function ReportPage() {
  const isReady = usePrerequisiteGuard("weights");
  const [state, setState] = useState<AppState | null>(null);

  useEffect(() => {
    setState(loadAppState());
  }, []);

  const scoringResult = useMemo(() => {
    if (!state) {
      return null;
    }

    const currentAnswers = filterAnswersToCurrent(state.answers, questions);
    return scoreDecision(currentAnswers, state.weights);
  }, [state]);

  const report = useMemo(() => {
    if (!scoringResult) {
      return null;
    }

    return buildRecommendationReport(scoringResult);
  }, [scoringResult]);

  if (!isReady || !scoringResult || !report || !state) {
    return null;
  }

  const generatedDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(new Date());

  return (
    <>
      <ReportSummary
        report={report}
        scoringResult={scoringResult}
        generatedDate={generatedDate}
      />

      <div className="memo-screen-actions flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/results"
          className="interaction-quiet -mx-1 rounded-control px-1 py-1 text-sm font-medium text-ink/70 hover:text-ink"
        >
          Back to results
        </Link>
        <Link
          href="/questionnaire"
          className="interaction-quiet -mx-1 rounded-control px-1 py-1 text-sm font-medium text-action-primary hover:text-action-primary-hover"
        >
          Change answers
        </Link>
      </div>

      <div className="memo-screen-actions flex flex-col gap-3 rounded-tile border border-border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-measure text-body-sm text-ink/65">
          Share a read-only copy — the link carries your answers and weights inside it, so send it
          only to people you trust to see them.
        </p>
        <div className="shrink-0">
          <ShareResultButton
            answers={filterAnswersToCurrent(state.answers, questions)}
            weights={state.weights}
          />
        </div>
      </div>
    </>
  );
}

"use client";

import { useMemo } from "react";
import { buildRecommendationReport } from "@/lib/report";
import { useScoredRun } from "@/lib/run-state";
import { ReportSummary } from "@/components/report/report-summary";
import { QuietLink } from "@/components/ui/quiet-button";

export default function ReportPage() {
  const { isReady, status, scoringResult } = useScoredRun("weights");

  const report = useMemo(() => {
    if (!scoringResult) {
      return null;
    }

    return buildRecommendationReport(scoringResult);
  }, [scoringResult]);

  if (!isReady || !scoringResult || !report || !status) {
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

      {/* Navigation only; sharing lives on the results page. Hidden in
          print by .memo-screen-actions. */}
      <footer className="memo-screen-actions -mx-2 flex flex-wrap items-center gap-x-1 gap-y-1 border-t border-hairline pt-6 sm:pt-8">
        <QuietLink href="/results">Back to results</QuietLink>
        <QuietLink href="/questionnaire" tone="primary">
          Change answers
        </QuietLink>
      </footer>
    </>
  );
}

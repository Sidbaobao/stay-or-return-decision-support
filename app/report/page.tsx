"use client";

import { useMemo } from "react";
import { buildRecommendationReport } from "@/lib/report";
import { useScoredRun } from "@/lib/run-state";
import { ReportSummary } from "@/components/report/report-summary";
import { ShareResultButton } from "@/components/share/share-result-button";
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

      {/* Everything that is not the memo itself, in one hairline footer.
          Hidden in print by .memo-screen-actions. */}
      <footer className="memo-screen-actions flex flex-col gap-5 border-t border-hairline pt-6 sm:flex-row sm:items-start sm:justify-between sm:pt-8">
        <div className="max-w-measure">
          <p className="text-body-sm text-ink/65">
            Share a read-only copy. The link carries your answers and weights inside it, so send it
            only to people you trust to see them.
          </p>
          <div className="mt-3">
            <ShareResultButton answers={status.answers} weights={status.state.weights} />
          </div>
        </div>
        <div className="-mx-2 flex flex-wrap items-center gap-x-1 gap-y-1 sm:-mt-2 sm:shrink-0">
          <QuietLink href="/results">Back to results</QuietLink>
          <QuietLink href="/questionnaire" tone="primary">
            Change answers
          </QuietLink>
        </div>
      </footer>
    </>
  );
}

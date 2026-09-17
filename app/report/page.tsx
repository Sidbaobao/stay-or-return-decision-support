"use client";

import { useMemo } from "react";
import { buildRecommendationReport } from "@/lib/report";
import { useScoredRun } from "@/lib/run-state";
import { formatDate } from "@/lib/i18n";
import { useLocale, useLocalizedTitle } from "@/lib/i18n/provider";
import { ReportSummary } from "@/components/report/report-summary";
import { Band } from "@/components/ui/band";
import { QuietLink } from "@/components/ui/quiet-button";

export default function ReportPage() {
  const { isReady, status, scoringResult } = useScoredRun("weights");
  const { t, locale } = useLocale();
  useLocalizedTitle(t.titles.memo);

  const report = useMemo(() => {
    if (!scoringResult || !status) {
      return null;
    }

    return buildRecommendationReport(scoringResult, status.answers, locale);
  }, [scoringResult, status, locale]);

  if (!isReady || !scoringResult || !report || !status) {
    return null;
  }

  const generatedDate = formatDate(locale, new Date().toISOString());

  return (
    <>
      <Band>
        <ReportSummary report={report} scoringResult={scoringResult} generatedDate={generatedDate} />
      </Band>

      {/* Navigation only; sharing lives on the results page. Hidden in
          print by .memo-screen-actions. */}
      <Band tone="white" padding="tight" as="footer" className="memo-screen-actions">
        <div className="-mx-2 flex flex-wrap items-center justify-end gap-x-1 gap-y-1">
          <QuietLink href="/results">{t.memo.backResults}</QuietLink>
          <QuietLink href="/questionnaire" tone="primary">
            {t.memo.changeAnswers}
          </QuietLink>
        </div>
      </Band>
    </>
  );
}

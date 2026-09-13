"use client";

import { useMemo } from "react";
import { buildRecommendationReport } from "@/lib/report";
import { useScoredRun } from "@/lib/run-state";
import { formatDate } from "@/lib/i18n";
import { useLocale, useLocalizedTitle } from "@/lib/i18n/provider";
import { ReportSummary } from "@/components/report/report-summary";
import { QuietLink } from "@/components/ui/quiet-button";

export default function ReportPage() {
  const { isReady, status, scoringResult } = useScoredRun("weights");
  const { t, locale } = useLocale();
  useLocalizedTitle(t.titles.memo);

  const report = useMemo(() => {
    if (!scoringResult) {
      return null;
    }

    return buildRecommendationReport(scoringResult, locale);
  }, [scoringResult, locale]);

  if (!isReady || !scoringResult || !report || !status) {
    return null;
  }

  const generatedDate = formatDate(locale, new Date().toISOString());

  return (
    <>
      <ReportSummary report={report} scoringResult={scoringResult} generatedDate={generatedDate} />

      {/* Navigation only; sharing lives on the results page. Hidden in
          print by .memo-screen-actions. */}
      <footer className="memo-screen-actions -mx-2 flex flex-wrap items-center gap-x-1 gap-y-1 border-t border-hairline pt-6 sm:pt-8">
        <QuietLink href="/results">{t.memo.backResults}</QuietLink>
        <QuietLink href="/questionnaire" tone="primary">
          {t.memo.changeAnswers}
        </QuietLink>
      </footer>
    </>
  );
}

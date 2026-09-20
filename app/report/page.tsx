"use client";

import { useMemo } from "react";
import { buildRecommendationReport } from "@/lib/report";
import { useScoredRun } from "@/lib/run-state";
import { formatDate } from "@/lib/i18n";
import { useLocale, useLocalizedTitle } from "@/lib/i18n/provider";
import { ReportSummary } from "@/components/report/report-summary";
import { Band } from "@/components/ui/band";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButtonLink } from "@/components/ui/secondary-button";
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
    <Band>
      {/* The sheet keeps a column of actions beside it on a wide screen, so
          it stays the width of a document; under it on a phone. Hidden in
          print by .memo-screen-actions, so the paper is only the paper. */}
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_14rem] lg:items-start lg:gap-14">
        <ReportSummary report={report} scoringResult={scoringResult} generatedDate={generatedDate} />

        <aside className="memo-screen-actions lg:sticky lg:top-8">
          <p className="num text-label text-ink/45">04 · {t.titles.memo}</p>
          <p className="num mt-2 text-body-sm text-ink/55">{generatedDate}</p>
          <div className="mt-6 flex flex-col items-start gap-3">
            <PrimaryButton type="button" onClick={() => window.print()}>
              {t.memo.print}
            </PrimaryButton>
            <SecondaryButtonLink href="/results">{t.memo.backResults}</SecondaryButtonLink>
            <QuietLink href="/questionnaire" tone="primary" className="-mx-2">
              {t.memo.changeAnswers}
            </QuietLink>
          </div>
        </aside>
      </div>
    </Band>
  );
}

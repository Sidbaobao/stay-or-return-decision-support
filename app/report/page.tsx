"use client";

import { useMemo } from "react";
import { buildRecommendationReport } from "@/lib/report";
import { useScoredRun } from "@/lib/run-state";
import { formatDate } from "@/lib/i18n";
import { useLocale, useLocalizedTitle } from "@/lib/i18n/provider";
import { MemoOutline } from "@/components/report/memo-outline";
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

  // The sheet's four sections, by the headings the sheet itself uses.
  const outline = useMemo(
    () => [
      { id: "memo-overall", label: t.memo.recommendation },
      { id: "memo-parts", label: t.memo.whereLeans },
      { id: "memo-change", label: t.memo.whatWouldChange },
      { id: "memo-before", label: t.memo.beforeDeciding }
    ],
    [t]
  );

  if (!isReady || !scoringResult || !report || !status) {
    return null;
  }

  const generatedDate = formatDate(locale, new Date().toISOString());

  return (
    <>
      {/* On a phone the outline is a strip of tabs that stays at the top. */}
      <div className="memo-screen-actions glass-bar sticky top-0 z-20 shadow-stuck lg:hidden">
        <div className="mx-auto w-full max-w-site px-page-gutter py-1.5">
          <MemoOutline items={outline} orientation="horizontal" ariaLabel={t.titles.memo} />
        </div>
      </div>

      <Band>
        {/* The sheet keeps a column beside it on a wide screen: an outline of
            its sections with the current one marked, the date, the actions.
            Hidden in print by .memo-screen-actions, so the paper is only the
            paper. */}
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_15rem] lg:items-start lg:gap-14">
          <ReportSummary report={report} scoringResult={scoringResult} generatedDate={generatedDate} />

          <aside className="memo-screen-actions lg:sticky lg:top-8">
            <p className="num text-label text-ink/45">04 · {t.titles.memo}</p>
            <div className="-mx-2.5 mt-5 hidden lg:block">
              <MemoOutline items={outline} orientation="vertical" ariaLabel={t.titles.memo} />
            </div>
            <p className="num mt-6 text-body-sm text-ink/55">{generatedDate}</p>
            <div className="mt-5 flex flex-col items-start gap-3">
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
    </>
  );
}

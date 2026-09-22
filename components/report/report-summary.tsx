"use client";

import { dimensionIcons } from "@/components/results/dimension-icons";
import { useContent } from "@/lib/i18n/content";
import { useLocale } from "@/lib/i18n/provider";
import { Dictionary } from "@/lib/i18n";
import { RecommendationReport, ScoringResult, ScenarioId } from "@/types";

type ReportSummaryProps = {
  report: RecommendationReport;
  scoringResult: ScoringResult;
  generatedDate: string;
};

// Shared floor with the Results lean rows so tiny leans don't overfill the bar.
const MIN_SHARED_SCALE = 20;

// "Still close" comes from uncertainDimensions membership (|rawGap| ≤ 10 in
// lib/scoring.ts); the ≤25 wording boundary echoes the engine's
// moderate-confidence band but is presentation copy.
function getLeanStatement(
  t: Dictionary["memo"],
  favoredScenario: ScenarioId | "tie",
  rawGap: number,
  isStillClose: boolean
) {
  if (favoredScenario === "tie") {
    return t.leanBalanced;
  }

  if (isStillClose) {
    return t.leanStillClose(favoredScenario);
  }

  if (Math.abs(rawGap) <= 25) {
    return t.lean(favoredScenario);
  }

  return t.leanClearly(favoredScenario);
}

export function ReportSummary({ report, scoringResult, generatedDate }: ReportSummaryProps) {
  const { t } = useLocale();
  const { dimensionLabel } = useContent();
  const memo = t.memo;
  const recommendationLabel = report.isBalanced ? memo.balanced : memo.verdict[report.recommendedScenario];
  const sharedScale = Math.max(
    MIN_SHARED_SCALE,
    ...scoringResult.contributions.map((contribution) => Math.abs(contribution.rawGap))
  );

  return (
    <article className="decision-memo overflow-hidden rounded-panel bg-surface shadow-soft">
      <header className="memo-block px-memo-x py-memo-header-y sm:px-memo-x-sm sm:py-memo-header-y-sm lg:px-memo-x-lg">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
          <p className="font-serif text-section-title text-ink">{memo.title}</p>
          <p className="text-eyebrow text-ink/65">{generatedDate}</p>
        </div>
      </header>

      <section
        className="memo-block bg-surface-warm px-memo-x py-memo-section-y sm:px-memo-x-sm sm:py-memo-section-y-sm lg:px-memo-x-lg lg:py-memo-section-y-lg"
        id="memo-overall"
        aria-labelledby="recommendation-heading"
      >
        <p className="text-eyebrow text-ink/65">{memo.recommendation}</p>
        <h1 id="recommendation-heading" className="mt-2 font-serif text-page-title text-ink">
          {recommendationLabel}
        </h1>
        <span className="text-eyebrow mt-4 inline-flex rounded-pill bg-surface-strong/80 px-3 py-1.5 text-ink/65">
          {memo.confidence[report.confidence]}
        </span>
        <div className="memo-prose memo-lines mt-5 space-y-2 text-ink/80">
          {report.lead.map((line, index) => (
            <p key={line} style={{ animationDelay: `${160 + index * 110}ms` }}>
              {line}
            </p>
          ))}
        </div>
      </section>

      <section
        className="memo-comparison px-memo-x py-memo-comparison-y sm:px-memo-x-sm sm:py-memo-comparison-y-sm lg:px-memo-x-lg lg:py-memo-comparison-y-lg"
        id="memo-parts"
        aria-labelledby="comparison-heading"
      >
        <div>
          <h2 id="comparison-heading" className="font-serif text-section-title text-ink">
            {memo.whereLeans}
          </h2>
        </div>

        <div className="mt-5">
          <div className="grid grid-cols-1 text-label sm:grid-cols-[1.35fr_1fr]">
            <div className="hidden px-memo-row-x-sm py-memo-row-y font-semibold text-ink/65 sm:block">{memo.dimension}</div>
            <div className="flex items-baseline justify-between px-memo-row-x py-memo-row-y sm:px-memo-row-x-sm">
              <span className="font-semibold text-path-stay">{memo.columnStay}</span>
              <span className="font-semibold text-ink/65">{memo.columnBalanced}</span>
              <span className="font-semibold text-path-return">{memo.columnReturn}</span>
            </div>
          </div>

          <div className="mt-1 space-y-1">
            {scoringResult.contributions.map((contribution) => {
              const Icon = dimensionIcons[contribution.dimensionId];
              const isBalanced = contribution.favoredScenario === "tie";
              const supportsStay = contribution.favoredScenario === "stay_us";
              const isStillClose = scoringResult.uncertainDimensions.includes(contribution.dimensionId);
              const statement = getLeanStatement(memo, contribution.favoredScenario, contribution.rawGap, isStillClose);
              const barWidth = (Math.abs(contribution.rawGap) / sharedScale) * 50;

              return (
                <div
                  key={contribution.dimensionId}
                  className="grid grid-cols-1 gap-2.5 rounded-tile px-memo-row-x py-memo-row-y odd:bg-surface-strong/45 sm:grid-cols-[1.35fr_1fr] sm:items-center sm:gap-4 sm:px-memo-row-x-sm"
                >
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                    <span className="flex items-center gap-3">
                      <Icon aria-hidden="true" className="h-4 w-4 shrink-0 self-center text-ink/45" strokeWidth={1.6} />
                      <span className="text-body-sm font-medium text-ink">
                        {dimensionLabel(contribution.dimensionId)}
                        <span className="sr-only">
                          {isBalanced ? "" : memo.srLeansBy(Math.abs(contribution.rawGap))}
                        </span>
                      </span>
                    </span>
                    <span
                      className="text-label font-medium"
                      style={
                        isBalanced
                          ? undefined
                          : {
                              color: supportsStay
                                ? "rgb(var(--color-path-stay))"
                                : "rgb(var(--color-path-return))"
                            }
                      }
                    >
                      {statement}
                    </span>
                  </div>

                  <div aria-hidden="true" className="relative h-2 rounded-pill bg-result-driver-track">
                    {!isBalanced ? (
                      <div
                        className={`absolute inset-y-0 ${
                          supportsStay
                            ? "right-1/2 rounded-l-pill bg-path-stay"
                            : "left-1/2 rounded-r-pill bg-path-return"
                        }`}
                        style={{ width: `${barWidth}%` }}
                      />
                    ) : null}
                    <div className="absolute left-1/2 top-1/2 h-3.5 w-px -translate-x-1/2 -translate-y-1/2 bg-ink/20" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </section>

      <div className="grid bg-canvas lg:grid-cols-2 lg:gap-x-6">
        <section
          className="memo-block px-memo-x py-memo-comparison-y sm:px-memo-x-sm lg:px-memo-x-lg lg:py-memo-section-y-lg"
          id="memo-change"
          aria-labelledby="change-heading"
        >
          <h2 id="change-heading" className="font-serif text-card-title text-ink">
            {memo.whatWouldChange}
          </h2>
          <ul className="memo-lines mt-4 space-y-3">
            {report.whatWouldChange.map((item, index) => (
              <li key={item.join(" ")} className="memo-prose space-y-1 text-ink/75" style={{ animationDelay: `${700 + index * 120}ms` }}>
                {item.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </li>
            ))}
          </ul>
        </section>

        <section
          className="memo-block px-memo-x py-memo-comparison-y pt-0 sm:px-memo-x-sm lg:px-memo-x-lg lg:py-memo-section-y-lg"
          id="memo-before"
          aria-labelledby="before-heading"
        >
          <h2 id="before-heading" className="font-serif text-card-title text-ink">
            {memo.beforeDeciding}
          </h2>
          <ol className="memo-prose memo-lines mt-4 list-decimal space-y-3 pl-5 text-ink/75 marker:text-ink/45">
            {report.beforeDeciding.map((item, index) => (
              <li key={item.join(" ")} className="space-y-1 pl-1" style={{ animationDelay: `${900 + index * 120}ms` }}>
                {item.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </li>
            ))}
          </ol>
        </section>
      </div>

      <footer className="memo-block px-memo-x py-memo-footer-y text-right sm:px-memo-x-sm lg:px-memo-x-lg">
        <div className="space-y-1 text-label text-ink/65">
          {report.disclaimer.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </footer>
    </article>
  );
}

import { Check } from "lucide-react";
import { dimensions } from "@/data/dimensions";
import { dimensionIcons } from "@/components/results/dimension-icons";
import { RecommendationReport, ScoringResult, ScenarioId } from "@/types";

type ReportSummaryProps = {
  report: RecommendationReport;
  scoringResult: ScoringResult;
  generatedDate: string;
};

const scenarioLabels: Record<ScenarioId, string> = {
  stay_us: "Stay in the US",
  return_china: "Return to China"
};

const confidenceLabels = {
  low: "Low confidence",
  medium: "Moderate confidence",
  high: "High confidence"
} as const;

// Shared floor with the Results lean rows so tiny leans don't overfill the bar.
const MIN_SHARED_SCALE = 20;

// "Still close" comes from uncertainDimensions membership (|rawGap| ≤ 10 in lib/scoring.ts);
// the ≤25 wording boundary echoes the engine's moderate-confidence band but is presentation copy.
function getLeanStatement(favoredScenario: ScenarioId | "tie", rawGap: number, isStillClose: boolean) {
  if (favoredScenario === "tie") {
    return "Balanced between the paths";
  }

  const pathLabel = favoredScenario === "stay_us" ? "staying" : "returning";

  if (isStillClose) {
    return `Leans toward ${pathLabel} — still close`;
  }

  if (Math.abs(rawGap) <= 25) {
    return `Leans toward ${pathLabel}`;
  }

  return `Clearly favors ${pathLabel}`;
}

function normalizeDisplayedSummary(summary: string) {
  return summary
    .replace(/\bresponses leans\b/g, "responses lean")
    .replace(/\bresponses points\b/g, "responses point");
}

export function ReportSummary({ report, scoringResult, generatedDate }: ReportSummaryProps) {
  const recommendationLabel = scenarioLabels[report.recommendedScenario];
  const displayedSummary = normalizeDisplayedSummary(report.summary);

  return (
    <article className="decision-memo overflow-hidden rounded-panel border border-border bg-surface shadow-subtle">
      <header className="memo-block px-memo-x py-memo-header-y sm:px-memo-x-sm sm:py-memo-header-y-sm lg:px-memo-x-lg">
        <div className="flex flex-col gap-2 border-b border-ink/15 pb-4 sm:flex-row sm:items-end sm:justify-between">
          <p className="font-serif text-section-title text-ink">Decision Memo</p>
          <p className="text-eyebrow text-ink/65">{generatedDate}</p>
        </div>
        <p className="mt-3 max-w-measure text-body-sm text-ink/70">
          A personal memo on whether to stay in the US or return to China.
        </p>
      </header>

      <section className="memo-block border-t border-border px-memo-x py-memo-section-y sm:px-memo-x-sm sm:py-memo-section-y-sm lg:px-memo-x-lg lg:py-memo-section-y-lg" aria-labelledby="recommendation-heading">
        <div className="max-w-4xl">
          <p className="text-eyebrow text-ink/65">Recommendation</p>
          <h1 id="recommendation-heading" className="mt-2 font-serif text-page-title text-ink">
            {recommendationLabel}.
          </h1>
          <span className="text-eyebrow mt-4 inline-flex rounded-pill border border-hairline-strong bg-surface-strong/55 px-3 py-1.5 text-ink/65">
            {confidenceLabels[report.confidence]}
          </span>
        </div>
      </section>

      <section className="memo-block border-t border-border" aria-labelledby="summary-heading">
        <div className="px-memo-x py-memo-section-y sm:px-memo-x-sm sm:py-memo-section-y-sm lg:px-memo-x-lg lg:py-memo-section-y-lg">
          <h2 id="summary-heading" className="font-serif text-card-title text-ink">
            Executive summary
          </h2>
          <p className="mt-3 max-w-measure text-body-lg font-medium text-ink/80">{displayedSummary}</p>
        </div>
      </section>

      <section className="memo-comparison border-t border-border px-memo-x py-memo-comparison-y sm:px-memo-x-sm sm:py-memo-comparison-y-sm lg:px-memo-x-lg lg:py-memo-comparison-y-lg" aria-labelledby="comparison-heading">
        <div>
          <p className="text-eyebrow text-ink/65">Why not the other path</p>
          <h2 id="comparison-heading" className="mt-2 max-w-5xl font-serif text-section-title text-ink">
            What each path gives, and asks.
          </h2>
        </div>

        <div className="mt-5 max-w-measure space-y-3">
          {report.whyNotOtherPath.map((paragraph) => (
            <p key={paragraph} className="text-body text-ink/80">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mt-7 border-y border-hairline-strong">
          <div className="grid grid-cols-1 border-b border-hairline-strong text-label sm:grid-cols-[1.35fr_1fr]">
            <div className="hidden px-memo-row-x-sm py-memo-row-y font-semibold text-ink/65 sm:block">Dimension</div>
            <div className="flex items-baseline justify-between px-memo-row-x py-memo-row-y sm:px-memo-row-x-sm">
              <span className="font-semibold text-path-stay">Stay</span>
              <span className="font-semibold text-ink/65">Balanced</span>
              <span className="font-semibold text-path-return">Return</span>
            </div>
          </div>

          <div className="divide-y divide-hairline">
            {(() => {
              const sharedScale = Math.max(
                MIN_SHARED_SCALE,
                ...scoringResult.contributions.map((contribution) => Math.abs(contribution.rawGap))
              );

              return scoringResult.contributions.map((contribution) => {
                const dimension = dimensions.find((item) => item.id === contribution.dimensionId);
                const Icon = dimensionIcons[contribution.dimensionId];
                const isBalanced = contribution.favoredScenario === "tie";
                const supportsStay = contribution.favoredScenario === "stay_us";
                const isStillClose = scoringResult.uncertainDimensions.includes(contribution.dimensionId);
                const statement = getLeanStatement(contribution.favoredScenario, contribution.rawGap, isStillClose);
                const barWidth = (Math.abs(contribution.rawGap) / sharedScale) * 50;

                return (
                  <div
                    key={contribution.dimensionId}
                    className="grid grid-cols-1 gap-2.5 px-memo-row-x py-memo-row-y sm:grid-cols-[1.35fr_1fr] sm:items-center sm:gap-4 sm:px-memo-row-x-sm"
                  >
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                      <span className="flex items-center gap-3">
                        <Icon aria-hidden="true" className="h-4 w-4 shrink-0 self-center text-ink/45" strokeWidth={1.6} />
                        <span className="text-body-sm font-medium text-ink">
                          {dimension?.label ?? contribution.dimensionId}
                          <span className="sr-only">
                            {isBalanced ? "" : `, leans by ${Math.abs(contribution.rawGap)} points`}
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
              });
            })()}
          </div>
        </div>

        <p className="mt-3 text-label text-ink/65">
          One lean per dimension — bars share one scale and show which path each dimension favors, and how strongly.
        </p>
      </section>

      <div className="grid border-t border-border lg:grid-cols-[0.9fr_1.1fr]">
        <section className="memo-block border-b border-border px-memo-x py-memo-comparison-y sm:px-memo-x-sm lg:border-b-0 lg:border-r lg:px-memo-x-lg lg:py-memo-section-y-lg" aria-labelledby="risks-heading">
          <h2 id="risks-heading" className="font-serif text-card-title text-ink">Risks & uncertainty</h2>
          <ul className="mt-4 space-y-3">
            {report.tradeoffs.map((item) => (
              <li key={item} className="border-l border-ink/20 pl-4 text-body-sm text-ink/70">{item}</li>
            ))}
          </ul>
        </section>

        <section className="memo-block px-memo-x py-memo-comparison-y sm:px-memo-x-sm lg:px-memo-x-lg lg:py-memo-section-y-lg" aria-labelledby="next-steps-heading">
          <h2 id="next-steps-heading" className="font-serif text-card-title text-ink">Next steps</h2>
          <ul className="mt-4 space-y-3">
            {report.nextSteps.map((item) => (
              <li key={item} className="grid grid-cols-[auto_1fr] gap-3 text-body-sm text-ink/70">
                <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded border border-ink/25 text-ink/60">
                  <Check aria-hidden="true" className="h-3 w-3" strokeWidth={2} />
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <footer className="memo-block border-t border-ink/10 px-memo-x py-memo-footer-y sm:px-memo-x-sm lg:px-memo-x-lg">
        <p className="max-w-measure text-label text-ink/65">{report.disclaimer}</p>
        <p className="mt-5 font-serif text-body font-semibold text-ink/70">This reflects my thinking as of {generatedDate}.</p>
      </footer>
    </article>
  );
}

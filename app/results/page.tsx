"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Briefcase,
  ChevronDown,
  HeartHandshake,
  Scale,
  Sprout,
  Stamp,
  Sun,
  type LucideIcon
} from "lucide-react";
import { questions } from "@/data/questions";
import { dimensions } from "@/data/dimensions";
import { filterAnswersToCurrent, loadAppState } from "@/lib/storage";
import { usePrerequisiteGuard } from "@/lib/guards";
import { scoreDecision } from "@/lib/scoring";
import { AppState, ConfidenceLevel, DimensionId, ScenarioId } from "@/types";
import { TotalScoreChart } from "@/components/charts/total-score-chart";
import { DimensionChart } from "@/components/charts/dimension-chart";
import { RadarChart } from "@/components/charts/radar-chart";
import { DimensionScoreTable } from "@/components/results/dimension-score-table";
import { PrimaryButtonLink } from "@/components/ui/primary-button";

const dimensionIcons: Record<DimensionId, LucideIcon> = {
  career: Briefcase,
  salary_cost: Scale,
  immigration: Stamp,
  family_emotion: HeartHandshake,
  lifestyle: Sun,
  long_term: Sprout
};

function formatScore(value: number) {
  return Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1);
}

function getConclusionHeadline(direction: ScenarioId, confidence: ConfidenceLevel, gap: number) {
  const isStayDirection = direction === "stay_us";

  if (confidence === "high" && gap > 25) {
    return isStayDirection
      ? "The US is clearly your path right now."
      : "Returning to China is clearly your path right now.";
  }

  if (confidence === "medium" && gap >= 10 && gap <= 25) {
    return isStayDirection
      ? "You're leaning toward staying—with real tradeoffs."
      : "You're leaning toward returning—with real tradeoffs.";
  }

  return isStayDirection
    ? "It's close. You lean slightly toward staying."
    : "It's close. You lean slightly toward returning.";
}

type AnimatedNumberProps = {
  value: number;
  delay?: number;
};

function AnimatedNumber({ value, delay = 0 }: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setDisplayValue(value);
      return;
    }

    let frameId = 0;
    const duration = 700;
    const startTime = window.performance.now() + delay;

    const updateValue = (time: number) => {
      if (time < startTime) {
        frameId = window.requestAnimationFrame(updateValue);
        return;
      }

      const progress = Math.min((time - startTime) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(value * easedProgress);

      if (progress < 1) {
        frameId = window.requestAnimationFrame(updateValue);
      } else {
        setDisplayValue(value);
      }
    };

    frameId = window.requestAnimationFrame(updateValue);
    return () => window.cancelAnimationFrame(frameId);
  }, [delay, value]);

  return (
    <>
      <span className="motion-reduce:hidden">{formatScore(displayValue)}</span>
      <span className="hidden motion-reduce:inline">{formatScore(value)}</span>
    </>
  );
}

export default function ResultsPage() {
  const isReady = usePrerequisiteGuard("weights");
  const [state, setState] = useState<AppState | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

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

  useEffect(() => {
    if (!scoringResult) {
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setIsRevealed(true);
      return;
    }

    setIsRevealed(false);
    const frameId = window.requestAnimationFrame(() => setIsRevealed(true));
    return () => window.cancelAnimationFrame(frameId);
  }, [scoringResult]);

  if (!isReady || !scoringResult) {
    return null;
  }

  const recommendedLabel =
    scoringResult.recommendedScenario === "stay_us" ? "Stay in the US" : "Return to China";
  const isStayRecommended = scoringResult.recommendedScenario === "stay_us";
  const accentColor = isStayRecommended ? "#3C5CCF" : "#D72638";
  const confidenceSteps =
    scoringResult.confidence === "low" ? 1 : scoringResult.confidence === "medium" ? 2 : 3;
  const conclusionHeadline = getConclusionHeadline(
    scoringResult.recommendedScenario,
    scoringResult.confidence,
    scoringResult.weightedTotals.difference
  );

  const rankedContributions = [...scoringResult.contributions].sort(
    (left, right) => Math.abs(right.weightedGap) - Math.abs(left.weightedGap)
  );
  const topContribution = rankedContributions[0];
  const topContributionDimension = dimensions.find(
    (dimension) => dimension.id === topContribution?.dimensionId
  );
  const TopContributionIcon = topContribution ? dimensionIcons[topContribution.dimensionId] : Briefcase;
  const topContributionDirection =
    topContribution && topContribution.weightedGap < 0 ? "returning to China" : "staying in the US";
  const conclusionHook =
    topContribution && Math.abs(topContribution.weightedGap) > 0
      ? `${topContributionDimension?.label ?? topContribution.dimensionId} creates the strongest pull, pointing toward ${topContributionDirection}.`
      : "No single dimension creates a strong pull yet.";

  const topDrivers = rankedContributions
    .filter((contribution) => Math.abs(contribution.weightedGap) > 0)
    .slice(0, 3);
  const largestDriverGap = Math.max(
    ...topDrivers.map((contribution) => Math.abs(contribution.weightedGap)),
    1
  );

  const closeDimensions = scoringResult.uncertainDimensions
    .map((dimensionId) => dimensions.find((dimension) => dimension.id === dimensionId))
    .filter((dimension): dimension is (typeof dimensions)[number] => Boolean(dimension));

  return (
    <>
      <section
        className="relative overflow-hidden rounded-feature border p-6 shadow-soft sm:p-8 lg:p-10"
        style={{
          borderColor: `${accentColor}40`,
          background: `linear-gradient(138deg, rgb(var(--color-surface)) 0%, rgb(var(--color-surface-strong)) 55%, ${accentColor}16 100%)`
        }}
      >
        <div
          className="absolute -right-20 -top-24 h-72 w-72 rounded-pill opacity-15 blur-3xl"
          style={{ backgroundColor: accentColor }}
        />
        <div
          className="absolute bottom-0 left-0 h-1 w-full origin-left transition-transform duration-700 motion-reduce:scale-x-100 motion-reduce:transition-none"
          style={{ backgroundColor: accentColor, transform: isRevealed ? "scaleX(1)" : "scaleX(0)" }}
        />

        <div
          className={`relative transition-all duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:scale-100 motion-reduce:opacity-100 motion-reduce:transition-none ${
            isRevealed ? "translate-y-0 scale-100 opacity-100" : "translate-y-3 scale-[0.985] opacity-0"
          }`}
        >
          <p className="text-eyebrow text-ink-accent">Step 3 / Results</p>

          <div className="mt-7 grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-end">
            <div>
              <p className="text-body-sm font-medium text-ink/70">Your conclusion</p>
              <h1
                className="mt-3 max-w-3xl font-serif text-display"
                style={{ color: accentColor }}
              >
                {conclusionHeadline}
              </h1>

              <div
                className={`mt-6 flex max-w-2xl items-start gap-3 transition-all delay-150 duration-500 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
                  isRevealed ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                }`}
              >
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-tile"
                  style={{ backgroundColor: `${accentColor}12`, color: accentColor }}
                >
                  <TopContributionIcon aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
                </span>
                <p className="pt-1 text-body-lg text-ink/70">{conclusionHook}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-tile border border-surface-strong/80 bg-surface-strong/80 px-4 py-3 shadow-legacy-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-body-sm font-medium text-ink/70">Confidence</span>
                  <span className="text-sm font-semibold capitalize text-ink">{scoringResult.confidence}</span>
                </div>
                <div className="mt-3 flex gap-2" role="img" aria-label={`${scoringResult.confidence} confidence`}>
                  {[1, 2, 3].map((step) => {
                    const isFilled = step <= confidenceSteps;

                    return (
                      <span key={step} className="h-2.5 flex-1 overflow-hidden rounded-pill bg-result-confidence-track">
                        <span
                          className={`block h-full origin-left rounded-pill transition-transform duration-500 ease-out motion-reduce:scale-x-100 motion-reduce:transition-none ${
                            isFilled && isRevealed ? "scale-x-100" : "scale-x-0"
                          }`}
                          style={{
                            backgroundColor: isFilled ? accentColor : "transparent",
                            transitionDelay: `${220 + step * 90}ms`
                          }}
                        />
                      </span>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      <section className="rounded-feature border border-border bg-surface p-6 shadow-legacy-sm sm:p-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-eyebrow text-ink-accent">Key drivers</p>
            <h2 className="mt-2 font-serif text-section-title text-ink">What moves the result</h2>
          </div>
          <p className="text-body-sm text-ink/70">Largest weighted gaps first.</p>
        </div>

        <div className="mt-6 space-y-4">
          {topDrivers.length > 0 ? (
            topDrivers.map((contribution) => {
              const dimension = dimensions.find((item) => item.id === contribution.dimensionId);
              const Icon = dimensionIcons[contribution.dimensionId];
              const supportsStay = contribution.weightedGap > 0;
              const driverColor = supportsStay ? "#3C5CCF" : "#D72638";
              const driverLabel = supportsStay ? "Supports Stay" : "Supports Return";
              const barWidth = (Math.abs(contribution.weightedGap) / largestDriverGap) * 100;

              return (
                <div
                  key={contribution.dimensionId}
                  className="grid gap-3 rounded-tile border border-surface-strong/80 bg-surface-strong/75 p-4 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center"
                >
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-tile"
                    style={{ backgroundColor: `${driverColor}12`, color: driverColor }}
                  >
                    <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-body font-medium text-ink">{dimension?.label ?? contribution.dimensionId}</p>
                      <span className="text-label font-medium" style={{ color: driverColor }}>
                        {driverLabel}
                      </span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-pill bg-result-driver-track">
                      <div
                        className="h-full rounded-pill"
                        style={{ width: `${barWidth}%`, backgroundColor: driverColor }}
                      />
                    </div>
                  </div>
                  <span className="text-body-sm font-semibold text-ink">{Math.abs(contribution.weightedGap)}</span>
                </div>
              );
            })
          ) : (
            <p className="rounded-tile bg-surface-strong/75 p-4 text-body-sm text-ink/65">No single dimension stands out.</p>
          )}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="interaction-card rounded-feature border border-ink/10 bg-surface-strong p-5 shadow-legacy-sm sm:p-6">
          <h2 className="font-serif text-section-title text-ink">Total score comparison</h2>
          <p className="mt-2 text-body-sm text-ink/70">Compare the two weighted totals.</p>

          <div className="mt-5 flex items-center justify-between gap-3">
            <p className="text-eyebrow text-ink/65">Score face-off</p>
            <span className="text-label font-medium" style={{ color: accentColor }}>
              {recommendedLabel} leads
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div
              className={`rounded-tile border p-4 ${isStayRecommended ? "shadow-legacy-sm" : "opacity-75"}`}
              style={{
                borderColor: isStayRecommended ? "#3C5CCF80" : "#3C5CCF25",
                backgroundColor: "#3C5CCF0D"
              }}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-body-sm font-medium text-ink/70">Stay</p>
                {isStayRecommended ? (
                  <span className="text-eyebrow text-path-stay">Leading</span>
                ) : null}
              </div>
              <p className="mt-2 text-3xl font-semibold text-path-stay sm:text-4xl">
                <AnimatedNumber value={scoringResult.weightedTotals.stay_us} delay={80} />
              </p>
              <div className="mt-3 h-2 overflow-hidden rounded-pill bg-path-stay/10">
                <div
                  className="h-full rounded-pill bg-path-stay transition-[width] duration-700 ease-out motion-reduce:transition-none"
                  style={{ width: isRevealed ? `${scoringResult.weightedTotals.stay_us}%` : "0%" }}
                />
              </div>
            </div>

            <div
              className={`rounded-tile border p-4 ${!isStayRecommended ? "shadow-legacy-sm" : "opacity-75"}`}
              style={{
                borderColor: !isStayRecommended ? "#D7263880" : "#D7263825",
                backgroundColor: "#D726380D"
              }}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-body-sm font-medium text-ink/70">Return</p>
                {!isStayRecommended ? (
                  <span className="text-eyebrow text-path-return">Leading</span>
                ) : null}
              </div>
              <p className="mt-2 text-3xl font-semibold text-path-return sm:text-4xl">
                <AnimatedNumber value={scoringResult.weightedTotals.return_china} delay={140} />
              </p>
              <div className="mt-3 h-2 overflow-hidden rounded-pill bg-path-return/10">
                <div
                  className="h-full rounded-pill bg-path-return transition-[width] duration-700 ease-out motion-reduce:transition-none"
                  style={{ width: isRevealed ? `${scoringResult.weightedTotals.return_china}%` : "0%" }}
                />
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-center">
            <span className="rounded-pill border border-border bg-surface px-3 py-1.5 text-label font-semibold text-ink/70">
              Gap <AnimatedNumber value={scoringResult.weightedTotals.difference} delay={220} />
            </span>
          </div>

          <div className="mt-5">
            <TotalScoreChart
              stayUsScore={scoringResult.weightedTotals.stay_us}
              returnChinaScore={scoringResult.weightedTotals.return_china}
            />
          </div>
        </section>

        <section className="interaction-card rounded-feature border border-ink/10 bg-surface-strong p-5 shadow-legacy-sm sm:p-6">
          <h2 className="font-serif text-section-title text-ink">Dimension contributions</h2>
          <p className="mt-2 text-body-sm text-ink/70">See which dimensions move the result.</p>
          <div className="mt-5">
            <DimensionChart contributions={scoringResult.contributions} />
          </div>
        </section>
      </div>

      <section className="interaction-card rounded-feature border border-ink/10 bg-surface-strong p-5 shadow-legacy-sm sm:p-6">
        <h2 className="font-serif text-section-title text-ink">Shape comparison</h2>
        <p className="mt-2 text-body-sm text-ink/70">Compare each path across all dimensions.</p>
        <div className="mt-5">
          <RadarChart scores={scoringResult.normalizedByDimension} />
        </div>
      </section>

      <details className="interaction-disclosure group rounded-feature border border-border bg-surface/70 shadow-legacy-sm">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 sm:p-6">
          <div>
            <h2 className="font-serif text-card-title text-ink">More detail</h2>
            <p className="mt-1 text-body-sm text-ink/70">Uncertainty, weight sensitivity, and score table.</p>
          </div>
          <ChevronDown
            aria-hidden="true"
            className="h-5 w-5 shrink-0 text-ink/55 transition-transform duration-motion-standard ease-interaction group-open:rotate-180 motion-reduce:transition-none"
          />
        </summary>

        <div className="grid gap-6 border-t border-border p-5 sm:p-6 lg:grid-cols-2">
          <section>
            <h3 className="text-body font-semibold text-ink">Still close</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {closeDimensions.length > 0 ? (
                closeDimensions.map((dimension) => (
                  <span key={dimension.id} className="rounded-pill bg-surface-strong px-3 py-2 text-body-sm text-ink/70 shadow-legacy-sm">
                    {dimension.shortLabel}
                  </span>
                ))
              ) : (
                <span className="text-body-sm text-ink/70">No close dimensions.</span>
              )}
            </div>
          </section>

          <section>
            <h3 className="text-body font-semibold text-ink">Weight sensitivity</h3>
            <div className="mt-3 flex gap-3">
              <div className="rounded-tile bg-surface-strong px-4 py-3 shadow-legacy-sm">
                <p className="text-label text-ink/65">Current gap</p>
                <p className="mt-1 text-lg font-semibold text-ink">
                  {scoringResult.weightFlipAnalysis.currentTotalGap}
                </p>
              </div>
              <div className="rounded-tile bg-surface-strong px-4 py-3 shadow-legacy-sm">
                <p className="text-label text-ink/65">Possible shift</p>
                <p className="mt-1 text-lg font-semibold text-ink">
                  {scoringResult.weightFlipAnalysis.totalPotentialShift}
                </p>
              </div>
            </div>
            <p className="mt-3 text-body-sm text-ink/65">
              {scoringResult.weightFlipAnalysis.couldFlip
                ? "Weight changes could reverse the lead."
                : "Weights alone are unlikely to reverse the lead."}
            </p>
          </section>

          <section className="lg:col-span-2">
            <h3 className="text-body font-semibold text-ink">Dimension scores</h3>
            <div className="mt-4 rounded-tile bg-surface-strong p-4 shadow-legacy-sm">
              <DimensionScoreTable scores={scoringResult.normalizedByDimension} />
            </div>
            <p className="mt-3 text-label text-ink/65">Reflects your current answers and weights.</p>
          </section>
        </div>
      </details>

      <footer className="flex flex-col gap-5 rounded-feature border border-border bg-surface-strong p-6 shadow-legacy-sm sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <h2 className="font-serif text-section-title text-ink">Read the full memo</h2>
          <p className="mt-2 text-body-sm text-ink/70">Recommendation, tradeoffs, and next steps.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href="/weights"
            className="interaction-secondary inline-flex min-h-11 items-center justify-center rounded-control px-5 py-3 text-sm font-medium text-ink/70"
          >
            Adjust weights
          </Link>
          <PrimaryButtonLink href="/report">Open full report</PrimaryButtonLink>
        </div>
      </footer>
    </>
  );
}

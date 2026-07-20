"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ChevronDown, User } from "lucide-react";
import { questions } from "@/data/questions";
import { dimensions } from "@/data/dimensions";
import {
  buildRunSignature,
  filterAnswersToCurrent,
  ensureLocalProfile,
  hasReportedRunStat,
  loadAppState,
  markRunStatReported,
  recordRunInHistory,
  updateLocalProfile
} from "@/lib/storage";
import { reportCompletionStat } from "@/lib/stats-client";
import { usePrerequisiteGuard } from "@/lib/guards";
import { scoreDecision } from "@/lib/scoring";
import { AppState, LocalProfile } from "@/types";
import { DecisionBalance } from "@/components/results/decision-balance";
import { DimensionLeanRows } from "@/components/results/dimension-lean-rows";
import { dimensionIcons } from "@/components/results/dimension-icons";
import { getConclusionHeadline } from "@/components/results/verdict-copy";
import { ShareResultButton } from "@/components/share/share-result-button";
import { PrimaryButtonLink } from "@/components/ui/primary-button";

export default function ResultsPage() {
  const isReady = usePrerequisiteGuard("weights");
  const [state, setState] = useState<AppState | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [profile, setProfile] = useState<LocalProfile | null>(null);

  useEffect(() => {
    setState(loadAppState());
    setProfile(ensureLocalProfile());
  }, []);

  const scoringResult = useMemo(() => {
    if (!state) {
      return null;
    }

    const currentAnswers = filterAnswersToCurrent(state.answers, questions);
    return scoreDecision(currentAnswers, state.weights);
  }, [state]);

  // Every completed run is snapshotted into device-local history (dedupe by
  // signature makes re-visits update the existing entry instead of stacking).
  useEffect(() => {
    if (!scoringResult || !state) {
      return;
    }

    const currentAnswers = filterAnswersToCurrent(state.answers, questions);

    if (Object.keys(currentAnswers).length < questions.length) {
      return;
    }

    const rankedByWeightedGap = [...scoringResult.contributions].sort(
      (left, right) => Math.abs(right.weightedGap) - Math.abs(left.weightedGap)
    );
    const strongestContribution = rankedByWeightedGap[0];

    recordRunInHistory({
      answers: currentAnswers,
      weights: state.weights,
      direction: scoringResult.recommendedScenario,
      confidence: scoringResult.confidence,
      difference: scoringResult.weightedTotals.difference,
      topDimensionId:
        strongestContribution && Math.abs(strongestContribution.weightedGap) > 0
          ? strongestContribution.dimensionId
          : null
    });

    // One anonymous stat event per unique completed run: the signature is
    // marked locally before sending, so reloads and re-visits never
    // double-count. Only the coarse direction + confidence tier are sent.
    const signature = buildRunSignature(currentAnswers, state.weights);

    if (!hasReportedRunStat(signature)) {
      markRunStatReported(signature);
      reportCompletionStat(
        scoringResult.weightedTotals.difference === 0
          ? "balanced"
          : scoringResult.recommendedScenario,
        scoringResult.confidence
      );
    }
  }, [scoringResult, state]);

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

  if (!isReady || !scoringResult || !state) {
    return null;
  }

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
  const TopContributionIcon = topContribution
    ? dimensionIcons[topContribution.dimensionId]
    : dimensionIcons.career;
  const topContributionDirection =
    topContribution && topContribution.weightedGap < 0 ? "returning to China" : "staying in the US";
  const conclusionHook =
    topContribution && Math.abs(topContribution.weightedGap) > 0
      ? `${topContributionDimension?.label ?? topContribution.dimensionId} creates the strongest pull, pointing toward ${topContributionDirection}.`
      : "No single dimension creates a strong pull yet.";

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
                  <span className="text-body-sm font-semibold capitalize text-ink">{scoringResult.confidence}</span>
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

              <DecisionBalance
                difference={scoringResult.weightedTotals.difference}
                recommendedScenario={scoringResult.recommendedScenario}
                isRevealed={isRevealed}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-feature border border-border bg-surface p-6 shadow-legacy-sm sm:p-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-eyebrow text-ink-accent">Key drivers</p>
            <h2 className="mt-2 font-serif text-section-title text-ink">Where each dimension pulls</h2>
          </div>
          <p className="text-body-sm text-ink/70">Strongest weighted pull first.</p>
        </div>

        <div className="mt-6">
          <DimensionLeanRows
            contributions={scoringResult.contributions}
            uncertainDimensionIds={scoringResult.uncertainDimensions}
          />
        </div>
      </section>

      <details className="interaction-disclosure group rounded-feature border border-border bg-surface/70 shadow-legacy-sm">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 sm:p-6">
          <div>
            <h2 className="font-serif text-card-title text-ink">More detail</h2>
            <p className="mt-1 text-body-sm text-ink/70">Whether different weights could flip the result.</p>
          </div>
          <ChevronDown
            aria-hidden="true"
            className="h-5 w-5 shrink-0 text-ink/55 transition-transform duration-motion-standard ease-interaction group-open:rotate-180 motion-reduce:transition-none"
          />
        </summary>

        <div className="border-t border-border p-5 sm:p-6">
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
        </div>
      </details>

      <section
        aria-labelledby="share-heading"
        className="flex flex-col gap-4 rounded-feature border border-border bg-surface p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"
      >
        <div className="min-w-0">
          <h2 id="share-heading" className="font-serif text-card-title text-ink">
            Share this result
          </h2>
          <p className="mt-1 max-w-measure text-body-sm text-ink/65">
            The link carries your answers and weights inside it — nothing is uploaded, but anyone
            you send it to can see this result. Share it only with people you trust.
          </p>
        </div>
        <div className="shrink-0">
          <ShareResultButton
            answers={filterAnswersToCurrent(state.answers, questions)}
            weights={state.weights}
          />
        </div>
      </section>

      {profile && !profile.nickname && !profile.nudgeDismissed ? (
        <aside
          aria-label="Local profile suggestion"
          className="flex flex-col gap-4 rounded-feature border border-border bg-surface p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"
        >
          <div className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-tile text-ink-accent"
              style={{ backgroundColor: "rgb(var(--color-accent-warm) / 0.16)" }}
            >
              <User className="h-5 w-5" strokeWidth={1.8} />
            </span>
            <div>
              <p className="text-body font-medium text-ink">This result is saved on this device.</p>
              <p className="mt-1 text-body-sm text-ink/70">
                Add a nickname to make it yours — everything stays in this browser, private to you.
              </p>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <Link
              href="/profile"
              className="interaction-secondary rounded-control border border-ink/15 px-4 py-2 text-sm font-medium text-ink/75"
            >
              Add a nickname
            </Link>
            <button
              type="button"
              onClick={() => setProfile(updateLocalProfile({ nudgeDismissed: true }))}
              className="interaction-quiet rounded-control px-2 py-1.5 text-sm font-medium text-ink/60 hover:text-ink"
            >
              Not now
            </button>
          </div>
        </aside>
      ) : null}

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
          <PrimaryButtonLink href="/report">Open the memo</PrimaryButtonLink>
        </div>
      </footer>
    </>
  );
}

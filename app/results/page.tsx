"use client";

import { useEffect } from "react";
import { ChevronDown, User } from "lucide-react";
import { dimensions } from "@/data/dimensions";
import { buildCompletionSignature, buildRunSignature, claimRunStat, hasReportedRunStat } from "@/lib/storage";
import { reportCompletionStat } from "@/lib/stats-client";
import { toStatDirection } from "@/lib/stats-schema";
import {
  getTopContribution,
  snapshotRunToHistory,
  useRevealOnReady,
  useScoredRun
} from "@/lib/run-state";
import { useLocalProfile } from "@/lib/use-local-profile";
import { DecisionBalance } from "@/components/results/decision-balance";
import { DimensionLeanRows } from "@/components/results/dimension-lean-rows";
import { dimensionIcons } from "@/components/results/dimension-icons";
import { getConclusionHeadline } from "@/components/results/verdict-copy";
import { ShareResultButton } from "@/components/share/share-result-button";
import { PrimaryButtonLink } from "@/components/ui/primary-button";
import { SecondaryButtonLink } from "@/components/ui/secondary-button";

export default function ResultsPage() {
  const { isReady, status, scoringResult } = useScoredRun("weights");
  const isRevealed = useRevealOnReady(Boolean(scoringResult));
  const { profile, update: updateProfile } = useLocalProfile();

  // Every completed run is snapshotted into device-local history, and counted
  // once. Both key on the answers alone, so re-weighting revises the entry
  // instead of adding one.
  useEffect(() => {
    if (!scoringResult || !status?.isComplete) {
      return;
    }

    snapshotRunToHistory(status, scoringResult);

    // The claim is written before sending so reloads cannot double-count, and
    // released again if the send fails so the next visit retries. Only the
    // coarse direction + confidence tier go out.
    const completionSignature = buildCompletionSignature(status.answers);
    const legacySignature = buildRunSignature(status.answers, status.state.weights);

    if (!hasReportedRunStat(legacySignature)) {
      const release = claimRunStat(completionSignature);

      if (release) {
        void reportCompletionStat(toStatDirection(scoringResult), scoringResult.confidence).then(
          (sent) => {
            if (!sent) {
              release();
            }
          }
        );
      }
    }
  }, [scoringResult, status]);

  if (!isReady || !scoringResult || !status) {
    return null;
  }

  const isStayRecommended = scoringResult.recommendedScenario === "stay_us";
  const accentToken = isStayRecommended ? "--color-path-stay" : "--color-path-return";
  const accentColor = `rgb(var(${accentToken}))`;
  const accentAt = (alpha: number) => `rgb(var(${accentToken}) / ${alpha})`;
  const confidenceSteps =
    scoringResult.confidence === "low" ? 1 : scoringResult.confidence === "medium" ? 2 : 3;
  const conclusionHeadline = getConclusionHeadline(
    scoringResult.recommendedScenario,
    scoringResult.confidence,
    scoringResult.weightedTotals.difference
  );

  const topContribution = getTopContribution(scoringResult);
  const topContributionDimension = dimensions.find(
    (dimension) => dimension.id === topContribution?.dimensionId
  );
  const TopContributionIcon = topContribution
    ? dimensionIcons[topContribution.dimensionId]
    : dimensionIcons.career;
  const topContributionDirection =
    topContribution && topContribution.weightedGap < 0 ? "returning to China" : "staying in the US";
  const conclusionHook = topContribution
    ? `${topContributionDimension?.label ?? topContribution.dimensionId} creates the strongest pull, pointing toward ${topContributionDirection}.`
    : "No single dimension creates a strong pull yet.";

  return (
    <>
      <section
        className="relative overflow-hidden rounded-feature border p-6 shadow-soft sm:p-8 lg:p-10"
        style={{
          borderColor: accentAt(0.25),
          background: `linear-gradient(138deg, rgb(var(--color-surface)) 0%, rgb(var(--color-surface-strong)) 55%, ${accentAt(0.09)} 100%)`
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
                  style={{ backgroundColor: accentAt(0.07), color: accentColor }}
                >
                  <TopContributionIcon aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
                </span>
                <p className="pt-1 text-body-lg text-ink/70">{conclusionHook}</p>
              </div>
            </div>

            <div className="space-y-5 lg:border-l lg:border-hairline lg:pl-8">
              <div className="border-b border-hairline pb-5">
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

      <section className="border-t border-hairline pt-6 sm:pt-8">
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

      <details className="interaction-disclosure group border-t border-hairline">
        <summary className="-mx-3 flex cursor-pointer list-none items-center justify-between gap-4 !rounded-control px-3 py-5">
          <div>
            <h2 className="font-serif text-card-title text-ink">More detail</h2>
            <p className="mt-1 text-body-sm text-ink/70">Whether different weights could flip the result.</p>
          </div>
          <ChevronDown
            aria-hidden="true"
            className="h-5 w-5 shrink-0 text-ink/55 transition-transform duration-motion-standard ease-interaction group-open:rotate-180 motion-reduce:transition-none"
          />
        </summary>

        <div className="pb-5 sm:pb-6">
          <section>
            <h3 className="text-body font-semibold text-ink">Weight sensitivity</h3>
            <dl className="mt-3 flex flex-wrap gap-x-10 gap-y-3">
              <div>
                <dt className="text-label text-ink/65">Current gap</dt>
                <dd className="mt-1 text-lg font-semibold text-ink">
                  {scoringResult.weightFlipAnalysis.currentTotalGap}
                </dd>
              </div>
              <div>
                <dt className="text-label text-ink/65">Possible shift</dt>
                <dd className="mt-1 text-lg font-semibold text-ink">
                  {scoringResult.weightFlipAnalysis.totalPotentialShift}
                </dd>
              </div>
            </dl>
            <p className="mt-3 text-body-sm text-ink/65">
              {scoringResult.weightFlipAnalysis.couldFlip
                ? "Weight changes could reverse the lead."
                : "Weights alone are unlikely to reverse the lead."}
            </p>
          </section>
        </div>
      </details>

      {!profile || (!profile.nickname && !profile.nudgeDismissed) ? (
        <aside
          aria-label="Local profile suggestion"
          className="flex flex-col gap-4 rounded-card border-l-4 border-ink-accent/60 bg-surface-warm px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7 sm:py-6"
        >
          <div className="flex items-start gap-3">
            <User aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-ink-accent" strokeWidth={1.8} />
            <div>
              <p className="text-body font-medium text-ink">This result is saved on this device.</p>
              <p className="mt-1 text-body-sm text-ink/70">
                Add a nickname to make it yours — everything stays in this browser, private to you.
              </p>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <SecondaryButtonLink href="/profile">Add a nickname</SecondaryButtonLink>
            <button
              type="button"
              onClick={() => updateProfile({ nudgeDismissed: true })}
              className="interaction-quiet rounded-control px-2 py-1.5 text-sm font-medium text-ink/60 hover:text-ink"
            >
              Not now
            </button>
          </div>
        </aside>
      ) : null}

      <div className="border-t border-hairline">
        <div className="divide-y divide-hairline">
          <section aria-labelledby="share-heading" className="py-6 sm:py-8">
            <h2 id="share-heading" className="font-serif text-card-title text-ink">
              Share this result
            </h2>
            <p className="mt-1 max-w-measure text-body-sm text-ink/65">
              The link carries your answers and weights inside it — nothing is uploaded, but anyone
              you send it to can see this result. Share it only with people you trust.
            </p>
            <div className="mt-4">
              <ShareResultButton answers={status.answers} weights={status.state.weights} />
            </div>
          </section>

          <footer className="flex flex-col gap-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:py-8">
            <div>
              <h2 className="font-serif text-section-title text-ink">Read the full memo</h2>
              <p className="mt-2 text-body-sm text-ink/70">Recommendation, tradeoffs, and next steps.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <SecondaryButtonLink href="/weights">Adjust weights</SecondaryButtonLink>
              <PrimaryButtonLink href="/report">Open the memo</PrimaryButtonLink>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}

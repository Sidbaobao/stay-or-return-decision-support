"use client";

import { useEffect } from "react";
import { User } from "lucide-react";
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
import { useContent } from "@/lib/i18n/content";
import { strongestReason } from "@/lib/reasons";
import { useLocale, useLocalizedTitle } from "@/lib/i18n/provider";
import { ShareResultButton } from "@/components/share/share-result-button";
import { Band, OffsetGrid } from "@/components/ui/band";
import { PrimaryButtonLink } from "@/components/ui/primary-button";
import { SecondaryButtonLink } from "@/components/ui/secondary-button";
import { QuietButton } from "@/components/ui/quiet-button";

export default function ResultsPage() {
  const { isReady, status, scoringResult } = useScoredRun("weights");
  const { t } = useLocale();
  const { questions, dimensionPhrase } = useContent();
  useLocalizedTitle(t.titles.results);
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
  const { currentTotalGap, totalPotentialShift, couldFlip } = scoringResult.weightFlipAnalysis;
  // Whole points in prose; the rows below keep a decimal.
  const gapText = String(Math.round(currentTotalGap));
  const shiftText = String(Math.round(totalPotentialShift));
  const weightSensitivitySentence = couldFlip
    ? t.results.sensitivityCouldFlip(gapText, shiftText)
    : totalPotentialShift === 0
      ? t.results.sensitivityNoShift(gapText)
      : t.results.sensitivityCannotFlip(gapText, shiftText);
  const conclusionHeadline = t.results.headline(
    scoringResult.recommendedScenario,
    scoringResult.confidence,
    scoringResult.weightedTotals.difference
  );

  const topContribution = getTopContribution(scoringResult);
  const TopContributionIcon = topContribution
    ? dimensionIcons[topContribution.dimensionId]
    : dimensionIcons.career;
  const conclusionHook = topContribution
    ? t.results.hook(
        dimensionPhrase(topContribution.dimensionId),
        strongestReason(
          questions,
          status.answers,
          topContribution.dimensionId,
          topContribution.weightedGap < 0 ? "return_china" : "stay_us"
        )
      )
    : t.results.hookNone;

  return (
    <>
      <Band>
      <section
        className="relative overflow-hidden rounded-feature p-6 shadow-soft sm:p-8 lg:p-10"
        style={{
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
          <p className="text-eyebrow text-ink-accent">{t.results.eyebrow}</p>

          <div className="mt-7 grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-end">
            <div>
              <h1
                className="font-serif text-display"
                style={{ color: accentColor }}
              >
                {conclusionHeadline}
              </h1>

              <div
                className={`mt-6 flex items-start gap-3 transition-all delay-150 duration-500 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
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

            <div className="space-y-6 lg:pl-8">
              <div className="pb-1">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-body-sm font-medium text-ink/70">{t.results.confidence}</span>
                  <span className="text-body-sm font-semibold text-ink">
                    {t.results.confidenceLevel[scoringResult.confidence]}
                  </span>
                </div>
                <div
                  className="mt-3 flex gap-2"
                  role="img"
                  aria-label={t.results.confidenceAria(t.results.confidenceLevel[scoringResult.confidence])}
                >
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
      </Band>

      <Band>
        <OffsetGrid
          aside={
            <>
              <p className="text-eyebrow text-ink-accent">{t.results.keyDrivers}</p>
              <h2 className="mt-2 font-serif text-section-title text-ink">{t.results.wherePulls}</h2>
            </>
          }
        >
          <DimensionLeanRows
            contributions={scoringResult.contributions}
            uncertainDimensionIds={scoringResult.uncertainDimensions}
          />
          <p className="mt-6 text-body-sm text-ink/70">{weightSensitivitySentence}</p>
        </OffsetGrid>
      </Band>

      {!profile || (!profile.nickname && !profile.nudgeDismissed) ? (
        <Band padding="none" className="pb-band">
        <aside
          aria-label={t.results.nudgeAria}
          className="flex flex-col gap-4 rounded-card bg-surface-warm px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7 sm:py-6"
        >
          <div className="flex items-start gap-3">
            <User aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-ink-accent" strokeWidth={1.8} />
            <div>
              <p className="text-body font-medium text-ink">{t.results.nudgeTitle}</p>
              <p className="mt-1 text-body-sm text-ink/70">{t.results.nudgeBody}</p>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <SecondaryButtonLink href="/profile">{t.results.addNickname}</SecondaryButtonLink>
            <QuietButton onClick={() => updateProfile({ nudgeDismissed: true })}>{t.results.notNow}</QuietButton>
          </div>
        </aside>
        </Band>
      ) : null}

      {/* Sharing on its own warm band: words left, the control right. */}
      <Band tone="warm" padding="tight" aria-labelledby="share-heading">
        <div className="flex flex-col gap-4 py-2 sm:flex-row sm:items-center sm:justify-between sm:gap-10">
          <div className="min-w-0">
            <h2 id="share-heading" className="font-serif text-card-title text-ink">
              {t.results.shareHeading}
            </h2>
            <p className="mt-1 text-body-sm text-ink/65">{t.results.shareBody}</p>
          </div>
          <div className="shrink-0">
            <ShareResultButton answers={status.answers} weights={status.state.weights} />
          </div>
        </div>
      </Band>

      <Band as="footer">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-serif text-section-title text-ink">{t.results.readMemo}</h2>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <SecondaryButtonLink href="/weights">{t.results.adjustWeights}</SecondaryButtonLink>
            <PrimaryButtonLink href="/report">{t.results.openMemo}</PrimaryButtonLink>
          </div>
        </div>
      </Band>
    </>
  );
}

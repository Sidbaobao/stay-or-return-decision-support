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
import { CountUp } from "@/components/results/count-up";
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
import { DimensionId, ScenarioId } from "@/types";

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
  const difference = scoringResult.weightedTotals.difference;
  // Whole points in prose; the rows below keep a decimal.
  const gapText = String(Math.round(currentTotalGap));
  const shiftText = String(Math.round(totalPotentialShift));
  const weightSensitivityLines = couldFlip
    ? t.results.sensitivityCouldFlip(gapText, shiftText)
    : totalPotentialShift === 0
      ? t.results.sensitivityNoShift(gapText)
      : t.results.sensitivityCannotFlip(gapText, shiftText);
  const conclusionHeadline = t.results.headline(
    scoringResult.recommendedScenario,
    scoringResult.confidence,
    difference
  );

  const topContribution = getTopContribution(scoringResult);
  const TopContributionIcon = topContribution
    ? dimensionIcons[topContribution.dimensionId]
    : dimensionIcons.career;
  const reasonFor = (dimensionId: DimensionId, scenario: ScenarioId) =>
    strongestReason(questions, status.answers, dimensionId, scenario);
  const conclusionHook = topContribution
    ? t.results.hook(
        dimensionPhrase(topContribution.dimensionId),
        reasonFor(topContribution.dimensionId, topContribution.weightedGap < 0 ? "return_china" : "stay_us")
      )
    : t.results.hookNone;
  const revealClassName = `transition-all duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
    isRevealed ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
  }`;

  return (
    <>
      {/* The verdict: words on the left, the one number on the right. */}
      <Band>
        <div className={`grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:items-end lg:gap-16 ${revealClassName}`}>
          <div>
            <p className="num text-label text-ink/45">
              <span style={{ color: accentColor }}>03</span> · {t.results.confidence} ·{" "}
              {t.results.confidenceLevel[scoringResult.confidence]}
            </p>
            <h1 className="mt-4 text-display" style={{ color: accentColor }}>
              {conclusionHeadline}
            </h1>

            <div
              className={`mt-7 flex items-start gap-3 transition-all delay-200 duration-500 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
                isRevealed ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
              }`}
            >
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-tile"
                style={{ backgroundColor: accentAt(0.14), color: accentColor }}
              >
                <TopContributionIcon aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
              </span>
              <div className="space-y-1 pt-1.5 text-body-lg text-ink/75">
                {conclusionHook.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:text-right">
            <p
              className={`num text-hero-number ${isStayRecommended ? "text-gradient-stay" : "text-gradient-return"}`}
              style={{ filter: `drop-shadow(0 0 32px ${accentAt(0.35)})` }}
            >
              <CountUp value={difference} signed />
              <span className="sr-only">{t.results.srLean(scoringResult.recommendedScenario, difference)}</span>
            </p>
            <p className="mt-3 text-body text-ink/60">{t.results.leans(scoringResult.recommendedScenario)}</p>

            <div
              className="mt-8 flex gap-1.5 lg:ml-auto lg:max-w-[14rem]"
              role="img"
              aria-label={t.results.confidenceAria(t.results.confidenceLevel[scoringResult.confidence])}
            >
              {[1, 2, 3].map((step) => {
                const isFilled = step <= confidenceSteps;

                return (
                  <span key={step} className="h-1.5 flex-1 overflow-hidden rounded-pill bg-result-confidence-track">
                    <span
                      className={`block h-full origin-left rounded-pill transition-transform duration-500 ease-out motion-reduce:scale-x-100 motion-reduce:transition-none ${
                        isFilled && isRevealed ? "scale-x-100" : "scale-x-0"
                      }`}
                      style={{
                        backgroundColor: isFilled ? accentColor : "transparent",
                        boxShadow: isFilled ? `0 0 10px ${accentAt(0.6)}` : undefined,
                        transitionDelay: `${400 + step * 110}ms`
                      }}
                    />
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </Band>

      <Band tone="white">
        <OffsetGrid
          aside={
            <div className="lg:sticky lg:top-8">
              <p className="num text-label text-ink/45">{t.results.keyDrivers}</p>
              <h2 className="mt-2 text-section-title text-ink">{t.results.wherePulls}</h2>
              <div className="mt-8 max-w-sm">
                <DecisionBalance
                  difference={difference}
                  recommendedScenario={scoringResult.recommendedScenario}
                  isRevealed={isRevealed}
                />
              </div>
            </div>
          }
        >
          <DimensionLeanRows
            contributions={scoringResult.contributions}
            uncertainDimensionIds={scoringResult.uncertainDimensions}
            reasonFor={reasonFor}
          />
          <div className="mt-8 space-y-1 text-body-sm text-ink/65">
            {weightSensitivityLines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </OffsetGrid>
      </Band>

      {!profile || (!profile.nickname && !profile.nudgeDismissed) ? (
        <Band padding="none" className="pb-band pt-band">
          <aside
            aria-label={t.results.nudgeAria}
            className="flex flex-col gap-4 rounded-card bg-surface-raised px-5 py-5 shadow-soft sm:flex-row sm:items-center sm:justify-between sm:px-7 sm:py-6"
          >
            <div className="flex items-start gap-3">
              <User aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-ink-accent" strokeWidth={1.8} />
              <div>
                <p className="text-body font-medium text-ink">{t.results.nudgeTitle}</p>
                <p className="mt-1 text-body-sm text-ink/65">{t.results.nudgeBody}</p>
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
            <h2 id="share-heading" className="text-card-title text-ink">
              {t.results.shareHeading}
            </h2>
            <p className="mt-1 text-body-sm text-ink/60">{t.results.shareBody}</p>
          </div>
          <div className="shrink-0">
            <ShareResultButton answers={status.answers} weights={status.state.weights} />
          </div>
        </div>
      </Band>

      <Band as="footer">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <SecondaryButtonLink href="/weights">{t.results.adjustWeights}</SecondaryButtonLink>
          <PrimaryButtonLink href="/report">{t.results.openMemo}</PrimaryButtonLink>
        </div>
      </Band>
    </>
  );
}

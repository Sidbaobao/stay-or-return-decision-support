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
import { PartTiles } from "@/components/results/part-tiles";
import { SplitBar } from "@/components/results/split-bar";
import { dimensionIcons } from "@/components/results/dimension-icons";
import { VerdictHeader } from "@/components/results/verdict-header";
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

  const direction = scoringResult.recommendedScenario;
  const accentToken = direction === "stay_us" ? "--color-path-stay" : "--color-path-return";
  const accentColor = `rgb(var(${accentToken}))`;
  const accentAt = (alpha: number) => `rgb(var(${accentToken}) / ${alpha})`;
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
  const conclusionHeadline = t.results.headline(direction, scoringResult.confidence, difference);

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

  return (
    <>
      <Band>
        <VerdictHeader
          eyebrow={
            <>
              <span style={{ color: accentColor }}>03</span> · {t.results.confidence} ·{" "}
              {t.results.confidenceLevel[scoringResult.confidence]}
            </>
          }
          headline={conclusionHeadline}
          direction={direction}
          difference={difference}
          confidence={scoringResult.confidence}
          isRevealed={isRevealed}
        >
          <div className="flex items-start gap-3">
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
        </VerdictHeader>
      </Band>

      {/* The quick read: the two shares, then the six parts as rings. The
          memo keeps the ranked bars and the analysis. */}
      <Band tone="white">
        <OffsetGrid aside={<h2 className="text-section-title text-ink">{t.results.splitHeading}</h2>}>
          <SplitBar
            stay={scoringResult.weightedTotals.stay_us}
            goBack={scoringResult.weightedTotals.return_china}
            isRevealed={isRevealed}
          />
        </OffsetGrid>
      </Band>

      <Band>
        <OffsetGrid
          aside={
            <div className="lg:sticky lg:top-8">
              <h2 className="text-section-title text-ink">{t.results.partsHeading}</h2>
              <div className="mt-5 space-y-1 text-body-sm text-ink/60">
                {weightSensitivityLines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </div>
          }
        >
          <PartTiles
            contributions={scoringResult.contributions}
            normalized={scoringResult.normalizedByDimension}
            uncertainDimensionIds={scoringResult.uncertainDimensions}
            isRevealed={isRevealed}
            reasonFor={reasonFor}
          />
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

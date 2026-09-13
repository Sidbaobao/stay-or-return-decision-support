import { dictionaries, Locale } from "@/lib/i18n";
import { getDimensionLabel } from "@/lib/i18n/content";
import { DimensionContribution, RecommendationReport, ScenarioId, ScoringResult } from "@/types";

// The memo says only what this run's numbers support: how far the answers
// lean, which dimensions made the lead, what pulls the other way, and what
// would change the result. The sentences themselves live in the dictionary
// for each language; this file only decides which ones apply.

function byPull(left: DimensionContribution, right: DimensionContribution) {
  return Math.abs(right.weightedGap) - Math.abs(left.weightedGap);
}

export function buildRecommendationReport(scoringResult: ScoringResult, locale: Locale): RecommendationReport {
  const t = dictionaries[locale].memo;
  const labelOf = (dimensionId: string) => getDimensionLabel(locale, dimensionId);
  const { recommendedScenario, confidence, contributions, uncertainDimensions, weightFlipAnalysis } = scoringResult;
  const otherScenario: ScenarioId = recommendedScenario === "stay_us" ? "return_china" : "stay_us";
  const gap = weightFlipAnalysis.currentTotalGap;
  const shift = weightFlipAnalysis.totalPotentialShift;
  const isBalanced = gap === 0;

  const leadLabels = contributions
    .filter((contribution) => contribution.favoredScenario === recommendedScenario)
    .sort(byPull)
    .slice(0, 2)
    .map((contribution) => labelOf(contribution.dimensionId));
  const againstLabels = contributions
    .filter((contribution) => contribution.favoredScenario === otherScenario)
    .sort(byPull)
    .slice(0, 2)
    .map((contribution) => labelOf(contribution.dimensionId));
  const closeLabels = uncertainDimensions.map(labelOf);
  const otherPath = t.otherPath[recommendedScenario];

  // ---- the lead, in one paragraph
  const lead: string[] = [];

  if (isBalanced) {
    lead.push(t.leadBalanced);
  } else {
    lead.push(t.leadBy(recommendedScenario, gap.toFixed(1)));

    if (leadLabels.length > 0) {
      lead.push(t.carries(leadLabels, againstLabels[0] ?? null));
    }

    lead.push(t.margin[confidence]);
  }

  // ---- what would change it
  const whatWouldChange: string[] = [];

  if (isBalanced) {
    whatWouldChange.push(t.levelPaths);
  } else {
    whatWouldChange.push(
      againstLabels.length > 0 ? t.otherStrongerOn(otherPath, againstLabels, leadLabels) : t.otherNotStronger(otherPath)
    );

    if (closeLabels.length === 0) {
      whatWouldChange.push(t.noClose);
    } else if (shift === 0) {
      whatWouldChange.push(t.closeBalanced(closeLabels));
    } else {
      whatWouldChange.push(t.closeShift(closeLabels, shift.toFixed(1), gap.toFixed(1), weightFlipAnalysis.couldFlip));
    }
  }

  // ---- before deciding
  const beforeDeciding: string[] = [];

  beforeDeciding.push(!isBalanced && leadLabels.length > 0 ? t.planCompare(leadLabels) : t.planCompareGeneric);

  if (!isBalanced && againstLabels.length > 0) {
    beforeDeciding.push(t.checkAssumption(againstLabels[0]));
  }

  if (closeLabels.length > 0 && shift > 0) {
    beforeDeciding.push(t.revisitWeights(closeLabels));
  }

  return {
    recommendedScenario,
    confidence,
    isBalanced,
    lead: lead.join(t.sentenceSeparator),
    whatWouldChange,
    beforeDeciding,
    disclaimer: t.disclaimer
  };
}

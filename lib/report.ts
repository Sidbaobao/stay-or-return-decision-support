import { dictionaries, Locale } from "@/lib/i18n";
import { getDimensionPhrase, getQuestions } from "@/lib/i18n/content";
import { strongestReason } from "@/lib/reasons";
import { Answers, DimensionContribution, RecommendationReport, ScenarioId, ScoringResult } from "@/types";

// The memo says only what this run's numbers support: how far the answers
// lean, which parts made the lead and which answers those were, what pulls
// the other way, and what would change the result. The sentences live in
// the dictionary for each language; this file decides which apply and
// hands them the reader's own answers to quote.

function byPull(left: DimensionContribution, right: DimensionContribution) {
  return Math.abs(right.weightedGap) - Math.abs(left.weightedGap);
}

// Whole points in prose. The tables keep a decimal.
function points(value: number) {
  return String(Math.round(value));
}

export function buildRecommendationReport(
  scoringResult: ScoringResult,
  answers: Answers,
  locale: Locale
): RecommendationReport {
  const t = dictionaries[locale].memo;
  const questions = getQuestions(locale);
  const phraseOf = (dimensionId: string) => getDimensionPhrase(locale, dimensionId);
  const { recommendedScenario, confidence, contributions, uncertainDimensions, weightFlipAnalysis } = scoringResult;
  const otherScenario: ScenarioId = recommendedScenario === "stay_us" ? "return_china" : "stay_us";
  const gap = weightFlipAnalysis.currentTotalGap;
  const shift = weightFlipAnalysis.totalPotentialShift;
  const isBalanced = gap === 0;

  const leadContributions = contributions
    .filter((contribution) => contribution.favoredScenario === recommendedScenario)
    .sort(byPull)
    .slice(0, 2);
  const againstContributions = contributions
    .filter((contribution) => contribution.favoredScenario === otherScenario)
    .sort(byPull)
    .slice(0, 2);

  const leadPhrases = leadContributions.map((contribution) => phraseOf(contribution.dimensionId));
  const leadReasons = leadContributions
    .map((contribution) => strongestReason(questions, answers, contribution.dimensionId, recommendedScenario))
    .filter((reason): reason is string => reason !== null);
  const againstPhrases = againstContributions.map((contribution) => phraseOf(contribution.dimensionId));
  const againstReason = againstContributions[0]
    ? strongestReason(questions, answers, againstContributions[0].dimensionId, otherScenario)
    : null;
  const closePhrases = uncertainDimensions.map(phraseOf);
  const otherPath = t.otherPath[recommendedScenario];

  // ---- the lead, in one paragraph
  const lead: string[] = [];

  if (isBalanced) {
    lead.push(t.leadBalanced);
  } else {
    lead.push(t.leadBy(recommendedScenario, points(gap)));

    if (leadPhrases.length > 0) {
      lead.push(t.carries(leadPhrases, leadReasons, againstPhrases[0] ?? null));
    }

    lead.push(t.margin[confidence]);
  }

  // ---- what would change it
  const whatWouldChange: string[] = [];

  if (isBalanced) {
    whatWouldChange.push(t.levelPaths);
  } else {
    whatWouldChange.push(
      againstPhrases.length > 0 ? t.otherStrongerOn(otherPath, againstPhrases, leadPhrases) : t.otherNotStronger(otherPath)
    );

    if (closePhrases.length === 0) {
      whatWouldChange.push(t.noClose);
    } else if (shift === 0) {
      whatWouldChange.push(t.closeBalanced(closePhrases));
    } else {
      whatWouldChange.push(t.closeShift(closePhrases, points(shift), points(gap), weightFlipAnalysis.couldFlip));
    }
  }

  // ---- before deciding
  const beforeDeciding: string[] = [];

  beforeDeciding.push(!isBalanced && leadPhrases.length > 0 ? t.planCompare(leadPhrases) : t.planCompareGeneric);

  if (!isBalanced && againstPhrases.length > 0) {
    beforeDeciding.push(t.checkAssumption(againstPhrases[0], againstReason));
  }

  if (closePhrases.length > 0 && shift > 0) {
    beforeDeciding.push(t.revisitWeights(closePhrases));
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

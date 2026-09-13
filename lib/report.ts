import { dimensions } from "@/data/dimensions";
import { DimensionContribution, RecommendationReport, ScenarioId, ScoringResult } from "@/types";

// The memo says only what this run's numbers support: how far the answers
// lean, which dimensions made the lead, what pulls the other way, and what
// would change the result. No sentence here is a template that reads the
// same for every run.

const pathWord: Record<ScenarioId, string> = {
  stay_us: "staying",
  return_china: "returning"
};

const otherPathName: Record<ScenarioId, string> = {
  stay_us: "Returning to China",
  return_china: "Staying in the US"
};

const reportDisclaimer = "A structured reflection, not legal, immigration or financial advice.";

const marginNote = {
  low: "The margin is small: a few different answers would change it.",
  medium: "The margin is clear but not decisive.",
  high: "The margin is wide."
} as const;

function labelOf(dimensionId: string) {
  return dimensions.find((dimension) => dimension.id === dimensionId)?.label ?? dimensionId;
}

function joinLabels(labels: string[]) {
  if (labels.length <= 1) {
    return labels[0] ?? "";
  }

  return `${labels.slice(0, -1).join(", ")} and ${labels[labels.length - 1]}`;
}

function byPull(left: DimensionContribution, right: DimensionContribution) {
  return Math.abs(right.weightedGap) - Math.abs(left.weightedGap);
}

export function buildRecommendationReport(scoringResult: ScoringResult): RecommendationReport {
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
  const closeAre = closeLabels.length === 1 ? "is" : "are";
  const closeThem = closeLabels.length === 1 ? "it" : "them";

  // ---- the lead, in one paragraph
  const lead: string[] = [];

  if (isBalanced) {
    lead.push("Your answers come out evenly balanced between the two paths.");
  } else {
    lead.push(`Your answers lean toward ${pathWord[recommendedScenario]} by ${gap.toFixed(1)} points.`);

    if (leadLabels.length > 0) {
      const carries =
        leadLabels.length === 1
          ? `${leadLabels[0]} carries most of that lead`
          : `${joinLabels(leadLabels)} carry most of that lead`;

      lead.push(
        againstLabels.length > 0
          ? `${carries}; ${againstLabels[0]} is the strongest pull the other way.`
          : `${carries}; nothing pulls the other way.`
      );
    }

    lead.push(marginNote[confidence]);
  }

  // ---- what would change it
  const whatWouldChange: string[] = [];

  if (isBalanced) {
    whatWouldChange.push("The two paths are level. Any change to your answers or weights would tip the result.");
  } else {
    if (againstLabels.length > 0) {
      whatWouldChange.push(
        `${otherPathName[recommendedScenario]} is stronger on ${joinLabels(againstLabels)}. For it to lead, ${
          againstLabels.length === 1 ? "that" : "those"
        } would have to matter more to you than ${joinLabels(leadLabels)} ${leadLabels.length === 1 ? "does" : "do"} now.`
      );
    } else {
      whatWouldChange.push(
        `${otherPathName[recommendedScenario]} is not stronger on any dimension.`
      );
    }

    if (closeLabels.length === 0) {
      whatWouldChange.push("No dimension is close. Re-weighting would not flip this result; only different answers would.");
    } else if (shift === 0) {
      whatWouldChange.push(
        `${joinLabels(closeLabels)} ${closeAre} balanced, so re-weighting ${closeThem} would not move the result; only different answers would.`
      );
    } else {
      whatWouldChange.push(
        `${joinLabels(closeLabels)} ${closeAre} still close. Re-weighting ${closeThem} could move the result by up to ${shift.toFixed(
          1
        )} points against a lead of ${gap.toFixed(1)}, so weights ${
          weightFlipAnalysis.couldFlip ? "could flip it" : "alone would not flip it"
        }.`
      );
    }
  }

  // ---- before deciding
  const beforeDeciding: string[] = [];

  if (!isBalanced && leadLabels.length > 0) {
    beforeDeciding.push(
      `Write down one concrete plan for each path and compare them on ${
        leadLabels.length === 1 ? "the dimension that decided this" : "the two dimensions that decided this"
      }: ${joinLabels(leadLabels)}.`
    );
  } else {
    beforeDeciding.push("Write down one concrete plan for each path and compare them side by side.");
  }

  if (!isBalanced && againstLabels.length > 0) {
    beforeDeciding.push(`Check the assumption behind your strongest pull the other way: ${againstLabels[0]}.`);
  }

  if (closeLabels.length > 0 && shift > 0) {
    beforeDeciding.push(`Revisit your weights once ${joinLabels(closeLabels)} ${closeAre} clearer.`);
  }

  return {
    recommendedScenario,
    confidence,
    isBalanced,
    lead: lead.join(" "),
    whatWouldChange,
    beforeDeciding,
    disclaimer: reportDisclaimer
  };
}

import { dimensions } from "@/data/dimensions";
import { reportDisclaimer } from "@/data/report-templates";
import { RecommendationReport, ScoringResult } from "@/types";

const scenarioLabelMap = {
  stay_us: "staying in the US",
  return_china: "returning to China"
} as const;

const dimensionNarratives = {
  career: {
    stay_us: "your answers suggest a stronger practical career case for staying, especially around realistic access and fit.",
    return_china: "your answers suggest the more realistic career path may currently be in China."
  },
  salary_cost: {
    stay_us: "your current inputs suggest the US offers the stronger near-term financial case after considering costs.",
    return_china: "your current inputs suggest China may offer the more workable financial position for your situation."
  },
  immigration: {
    stay_us: "immigration constraints appear manageable enough that they do not outweigh the benefits of staying.",
    return_china: "immigration burden and uncertainty are materially weakening the case for staying."
  },
  family_emotion: {
    stay_us: "family factors do not currently pull strongly enough toward returning to outweigh other priorities.",
    return_china: "family proximity, obligations, or support appear to materially strengthen the case for returning."
  },
  lifestyle: {
    stay_us: "your current lifestyle preferences appear more compatible with remaining in the US.",
    return_china: "your current lifestyle preferences appear more compatible with returning to China."
  },
  long_term: {
    stay_us: "your longer-range plans currently align more with building from the US.",
    return_china: "your longer-range plans currently align more with building from China."
  }
} as const;

function getDimensionLabel(dimensionId: keyof typeof dimensionNarratives) {
  return dimensions.find((dimension) => dimension.id === dimensionId)?.label ?? dimensionId;
}

export function buildRecommendationReport(scoringResult: ScoringResult): RecommendationReport {
  const otherScenario = scoringResult.recommendedScenario === "stay_us" ? "return_china" : "stay_us";
  const topSupportingFactors = scoringResult.contributions
    .filter((contribution) => contribution.favoredScenario === scoringResult.recommendedScenario)
    .sort((left, right) => Math.abs(right.weightedGap) - Math.abs(left.weightedGap))
    .slice(0, 3)
    .map((contribution) => {
      const dimensionId = contribution.dimensionId as keyof typeof dimensionNarratives;
      return `${getDimensionLabel(dimensionId)} currently supports ${scenarioLabelMap[scoringResult.recommendedScenario]} because ${dimensionNarratives[dimensionId][scoringResult.recommendedScenario]}`;
    });

  const otherPathStrengths = scoringResult.contributions
    .filter((contribution) => contribution.favoredScenario === otherScenario)
    .sort((left, right) => Math.abs(right.weightedGap) - Math.abs(left.weightedGap))
    .slice(0, 2)
    .map((contribution) => getDimensionLabel(contribution.dimensionId as keyof typeof dimensionNarratives));

  const topRecommendedDimensions = scoringResult.contributions
    .filter((contribution) => contribution.favoredScenario === scoringResult.recommendedScenario)
    .sort((left, right) => Math.abs(right.weightedGap) - Math.abs(left.weightedGap))
    .slice(0, 2)
    .map((contribution) => getDimensionLabel(contribution.dimensionId as keyof typeof dimensionNarratives));

  const closeDimensionLabels = scoringResult.uncertainDimensions.map((dimensionId) =>
    getDimensionLabel(dimensionId as keyof typeof dimensionNarratives)
  );

  const leadStrength =
    scoringResult.confidence === "low"
      ? "leans slightly"
      : scoringResult.confidence === "medium"
        ? "points more clearly"
        : "points clearly";

  const summary = `Your current responses ${leadStrength} toward ${scenarioLabelMap[scoringResult.recommendedScenario]}.`;

  const confidenceNote =
    scoringResult.confidence === "low"
      ? `The overall result is close. ${closeDimensionLabels.length > 0 ? `${closeDimensionLabels.join(", ")} remain relatively close, so new information or different priorities could still change the picture.` : "That makes this better read as a directional lean than a settled recommendation."}`
      : scoringResult.confidence === "medium"
        ? `The result shows a meaningful lead, but not a final verdict. ${closeDimensionLabels.length > 0 ? `Dimensions such as ${closeDimensionLabels.join(", ")} are still close enough that they deserve a second look.` : "It still reflects your current inputs rather than a guaranteed outcome."}`
        : `The result is more clearly directional under your current inputs. ${closeDimensionLabels.length > 0 ? `Even so, ${closeDimensionLabels.join(", ")} are still not fully settled.` : "It should still be treated as structured reflection rather than certainty."}`;

  const whyNotOtherPath = [
    otherPathStrengths.length > 0
      ? `${scenarioLabelMap[otherScenario].charAt(0).toUpperCase() + scenarioLabelMap[otherScenario].slice(1)} is not without strengths. In your current results, it performs relatively well on ${otherPathStrengths.join(" and ")}.`
      : `${scenarioLabelMap[otherScenario].charAt(0).toUpperCase() + scenarioLabelMap[otherScenario].slice(1)} still has some strengths, even if they are not currently large enough to lead.`,
    topRecommendedDimensions.length > 0
      ? `It is not leading because those strengths are currently outweighed by stronger results in ${topRecommendedDimensions.join(" and ")} under your present weighting.`
      : "It is not leading because the current weighted balance still favors the recommended path.",
    scoringResult.weightFlipAnalysis.couldFlip
      ? "For the non-leading path to move ahead, close dimensions would need to matter more to you or the current leading dimensions would need to weaken."
      : "For the non-leading path to move ahead, either your priorities would need to shift materially or the practical case behind the leading path would need to change."
  ];

  const tradeoffs = [
    closeDimensionLabels.length > 0
      ? `Even with the current recommendation, ${closeDimensionLabels.join(" and ")} remain live tradeoffs rather than minor details.`
      : "Even with the current recommendation, there are still real tradeoffs that the score does not erase.",
    scoringResult.weightFlipAnalysis.couldFlip
      ? "Changing weights could realistically change the result, so this decision may still be sensitive to how you rank close dimensions."
      : "Changing weights alone looks less likely to reverse the result, which suggests the current lead is not only a weighting artifact."
  ];

  const nextSteps = [
    `Compare one specific plan for ${scenarioLabelMap.stay_us} and one specific plan for ${scenarioLabelMap.return_china} side by side.`,
    "Recheck the two assumptions most likely to be wrong, such as job access, actual savings outlook, or family constraints.",
    closeDimensionLabels.length > 0
      ? `Revisit your weights after clarifying the close dimensions: ${closeDimensionLabels.join(", ")}.`
      : "If you still feel uncertain, revisit your weights after gathering more concrete information."
  ];

  return {
    recommendedScenario: scoringResult.recommendedScenario,
    confidence: scoringResult.confidence,
    summary,
    confidenceNote,
    supportingFactors:
      topSupportingFactors.length > 0
        ? topSupportingFactors
        : [`No single dimension is strongly dominating. The current lead comes from several smaller differences adding up.`],
    whyNotOtherPath,
    tradeoffs,
    nextSteps,
    disclaimer: reportDisclaimer
  };
}

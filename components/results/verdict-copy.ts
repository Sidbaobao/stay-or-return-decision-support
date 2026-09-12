import { ConfidenceLevel, ScenarioId } from "@/types";

export function getConclusionHeadline(direction: ScenarioId, confidence: ConfidenceLevel, gap: number) {
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

// Third-person register for the shared read-only view: the reader is not the
// person who answered, so "you're leaning" would misattribute the result.
export function getSharedHeadline(direction: ScenarioId, confidence: ConfidenceLevel, gap: number) {
  const pathLabel = direction === "stay_us" ? "staying" : "returning";

  if (confidence === "high" && gap > 25) {
    return `This result points clearly toward ${pathLabel}.`;
  }

  if (confidence === "medium" && gap >= 10 && gap <= 25) {
    return `This result leans toward ${pathLabel}—with real tradeoffs.`;
  }

  return `It's close. This result leans slightly toward ${pathLabel}.`;
}

// Past-tense register for history rows and snapshots. A zero gap is reported
// as balanced: the engine's tie-break defaults to stay_us, which would
// otherwise be shown to the user as a lean they never expressed.
export function getPastRunStatement(
  direction: ScenarioId,
  confidence: ConfidenceLevel,
  difference?: number
) {
  if (difference === 0) {
    return "Came out evenly balanced";
  }

  const pathLabel = direction === "stay_us" ? "staying" : "returning";

  if (confidence === "high") {
    return `Pointed clearly toward ${pathLabel}`;
  }

  if (confidence === "medium") {
    return `Leaned toward ${pathLabel}`;
  }

  return `Leaned slightly toward ${pathLabel}`;
}

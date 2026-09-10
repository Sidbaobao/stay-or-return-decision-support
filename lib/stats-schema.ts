import { ScoringResult } from "@/types";

// Shared by the client sender and the server route so the whitelist can never
// drift between them. Isomorphic: no server or browser imports.

export const STAT_DIRECTIONS = ["stay_us", "return_china", "balanced"] as const;
export const STAT_CONFIDENCES = ["low", "medium", "high"] as const;

export type StatDirection = (typeof STAT_DIRECTIONS)[number];
export type StatConfidence = (typeof STAT_CONFIDENCES)[number];

export function isStatDirection(value: unknown): value is StatDirection {
  return typeof value === "string" && (STAT_DIRECTIONS as readonly string[]).includes(value);
}

export function isStatConfidence(value: unknown): value is StatConfidence {
  return typeof value === "string" && (STAT_CONFIDENCES as readonly string[]).includes(value);
}

// The tie rule lives here and only here: a zero gap is "balanced", never the
// engine's stay_us default.
export function toStatDirection(
  result: Pick<ScoringResult, "recommendedScenario" | "weightedTotals">
): StatDirection {
  return result.weightedTotals.difference === 0 ? "balanced" : result.recommendedScenario;
}

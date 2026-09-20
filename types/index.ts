export type ScenarioId = "stay_us" | "return_china";

export type DimensionId =
  | "career"
  | "salary_cost"
  | "immigration"
  | "family_emotion"
  | "lifestyle"
  | "long_term";

export type Dimension = {
  id: DimensionId;
  label: string;
  shortLabel: string;
  // How the dimension is named inside a sentence ("the visa situation").
  phrase: string;
};

export type QuestionOption = {
  id: string;
  label: string;
  // What choosing this says, as a clause after "you said": "you'd have more
  // left over each month in the US". Balanced options have none; only an
  // answer that pushes one way gets quoted back.
  reason?: string;
  stay_us_score: number;
  return_china_score: number;
};

export type Question = {
  id: string;
  dimensionId: DimensionId;
  prompt: string;
  options: QuestionOption[];
};

export type Answers = Record<string, string>;

export type Weights = Record<DimensionId, number>;

export type RawDimensionScore = {
  dimensionId: DimensionId;
  stay_us: number;
  return_china: number;
  maxPossible: number;
};

export type NormalizedDimensionScore = {
  dimensionId: DimensionId;
  stay_us: number;
  return_china: number;
};

export type WeightedTotals = {
  stay_us: number;
  return_china: number;
  difference: number;
};

export type ConfidenceLevel = "low" | "medium" | "high";

export type RecommendationReport = {
  recommendedScenario: ScenarioId;
  confidence: ConfidenceLevel;
  isBalanced: boolean;
  // One sentence per line. An item in a list may take several lines.
  lead: string[];
  whatWouldChange: string[][];
  beforeDeciding: string[][];
  disclaimer: string[];
};

export type AppState = {
  answers: Answers;
  weights: Weights;
};

// Device-only identity and history. Stored in this browser's localStorage and
// never sent anywhere — there is no account, no sync, no server copy.
export type ProfileAccentId = "stay" | "return" | "warm";

export type LocalProfile = {
  profileVersion: "v1";
  nickname: string;
  accentId: ProfileAccentId;
  createdAt: string;
  nudgeDismissed: boolean;
};

export type HistoryEntry = {
  id: string;
  completedAt: string;
  lastOpenedAt: string;
  questionsVersion: string;
  // Identifies the run by its answers alone: re-weighting the same answers is
  // the same decision, not a new one.
  completionSignature: string;
  // Legacy answers+weights hash, still written so a device that downgrades
  // keeps working.
  signature: string;
  direction: ScenarioId;
  confidence: ConfidenceLevel;
  difference: number;
  topDimensionId: DimensionId | null;
  answers: Answers;
  weights: Weights;
};

export type ScoringResult = {
  rawByDimension: RawDimensionScore[];
  normalizedByDimension: NormalizedDimensionScore[];
  weightedTotals: WeightedTotals;
  contributions: DimensionContribution[];
  uncertainDimensions: DimensionId[];
  weightFlipAnalysis: WeightFlipAnalysis;
  recommendedScenario: ScenarioId;
  confidence: ConfidenceLevel;
};

export type DimensionContribution = {
  dimensionId: DimensionId;
  rawGap: number;
  weightedGap: number;
  favoredScenario: ScenarioId | "tie";
};

export type WeightFlipAnalysis = {
  currentTotalGap: number;
  uncertainDimensionIds: DimensionId[];
  totalPotentialShift: number;
  couldFlip: boolean;
};

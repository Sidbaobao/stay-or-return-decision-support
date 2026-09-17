import { Answers, DimensionId, Question, ScenarioId } from "@/types";

// The answer that pushed a part of the decision hardest toward one side,
// quoted back as its `reason`. Pass the localized questions, so the quote
// is in the reader's language. Null when nothing in that part pushes that
// way, or the pushing answers carry no reason.
export function strongestReason(
  questions: Question[],
  answers: Answers,
  dimensionId: DimensionId,
  scenario: ScenarioId
): string | null {
  let best: { margin: number; reason: string } | null = null;

  for (const question of questions) {
    if (question.dimensionId !== dimensionId) {
      continue;
    }

    const option = question.options.find((candidate) => candidate.id === answers[question.id]);

    if (!option?.reason) {
      continue;
    }

    const margin =
      scenario === "stay_us"
        ? option.stay_us_score - option.return_china_score
        : option.return_china_score - option.stay_us_score;

    if (margin > 0 && (best === null || margin > best.margin)) {
      best = { margin, reason: option.reason };
    }
  }

  return best?.reason ?? null;
}

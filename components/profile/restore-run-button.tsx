"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { questions } from "@/data/questions";
import { scoreDecision } from "@/lib/scoring";
import {
  filterAnswersToCurrent,
  hasCompleteAnswers,
  hasWeights,
  loadAppState,
  recordRunInHistory,
  restoreRunFromHistory
} from "@/lib/storage";
import { HistoryEntry } from "@/types";

type RestoreRunButtonProps = {
  entry: HistoryEntry;
};

const quietButtonClassName =
  "interaction-quiet rounded-control px-1.5 py-1 text-sm font-medium text-action-primary hover:text-action-primary-hover";

// Restoring replaces the current run with the snapshot. Three cases:
// - current run empty → restore directly;
// - current run complete → snapshot it into history first (so nothing is
//   lost), then restore;
// - current run partially answered → unfinished work would be destroyed, so
//   ask inline before replacing.
export function RestoreRunButton({ entry }: RestoreRunButtonProps) {
  const router = useRouter();
  const [isConfirming, setIsConfirming] = useState(false);

  const performRestore = () => {
    const state = loadAppState();
    const currentAnswers = filterAnswersToCurrent(state.answers, questions);
    const isComplete = hasCompleteAnswers({ ...state, answers: currentAnswers }, questions.length);

    if (isComplete && hasWeights(state)) {
      const currentResult = scoreDecision(currentAnswers, state.weights);
      const rankedContributions = [...currentResult.contributions].sort(
        (left, right) => Math.abs(right.weightedGap) - Math.abs(left.weightedGap)
      );
      const topContribution = rankedContributions[0];

      recordRunInHistory({
        answers: currentAnswers,
        weights: state.weights,
        direction: currentResult.recommendedScenario,
        confidence: currentResult.confidence,
        difference: currentResult.weightedTotals.difference,
        topDimensionId:
          topContribution && Math.abs(topContribution.weightedGap) > 0
            ? topContribution.dimensionId
            : null
      });
    }

    if (restoreRunFromHistory(entry.id)) {
      router.push("/results");
    }
  };

  const handleClick = () => {
    const state = loadAppState();
    const currentAnswers = filterAnswersToCurrent(state.answers, questions);
    const answeredCount = Object.keys(currentAnswers).length;
    const isComplete = hasCompleteAnswers({ ...state, answers: currentAnswers }, questions.length);

    if (answeredCount > 0 && !isComplete) {
      setIsConfirming(true);
      return;
    }

    performRestore();
  };

  if (isConfirming) {
    return (
      <span className="inline-flex flex-wrap items-center gap-2">
        <span className="text-sm text-ink/70">Replace your in-progress run?</span>
        <button type="button" onClick={performRestore} className={quietButtonClassName}>
          Replace
        </button>
        <button
          type="button"
          onClick={() => setIsConfirming(false)}
          className="interaction-quiet rounded-control px-1.5 py-1 text-sm font-medium text-ink/60 hover:text-ink"
        >
          Keep current
        </button>
      </span>
    );
  }

  return (
    <button type="button" onClick={handleClick} className={quietButtonClassName}>
      Restore
    </button>
  );
}

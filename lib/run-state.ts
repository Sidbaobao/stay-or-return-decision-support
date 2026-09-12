"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { questions } from "@/data/questions";
import { usePrerequisiteGuard, GuardRequirement } from "@/lib/guards";
import { scoreDecision } from "@/lib/scoring";
import {
  filterAnswersToCurrent,
  getRunHistoryEntry,
  hasCompleteAnswers,
  loadAppState,
  QUESTIONS_VERSION,
  recordRunInHistory,
  saveAppState,
  STORAGE_KEYS,
  subscribeToStorageKey
} from "@/lib/storage";
import { AppState, Answers, DimensionContribution, ScoringResult } from "@/types";

// One derivation of "where is this run up to", instead of the same
// load → filter → count chain hand-rolled in the nav, the home CTA, the
// results and report pages, and the restore button.

export type RunStatus = {
  state: AppState;
  answers: Answers;
  answeredCount: number;
  isComplete: boolean;
  canScore: boolean;
};

export function deriveRunStatus(state: AppState): RunStatus {
  const answers = filterAnswersToCurrent(state.answers, questions);
  const isComplete = hasCompleteAnswers({ ...state, answers }, questions.length);

  return {
    state,
    answers,
    answeredCount: Object.keys(answers).length,
    isComplete,
    // Weights always exist (they default), so a complete set of answers is
    // the only real gate. The nav used to show a second "set your weights"
    // lock that could never engage.
    canScore: isComplete
  };
}

export function readRunStatus(): RunStatus {
  return deriveRunStatus(loadAppState());
}

// Null until mounted, so server and first client render agree. Re-reads
// whenever the run is written anywhere — including another tab, and including
// "Reset current run", which previously left stale answers on screen.
export function useRunStatus(): RunStatus | null {
  const [status, setStatus] = useState<RunStatus | null>(null);

  useEffect(() => {
    setStatus(readRunStatus());

    return subscribeToStorageKey(STORAGE_KEYS.currentRun, () => {
      setStatus(readRunStatus());
    });
  }, []);

  return status;
}

export function rankContributions(contributions: DimensionContribution[]) {
  return [...contributions].sort(
    (left, right) => Math.abs(right.weightedGap) - Math.abs(left.weightedGap)
  );
}

export function getTopContribution(result: ScoringResult): DimensionContribution | null {
  const strongest = rankContributions(result.contributions)[0];

  return strongest && Math.abs(strongest.weightedGap) > 0 ? strongest : null;
}

export function buildRunSummary(result: ScoringResult) {
  return {
    direction: result.recommendedScenario,
    confidence: result.confidence,
    difference: result.weightedTotals.difference,
    topDimensionId: getTopContribution(result)?.dimensionId ?? null
  };
}

export function snapshotRunToHistory(status: RunStatus, result: ScoringResult) {
  return recordRunInHistory({
    answers: status.answers,
    weights: status.state.weights,
    ...buildRunSummary(result)
  });
}

// Replaces the current run with a saved snapshot. The target is read into
// memory FIRST: snapshotting the current run can push a tenth entry out of
// history, and that entry could be the very one being restored — which used
// to make Restore fail silently.
export function restoreSnapshotAsCurrentRun(id: string): boolean {
  const target = getRunHistoryEntry(id);

  if (!target || target.questionsVersion !== QUESTIONS_VERSION) {
    return false;
  }

  const status = readRunStatus();

  if (status.canScore) {
    snapshotRunToHistory(status, scoreDecision(status.answers, status.state.weights));
  }

  saveAppState({ answers: { ...target.answers }, weights: { ...target.weights } });
  return true;
}

// The load → guard → score pipeline shared by the results page and the memo.
export function useScoredRun(requirement: GuardRequirement) {
  const router = useRouter();
  const isGuardReady = usePrerequisiteGuard(requirement);
  const status = useRunStatus();
  const isScorable = Boolean(status?.canScore);

  // The guard only runs at mount, but the status is live: if the run is reset
  // while this page is open (here or in another tab), leave. Scoring an empty
  // run would otherwise render a confident-looking verdict — the engine's
  // tie-break reads as a slight lean toward staying — for no answers at all.
  useEffect(() => {
    if (status && !isScorable) {
      router.replace("/questionnaire");
    }
  }, [isScorable, router, status]);

  const scoringResult = useMemo(() => {
    if (!status || !isScorable) {
      return null;
    }

    return scoreDecision(status.answers, status.state.weights);
  }, [isScorable, status]);

  return { isReady: isGuardReady && Boolean(status), status, scoringResult };
}

// Plays the reveal once the content is ready, with a static fallback for
// anyone who asked for reduced motion.
export function useRevealOnReady(isReady: boolean): boolean {
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsRevealed(true);
      return;
    }

    setIsRevealed(false);
    const frameId = window.requestAnimationFrame(() => setIsRevealed(true));

    return () => window.cancelAnimationFrame(frameId);
  }, [isReady]);

  return isRevealed;
}


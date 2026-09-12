// The run in progress: answers plus weights, under one key that
// "Reset current run" clears. Profile and history live under their own keys
// and deliberately survive a reset.

import { defaultWeights, dimensions } from "@/data/dimensions";
import { questions } from "@/data/questions";
import { QUESTIONS_VERSION } from "@/lib/questionnaire-version";
import { isRecord, readJson, removeKey, STORAGE_KEYS, writeJson } from "@/lib/storage/local-store";
import { AppState, Answers, DimensionId, Question, Weights } from "@/types";

type StoredAppState = AppState & {
  questionsVersion?: string;
};

export function filterAnswersToCurrent(answers: Answers, currentQuestions: Question[]): Answers {
  const validQuestionIds = new Set(currentQuestions.map((question) => question.id));

  return Object.fromEntries(
    Object.entries(answers).filter(([questionId]) => validQuestionIds.has(questionId))
  );
}

export function getDefaultAppState(): AppState {
  return {
    answers: {},
    weights: { ...defaultWeights }
  };
}

function parseAnswers(value: unknown): Answers {
  if (!isRecord(value)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value).filter((entry): entry is [string, string] => typeof entry[1] === "string")
  );
}

// Defaults fill any gap, and only finite non-negative numbers for known
// dimensions are accepted — a corrupt value would otherwise reach the scoring
// engine and turn every total into NaN.
function parseWeights(value: unknown): Weights {
  const weights = { ...defaultWeights };

  if (!isRecord(value)) {
    return weights;
  }

  for (const dimension of dimensions) {
    const stored = value[dimension.id];

    if (typeof stored === "number" && Number.isFinite(stored) && stored >= 0) {
      weights[dimension.id as DimensionId] = stored;
    }
  }

  return weights;
}

export function loadAppState(): AppState {
  const stored = readJson(STORAGE_KEYS.currentRun, (value) => {
    if (!isRecord(value)) {
      return null;
    }

    return {
      questionsVersion: typeof value.questionsVersion === "string" ? value.questionsVersion : undefined,
      answers: parseAnswers(value.answers),
      rawAnswerCount: isRecord(value.answers) ? Object.keys(value.answers).length : 0,
      weights: parseWeights(value.weights)
    };
  });

  if (!stored) {
    return getDefaultAppState();
  }

  // A question-set change invalidates the answers but not the priorities.
  if (stored.questionsVersion !== QUESTIONS_VERSION) {
    const resetState: AppState = { answers: {}, weights: stored.weights };

    saveAppState(resetState);
    return resetState;
  }

  const filteredAnswers = filterAnswersToCurrent(stored.answers, questions);
  const sanitizedState: AppState = { answers: filteredAnswers, weights: stored.weights };

  if (Object.keys(filteredAnswers).length !== stored.rawAnswerCount) {
    saveAppState(sanitizedState);
  }

  return sanitizedState;
}

export function saveAppState(state: AppState) {
  const storedState: StoredAppState = {
    ...state,
    answers: filterAnswersToCurrent(state.answers, questions),
    questionsVersion: QUESTIONS_VERSION
  };

  writeJson(STORAGE_KEYS.currentRun, storedState);
}

export function saveAnswers(answers: Answers) {
  const currentState = loadAppState();

  saveAppState({
    ...currentState,
    answers: filterAnswersToCurrent(answers, questions)
  });
}

export function saveWeights(weights: Weights) {
  const currentState = loadAppState();

  saveAppState({
    ...currentState,
    weights
  });
}

export function resetAppState() {
  removeKey(STORAGE_KEYS.currentRun);
}

export function hasAnyAnswers(state: AppState) {
  return Object.keys(filterAnswersToCurrent(state.answers, questions)).length > 0;
}

export function hasCompleteAnswers(state: AppState, requiredQuestionCount: number) {
  return Object.keys(filterAnswersToCurrent(state.answers, questions)).length >= requiredQuestionCount;
}

export function hasWeights(state: AppState) {
  return Object.keys(state.weights).length > 0;
}

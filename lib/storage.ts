"use client";

import { defaultWeights } from "@/data/dimensions";
import { questions } from "@/data/questions";
import {
  AppState,
  Answers,
  ConfidenceLevel,
  DimensionId,
  HistoryEntry,
  LocalProfile,
  ProfileAccentId,
  Question,
  ScenarioId,
  Weights
} from "@/types";

const STORAGE_KEY = "stay-or-return-v1";
export const QUESTIONS_VERSION = "v2";

type StoredAppState = AppState & {
  questionsVersion?: string;
};

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

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

export function loadAppState(): AppState {
  if (!canUseStorage()) {
    return getDefaultAppState();
  }

  const rawState = window.localStorage.getItem(STORAGE_KEY);

  if (!rawState) {
    return getDefaultAppState();
  }

  try {
    const parsedState = JSON.parse(rawState) as Partial<StoredAppState>;
    const storedWeights = {
      ...defaultWeights,
      ...(parsedState.weights ?? {})
    };

    if (parsedState.questionsVersion !== QUESTIONS_VERSION) {
      const resetState = {
        answers: {},
        weights: storedWeights
      };

      saveAppState(resetState);
      return resetState;
    }

    const filteredAnswers = filterAnswersToCurrent(parsedState.answers ?? {}, questions);
    const sanitizedState = {
      answers: filteredAnswers,
      weights: storedWeights
    };

    if (Object.keys(filteredAnswers).length !== Object.keys(parsedState.answers ?? {}).length) {
      saveAppState(sanitizedState);
    }

    return sanitizedState;
  } catch {
    return getDefaultAppState();
  }
}

export function saveAppState(state: AppState) {
  if (!canUseStorage()) {
    return;
  }

  const storedState: StoredAppState = {
    ...state,
    answers: filterAnswersToCurrent(state.answers, questions),
    questionsVersion: QUESTIONS_VERSION
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(storedState));
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
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
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

// ---------------------------------------------------------------------------
// Local profile & run history — device-only data.
//
// These live under their own storage keys, separate from the current run, so
// resetAppState (which clears only the current run) and questionsVersion
// resets can never delete them. Nothing here is ever transmitted anywhere:
// no account, no sync, no server copy.
// ---------------------------------------------------------------------------

const PROFILE_STORAGE_KEY = "stay-or-return-profile-v1";
const HISTORY_STORAGE_KEY = "stay-or-return-history-v1";
const PROFILE_UPDATED_EVENT = "stay-or-return:profile-updated";

// Lets always-mounted UI (the nav profile chip) refresh when the profile is
// edited elsewhere on the same page, without a route change.
export function subscribeToProfileUpdates(listener: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener(PROFILE_UPDATED_EVENT, listener);
  return () => window.removeEventListener(PROFILE_UPDATED_EVENT, listener);
}

function emitProfileUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(PROFILE_UPDATED_EVENT));
  }
}

export const HISTORY_LIMIT = 10;
export const NICKNAME_MAX_LENGTH = 24;

const PROFILE_ACCENT_IDS: ProfileAccentId[] = ["stay", "return", "warm"];

function createRandomId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `run-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function hashString(input: string) {
  let hash = 5381;

  for (let index = 0; index < input.length; index += 1) {
    hash = ((hash << 5) + hash + input.charCodeAt(index)) | 0;
  }

  return (hash >>> 0).toString(36);
}

// Identifies one (questionnaire version, answers, weights) combination so a
// re-visited results page updates its existing history entry instead of
// appending a duplicate.
export function buildRunSignature(answers: Answers, weights: Weights) {
  const answerPart = Object.entries(answers)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([questionId, optionId]) => `${questionId}=${optionId}`)
    .join(";");
  const weightPart = Object.entries(weights)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([dimensionId, value]) => `${dimensionId}=${Math.round(Number(value) * 1000) / 1000}`)
    .join(";");

  return hashString(`${QUESTIONS_VERSION}|${answerPart}|${weightPart}`);
}

export function loadLocalProfile(): LocalProfile | null {
  if (!canUseStorage()) {
    return null;
  }

  const raw = window.localStorage.getItem(PROFILE_STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<LocalProfile>;

    if (typeof parsed.createdAt !== "string") {
      return null;
    }

    return {
      profileVersion: "v1",
      nickname: typeof parsed.nickname === "string" ? parsed.nickname.slice(0, NICKNAME_MAX_LENGTH) : "",
      accentId: PROFILE_ACCENT_IDS.includes(parsed.accentId as ProfileAccentId)
        ? (parsed.accentId as ProfileAccentId)
        : "warm",
      createdAt: parsed.createdAt,
      nudgeDismissed: parsed.nudgeDismissed === true
    };
  } catch {
    return null;
  }
}

function saveLocalProfile(profile: LocalProfile) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  emitProfileUpdated();
}

export function ensureLocalProfile(): LocalProfile {
  const existing = loadLocalProfile();

  if (existing) {
    return existing;
  }

  const created: LocalProfile = {
    profileVersion: "v1",
    nickname: "",
    accentId: "warm",
    createdAt: new Date().toISOString(),
    nudgeDismissed: false
  };

  saveLocalProfile(created);
  return created;
}

export function updateLocalProfile(
  patch: Partial<Pick<LocalProfile, "nickname" | "accentId" | "nudgeDismissed">>
): LocalProfile {
  const current = ensureLocalProfile();
  const next: LocalProfile = {
    ...current,
    ...patch,
    nickname:
      patch.nickname !== undefined
        ? patch.nickname.trim().slice(0, NICKNAME_MAX_LENGTH)
        : current.nickname
  };

  saveLocalProfile(next);
  return next;
}

export function loadRunHistory(): HistoryEntry[] {
  if (!canUseStorage()) {
    return [];
  }

  const raw = window.localStorage.getItem(HISTORY_STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter((entry): entry is HistoryEntry => {
        return (
          Boolean(entry) &&
          typeof entry.id === "string" &&
          typeof entry.completedAt === "string" &&
          typeof entry.signature === "string" &&
          typeof entry.questionsVersion === "string" &&
          (entry.direction === "stay_us" || entry.direction === "return_china") &&
          typeof entry.difference === "number" &&
          typeof entry.answers === "object" &&
          typeof entry.weights === "object"
        );
      })
      .slice(0, HISTORY_LIMIT);
  } catch {
    return [];
  }
}

function saveRunHistory(entries: HistoryEntry[]) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(entries.slice(0, HISTORY_LIMIT)));
}

export function recordRunInHistory(input: {
  answers: Answers;
  weights: Weights;
  direction: ScenarioId;
  confidence: ConfidenceLevel;
  difference: number;
  topDimensionId: DimensionId | null;
}): HistoryEntry[] {
  if (!canUseStorage()) {
    return [];
  }

  const signature = buildRunSignature(input.answers, input.weights);
  const history = loadRunHistory();
  const existing = history.find((entry) => entry.signature === signature);
  const completedAt = new Date().toISOString();

  const nextEntry: HistoryEntry = existing
    ? { ...existing, completedAt }
    : {
        id: createRandomId(),
        completedAt,
        questionsVersion: QUESTIONS_VERSION,
        signature,
        direction: input.direction,
        confidence: input.confidence,
        difference: input.difference,
        topDimensionId: input.topDimensionId,
        answers: { ...input.answers },
        weights: { ...input.weights }
      };

  const next = [nextEntry, ...history.filter((entry) => entry.signature !== signature)].slice(
    0,
    HISTORY_LIMIT
  );

  saveRunHistory(next);
  return next;
}

export function getRunHistoryEntry(id: string): HistoryEntry | null {
  return loadRunHistory().find((entry) => entry.id === id) ?? null;
}

export function deleteRunHistoryEntry(id: string): HistoryEntry[] {
  const next = loadRunHistory().filter((entry) => entry.id !== id);
  saveRunHistory(next);
  return next;
}

// Replaces the current run with a saved one. Callers are responsible for
// confirming with the user when the current run holds unfinished work.
export function restoreRunFromHistory(id: string): boolean {
  const entry = getRunHistoryEntry(id);

  if (!entry || entry.questionsVersion !== QUESTIONS_VERSION) {
    return false;
  }

  saveAppState({ answers: { ...entry.answers }, weights: { ...entry.weights } });
  return true;
}

export function clearLocalProfileAndHistory() {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(PROFILE_STORAGE_KEY);
  window.localStorage.removeItem(HISTORY_STORAGE_KEY);
  emitProfileUpdated();
}

// ---------------------------------------------------------------------------
// Anonymous-stats bookkeeping. Only run *signatures* are kept here, locally,
// so a run is counted once per device. Signatures never leave the device —
// the stat event itself carries nothing but direction + confidence tier.
// ---------------------------------------------------------------------------

const REPORTED_STATS_KEY = "stay-or-return-stats-v1";
const REPORTED_STATS_LIMIT = 30;

function loadReportedSignatures(): string[] {
  if (!canUseStorage()) {
    return [];
  }

  try {
    const parsed = JSON.parse(window.localStorage.getItem(REPORTED_STATS_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export function hasReportedRunStat(signature: string) {
  return loadReportedSignatures().includes(signature);
}

export function markRunStatReported(signature: string) {
  if (!canUseStorage()) {
    return;
  }

  const next = [signature, ...loadReportedSignatures().filter((item) => item !== signature)].slice(
    0,
    REPORTED_STATS_LIMIT
  );

  window.localStorage.setItem(REPORTED_STATS_KEY, JSON.stringify(next));
}

// Everything the device knows, for the profile page's "Export my data" button.
export function buildLocalDataExport() {
  return {
    exportedAt: new Date().toISOString(),
    note: "This data lived only in your browser's local storage. It was never sent anywhere.",
    profile: loadLocalProfile(),
    history: loadRunHistory(),
    currentRun: loadAppState()
  };
}

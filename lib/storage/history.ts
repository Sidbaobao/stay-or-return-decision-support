// The last ten completed runs, kept on this device so a past decision can be
// reopened or restored. Each entry stores the full answers and weights, which
// is what makes a snapshot re-scorable rather than just a remembered verdict.

import { QUESTIONS_VERSION } from "@/lib/questionnaire-version";
import { saveAppState } from "@/lib/storage/current-run";
import { canUseStorage, isRecord, readJson, removeKey, STORAGE_KEYS, writeJson } from "@/lib/storage/local-store";
import { Answers, ConfidenceLevel, DimensionId, HistoryEntry, ScenarioId, Weights } from "@/types";

export const HISTORY_LIMIT = 10;

const CONFIDENCE_LEVELS: ConfidenceLevel[] = ["low", "medium", "high"];

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

function parseHistoryEntry(value: unknown): HistoryEntry | null {
  if (!isRecord(value)) {
    return null;
  }

  const isValid =
    typeof value.id === "string" &&
    typeof value.completedAt === "string" &&
    typeof value.signature === "string" &&
    typeof value.questionsVersion === "string" &&
    (value.direction === "stay_us" || value.direction === "return_china") &&
    CONFIDENCE_LEVELS.includes(value.confidence as ConfidenceLevel) &&
    typeof value.difference === "number" &&
    Number.isFinite(value.difference) &&
    (value.topDimensionId === null || typeof value.topDimensionId === "string") &&
    isRecord(value.answers) &&
    isRecord(value.weights);

  return isValid ? (value as unknown as HistoryEntry) : null;
}

export function loadRunHistory(): HistoryEntry[] {
  const entries = readJson(STORAGE_KEYS.history, (value) => {
    if (!Array.isArray(value)) {
      return null;
    }

    return value
      .map(parseHistoryEntry)
      .filter((entry): entry is HistoryEntry => entry !== null)
      .slice(0, HISTORY_LIMIT);
  });

  return entries ?? [];
}

function saveRunHistory(entries: HistoryEntry[]) {
  writeJson(STORAGE_KEYS.history, entries.slice(0, HISTORY_LIMIT));
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
    // Never hand back an entry that was not persisted.
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

export function clearRunHistory() {
  removeKey(STORAGE_KEYS.history);
}

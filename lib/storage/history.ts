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

function serializeAnswers(answers: Answers) {
  return Object.entries(answers)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([questionId, optionId]) => `${questionId}=${optionId}`)
    .join(";");
}

// What makes two runs "the same decision": the answers. Re-weighting is a
// revision of one decision, not a second one — keying on weights too meant a
// user who nudged priorities ten times evicted every earlier decision from a
// ten-entry history, and reported ten completions to the stats endpoint.
export function buildCompletionSignature(answers: Answers) {
  return hashString(`${QUESTIONS_VERSION}|${serializeAnswers(answers)}`);
}

// Legacy (answers + weights) signature. Still written on every entry, and
// still used once to recognise stat markers left by the previous version.
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

  if (!isValid) {
    return null;
  }

  const entry = value as unknown as HistoryEntry;

  // Entries written before completionSignature/lastOpenedAt existed are
  // normalised here from data they already carry, so nothing duplicates.
  return {
    ...entry,
    completionSignature:
      typeof value.completionSignature === "string"
        ? value.completionSignature
        : buildCompletionSignature(entry.answers),
    lastOpenedAt: typeof value.lastOpenedAt === "string" ? value.lastOpenedAt : entry.completedAt
  };
}

// Collapses entries that are the same decision. A device upgraded from the
// version that keyed on answers+weights can hold several rows for one set of
// answers; the newest carries the current summary, the oldest carries the date
// it was first made. The result is read-side truth, persisted on the next
// write.
function collapseToOnePerDecision(entries: HistoryEntry[]): HistoryEntry[] {
  const collapsed: HistoryEntry[] = [];
  const indexBySignature = new Map<string, number>();

  for (const entry of entries) {
    const existingIndex = indexBySignature.get(entry.completionSignature);

    if (existingIndex === undefined) {
      indexBySignature.set(entry.completionSignature, collapsed.length);
      collapsed.push(entry);
      continue;
    }

    const kept = collapsed[existingIndex];

    collapsed[existingIndex] = {
      ...kept,
      completedAt: entry.completedAt < kept.completedAt ? entry.completedAt : kept.completedAt,
      lastOpenedAt: entry.lastOpenedAt > kept.lastOpenedAt ? entry.lastOpenedAt : kept.lastOpenedAt
    };
  }

  return collapsed;
}

export function loadRunHistory(): HistoryEntry[] {
  const entries = readJson(STORAGE_KEYS.history, (value) => {
    if (!Array.isArray(value)) {
      return null;
    }

    const parsed = value
      .map(parseHistoryEntry)
      .filter((entry): entry is HistoryEntry => entry !== null);

    return collapseToOnePerDecision(parsed).slice(0, HISTORY_LIMIT);
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

  const completionSignature = buildCompletionSignature(input.answers);
  const history = loadRunHistory();
  const now = new Date().toISOString();
  const summary = {
    signature: buildRunSignature(input.answers, input.weights),
    direction: input.direction,
    confidence: input.confidence,
    difference: input.difference,
    topDimensionId: input.topDimensionId,
    weights: { ...input.weights },
    lastOpenedAt: now
  };

  const existingIndex = history.findIndex(
    (entry) => entry.completionSignature === completionSignature
  );

  // Revisiting or re-weighting refreshes the entry where it stands: the row
  // keeps the date the decision was first made, and does not jump the list.
  const next: HistoryEntry[] =
    existingIndex >= 0
      ? history.map((entry, index) => (index === existingIndex ? { ...entry, ...summary } : entry))
      : [
          {
            id: createRandomId(),
            completedAt: now,
            questionsVersion: QUESTIONS_VERSION,
            completionSignature,
            answers: { ...input.answers },
            ...summary
          },
          ...history
        ].slice(0, HISTORY_LIMIT);

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

// Every localStorage access in the app goes through this barrel — components
// import from "@/lib/storage" and never touch window.localStorage directly.
// The implementation is split by concern under lib/storage/.

export { QUESTIONS_VERSION } from "@/lib/questionnaire-version";

export { STORAGE_KEYS, subscribeToStorageKey } from "@/lib/storage/local-store";
export type { StorageKey } from "@/lib/storage/local-store";

export {
  filterAnswersToCurrent,
  getDefaultAppState,
  hasAnyAnswers,
  hasCompleteAnswers,
  hasWeights,
  loadAppState,
  resetAppState,
  saveAnswers,
  saveAppState,
  saveWeights
} from "@/lib/storage/current-run";

export {
  clearLocalProfile,
  ensureLocalProfile,
  loadLocalProfile,
  NICKNAME_MAX_LENGTH,
  subscribeToProfileUpdates,
  updateLocalProfile
} from "@/lib/storage/profile";

export {
  buildCompletionSignature,
  buildRunSignature,
  clearRunHistory,
  deleteRunHistoryEntry,
  getRunHistoryEntry,
  HISTORY_LIMIT,
  loadRunHistory,
  recordRunInHistory,
  restoreRunFromHistory
} from "@/lib/storage/history";

export {
  claimRunStat,
  clearReportedRunStats,
  hasReportedRunStat,
  loadReportedRunStats
} from "@/lib/storage/stats-marker";

export { buildLocalDataExport, clearLocalProfileAndHistory } from "@/lib/storage/data-export";

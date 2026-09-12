// Which completed runs have already been counted by the anonymous stats
// endpoint, so one run is reported once per device. Only signatures are kept,
// and they never leave the device — the stat event itself carries nothing but
// a direction and a confidence tier.

import { readJson, removeKey, STORAGE_KEYS, writeJson } from "@/lib/storage/local-store";

const REPORTED_STATS_LIMIT = 30;

function loadReportedSignatures(): string[] {
  const signatures = readJson(STORAGE_KEYS.reportedStats, (value) => {
    if (!Array.isArray(value)) {
      return null;
    }

    return value.filter((item): item is string => typeof item === "string");
  });

  return signatures ?? [];
}

export function hasReportedRunStat(signature: string) {
  return loadReportedSignatures().includes(signature);
}

export function markRunStatReported(signature: string) {
  const next = [signature, ...loadReportedSignatures().filter((item) => item !== signature)].slice(
    0,
    REPORTED_STATS_LIMIT
  );

  writeJson(STORAGE_KEYS.reportedStats, next);
}

export function clearReportedRunStats() {
  removeKey(STORAGE_KEYS.reportedStats);
}

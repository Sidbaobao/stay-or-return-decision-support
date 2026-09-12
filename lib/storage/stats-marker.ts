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

// Marks the run as reported and hands back a release function, or null when it
// was already claimed. Calling release puts it back, so the next visit retries
// — that is how a dropped or rate-limited beacon stops being lost for good.
export function claimRunStat(signature: string): (() => void) | null {
  const reported = loadReportedSignatures();

  if (reported.includes(signature)) {
    return null;
  }

  writeJson(STORAGE_KEYS.reportedStats, [signature, ...reported].slice(0, REPORTED_STATS_LIMIT));

  return () => {
    writeJson(
      STORAGE_KEYS.reportedStats,
      loadReportedSignatures().filter((item) => item !== signature)
    );
  };
}

export function loadReportedRunStats(): string[] {
  return loadReportedSignatures();
}

export function clearReportedRunStats() {
  removeKey(STORAGE_KEYS.reportedStats);
}

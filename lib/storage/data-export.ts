// "Export my data" and "Delete profile & history" on the profile page. Both
// exist to make the privacy claim checkable: the user can see everything the
// device holds, and remove it.

import { loadAppState } from "@/lib/storage/current-run";
import { clearRunHistory, loadRunHistory } from "@/lib/storage/history";
import { clearLocalProfile, loadLocalProfile } from "@/lib/storage/profile";
import { clearReportedRunStats, loadReportedRunStats } from "@/lib/storage/stats-marker";

export function buildLocalDataExport() {
  return {
    exportedAt: new Date().toISOString(),
    note: "This data lived only in your browser's local storage. It was never sent anywhere.",
    profile: loadLocalProfile(),
    history: loadRunHistory(),
    currentRun: loadAppState(),
    reportedRunSignatures: loadReportedRunStats()
  };
}

export function clearLocalProfileAndHistory() {
  // Profile last: clearing it notifies subscribers, and they must not observe
  // a device that still holds the old decisions.
  clearRunHistory();
  clearReportedRunStats();
  clearLocalProfile();
}

// "Export my data" and "Delete profile & history" on the profile page. Both
// exist to make the privacy claim checkable: the user can see everything the
// device holds, and remove it.

import { loadAppState } from "@/lib/storage/current-run";
import { clearRunHistory, loadRunHistory } from "@/lib/storage/history";
import { clearLocalProfile, loadLocalProfile } from "@/lib/storage/profile";

export function buildLocalDataExport() {
  return {
    exportedAt: new Date().toISOString(),
    note: "This data lived only in your browser's local storage. It was never sent anywhere.",
    profile: loadLocalProfile(),
    history: loadRunHistory(),
    currentRun: loadAppState()
  };
}

export function clearLocalProfileAndHistory() {
  // History first: clearing the profile notifies subscribers, and they must
  // not observe a device that still has the old decisions in it.
  clearRunHistory();
  clearLocalProfile();
}

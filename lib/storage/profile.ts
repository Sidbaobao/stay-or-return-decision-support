// The device-local profile: a nickname and an accent, nothing more. No
// account, no sync, no server copy — it exists so the app can say "your
// decisions" and mean this browser.

import { isRecord, readJson, removeKey, STORAGE_KEYS, writeJson } from "@/lib/storage/local-store";
import { LocalProfile, ProfileAccentId } from "@/types";

export const NICKNAME_MAX_LENGTH = 24;

const PROFILE_ACCENT_IDS: ProfileAccentId[] = ["stay", "return", "warm"];

export function loadLocalProfile(): LocalProfile | null {
  return readJson(STORAGE_KEYS.profile, (value) => {
    if (!isRecord(value) || typeof value.createdAt !== "string") {
      return null;
    }

    return {
      profileVersion: "v1",
      nickname: typeof value.nickname === "string" ? value.nickname.slice(0, NICKNAME_MAX_LENGTH) : "",
      accentId: PROFILE_ACCENT_IDS.includes(value.accentId as ProfileAccentId)
        ? (value.accentId as ProfileAccentId)
        : "warm",
      createdAt: value.createdAt,
      nudgeDismissed: value.nudgeDismissed === true
    } satisfies LocalProfile;
  });
}

function saveLocalProfile(profile: LocalProfile) {
  writeJson(STORAGE_KEYS.profile, profile);
}

// Creates the record if it is missing. Call only from a deliberate user
// action (opening /profile, dismissing the nudge) — never on a plain page
// view, so a /shared recipient is left untouched.
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

export function clearLocalProfile() {
  removeKey(STORAGE_KEYS.profile);
}

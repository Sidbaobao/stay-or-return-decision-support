// The one place that touches localStorage. Every read parses through a
// caller-supplied validator, every write is guarded, and nothing throws:
// storage can be unavailable (SSR), disabled, full, or hold corrupt data, and
// the app must keep working in all four cases.

// Every key the app owns. Anything added here must also be considered by
// data-export.ts, which reads and clears by this registry.
export const STORAGE_KEYS = {
  currentRun: "stay-or-return-v1",
  profile: "stay-or-return-profile-v1",
  history: "stay-or-return-history-v1",
  reportedStats: "stay-or-return-stats-v1"
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

const STORAGE_EVENT = "stay-or-return:storage";

export function canUseStorage() {
  try {
    return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
  } catch {
    // Accessing localStorage itself throws when site data is blocked.
    return false;
  }
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// Reads a key and hands the parsed JSON to `parse`, which returns the trusted
// shape or null. Any failure along the way — unavailable storage, bad JSON,
// data that does not match — yields null.
export function readJson<T>(key: StorageKey, parse: (value: unknown) => T | null): T | null {
  if (!canUseStorage()) {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(key);

    if (!raw) {
      return null;
    }

    return parse(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function writeJson(key: StorageKey, value: unknown): boolean {
  if (!canUseStorage()) {
    return false;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    emitStorageChange(key);
    return true;
  } catch {
    // Quota exceeded or storage disabled mid-session.
    return false;
  }
}

export function removeKey(key: StorageKey): boolean {
  if (!canUseStorage()) {
    return false;
  }

  try {
    window.localStorage.removeItem(key);
    emitStorageChange(key);
    return true;
  } catch {
    return false;
  }
}

function emitStorageChange(key: StorageKey) {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent(STORAGE_EVENT, { detail: { key } }));
}

// Lets always-mounted UI (the nav profile chip) refresh when a key is written
// elsewhere on the same page, without waiting for a route change.
export function subscribeToStorageKey(key: StorageKey, listener: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleChange = (event: Event) => {
    const detail = (event as CustomEvent<{ key?: string }>).detail;

    if (!detail || detail.key === key) {
      listener();
    }
  };

  window.addEventListener(STORAGE_EVENT, handleChange);
  return () => window.removeEventListener(STORAGE_EVENT, handleChange);
}

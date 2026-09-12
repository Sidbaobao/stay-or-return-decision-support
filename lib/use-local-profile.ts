"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ensureLocalProfile,
  loadLocalProfile,
  STORAGE_KEYS,
  subscribeToStorageKey,
  updateLocalProfile
} from "@/lib/storage";
import { LocalProfile } from "@/types";

type UseLocalProfileOptions = {
  // Only /profile creates a record on arrival. Everywhere else reads, so a
  // visitor who never opens their profile — a shared-link recipient, say —
  // leaves no trace on the device.
  create?: boolean;
};

export function useLocalProfile({ create = false }: UseLocalProfileOptions = {}) {
  const [profile, setProfile] = useState<LocalProfile | null>(null);

  useEffect(() => {
    // The same read on mount and on every change: on /profile that means
    // erasing everything leaves a fresh record rather than a blank page.
    const readProfile = () => {
      setProfile(create ? ensureLocalProfile() : loadLocalProfile());
    };

    readProfile();

    return subscribeToStorageKey(STORAGE_KEYS.profile, readProfile);
  }, [create]);

  const update = useCallback((patch: Parameters<typeof updateLocalProfile>[0]) => {
    setProfile(updateLocalProfile(patch));
  }, []);

  return { profile, update };
}

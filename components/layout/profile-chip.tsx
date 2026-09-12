"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { User } from "lucide-react";
import { loadLocalProfile, subscribeToProfileUpdates } from "@/lib/storage";
import { getMonogram, profileAccentStyles } from "@/components/profile/profile-utils";
import { LocalProfile } from "@/types";

type ProfileChipProps = {
  variant?: "light" | "default";
};

export function ProfileChip({ variant = "default" }: ProfileChipProps) {
  const pathname = usePathname();
  const [profile, setProfile] = useState<LocalProfile | null>(null);

  // Read-only: a profile record is created when someone deliberately makes
  // one, never merely by visiting a page (a /shared recipient must stay
  // untouched).
  useEffect(() => {
    setProfile(loadLocalProfile());

    return subscribeToProfileUpdates(() => {
      setProfile(loadLocalProfile());
    });
  }, [pathname]);

  const monogram = profile ? getMonogram(profile.nickname) : null;
  const accent = profile ? profileAccentStyles[profile.accentId] : profileAccentStyles.warm;
  const isActive = pathname === "/profile" || pathname.startsWith("/profile/");
  const greeting = profile?.nickname ? `Hi, ${profile.nickname}` : null;

  return (
    <Link
      href="/profile"
      aria-label="My profile — saved only on this device"
      aria-current={isActive ? "page" : undefined}
      title="My profile"
      className={`interaction-quiet inline-flex items-center gap-2 rounded-pill ${
        isActive ? "outline outline-2 outline-offset-2 outline-action-primary/40" : ""
      }`}
    >
      {greeting ? (
        <span
          className={`hidden text-sm lg:inline ${
            variant === "light" ? "text-surface-strong/75" : "text-ink/70"
          }`}
        >
          {greeting}
        </span>
      ) : null}
      <span
        aria-hidden="true"
        className={`flex h-10 w-10 items-center justify-center rounded-pill border text-sm font-semibold ${
          variant === "light" ? "border-surface-strong/25" : "border-transparent"
        }`}
        style={
          variant === "light"
            ? { backgroundColor: "rgb(var(--color-surface-strong) / 0.12)", color: "rgb(var(--color-surface-strong) / 0.85)" }
            : { backgroundColor: accent.background, color: accent.color }
        }
      >
        {monogram ?? <User className="h-[18px] w-[18px]" strokeWidth={1.8} />}
      </span>
    </Link>
  );
}

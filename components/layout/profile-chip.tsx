"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User } from "lucide-react";
import { useLocalProfile } from "@/lib/use-local-profile";
import { useLocale } from "@/lib/i18n/provider";
import { getMonogram, profileAccentStyles } from "@/components/profile/profile-utils";

type ProfileChipProps = {
  variant?: "light" | "default";
};

export function ProfileChip({ variant = "default" }: ProfileChipProps) {
  const pathname = usePathname();
  const { t } = useLocale();
  // Read-only: a record is created when someone deliberately makes one, never
  // merely by visiting a page (a /shared recipient must stay untouched).
  const { profile } = useLocalProfile();

  const monogram = profile ? getMonogram(profile.nickname) : null;
  const accent = profile ? profileAccentStyles[profile.accentId] : profileAccentStyles.warm;
  const isActive = pathname === "/profile" || pathname.startsWith("/profile/");
  const greeting = profile?.nickname ? t.nav.greeting(profile.nickname) : null;

  return (
    <Link
      href="/profile"
      aria-label={t.nav.profile}
      aria-current={isActive ? "page" : undefined}
      title={t.nav.profile}
      className="interaction-quiet inline-flex items-center gap-2 rounded-pill"
    >
      {greeting ? (
        <span
          className={`hidden whitespace-nowrap text-sm lg:inline ${
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
        } ${isActive ? "ring-2 ring-action-primary/40 ring-offset-2 ring-offset-surface-strong" : ""}`}
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

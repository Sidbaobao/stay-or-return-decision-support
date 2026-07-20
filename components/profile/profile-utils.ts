import { ProfileAccentId } from "@/types";

// Accent styles stay inside the site's canonical palette: the two path colors
// plus the warm accent. Values reference the design tokens, never raw hex.
export const profileAccentStyles: Record<
  ProfileAccentId,
  { background: string; color: string; label: string }
> = {
  stay: {
    background: "rgb(var(--color-path-stay) / 0.12)",
    color: "rgb(var(--color-path-stay))",
    label: "Blue"
  },
  return: {
    background: "rgb(var(--color-path-return) / 0.10)",
    color: "rgb(var(--color-path-return))",
    label: "Red"
  },
  warm: {
    background: "rgb(var(--color-accent-warm) / 0.16)",
    color: "rgb(var(--color-ink-accent))",
    label: "Coral"
  }
};

export function getMonogram(nickname: string) {
  const trimmed = nickname.trim();

  if (!trimmed) {
    return null;
  }

  return Array.from(trimmed)[0].toUpperCase();
}

export function formatFriendlyDate(isoDate: string) {
  const parsed = new Date(isoDate);

  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(parsed);
}

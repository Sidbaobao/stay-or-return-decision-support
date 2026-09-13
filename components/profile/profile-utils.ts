import { ProfileAccentId } from "@/types";

// Accent styles stay inside the site's canonical palette: the two path colors
// plus the warm accent. Values reference the design tokens, never raw hex.
export const profileAccentStyles: Record<
  ProfileAccentId,
  { background: string; color: string }
> = {
  stay: {
    background: "rgb(var(--color-path-stay) / 0.12)",
    color: "rgb(var(--color-path-stay))"
  },
  return: {
    background: "rgb(var(--color-path-return) / 0.10)",
    color: "rgb(var(--color-path-return))"
  },
  warm: {
    background: "rgb(var(--color-accent-warm) / 0.16)",
    color: "rgb(var(--color-ink-accent))"
  }
};

export function getMonogram(nickname: string) {
  const trimmed = nickname.trim();

  if (!trimmed) {
    return null;
  }

  return Array.from(trimmed)[0].toUpperCase();
}

"use client";

import { StatConfidence, StatDirection } from "@/lib/stats-schema";

export type { StatDirection } from "@/lib/stats-schema";

// Fire-and-forget anonymous completion event. The payload is the entire
// transmission: one coarse direction and one confidence tier. No ids, no
// answers, no weights, no nickname — and failures are swallowed so stats can
// never block or break the experience.
export async function reportCompletionStat(
  direction: StatDirection,
  confidence: StatConfidence
): Promise<boolean> {
  try {
    const payload = JSON.stringify({ direction, confidence });

    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      const blob = new Blob([payload], { type: "application/json" });

      if (navigator.sendBeacon("/api/stats", blob)) {
        return true;
      }
    }

    if (typeof fetch === "function") {
      const response = await fetch("/api/stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true
      });

      return response.ok;
    }

    return false;
  } catch {
    // Stats are best-effort by design.
    return false;
  }
}

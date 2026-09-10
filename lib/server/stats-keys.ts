import { STAT_CONFIDENCES, STAT_DIRECTIONS, StatConfidence, StatDirection } from "@/lib/stats-schema";

// Single source of truth for every Redis key the stats feature touches.
// What is stored, in full: counters only.
//   stats:total, stats:direction:{d}, stats:confidence:{c}
//   stats:m:{YYYY-MM}:total, stats:m:{YYYY-MM}:direction:{d}, stats:m:{YYYY-MM}:confidence:{c}
// Rate limiting uses short-lived keys (rl:ip:{hmac}:{minute}, rl:global:{day}).

export function monthKey(date: Date) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

export function dayKey(date: Date) {
  return `${monthKey(date)}-${String(date.getUTCDate()).padStart(2, "0")}`;
}

// Anchored on day 1 so stepping back never overflows a short month.
export function recentMonthKeys(now: Date, count: number) {
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();

  return Array.from({ length: count }, (_, index) =>
    monthKey(new Date(Date.UTC(year, month - index, 1)))
  );
}

export type CounterGroupKeys = {
  total: string;
  direction: Record<StatDirection, string>;
  confidence: Record<StatConfidence, string>;
};

function groupKeys(prefix: string): CounterGroupKeys {
  return {
    total: `${prefix}:total`,
    direction: Object.fromEntries(
      STAT_DIRECTIONS.map((value) => [value, `${prefix}:direction:${value}`])
    ) as Record<StatDirection, string>,
    confidence: Object.fromEntries(
      STAT_CONFIDENCES.map((value) => [value, `${prefix}:confidence:${value}`])
    ) as Record<StatConfidence, string>
  };
}

export const allTimeKeys = groupKeys("stats");

export function monthlyKeys(month: string) {
  return groupKeys(`stats:m:${month}`);
}

// The six counters one completion increments.
export function completionCounterKeys(month: string, direction: StatDirection, confidence: StatConfidence) {
  const monthly = monthlyKeys(month);

  return [
    allTimeKeys.total,
    allTimeKeys.direction[direction],
    allTimeKeys.confidence[confidence],
    monthly.total,
    monthly.direction[direction],
    monthly.confidence[confidence]
  ];
}

export function flattenGroupKeys(group: CounterGroupKeys) {
  return [group.total, ...Object.values(group.direction), ...Object.values(group.confidence)];
}

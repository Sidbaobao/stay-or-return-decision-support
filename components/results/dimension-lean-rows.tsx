"use client";

import { useEffect, useRef, useState } from "react";
import { padIndex } from "@/components/questionnaire/question-card";
import { useContent } from "@/lib/i18n/content";
import { useLocale } from "@/lib/i18n/provider";
import { DimensionContribution, DimensionId, ScenarioId } from "@/types";

type DimensionLeanRowsProps = {
  contributions: DimensionContribution[];
  uncertainDimensionIds: DimensionId[];
  // The answer behind a part's lean, quoted when the reader opens the row.
  reasonFor?: (dimensionId: DimensionId, scenario: ScenarioId) => string | null;
};

const MIN_SHARED_SCALE = 20;

// Six rows ranked by pull: index, name, which way, a thin bar from the
// centre, the weighted number. A row under the pointer (or opened with a
// tap) unfolds the reader's own answer beneath its bar.
export function DimensionLeanRows({ contributions, uncertainDimensionIds, reasonFor }: DimensionLeanRowsProps) {
  const { t } = useLocale();
  const { dimensionLabel } = useContent();
  const listRef = useRef<HTMLUListElement | null>(null);
  const [isInView, setIsInView] = useState(false);
  const [openId, setOpenId] = useState<DimensionId | null>(null);

  useEffect(() => {
    const list = listRef.current;

    if (!list) {
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion || typeof IntersectionObserver === "undefined") {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(list);

    return () => {
      observer.disconnect();
    };
  }, []);

  const rankedContributions = [...contributions].sort(
    (left, right) => Math.abs(right.weightedGap) - Math.abs(left.weightedGap)
  );

  const sharedScale = Math.max(
    MIN_SHARED_SCALE,
    ...rankedContributions.map((contribution) => Math.abs(contribution.rawGap))
  );

  return (
    <ul ref={listRef} className="-mx-3 space-y-1">
      {rankedContributions.map((contribution, index) => {
        const isBalanced = contribution.favoredScenario === "tie";
        const supportsStay = contribution.favoredScenario === "stay_us";
        const scenario: ScenarioId = supportsStay ? "stay_us" : "return_china";
        const isStillClose = uncertainDimensionIds.includes(contribution.dimensionId);
        const isTopDriver = index === 0 && Math.abs(contribution.weightedGap) > 0;
        const accent = supportsStay ? "rgb(var(--color-path-stay))" : "rgb(var(--color-path-return))";
        const directionLabel = isBalanced ? t.results.balanced : t.results.leans(scenario);
        const barWidth = (Math.abs(contribution.rawGap) / sharedScale) * 50;
        const quote = !isBalanced && reasonFor ? reasonFor(contribution.dimensionId, scenario) : null;
        const isOpen = openId === contribution.dimensionId;
        const label = dimensionLabel(contribution.dimensionId);

        return (
          <li
            key={contribution.dimensionId}
            className={`group rounded-tile px-3 py-3 transition-all duration-500 ease-out hover:bg-surface-raised/60 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
              isInView ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
            }`}
            style={{ transitionDelay: `${index * 70}ms` }}
          >
            <div className="grid grid-cols-[1.5rem_minmax(0,1fr)_auto] items-baseline gap-x-3">
              <span aria-hidden="true" className="num text-[0.6875rem] text-ink/40">
                {padIndex(index + 1)}
              </span>

              <div className="flex min-w-0 flex-wrap items-baseline gap-x-2.5 gap-y-1">
                {quote ? (
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenId(isOpen ? null : contribution.dimensionId)}
                    className="interaction-quiet -mx-1 rounded-control px-1 text-body font-medium text-ink"
                  >
                    {label}
                  </button>
                ) : (
                  <p className="text-body font-medium text-ink">{label}</p>
                )}
                <span className="sr-only">
                  {isBalanced ? t.results.srBalanced : t.results.srLean(scenario, Math.abs(contribution.rawGap))}
                </span>
                <span className="text-label font-medium" style={{ color: isBalanced ? undefined : accent }}>
                  {directionLabel}
                </span>
                {isTopDriver ? (
                  <span
                    className="rounded-pill px-2 py-0.5 text-[0.6875rem] font-medium"
                    style={{
                      backgroundColor: supportsStay
                        ? "rgb(var(--color-path-stay) / 0.14)"
                        : "rgb(var(--color-path-return) / 0.14)",
                      color: accent
                    }}
                  >
                    {t.results.topDriver}
                  </span>
                ) : null}
                {isStillClose ? (
                  <span className="rounded-pill bg-ink/10 px-2 py-0.5 text-[0.6875rem] text-ink/65">
                    {t.results.stillClose}
                  </span>
                ) : null}
              </div>

              <p className="num text-body-sm text-ink/80">
                {Math.abs(contribution.weightedGap).toFixed(1)}
                <span className="sr-only"> {t.results.weightedPull}</span>
              </p>
            </div>

            <div aria-hidden="true" className="relative ml-[2.25rem] mt-2.5 h-1.5 rounded-pill bg-result-driver-track">
              {!isBalanced ? (
                <div
                  className={`absolute inset-y-0 transition-transform duration-motion-reveal ease-out motion-reduce:scale-x-100 motion-reduce:transition-none ${
                    supportsStay
                      ? "right-1/2 origin-right rounded-l-pill bg-path-stay"
                      : "left-1/2 origin-left rounded-r-pill bg-path-return"
                  } ${isInView ? "scale-x-100" : "scale-x-0"}`}
                  style={{
                    width: `${barWidth}%`,
                    transitionDelay: `${150 + index * 70}ms`,
                    boxShadow: `0 0 12px ${supportsStay ? "rgb(var(--color-path-stay) / 0.55)" : "rgb(var(--color-path-return) / 0.55)"}`
                  }}
                />
              ) : null}
              <div className="absolute left-1/2 top-1/2 h-3.5 w-px -translate-x-1/2 -translate-y-1/2 bg-ink/25" />
            </div>

            {quote ? (
              <div
                className={`ml-[2.25rem] grid transition-[grid-template-rows] duration-motion-slide ease-slide motion-reduce:transition-none ${
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr] group-focus-within:grid-rows-[1fr] group-hover:grid-rows-[1fr]"
                }`}
              >
                <p className="overflow-hidden text-body-sm text-ink/65">
                  <span className="block pt-2.5">{t.results.youSaid(quote)}</span>
                </p>
              </div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

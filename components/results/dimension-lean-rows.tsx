"use client";

import { useEffect, useRef, useState } from "react";
import { dimensions } from "@/data/dimensions";
import { dimensionIcons } from "@/components/results/dimension-icons";
import { DimensionContribution, DimensionId } from "@/types";

type DimensionLeanRowsProps = {
  contributions: DimensionContribution[];
  uncertainDimensionIds: DimensionId[];
};

const MIN_SHARED_SCALE = 20;

export function DimensionLeanRows({ contributions, uncertainDimensionIds }: DimensionLeanRowsProps) {
  const listRef = useRef<HTMLUListElement | null>(null);
  const [isInView, setIsInView] = useState(false);

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
    <div>
      <ul ref={listRef} className="space-y-4">
        {rankedContributions.map((contribution, index) => {
          const dimension = dimensions.find((item) => item.id === contribution.dimensionId);
          const Icon = dimensionIcons[contribution.dimensionId];
          const isBalanced = contribution.favoredScenario === "tie";
          const supportsStay = contribution.favoredScenario === "stay_us";
          const isStillClose = uncertainDimensionIds.includes(contribution.dimensionId);
          const isTopDriver = index === 0 && Math.abs(contribution.weightedGap) > 0;

          const accent = supportsStay ? "rgb(var(--color-path-stay))" : "rgb(var(--color-path-return))";
          const directionLabel = isBalanced ? "Balanced" : supportsStay ? "Supports Stay" : "Supports Return";
          const barWidth = (Math.abs(contribution.rawGap) / sharedScale) * 50;

          return (
            <li
              key={contribution.dimensionId}
              className={`grid gap-3 rounded-tile border border-surface-strong/80 bg-surface-strong/75 p-4 transition-all duration-500 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center ${
                isInView ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
              }`}
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              <span
                className="flex h-11 w-11 items-center justify-center rounded-tile"
                style={
                  isBalanced
                    ? { backgroundColor: "rgb(var(--color-ink) / 0.05)", color: "rgb(var(--color-ink) / 0.45)" }
                    : {
                        backgroundColor: supportsStay
                          ? "rgb(var(--color-path-stay) / 0.08)"
                          : "rgb(var(--color-path-return) / 0.08)",
                        color: accent
                      }
                }
              >
                <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
              </span>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <p className="text-body font-medium text-ink">
                    {dimension?.label ?? contribution.dimensionId}
                    <span className="sr-only">
                      {isBalanced
                        ? ", balanced between the two paths"
                        : `, leans ${supportsStay ? "stay" : "return"} by ${Math.abs(contribution.rawGap)} points`}
                    </span>
                  </p>
                  <span className="text-label font-medium" style={{ color: isBalanced ? undefined : accent }}>
                    {directionLabel}
                  </span>
                  <span className="ml-auto flex items-center gap-1.5">
                    {isTopDriver ? (
                      <span
                        className="rounded-pill border px-2.5 py-1 text-label font-medium"
                        style={{
                          borderColor: supportsStay
                            ? "rgb(var(--color-path-stay) / 0.35)"
                            : "rgb(var(--color-path-return) / 0.35)",
                          color: accent
                        }}
                      >
                        Top driver
                      </span>
                    ) : null}
                    {isStillClose ? (
                      <span className="rounded-pill border border-border bg-surface px-2.5 py-1 text-label text-ink/65">
                        Still close
                      </span>
                    ) : null}
                  </span>
                </div>

                <div aria-hidden="true" className="relative mt-3 h-2.5 rounded-pill bg-result-driver-track">
                  {!isBalanced ? (
                    <div
                      className={`absolute inset-y-0 transition-transform duration-[650ms] ease-out motion-reduce:scale-x-100 motion-reduce:transition-none ${
                        supportsStay
                          ? "right-1/2 origin-right rounded-l-pill bg-path-stay"
                          : "left-1/2 origin-left rounded-r-pill bg-path-return"
                      } ${isInView ? "scale-x-100" : "scale-x-0"}`}
                      style={{ width: `${barWidth}%`, transitionDelay: `${150 + index * 80}ms` }}
                    />
                  ) : null}
                  <div className="absolute left-1/2 top-1/2 h-4 w-px -translate-x-1/2 -translate-y-1/2 bg-ink/20" />
                </div>
              </div>

              <div className="flex items-baseline gap-1.5 sm:flex-col sm:items-end sm:gap-0">
                <span className="text-body-sm font-semibold text-ink">{Math.abs(contribution.weightedGap)}</span>
                <span className="text-label text-ink/65">weighted pull</span>
              </div>
            </li>
          );
        })}
      </ul>

      <p className="mt-4 text-label text-ink/65">
        Bars share one scale and show how far your answers lean; the number is each dimension&apos;s weighted pull
        on the overall result.
      </p>
    </div>
  );
}

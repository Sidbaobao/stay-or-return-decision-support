"use client";

import { useEffect, useState } from "react";
import { ScenarioId } from "@/types";
import { clamp } from "@/lib/utils";

type DecisionBalanceProps = {
  difference: number;
  recommendedScenario: ScenarioId;
  isRevealed: boolean;
};

function formatScore(value: number) {
  return Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1);
}

type AnimatedNumberProps = {
  value: number;
  delay?: number;
};

function AnimatedNumber({ value, delay = 0 }: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setDisplayValue(value);
      return;
    }

    let frameId = 0;
    const duration = 700;
    const startTime = window.performance.now() + delay;

    const updateValue = (time: number) => {
      if (time < startTime) {
        frameId = window.requestAnimationFrame(updateValue);
        return;
      }

      const progress = Math.min((time - startTime) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(value * easedProgress);

      if (progress < 1) {
        frameId = window.requestAnimationFrame(updateValue);
      } else {
        setDisplayValue(value);
      }
    };

    frameId = window.requestAnimationFrame(updateValue);
    return () => window.cancelAnimationFrame(frameId);
  }, [delay, value]);

  return (
    <>
      <span className="motion-reduce:hidden">{formatScore(displayValue)}</span>
      <span className="hidden motion-reduce:inline">{formatScore(value)}</span>
    </>
  );
}

export function DecisionBalance({ difference, recommendedScenario, isRevealed }: DecisionBalanceProps) {
  const isTied = difference === 0;
  const isStayLeading = !isTied && recommendedScenario === "stay_us";
  const leaderLabel = recommendedScenario === "stay_us" ? "Stay in the US" : "Return to China";

  const accent = isStayLeading ? "rgb(var(--color-path-stay))" : "rgb(var(--color-path-return))";
  const fillGradient = isStayLeading
    ? "linear-gradient(to left, rgb(var(--color-path-stay) / 0.25), rgb(var(--color-path-stay) / 0.85))"
    : "linear-gradient(to right, rgb(var(--color-path-return) / 0.25), rgb(var(--color-path-return) / 0.85))";

  // One shared track: center = balanced, full deflection at a 50-point weighted gap.
  // Stay pole sits left, so a stay lead moves the marker left of center.
  const signedGap = recommendedScenario === "stay_us" ? difference : -difference;
  const markerPosition = clamp(50 - signedGap, 3, 97);
  const revealedPosition = isRevealed ? markerPosition : 50;
  const fillWidth = isRevealed ? Math.abs(50 - markerPosition) : 0;

  return (
    <div className="rounded-card border border-surface-strong/80 bg-surface-strong/80 p-4 shadow-subtle">
      <div className="flex items-center justify-between gap-3">
        <p className="text-eyebrow text-ink/65">Decision balance</p>
        <span className="text-label font-medium" style={{ color: isTied ? undefined : accent }}>
          {isTied ? "Evenly balanced" : `${leaderLabel} leads`}
        </span>
      </div>

      <div
        className="mt-5"
        role="img"
        aria-label={
          isTied
            ? "Decision balance: evenly balanced between staying in the US and returning to China."
            : `Decision balance: ${leaderLabel} leads by ${formatScore(difference)} points on one scale running from strong stay on the left to strong return on the right.`
        }
      >
        <div className="flex items-baseline justify-between">
          <span className="text-label font-semibold text-path-stay">Stay</span>
          <span className="text-label font-semibold text-path-return">Return</span>
        </div>

        <div className="relative mt-2 pb-6">
          <div className="relative h-3 rounded-pill bg-result-driver-track">
            {/* Close zone: the ±10-point band where the engine treats the result as low confidence */}
            <div className="absolute inset-y-0 left-1/2 w-[20%] -translate-x-1/2 rounded-pill bg-ink/[0.05]" />

            {!isTied ? (
              <div
                className={`absolute inset-y-0 transition-[width] duration-motion-reveal ease-out delay-[350ms] motion-reduce:transition-none ${
                  isStayLeading ? "right-1/2 rounded-l-pill" : "left-1/2 rounded-r-pill"
                }`}
                style={{ width: `${fillWidth}%`, backgroundImage: fillGradient }}
              />
            ) : null}

            <div className="absolute left-1/2 top-1/2 h-5 w-px -translate-x-1/2 -translate-y-1/2 bg-ink/25" />

            <div
              className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-pill border-2 bg-surface transition-[left] duration-motion-reveal-long ease-reveal delay-[250ms] motion-reduce:transition-none"
              style={{
                left: `${revealedPosition}%`,
                borderColor: isTied ? "rgb(var(--color-ink) / 0.35)" : accent,
                boxShadow: isTied
                  ? "0 1px 2px rgb(var(--color-ink) / 0.18)"
                  : `0 0 0 5px ${isStayLeading ? "rgb(var(--color-path-stay) / 0.14)" : "rgb(var(--color-path-return) / 0.14)"}, 0 1px 2px rgb(var(--color-ink) / 0.18)`
              }}
            />
          </div>

          <span className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-4 text-label text-ink/65">
            Balanced
          </span>
        </div>

        <p className="mt-3 text-center text-body-sm text-ink/70">
          {isTied ? (
            "Evenly balanced right now."
          ) : (
            <>
              Leads by{" "}
              <span className="font-semibold" style={{ color: accent }}>
                <AnimatedNumber value={difference} delay={300} />
              </span>{" "}
              points
            </>
          )}
        </p>
      </div>

      <p className="mt-3 border-t border-border pt-3 text-center text-label text-ink/65">
        Each answer moves this one balance — from strong stay to strong return.
      </p>
    </div>
  );
}

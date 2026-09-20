"use client";

import { useEffect, useState } from "react";
import { ScenarioId } from "@/types";
import { clamp } from "@/lib/utils";
import { useLocale } from "@/lib/i18n/provider";

type DecisionBalanceProps = {
  difference: number;
  recommendedScenario: ScenarioId;
  isRevealed: boolean;
  // "live" follows a value that is still changing (the priorities page):
  // short transitions, no reveal delay, no count-up.
  mode?: "reveal" | "live";
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

export function DecisionBalance({ difference, recommendedScenario, isRevealed, mode = "reveal" }: DecisionBalanceProps) {
  const { t } = useLocale();
  const isLive = mode === "live";
  const isTied = difference === 0;
  const isStayLeading = !isTied && recommendedScenario === "stay_us";
  const leaderLabel = t.balance.leader[recommendedScenario];

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
    <div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-eyebrow text-ink/65">{t.balance.eyebrow}</p>
        <span className="text-label font-medium" style={{ color: isTied ? undefined : accent }}>
          {isTied ? t.balance.evenly : t.balance.leads(leaderLabel)}
        </span>
      </div>

      <div
        className="mt-5"
        role="img"
        aria-label={isTied ? t.balance.ariaTied : t.balance.aria(leaderLabel, formatScore(difference))}
      >
        <div className="flex items-baseline justify-between">
          <span className="text-label font-semibold text-path-stay">{t.balance.stay}</span>
          <span className="text-label font-semibold text-path-return">{t.balance.return}</span>
        </div>

        <div className="relative mt-2 pb-6">
          <div className="relative h-3 rounded-pill bg-result-driver-track">
            {/* Close zone: the ±10-point band where the engine treats the result as low confidence */}
            <div className="absolute inset-y-0 left-1/2 w-[20%] -translate-x-1/2 rounded-pill bg-ink/[0.05]" />

            {!isTied ? (
              <div
                className={`absolute inset-y-0 motion-reduce:transition-none ${
                  isLive
                    ? "transition-[width] duration-motion-standard ease-interaction"
                    : "transition-[width] duration-motion-reveal ease-out delay-[350ms]"
                } ${isStayLeading ? "right-1/2 rounded-l-pill" : "left-1/2 rounded-r-pill"}`}
                style={{ width: `${fillWidth}%`, backgroundImage: fillGradient }}
              />
            ) : null}

            <div className="absolute left-1/2 top-1/2 h-5 w-px -translate-x-1/2 -translate-y-1/2 bg-ink/25" />

            <div
              className={`absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-pill border-2 bg-ink motion-reduce:transition-none ${
                isLive
                  ? "transition-[left] duration-motion-standard ease-interaction"
                  : "transition-[left] duration-motion-reveal-long ease-reveal delay-[250ms]"
              }`}
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
            {t.balance.balanced}
          </span>
        </div>

        <p className="mt-3 text-center text-body-sm text-ink/70">
          {isTied ? (
            t.balance.evenlyNow
          ) : (
            <>
              {t.balance.leadsBy}{" "}
              <span className="num font-semibold" style={{ color: accent }}>
                {isLive ? formatScore(difference) : <AnimatedNumber value={difference} delay={300} />}
              </span>{" "}
              {t.balance.points}
            </>
          )}
        </p>
      </div>
    </div>
  );
}

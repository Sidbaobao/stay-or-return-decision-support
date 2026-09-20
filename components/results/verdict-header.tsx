"use client";

import { ReactNode } from "react";
import { CountUp } from "@/components/results/count-up";
import { useLocale } from "@/lib/i18n/provider";
import { ConfidenceLevel, ScenarioId } from "@/types";

type VerdictHeaderProps = {
  // The small line above the headline: the step, the date, who shared it.
  eyebrow: ReactNode;
  headline: string;
  direction: ScenarioId;
  difference: number;
  confidence: ConfidenceLevel;
  isRevealed: boolean;
  // Under the headline: the quoted reason, a note, an action.
  children?: ReactNode;
  // Under the number.
  aside?: ReactNode;
};

// The first band of a result, wherever a result is shown: the words on the
// left, the one number on the right, three segments for how clear it is.
// The result page, a shared result and a saved decision all read the same.
export function VerdictHeader({
  eyebrow,
  headline,
  direction,
  difference,
  confidence,
  isRevealed,
  children,
  aside
}: VerdictHeaderProps) {
  const { t } = useLocale();
  const isStay = direction === "stay_us";
  const isTie = difference === 0;
  const accentToken = isStay ? "--color-path-stay" : "--color-path-return";
  const accentColor = isTie ? "rgb(var(--color-ink))" : `rgb(var(${accentToken}))`;
  const accentAt = (alpha: number) => `rgb(var(${accentToken}) / ${alpha})`;
  const confidenceSteps = confidence === "low" ? 1 : confidence === "medium" ? 2 : 3;

  return (
    <div
      className={`grid gap-10 transition-all duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:items-end lg:gap-16 ${
        isRevealed ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
      }`}
    >
      <div className="min-w-0">
        <div className="num text-label text-ink/45">{eyebrow}</div>
        <h1 className="mt-4 text-display" style={{ color: accentColor }}>
          {headline}
        </h1>
        {children ? (
          <div
            className={`mt-7 transition-all delay-200 duration-500 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
              isRevealed ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
            }`}
          >
            {children}
          </div>
        ) : null}
      </div>

      <div className="lg:text-right">
        <p
          className={`num text-hero-number ${isTie ? "text-ink" : isStay ? "text-gradient-stay" : "text-gradient-return"}`}
          style={isTie ? undefined : { filter: `drop-shadow(0 0 32px ${accentAt(0.35)})` }}
        >
          <CountUp value={difference} signed />
          <span className="sr-only">{isTie ? t.results.srBalanced : t.results.srLean(direction, difference)}</span>
        </p>
        <p className="mt-3 text-body text-ink/60">{isTie ? t.balance.evenly : t.results.leans(direction)}</p>

        <div
          className="mt-8 flex gap-1.5 lg:ml-auto lg:max-w-[14rem]"
          role="img"
          aria-label={t.results.confidenceAria(t.results.confidenceLevel[confidence])}
        >
          {[1, 2, 3].map((step) => {
            const isFilled = step <= confidenceSteps;

            return (
              <span key={step} className="h-1.5 flex-1 overflow-hidden rounded-pill bg-result-confidence-track">
                <span
                  className={`block h-full origin-left rounded-pill transition-transform duration-500 ease-out motion-reduce:scale-x-100 motion-reduce:transition-none ${
                    isFilled && isRevealed ? "scale-x-100" : "scale-x-0"
                  }`}
                  style={{
                    backgroundColor: isFilled ? accentColor : "transparent",
                    boxShadow: isFilled && !isTie ? `0 0 10px ${accentAt(0.6)}` : undefined,
                    transitionDelay: `${400 + step * 110}ms`
                  }}
                />
              </span>
            );
          })}
        </div>

        {aside ? <div className="mt-6 lg:flex lg:justify-end">{aside}</div> : null}
      </div>
    </div>
  );
}

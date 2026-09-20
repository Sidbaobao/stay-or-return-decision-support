"use client";

import { useEffect, useState } from "react";
import { padIndex } from "@/components/questionnaire/question-card";
import { useContent } from "@/lib/i18n/content";
import { useLocale } from "@/lib/i18n/provider";
import { DimensionContribution, DimensionId, NormalizedDimensionScore, ScenarioId } from "@/types";

type PartTilesProps = {
  contributions: DimensionContribution[];
  normalized: NormalizedDimensionScore[];
  uncertainDimensionIds: DimensionId[];
  isRevealed: boolean;
  // The answer behind a part's lean, quoted when the reader opens the tile.
  reasonFor?: (dimensionId: DimensionId, scenario: ScenarioId) => string | null;
};

const RING_SIZE = 76;
const RING_STROKE = 6;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

type RingProps = {
  share: number;
  color: string;
  glow: string;
  isRevealed: boolean;
};

// A ring that fills to the share of a part's points on its leading side.
function Ring({ share, color, glow, isRevealed }: RingProps) {
  const offset = RING_LENGTH * (1 - (isRevealed ? share : 0) / 100);

  return (
    <svg
      width={RING_SIZE}
      height={RING_SIZE}
      viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
      aria-hidden="true"
      className="shrink-0 -rotate-90"
    >
      <circle
        cx={RING_SIZE / 2}
        cy={RING_SIZE / 2}
        r={RING_RADIUS}
        fill="none"
        stroke="rgb(var(--color-result-driver-track))"
        strokeWidth={RING_STROKE}
      />
      <circle
        cx={RING_SIZE / 2}
        cy={RING_SIZE / 2}
        r={RING_RADIUS}
        fill="none"
        stroke={color}
        strokeWidth={RING_STROKE}
        strokeLinecap="round"
        strokeDasharray={RING_LENGTH}
        strokeDashoffset={offset}
        className="transition-[stroke-dashoffset] duration-motion-reveal-long ease-slide motion-reduce:transition-none"
        style={{ filter: `drop-shadow(0 0 6px ${glow})` }}
      />
    </svg>
  );
}

// The six parts as tiles, ranked by pull: a ring with the share of the
// part's points on its leading side, the part's name, which way it leans.
// A tile under the pointer (or tapped) unfolds the reader's own answer.
// The memo keeps the ranked bars and the analysis; this is the quick read.
export function PartTiles({ contributions, normalized, uncertainDimensionIds, isRevealed, reasonFor }: PartTilesProps) {
  const { t } = useLocale();
  const { dimensionLabel } = useContent();
  const [openId, setOpenId] = useState<DimensionId | null>(null);
  const [isShown, setIsShown] = useState(false);

  // The rings fill after the tiles have risen into place.
  useEffect(() => {
    if (!isRevealed) {
      return;
    }

    const frameId = window.requestAnimationFrame(() => setIsShown(true));
    return () => window.cancelAnimationFrame(frameId);
  }, [isRevealed]);

  const scoreOf = new Map(normalized.map((score) => [score.dimensionId, score]));
  const rankedContributions = [...contributions].sort(
    (left, right) => Math.abs(right.weightedGap) - Math.abs(left.weightedGap)
  );

  return (
    <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {rankedContributions.map((contribution, index) => {
        const isBalanced = contribution.favoredScenario === "tie";
        const supportsStay = contribution.favoredScenario === "stay_us";
        const scenario: ScenarioId = supportsStay ? "stay_us" : "return_china";
        const score = scoreOf.get(contribution.dimensionId);
        const total = score ? score.stay_us + score.return_china : 0;
        const leading = score ? (supportsStay ? score.stay_us : score.return_china) : 0;
        const share = isBalanced || total === 0 ? 50 : Math.round((leading / total) * 100);
        const isStillClose = uncertainDimensionIds.includes(contribution.dimensionId);
        const isTopDriver = index === 0 && Math.abs(contribution.weightedGap) > 0;
        const accentToken = supportsStay ? "--color-path-stay" : "--color-path-return";
        const accent = isBalanced ? "rgb(var(--color-ink) / 0.35)" : `rgb(var(${accentToken}))`;
        const glow = isBalanced ? "transparent" : `rgb(var(${accentToken}) / 0.7)`;
        const directionLabel = isBalanced ? t.results.balanced : t.results.leans(scenario);
        const quote = !isBalanced && reasonFor ? reasonFor(contribution.dimensionId, scenario) : null;
        const isOpen = openId === contribution.dimensionId;
        const label = dimensionLabel(contribution.dimensionId);
        const hue = `rgb(var(--color-dim-${contribution.dimensionId}))`;

        return (
          <li
            key={contribution.dimensionId}
            className={`group rounded-card bg-surface-raised/70 p-5 shadow-soft transition-all duration-500 ease-out hover:bg-surface-raised motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
              isRevealed ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
            }`}
            style={{ transitionDelay: `${index * 70}ms` }}
          >
            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                <Ring share={share} color={accent} glow={glow} isRevealed={isShown} />
                <p
                  aria-hidden="true"
                  className="num absolute inset-0 flex items-center justify-center text-[1.05rem] font-semibold text-ink"
                >
                  {share}
                  <span className="text-[0.65rem] text-ink/45">%</span>
                </p>
              </div>

              <div className="min-w-0">
                <p className="num flex items-center gap-2 text-[0.6875rem] text-ink/40">
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-pill" style={{ backgroundColor: hue }} />
                  {padIndex(index + 1)}
                </p>
                {quote ? (
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenId(isOpen ? null : contribution.dimensionId)}
                    className="interaction-quiet -mx-1 mt-0.5 rounded-control px-1 text-body font-semibold text-ink"
                  >
                    {label}
                  </button>
                ) : (
                  <p className="mt-0.5 text-body font-semibold text-ink">{label}</p>
                )}
                <p className="mt-0.5 text-label font-medium" style={{ color: isBalanced ? undefined : accent }}>
                  {directionLabel}
                  {isTopDriver ? (
                    <span
                      className="ml-2 rounded-pill px-2 py-0.5 text-[0.6875rem]"
                      style={{ backgroundColor: `rgb(var(${accentToken}) / 0.14)`, color: accent }}
                    >
                      {t.results.topDriver}
                    </span>
                  ) : null}
                  {isStillClose ? (
                    <span className="ml-2 rounded-pill bg-ink/10 px-2 py-0.5 text-[0.6875rem] text-ink/65">
                      {t.results.stillClose}
                    </span>
                  ) : null}
                </p>
                <span className="sr-only">
                  {isBalanced ? t.results.percentEven : t.results.percentToward(share, scenario)}
                </span>
              </div>
            </div>

            {quote ? (
              <div
                className={`grid transition-[grid-template-rows] duration-motion-slide ease-slide motion-reduce:transition-none ${
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr] group-focus-within:grid-rows-[1fr] group-hover:grid-rows-[1fr]"
                }`}
              >
                <p className="overflow-hidden text-body-sm text-ink/65">
                  <span className="block pt-3">{t.results.youSaid(quote)}</span>
                </p>
              </div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

"use client";

import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { hierarchy, pack, type HierarchyCircularNode } from "d3-hierarchy";
import { dimensionIcons } from "@/components/results/dimension-icons";
import { useLocale } from "@/lib/i18n/provider";
import { Dimension, DimensionId, Weights } from "@/types";
import { WeightFineTuneSlider } from "@/components/weights/weight-fine-tune-slider";
import {
  canDecreaseWeight,
  canIncreaseWeight,
  getMaxWeight,
  getWeightPercentage,
  setDimensionWeight,
  stepDimensionWeight
} from "@/components/weights/weight-bubble-utils";

// The cluster is packed into a landscape frame on a wide screen and a
// portrait one on a phone, so the circles stay big enough to read.
const LANDSCAPE: [number, number] = [680, 520];
const PORTRAIT: [number, number] = [520, 720];
// Below this radius on screen a circle has no room for its steppers; the
// pair in the slider card serves it instead.
const COMPACT_RADIUS_PX = 88;
const ICONLESS_RADIUS_PX = 58;

type BubbleDatum = {
  id?: DimensionId;
  value?: number;
  order?: number;
  children?: BubbleDatum[];
};

// Each part's hue comes from its --color-dim-* token, so the bubbles, the
// rail on the questionnaire and the chips on the home page agree.
function hueAt(dimensionId: DimensionId, alpha: number) {
  return `rgb(var(--color-dim-${dimensionId}) / ${alpha})`;
}

type WeightBubbleClusterProps = {
  dimensions: Dimension[];
  weights: Weights;
  totalBudget: number;
  onChange: (weights: Weights) => void;
  // Shown beside the slider: the page's live reading of the result.
  aside?: ReactNode;
};

// Six glowing circles packed by size. Bigger is more important; a change
// repacks the cluster and every circle drifts to its new place. The active
// one has the slider and its steppers.
export function WeightBubbleCluster({ dimensions, weights, totalBudget, onChange, aside }: WeightBubbleClusterProps) {
  const dimensionIds = useMemo(() => dimensions.map((dimension) => dimension.id), [dimensions]);
  const [activeDimensionId, setActiveDimensionId] = useState<DimensionId>(dimensions[0]?.id ?? "career");
  const [isSettled, setIsSettled] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);
  const [frameWidth, setFrameWidth] = useState(0);
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => setIsSettled(true));
    return () => window.cancelAnimationFrame(frameId);
  }, []);

  // Matches Tailwind's sm breakpoint, which picks the frame's aspect ratio.
  useEffect(() => {
    const media = window.matchMedia("(max-width: 639px)");
    const update = () => setIsPortrait(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const frame = frameRef.current;

    if (!frame || typeof ResizeObserver === "undefined") {
      return;
    }

    const observer = new ResizeObserver((entries) => setFrameWidth(entries[0]?.contentRect.width ?? 0));
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  const [packWidth, packHeight] = isPortrait ? PORTRAIT : LANDSCAPE;
  const scale = frameWidth > 0 ? frameWidth / packWidth : 1;

  const packedBubbles = useMemo<Array<HierarchyCircularNode<BubbleDatum>>>(() => {
    const data: BubbleDatum = {
      children: dimensions.map((dimension, index) => ({
        id: dimension.id,
        value: weights[dimension.id],
        order: index
      }))
    };

    return pack<BubbleDatum>()
      .size([packWidth, packHeight])
      .padding(14)(
        hierarchy(data)
          .sum((datum) => datum.value ?? 0)
          .sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0))
      )
      .leaves()
      .filter((node: HierarchyCircularNode<BubbleDatum>) => node.data.id);
  }, [dimensions, weights, packWidth, packHeight]);

  const { t } = useLocale();
  const activeDimension = dimensions.find((dimension) => dimension.id === activeDimensionId) ?? dimensions[0];
  const activeWeight = weights[activeDimension.id];
  const maxWeight = getMaxWeight(totalBudget, dimensions.length);
  const activeCanIncrease = canIncreaseWeight(weights, activeDimension.id, dimensionIds);
  const activeCanDecrease = canDecreaseWeight(weights, activeDimension.id);
  const boundaryMessage = !activeCanIncrease
    ? t.weights.cannotGrow
    : !activeCanDecrease
      ? t.weights.atMinimum
      : "";

  const handleStepChange = (dimensionId: DimensionId, direction: "increase" | "decrease") => {
    setActiveDimensionId(dimensionId);
    onChange(stepDimensionWeight(weights, dimensionId, direction, dimensionIds, totalBudget));
  };

  const handleFineTuneChange = (dimensionId: DimensionId, value: number) => {
    setActiveDimensionId(dimensionId);
    onChange(setDimensionWeight(weights, dimensionId, value, dimensionIds, totalBudget));
  };

  return (
    <section
      aria-label={t.weights.priorityMap}
      className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-center lg:gap-12"
    >
      <div ref={frameRef} className="relative mx-auto aspect-[520/720] w-full max-w-4xl sm:aspect-[680/520]">
        {packedBubbles.map((node) => {
          const dimensionId = node.data.id as DimensionId;
          const dimension = dimensions.find((item) => item.id === dimensionId);

          if (!dimension) {
            return null;
          }

          const Icon = dimensionIcons[dimensionId];
          const percentage = getWeightPercentage(weights[dimensionId], totalBudget);
          const isActive = activeDimensionId === dimensionId;
          const canIncrease = canIncreaseWeight(weights, dimensionId, dimensionIds);
          const canDecrease = canDecreaseWeight(weights, dimensionId);
          const radiusOnScreen = node.r * scale;
          const isCompact = radiusOnScreen < COMPACT_RADIUS_PX;
          const showsIcon = radiusOnScreen >= ICONLESS_RADIUS_PX;

          return (
            <div
              key={dimensionId}
              className={`absolute rounded-pill transition-all duration-motion-slide ease-slide motion-reduce:transition-none ${
                isSettled ? "scale-100 opacity-100" : "scale-90 opacity-0 motion-reduce:opacity-100"
              }`}
              style={{
                left: `${((node.x - node.r) / packWidth) * 100}%`,
                top: `${((node.y - node.r) / packHeight) * 100}%`,
                width: `${((node.r * 2) / packWidth) * 100}%`,
                height: `${((node.r * 2) / packHeight) * 100}%`,
                zIndex: isActive ? 2 : 1
              }}
            >
              <button
                type="button"
                onClick={() => setActiveDimensionId(dimensionId)}
                aria-pressed={isActive}
                data-selected={isActive ? "true" : "false"}
                aria-label={t.weights.bubbleAria(dimension.label, `${percentage}`)}
                className="interaction-bubble absolute inset-0 flex flex-col items-center justify-center rounded-pill border p-3 text-center"
                style={{
                  backgroundImage: `radial-gradient(circle at 32% 28%, ${hueAt(dimensionId, 0.55)}, ${hueAt(dimensionId, 0.14)} 70%)`,
                  borderColor: hueAt(dimensionId, isActive ? 0.95 : 0.4),
                  boxShadow: `0 0 ${isActive ? 64 : 36}px ${hueAt(dimensionId, isActive ? 0.5 : 0.22)}, inset 0 0 40px ${hueAt(
                    dimensionId,
                    0.16
                  )}`,
                  color: hueAt(dimensionId, 1)
                }}
              >
                {showsIcon ? (
                  <Icon
                    aria-hidden="true"
                    strokeWidth={1.8}
                    className={`shrink-0 ${isCompact ? "h-5 w-5" : "h-6 w-6 sm:h-8 sm:w-8"}`}
                  />
                ) : null}
                <span className="mt-1 max-w-[86%] text-sm font-semibold leading-tight text-ink">
                  {dimension.shortLabel}
                </span>
                <span className="num mt-1 rounded-pill bg-black/35 px-2 py-0.5 text-label text-ink/85">
                  {percentage}%
                </span>
              </button>

              {!isCompact ? (
                <div className="absolute bottom-[7%] left-1/2 z-10 flex -translate-x-1/2 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleStepChange(dimensionId, "decrease")}
                    disabled={!canDecrease}
                    aria-label={t.weights.decreaseAria(dimension.label)}
                    className="interaction-stepper glass-bar flex h-8 w-8 items-center justify-center rounded-pill border border-surface-strong/15 text-sm font-bold text-ink disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    -
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStepChange(dimensionId, "increase")}
                    disabled={!canIncrease}
                    aria-label={t.weights.increaseAria(dimension.label)}
                    className="interaction-stepper glass-bar flex h-8 w-8 items-center justify-center rounded-pill border border-surface-strong/15 text-sm font-bold text-ink disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    +
                  </button>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="min-w-0 space-y-6">
        {aside}
        <div className="rounded-card bg-surface-raised/70 p-5 shadow-soft sm:p-6">
          <WeightFineTuneSlider
            dimension={activeDimension}
            value={activeWeight}
            totalBudget={totalBudget}
            maxWeight={maxWeight}
            canIncrease={activeCanIncrease}
            canDecrease={activeCanDecrease}
            helperMessage={boundaryMessage}
            onChange={handleFineTuneChange}
            onStep={(direction) => handleStepChange(activeDimension.id, direction)}
          />
        </div>
      </div>
    </section>
  );
}

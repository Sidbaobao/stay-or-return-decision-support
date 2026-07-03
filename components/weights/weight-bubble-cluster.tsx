"use client";

import { useEffect, useMemo, useState } from "react";
import { hierarchy, pack, type HierarchyCircularNode } from "d3-hierarchy";
import {
  Briefcase,
  HeartHandshake,
  Scale,
  Sprout,
  Stamp,
  Sun,
  type LucideIcon
} from "lucide-react";
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

const PACK_WIDTH = 680;
const PACK_HEIGHT = 520;

type BubbleDatum = {
  id?: DimensionId;
  value?: number;
  order?: number;
  children?: BubbleDatum[];
};

type DimensionVisual = {
  Icon: LucideIcon;
  color: string;
};

const dimensionVisuals: Record<DimensionId, DimensionVisual> = {
  career: {
    Icon: Briefcase,
    color: "#3C5CCF"
  },
  salary_cost: {
    Icon: Scale,
    color: "#D72638"
  },
  immigration: {
    Icon: Stamp,
    color: "#4F86F7"
  },
  family_emotion: {
    Icon: HeartHandshake,
    color: "#D96C4A"
  },
  lifestyle: {
    Icon: Sun,
    color: "#D89A2B"
  },
  long_term: {
    Icon: Sprout,
    color: "#5F8E5E"
  }
};

function hexToRgb(hexColor: string) {
  const normalizedColor = hexColor.replace("#", "");
  const value = Number.parseInt(normalizedColor, 16);

  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255
  };
}

function getColorWithAlpha(hexColor: string, alpha: number) {
  const { r, g, b } = hexToRgb(hexColor);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

type WeightBubbleClusterProps = {
  dimensions: Dimension[];
  weights: Weights;
  totalBudget: number;
  onChange: (weights: Weights) => void;
};

export function WeightBubbleCluster({ dimensions, weights, totalBudget, onChange }: WeightBubbleClusterProps) {
  const dimensionIds = useMemo(() => dimensions.map((dimension) => dimension.id), [dimensions]);
  const [activeDimensionId, setActiveDimensionId] = useState<DimensionId>(dimensions[0]?.id ?? "career");
  const [isSettled, setIsSettled] = useState(false);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => setIsSettled(true));
    return () => window.cancelAnimationFrame(frameId);
  }, []);

  const packedBubbles = useMemo<Array<HierarchyCircularNode<BubbleDatum>>>(() => {
    const data: BubbleDatum = {
      children: dimensions.map((dimension, index) => ({
        id: dimension.id,
        value: weights[dimension.id],
        order: index
      }))
    };

    return pack<BubbleDatum>()
      .size([PACK_WIDTH, PACK_HEIGHT])
      .padding(12)(
        hierarchy(data)
          .sum((datum) => datum.value ?? 0)
          .sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0))
      )
      .leaves()
      .filter((node: HierarchyCircularNode<BubbleDatum>) => node.data.id);
  }, [dimensions, weights]);

  const activeDimension = dimensions.find((dimension) => dimension.id === activeDimensionId) ?? dimensions[0];
  const activeWeight = weights[activeDimension.id];
  const maxWeight = getMaxWeight(totalBudget, dimensions.length);
  const activeCanIncrease = canIncreaseWeight(weights, activeDimension.id, dimensionIds);
  const activeCanDecrease = canDecreaseWeight(weights, activeDimension.id);
  const boundaryMessage = !activeCanIncrease
    ? "Other priorities are already at the minimum, so this one cannot grow further."
    : !activeCanDecrease
      ? "This priority is already at the minimum."
      : "Use plus, minus, or the slider to rebalance your priorities.";

  const handleStepChange = (dimensionId: DimensionId, direction: "increase" | "decrease") => {
    setActiveDimensionId(dimensionId);
    onChange(stepDimensionWeight(weights, dimensionId, direction, dimensionIds, totalBudget));
  };

  const handleFineTuneChange = (dimensionId: DimensionId, value: number) => {
    setActiveDimensionId(dimensionId);
    onChange(setDimensionWeight(weights, dimensionId, value, dimensionIds, totalBudget));
  };

  return (
    <section className="rounded-feature border border-border bg-surface p-5 shadow-soft sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-eyebrow text-ink-accent">Priority map</p>
          <h2 className="mt-2 font-serif text-section-title text-ink">
            Shape your decision priorities
          </h2>
        </div>
        <p className="max-w-md text-body-sm text-ink/70">
          Increasing one priority reduces the others proportionally.
        </p>
      </div>

      <div className="mt-4 max-w-measure space-y-2">
        <h3 className="text-body-sm font-semibold text-ink">How weights work</h3>
        <p className="text-body-sm text-ink/70">
          This step does not change your answers. It changes how strongly each dimension affects the final score.
        </p>
        <p className="text-body-sm text-ink/70">
          Make a bubble larger when that area matters more right now. The app saves the same six weight values as before,
          and scoring still treats them as relative priorities.
        </p>
      </div>

      <div className="relative mx-auto mt-6 aspect-[680/520] w-full max-w-4xl overflow-hidden rounded-panel border border-surface-strong/80 bg-gradient-to-br from-surface via-surface-strong to-surface-warm shadow-legacy-sm">
        {packedBubbles.map((node) => {
            const dimensionId = node.data.id as DimensionId;
            const dimension = dimensions.find((item) => item.id === dimensionId);

            if (!dimension) {
              return null;
            }

            const { Icon, color } = dimensionVisuals[dimensionId];
            const percentage = getWeightPercentage(weights[dimensionId], totalBudget);
            const isActive = activeDimensionId === dimensionId;
            const canIncrease = canIncreaseWeight(weights, dimensionId, dimensionIds);
            const canDecrease = canDecreaseWeight(weights, dimensionId);
            const fillAlpha = Math.min(0.16 + percentage / 180, 0.58);

            return (
              <div
                key={dimensionId}
                className={`absolute rounded-pill transition-all duration-500 ease-out motion-reduce:transition-none ${
                  isSettled ? "scale-100 opacity-100" : "scale-95 opacity-0 motion-reduce:opacity-100"
                }`}
                style={{
                  left: `${((node.x - node.r) / PACK_WIDTH) * 100}%`,
                  top: `${((node.y - node.r) / PACK_HEIGHT) * 100}%`,
                  width: `${((node.r * 2) / PACK_WIDTH) * 100}%`,
                  height: `${((node.r * 2) / PACK_HEIGHT) * 100}%`
                }}
              >
                <button
                  type="button"
                  onClick={() => setActiveDimensionId(dimensionId)}
                  aria-pressed={isActive}
                  data-selected={isActive ? "true" : "false"}
                  aria-label={`${dimension.label}, ${percentage}% priority. Open fine tuning.`}
                  className="interaction-bubble absolute inset-0 flex flex-col items-center justify-center rounded-pill border p-4 text-center"
                  style={{
                    backgroundColor: getColorWithAlpha(color, fillAlpha),
                    borderColor: getColorWithAlpha(color, isActive ? 0.8 : 0.35),
                    color
                  }}
                >
                  <Icon aria-hidden="true" strokeWidth={1.8} className="h-7 w-7 shrink-0 sm:h-8 sm:w-8" />
                  <span className="mt-2 max-w-[82%] text-sm font-semibold leading-tight text-ink">
                    {dimension.shortLabel}
                  </span>
                  <span className="mt-1 rounded-pill bg-surface-strong/75 px-2 py-1 text-label font-semibold text-ink/70">
                    {percentage}%
                  </span>
                </button>

                <div className="absolute bottom-[8%] left-1/2 z-10 flex -translate-x-1/2 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleStepChange(dimensionId, "decrease")}
                    disabled={!canDecrease}
                    aria-label={`Decrease ${dimension.label} priority`}
                    className="interaction-stepper flex h-8 w-8 items-center justify-center rounded-pill border border-surface-strong/80 bg-surface-strong/90 text-sm font-bold text-ink disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    -
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStepChange(dimensionId, "increase")}
                    disabled={!canIncrease}
                    aria-label={`Increase ${dimension.label} priority`}
                    className="interaction-stepper flex h-8 w-8 items-center justify-center rounded-pill border border-surface-strong/80 bg-surface-strong/90 text-sm font-bold text-ink disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
      </div>

      <div className="mt-6 border-t border-border pt-6">
        <WeightFineTuneSlider
          dimension={activeDimension}
          value={activeWeight}
          totalBudget={totalBudget}
          maxWeight={maxWeight}
          helperMessage={boundaryMessage}
          onChange={handleFineTuneChange}
        />
      </div>
    </section>
  );
}

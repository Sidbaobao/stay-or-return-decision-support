"use client";

import { useLocale } from "@/lib/i18n/provider";
import { Dimension, DimensionId } from "@/types";
import { getWeightPercentage, MIN_WEIGHT } from "@/components/weights/weight-bubble-utils";

type WeightFineTuneSliderProps = {
  dimension: Dimension;
  value: number;
  totalBudget: number;
  maxWeight: number;
  canIncrease: boolean;
  canDecrease: boolean;
  helperMessage: string;
  onChange: (dimensionId: DimensionId, value: number) => void;
  onStep: (direction: "increase" | "decrease") => void;
};

// The active part's controls: its name, its share in the mono face, a
// stepper on each side of a range. On a phone this is where a small
// circle is adjusted.
export function WeightFineTuneSlider({
  dimension,
  value,
  totalBudget,
  maxWeight,
  canIncrease,
  canDecrease,
  helperMessage,
  onChange,
  onStep
}: WeightFineTuneSliderProps) {
  const { t } = useLocale();
  const percentage = getWeightPercentage(value, totalBudget);
  const stepperClassName =
    "interaction-stepper flex h-9 w-9 shrink-0 items-center justify-center rounded-pill border border-surface-strong/15 bg-surface-selected text-base font-bold text-ink disabled:cursor-not-allowed disabled:opacity-35";

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="num text-label text-ink/45">{t.weights.fineTune}</p>
          <h3 className="mt-1 text-card-title text-ink">{dimension.label}</h3>
        </div>
        <p className="num shrink-0 text-[1.75rem] leading-none" style={{ color: `rgb(var(--color-dim-${dimension.id}))` }}>
          {percentage}
          <span className="text-base text-ink/50">%</span>
        </p>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <button
          type="button"
          onClick={() => onStep("decrease")}
          disabled={!canDecrease}
          aria-label={t.weights.decreaseAria(dimension.label)}
          className={stepperClassName}
        >
          -
        </button>
        <input
          type="range"
          min={MIN_WEIGHT}
          max={maxWeight}
          step={0.1}
          value={value}
          onChange={(event) => onChange(dimension.id, Number(event.target.value))}
          aria-label={t.weights.fineTuneAria(dimension.label)}
          className="interaction-range min-w-0 flex-1"
        />
        <button
          type="button"
          onClick={() => onStep("increase")}
          disabled={!canIncrease}
          aria-label={t.weights.increaseAria(dimension.label)}
          className={stepperClassName}
        >
          +
        </button>
      </div>

      <div className="mt-1 flex justify-between gap-4 px-12 text-label text-ink/45">
        <span>{t.weights.minimum}</span>
        <span>{t.weights.maximum}</span>
      </div>

      <p aria-live="polite" className="mt-3 min-h-5 text-body-sm text-ink/60">
        {helperMessage}
      </p>
    </div>
  );
}

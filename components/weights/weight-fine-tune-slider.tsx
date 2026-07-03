import { Dimension, DimensionId } from "@/types";
import { getWeightPercentage, MIN_WEIGHT } from "@/components/weights/weight-bubble-utils";

type WeightFineTuneSliderProps = {
  dimension: Dimension;
  value: number;
  totalBudget: number;
  maxWeight: number;
  helperMessage: string;
  onChange: (dimensionId: DimensionId, value: number) => void;
};

export function WeightFineTuneSlider({
  dimension,
  value,
  totalBudget,
  maxWeight,
  helperMessage,
  onChange
}: WeightFineTuneSliderProps) {
  const percentage = getWeightPercentage(value, totalBudget);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-warm">Fine tune</p>
          <h3 className="mt-2 font-serif text-xl font-semibold leading-tight text-ink">
            {dimension.label}
          </h3>
          <p className="mt-2 text-sm leading-6 text-ink/65">{dimension.description}</p>
        </div>
        <div className="shrink-0 rounded-pill bg-surface-strong px-4 py-2 text-sm font-semibold text-action-primary shadow-legacy-sm">
          {percentage}%
        </div>
      </div>

      <input
        type="range"
        min={MIN_WEIGHT}
        max={maxWeight}
        step={0.1}
        value={value}
        onChange={(event) => onChange(dimension.id, Number(event.target.value))}
        aria-label={`Fine tune ${dimension.label} priority`}
        className="interaction-range mt-5 w-full"
      />

      <div className="mt-2 flex justify-between gap-4 text-xs leading-5 text-ink/55">
        <span>Minimum priority</span>
        <span>Maximum possible share</span>
      </div>

      <p className="mt-3 text-sm leading-6 text-ink/70">{helperMessage}</p>
    </div>
  );
}

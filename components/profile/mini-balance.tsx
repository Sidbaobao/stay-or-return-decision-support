import { ScenarioId } from "@/types";

type MiniBalanceProps = {
  direction: ScenarioId;
  difference: number;
};

// Compact version of the results-page decision balance: same center-origin
// vocabulary, same ±50-point scale, sized for a history row.
export function MiniBalance({ direction, difference }: MiniBalanceProps) {
  const isStay = direction === "stay_us";
  const fillWidth = (Math.min(Math.abs(difference), 50) / 50) * 50;

  return (
    <div aria-hidden="true" className="relative h-1.5 w-24 rounded-pill bg-result-driver-track">
      {difference > 0 ? (
        <div
          className={`absolute inset-y-0 ${
            isStay ? "right-1/2 rounded-l-pill bg-path-stay" : "left-1/2 rounded-r-pill bg-path-return"
          }`}
          style={{ width: `${fillWidth}%` }}
        />
      ) : null}
      <div className="absolute left-1/2 top-1/2 h-3 w-px -translate-x-1/2 -translate-y-1/2 bg-ink/20" />
    </div>
  );
}

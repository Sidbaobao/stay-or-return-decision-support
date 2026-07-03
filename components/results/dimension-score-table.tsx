import { dimensions } from "@/data/dimensions";
import { NormalizedDimensionScore } from "@/types";

type DimensionScoreTableProps = {
  scores: NormalizedDimensionScore[];
};

export function DimensionScoreTable({ scores }: DimensionScoreTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left">
        <thead>
          <tr className="border-b border-ink/10 text-body-sm text-ink/70">
            <th className="pb-3 pr-4 font-medium">Dimension</th>
            <th className="pb-3 pr-4 font-medium">Stay in US</th>
            <th className="pb-3 font-medium">Return to China</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((score) => {
            const dimension = dimensions.find((item) => item.id === score.dimensionId);

            return (
              <tr key={score.dimensionId} className="border-b border-ink/10 last:border-b-0">
                <td className="py-4 pr-4 font-medium text-ink">{dimension?.label ?? score.dimensionId}</td>
                <td className="py-4 pr-4 text-ink/70">{score.stay_us}</td>
                <td className="py-4 text-ink/70">{score.return_china}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

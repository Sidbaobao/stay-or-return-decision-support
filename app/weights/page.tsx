"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { defaultWeights, dimensions } from "@/data/dimensions";
import { usePrerequisiteGuard } from "@/lib/guards";
import { loadAppState, saveWeights } from "@/lib/storage";
import { Weights } from "@/types";
import { PageHeader } from "@/components/ui/page-header";
import { WeightBubbleCluster } from "@/components/weights/weight-bubble-cluster";
import { getWeightTotal } from "@/components/weights/weight-bubble-utils";
import { PrimaryButton } from "@/components/ui/primary-button";

export default function WeightsPage() {
  const isReady = usePrerequisiteGuard("answers");
  const router = useRouter();
  const [weights, setWeights] = useState<Weights>(defaultWeights);
  const [totalBudget, setTotalBudget] = useState(getWeightTotal(defaultWeights, dimensions.map((dimension) => dimension.id)));

  useEffect(() => {
    const savedWeights = loadAppState().weights;
    setWeights(savedWeights);
    setTotalBudget(getWeightTotal(savedWeights, dimensions.map((dimension) => dimension.id)));
  }, []);

  const handleSave = () => {
    saveWeights(weights);
    router.push("/results");
  };

  if (!isReady) {
    return null;
  }

  return (
    <>
      <PageHeader
        eyebrow="Step 2"
        title="Set your priorities"
        description="Choose how much each dimension should influence the final result. A higher weight gives that dimension more say in the comparison."
      />

      <WeightBubbleCluster
        dimensions={dimensions}
        weights={weights}
        totalBudget={totalBudget}
        onChange={setWeights}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/questionnaire"
          className="interaction-quiet -mx-1 self-center rounded-control px-1 py-1 text-sm font-medium text-ink/70 hover:text-ink sm:self-auto"
        >
          Back to questionnaire
        </Link>
        <PrimaryButton onClick={handleSave} className="w-full sm:w-auto">
          Save and continue to results
        </PrimaryButton>
      </div>
    </>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { defaultWeights } from "@/data/dimensions";
import { usePrerequisiteGuard } from "@/lib/guards";
import { saveWeights, STORAGE_KEYS, subscribeToStorageKey } from "@/lib/storage";
import { readRunStatus } from "@/lib/run-state";
import { useContent } from "@/lib/i18n/content";
import { useLocale, useLocalizedTitle } from "@/lib/i18n/provider";
import { Weights } from "@/types";
import { Band } from "@/components/ui/band";
import { PageHeader } from "@/components/ui/page-header";
import { WeightBubbleCluster } from "@/components/weights/weight-bubble-cluster";
import { getWeightTotal } from "@/components/weights/weight-bubble-utils";
import { PrimaryButton } from "@/components/ui/primary-button";
import { ResetProgressButton } from "@/components/ui/reset-progress-button";
import { QuietLink } from "@/components/ui/quiet-button";

export default function WeightsPage() {
  const isReady = usePrerequisiteGuard("answers");
  const router = useRouter();
  const { t } = useLocale();
  const { dimensions } = useContent();
  useLocalizedTitle(t.titles.weights);
  const [weights, setWeights] = useState<Weights>(defaultWeights);
  const [totalBudget, setTotalBudget] = useState(getWeightTotal(defaultWeights, dimensions.map((dimension) => dimension.id)));
  const [isHydrated, setIsHydrated] = useState(false);
  // Mirrors what is on screen, so the storage listener can tell an external
  // change from a value we already show. Updated on every render, not just on
  // save, or a mid-drag reset in another tab would be skipped.
  const weightsRef = useRef<Weights>(defaultWeights);
  const hasUserEditedRef = useRef(false);

  useEffect(() => {
    weightsRef.current = weights;
  }, [weights]);

  useEffect(() => {
    const adoptStoredWeights = () => {
      const stored = readRunStatus().state.weights;
      const current = weightsRef.current;
      const isSameAsLocal = dimensions.every(
        (dimension) => stored[dimension.id] === current[dimension.id]
      );

      if (isSameAsLocal) {
        return;
      }

      // Adopted from elsewhere, so nothing here should be written back: a
      // pending autosave would otherwise resurrect the run a reset removed.
      hasUserEditedRef.current = false;
      weightsRef.current = stored;
      setWeights(stored);
      setTotalBudget(getWeightTotal(stored, dimensions.map((dimension) => dimension.id)));
    };

    adoptStoredWeights();
    setIsHydrated(true);

    // Follow the store, so "Reset current run" (or another tab) puts the
    // cluster back to its defaults instead of leaving stale priorities on
    // screen.
    return subscribeToStorageKey(STORAGE_KEYS.currentRun, adoptStoredWeights);
    // The dimension ids never change; only their labels do with the locale.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Autosave once the user stops adjusting, so leaving the page keeps their
  // priorities. Debounced because the fine-tune slider emits on every drag
  // tick; the hydration guard keeps the defaults from overwriting saved
  // weights on first paint.
  useEffect(() => {
    if (!isHydrated || !hasUserEditedRef.current) {
      return;
    }

    const timeoutId = window.setTimeout(() => saveWeights(weights), 400);

    return () => window.clearTimeout(timeoutId);
  }, [isHydrated, weights]);

  const handleWeightsChange = (next: Weights) => {
    hasUserEditedRef.current = true;
    setWeights(next);
  };

  const handleSave = () => {
    saveWeights(weights);
    router.push("/results");
  };

  // The header's reset snapshots the run from storage. Flush the debounced
  // autosave first so a bubble dragged a moment ago is what gets saved.
  const flushPendingWeights = () => {
    if (hasUserEditedRef.current) {
      saveWeights(weightsRef.current);
    }
  };

  if (!isReady) {
    return null;
  }

  return (
    <>
      <Band padding="header">
        <PageHeader
          eyebrow={t.weights.eyebrow}
          title={t.weights.title}
          description={t.weights.description}
          actions={<ResetProgressButton onBeforeReset={flushPendingWeights} />}
        />
      </Band>

      <Band padding="none" className="pb-band pt-4">
        <WeightBubbleCluster
          dimensions={dimensions}
          weights={weights}
          totalBudget={totalBudget}
          onChange={handleWeightsChange}
        />
      </Band>

      <Band tone="white" padding="tight" as="div">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <QuietLink href="/questionnaire" className="-mx-2 self-center sm:self-auto">
            {t.weights.backQuestionnaire}
          </QuietLink>
          <PrimaryButton onClick={handleSave} className="w-full sm:w-auto">
            {t.weights.saveContinue}
          </PrimaryButton>
        </div>
      </Band>
    </>
  );
}

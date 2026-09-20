"use client";

import { Check } from "lucide-react";
import { padIndex } from "@/components/questionnaire/question-card";
import { useLocale } from "@/lib/i18n/provider";
import { Dimension } from "@/types";

export type RailGroup = {
  dimension: Dimension;
  answeredCount: number;
  totalCount: number;
};

type PartRailProps = {
  groups: RailGroup[];
  currentIndex: number;
  onSelect: (index: number) => void;
};

// The six parts as a rail: a strip across the top on a phone, a column
// that stays put beside the questions on a wide screen. Each part shows its
// number in its own hue once it is reached, and a check once it is done.
export function PartRail({ groups, currentIndex, onSelect }: PartRailProps) {
  const { t } = useLocale();

  return (
    <ol
      role="list"
      aria-label={t.questionnaire.stepsHeading}
      // Positioned, so the screen-reader text inside its items stays inside
      // the strip instead of stretching the page on a phone.
      className="relative -mx-1 flex gap-1 overflow-x-auto px-1 pb-1 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0"
    >
      {groups.map((group, index) => {
        const isCurrent = index === currentIndex;
        const isComplete = group.answeredCount === group.totalCount;
        const hue = `rgb(var(--color-dim-${group.dimension.id}))`;

        return (
          <li key={group.dimension.id} className="shrink-0 lg:shrink">
            <button
              type="button"
              onClick={() => onSelect(index)}
              aria-current={isCurrent ? "step" : undefined}
              className={`interaction-step flex w-full items-center gap-3 rounded-control px-2.5 py-2 text-left transition-colors duration-motion-standard ease-interaction motion-reduce:transition-none ${
                isCurrent
                  ? "bg-surface-raised text-ink"
                  : isComplete
                    ? "text-ink/75 hover:bg-surface-raised/70 hover:text-ink"
                    : "text-ink/45 hover:bg-surface-raised/70 hover:text-ink"
              }`}
            >
              <span
                aria-hidden="true"
                className="num w-5 text-[0.6875rem]"
                style={{ color: isCurrent || isComplete ? hue : undefined }}
              >
                {padIndex(index + 1)}
              </span>
              <span className="whitespace-nowrap text-body-sm font-medium lg:flex-1">{group.dimension.label}</span>
              <span className="num ml-1 inline-flex items-center text-[0.6875rem] text-ink/45 lg:ml-0">
                {isComplete ? (
                  <Check aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={2.4} style={{ color: hue }} />
                ) : (
                  <span aria-hidden="true">
                    {group.answeredCount}/{group.totalCount}
                  </span>
                )}
                <span className="sr-only">
                  {isComplete
                    ? t.questionnaire.done
                    : `${t.questionnaire.ofCount(group.answeredCount, group.totalCount)}${t.questionnaire.answeredSuffix}`}
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

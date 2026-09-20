"use client";

import Link from "next/link";
import { CSSProperties } from "react";
import { factorRows } from "@/data/factors";
import { factorsZh } from "@/data/factors.zh";
import { questionElementId } from "@/components/questionnaire/question-card";
import { useContent } from "@/lib/i18n/content";
import { useLocale } from "@/lib/i18n/provider";

// Three rows, three speeds, two directions; the middle row starts offset so
// the chips never line up into a grid.
const rowSettings = [
  { duration: 95, direction: "left", offset: "0" },
  { duration: 120, direction: "right", offset: "3rem" },
  { duration: 105, direction: "left", offset: "1.25rem" }
] as const;

// The things this decision turns on, drifting across the hero. Each chip is
// coloured by the part it belongs to and leads to the question that asks
// about it; resting on one shows that question. Each row holds its list
// twice so the loop has no seam; the second copy is hidden from assistive
// technology and from the tab order.
export function FactorFlow() {
  const { t, locale } = useLocale();
  const { questions } = useContent();
  const questionById = new Map(questions.map((question, index) => [question.id, { question, number: index + 1 }]));

  return (
    <div role="region" aria-label={t.home.flowAria} className="flow w-full space-y-3 pt-20">
      {factorRows.map((row, rowIndex) => {
        const settings = rowSettings[rowIndex % rowSettings.length];
        const chips = [...row, ...row];

        return (
          <div
            key={rowIndex}
            className="flow-row"
            data-direction={settings.direction}
            style={{ "--flow-duration": `${settings.duration}s`, paddingLeft: settings.offset } as CSSProperties}
          >
            {chips.map((factor, index) => {
              const entry = questionById.get(factor.questionId);

              if (!entry) {
                return null;
              }

              const isClone = index >= row.length;
              const label = locale === "zh" ? (factorsZh[factor.id] ?? factor.label) : factor.label;
              const questionLabel = t.home.factorQuestion(entry.number);

              return (
                <span
                  key={`${factor.id}-${index}`}
                  data-clone={isClone ? "true" : "false"}
                  aria-hidden={isClone ? "true" : undefined}
                  className="chip-wrap relative"
                >
                  <Link
                    href={`/questionnaire#${questionElementId(entry.question.id)}`}
                    tabIndex={isClone ? -1 : undefined}
                    className="chip text-body-sm"
                  >
                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 shrink-0 rounded-pill"
                      style={{
                        backgroundColor: `rgb(var(--color-dim-${entry.question.dimensionId}))`,
                        boxShadow: `0 0 8px rgb(var(--color-dim-${entry.question.dimensionId}) / 0.9)`
                      }}
                    />
                    {label}
                    <span className="sr-only">, {questionLabel}</span>
                  </Link>
                  <span role="tooltip" className="chip-tip">
                    <span className="num block text-[0.6875rem] opacity-60">{questionLabel}</span>
                    {entry.question.prompt}
                  </span>
                </span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

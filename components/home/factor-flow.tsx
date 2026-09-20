"use client";

import Link from "next/link";
import { CSSProperties } from "react";
import { factorRows } from "@/data/factors";
import { factorsZh } from "@/data/factors.zh";
import { questionElementId } from "@/components/questionnaire/question-card";
import { useContent } from "@/lib/i18n/content";
import { useLocale } from "@/lib/i18n/provider";

// Each row holds its words four times, so the loop has no seam even on a
// very wide screen; the copies are hidden from assistive technology and
// from the tab order. Three speeds, two directions, and the middle row
// starts offset so the words never line up into a grid.
const COPIES = 4;
const rowSettings = [
  { duration: 110, direction: "left", offset: "0" },
  { duration: 140, direction: "right", offset: "6rem" },
  { duration: 125, direction: "left", offset: "2.5rem" }
] as const;

// The things this decision turns on, set as type across the hero: a big
// serif word in its part's hue, a semibold word, a small quiet one, all on
// one baseline. Each word leads to the question that asks about it, and
// resting on one shows that question.
export function FactorFlow() {
  const { t, locale } = useLocale();
  const { questions } = useContent();
  const questionById = new Map(questions.map((question, index) => [question.id, { question, number: index + 1 }]));

  return (
    <div role="region" aria-label={t.home.flowAria} className="flow w-full pt-24">
      {factorRows.map((row, rowIndex) => {
        const settings = rowSettings[rowIndex % rowSettings.length];
        const words = Array.from({ length: COPIES }, () => row).flat();

        return (
          <div key={rowIndex} className="flow-track" style={{ paddingLeft: settings.offset }}>
            <div
              className="flow-row"
              data-direction={settings.direction}
              style={{ "--flow-duration": `${settings.duration}s` } as CSSProperties}
            >
              {words.map((factor, index) => {
                const entry = questionById.get(factor.questionId);

                if (!entry) {
                  return null;
                }

                const isClone = index >= row.length;
                const label = locale === "zh" ? (factorsZh[factor.id] ?? factor.label) : factor.label;
                const questionLabel = t.home.factorQuestion(entry.number);
                const hue = `rgb(var(--color-dim-${entry.question.dimensionId}))`;
                const glow = `rgb(var(--color-dim-${entry.question.dimensionId}) / 0.6)`;

                return (
                  <span
                    key={`${factor.id}-${index}`}
                    data-clone={isClone ? "true" : "false"}
                    aria-hidden={isClone ? "true" : undefined}
                    className="flow-item"
                    style={{ "--flow-hue": hue, "--flow-glow": glow } as CSSProperties}
                  >
                    <Link
                      href={`/questionnaire#${questionElementId(entry.question.id)}`}
                      tabIndex={isClone ? -1 : undefined}
                      className="flow-word"
                      data-weight={factor.weight}
                    >
                      {factor.weight > 1 ? <span aria-hidden="true" className="flow-dot" /> : null}
                      {label}
                      <span className="sr-only">, {questionLabel}</span>
                    </Link>
                    <span role="tooltip" className="flow-tip">
                      <span className="num block text-[0.6875rem] opacity-60">{questionLabel}</span>
                      {entry.question.prompt}
                    </span>
                  </span>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

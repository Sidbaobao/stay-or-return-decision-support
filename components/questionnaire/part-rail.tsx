"use client";

import { CSSProperties } from "react";
import { padIndex } from "@/components/questionnaire/question-card";
import { useLocale } from "@/lib/i18n/provider";
import { Answers, Dimension, Question } from "@/types";

export type RailGroup = {
  dimension: Dimension;
  questions: Question[];
};

type PartRailProps = {
  groups: RailGroup[];
  currentIndex: number;
  answers: Answers;
  activeQuestionId?: string;
  totalQuestions: number;
  questionNumber: (questionId: string) => number;
  onSelect: (index: number) => void;
  onSelectQuestion: (questionId: string) => void;
};

// The six parts as a rail: a strip across the top on a phone, a column that
// stays put beside the questions on a wide screen. Each part shows its
// number in its own hue once it is reached and four dots, one per
// question: filled when answered, pulsing on the one the reader is on.
// A dot is a way to any question. Under the rail, the three keys.
export function PartRail({
  groups,
  currentIndex,
  answers,
  activeQuestionId,
  totalQuestions,
  questionNumber,
  onSelect,
  onSelectQuestion
}: PartRailProps) {
  const { t } = useLocale();

  return (
    <div>
      <ol
        role="list"
        aria-label={t.questionnaire.stepsHeading}
        // Positioned, so the screen-reader text inside its items stays inside
        // the strip instead of stretching the page on a phone.
        className="relative -mx-1 flex gap-1 overflow-x-auto px-1 pb-1 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0"
      >
        {groups.map((group, index) => {
          const isCurrent = index === currentIndex;
          const answeredCount = group.questions.filter((question) => answers[question.id]).length;
          const isComplete = answeredCount === group.questions.length;
          const hue = `rgb(var(--color-dim-${group.dimension.id}))`;
          const glow = `rgb(var(--color-dim-${group.dimension.id}) / 0.7)`;

          return (
            <li key={group.dimension.id} className="shrink-0 lg:shrink">
              <div
                className={`flex items-center gap-2 rounded-control pl-2.5 pr-1.5 transition-colors duration-motion-standard ease-interaction motion-reduce:transition-none ${
                  isCurrent ? "bg-surface-raised" : "hover:bg-surface-raised/70"
                }`}
              >
                <button
                  type="button"
                  onClick={() => onSelect(index)}
                  aria-current={isCurrent ? "step" : undefined}
                  className={`interaction-step flex min-w-0 items-center gap-3 rounded-control py-2 text-left lg:flex-1 ${
                    isCurrent ? "text-ink" : isComplete ? "text-ink/75 hover:text-ink" : "text-ink/45 hover:text-ink"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="num w-5 text-[0.6875rem]"
                    style={{ color: isCurrent || isComplete ? hue : undefined }}
                  >
                    {padIndex(index + 1)}
                  </span>
                  <span className="whitespace-nowrap text-body-sm font-medium">{group.dimension.label}</span>
                  <span className="sr-only">
                    {isComplete
                      ? t.questionnaire.done
                      : `${t.questionnaire.ofCount(answeredCount, group.questions.length)}${t.questionnaire.answeredSuffix}`}
                  </span>
                </button>

                <span role="group" aria-label={group.dimension.label} className="flex items-center">
                  {group.questions.map((question) => (
                    <button
                      key={question.id}
                      type="button"
                      onClick={() => onSelectQuestion(question.id)}
                      aria-label={t.questionnaire.questionOf(questionNumber(question.id), totalQuestions)}
                      data-answered={answers[question.id] ? "true" : "false"}
                      data-active={question.id === activeQuestionId ? "true" : "false"}
                      className="rail-dot"
                      style={{ "--dot-hue": hue, "--dot-glow": glow } as CSSProperties}
                    />
                  ))}
                </span>
              </div>
            </li>
          );
        })}
      </ol>

      {/* Only where there is a keyboard: the three keys that answer. */}
      <div className="rail-keys mt-7 hidden lg:block">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          {["1", "2", "3"].map((key) => (
            <kbd key={key} className="rail-key num">
              {key}
            </kbd>
          ))}
        </div>
        <p className="mt-2.5 text-label text-ink/45">{t.questionnaire.keysHint}</p>
      </div>
    </div>
  );
}

"use client";

import { RefObject, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Briefcase,
  HeartHandshake,
  Scale,
  Sprout,
  Stamp,
  Sun,
  type LucideIcon
} from "lucide-react";
import { usePrerequisiteGuard } from "@/lib/guards";
import { filterAnswersToCurrent, saveAnswers, STORAGE_KEYS, subscribeToStorageKey } from "@/lib/storage";
import { readRunStatus } from "@/lib/run-state";
import { useContent } from "@/lib/i18n/content";
import { useLocale, useLocalizedTitle } from "@/lib/i18n/provider";
import { Answers, Dimension, DimensionId, Question } from "@/types";
import { PageHeader } from "@/components/ui/page-header";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { ResetProgressButton } from "@/components/ui/reset-progress-button";
import { QuietLink } from "@/components/ui/quiet-button";
import { QuestionCard, questionElementId } from "@/components/questionnaire/question-card";

const dimensionIcons: Record<DimensionId, LucideIcon> = {
  career: Briefcase,
  salary_cost: Scale,
  immigration: Stamp,
  family_emotion: HeartHandshake,
  lifestyle: Sun,
  long_term: Sprout
};

// Lets the selection paint before the page moves on to the next question.
const SCROLL_AFTER_ANSWER_MS = 220;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function scrollToElement(element: HTMLElement | null, block: ScrollLogicalPosition) {
  element?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block });
}

type DimensionProgressRingProps = {
  answeredCount: number;
  totalCount: number;
  isComplete: boolean;
};

function DimensionProgressRing({ answeredCount, totalCount, isComplete }: DimensionProgressRingProps) {
  const size = 40;
  const strokeWidth = 3;
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressRatio = totalCount === 0 ? 0 : answeredCount / totalCount;
  const dashOffset = circumference * (1 - progressRatio);

  return (
    <div aria-hidden="true" className="relative shrink-0">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        aria-hidden="true"
      >
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill={isComplete ? "rgb(var(--color-action-primary))" : "transparent"}
          stroke="rgb(var(--color-progress-track))"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke="rgb(var(--color-action-primary))"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
          className="transition-[stroke-dashoffset] duration-motion-emphasis ease-interaction motion-reduce:transition-none"
        />
        {isComplete ? (
          <path
            d={`M ${center - 8} ${center + 1} L ${center - 2} ${center + 7} L ${
              center + 10
            } ${center - 8}`}
            fill="none"
            stroke="rgb(var(--color-surface-strong))"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3"
          />
        ) : (
          <text
            x={center}
            y={center + 4}
            textAnchor="middle"
            className="fill-ink text-[10px] font-semibold"
          >
            {answeredCount}/{totalCount}
          </text>
        )}
      </svg>
    </div>
  );
}

type DimensionIntroHeaderProps = {
  dimension: Dimension;
  guidingQuestion: string;
  eyebrow: string;
  headingRef: RefObject<HTMLHeadingElement | null>;
};

function DimensionIntroHeader({ dimension, guidingQuestion, eyebrow, headingRef }: DimensionIntroHeaderProps) {
  const Icon = dimensionIcons[dimension.id];

  return (
    <div className="space-y-3">
      <div>
        <p className="flex items-center gap-2 text-eyebrow text-ink-accent">
          <Icon aria-hidden="true" strokeWidth={1.8} className="h-5 w-5 text-accent-warm" />
          {eyebrow}
        </p>
        {/* Focus lands here after a step change, so keyboard and screen
            reader users arrive with the new questions. */}
        <h2 ref={headingRef} tabIndex={-1} className="mt-2 font-serif text-section-title text-ink outline-none">
          {dimension.label}
        </h2>
      </div>
      <p className="border-l-2 border-accent-warm/40 pl-4 text-body font-medium text-ink">
        {guidingQuestion}
      </p>
    </div>
  );
}

type QuestionGroup = {
  dimension: Dimension;
  questions: Question[];
};

export default function QuestionnairePage() {
  const isReady = usePrerequisiteGuard("none");
  const router = useRouter();
  const { t } = useLocale();
  const { questions, dimensions } = useContent();
  useLocalizedTitle(t.titles.questionnaire);

  const groupedQuestions: QuestionGroup[] = dimensions.map((dimension) => ({
    dimension,
    questions: questions.filter((question) => question.dimensionId === dimension.id)
  }));
  const questionNumbers = new Map(questions.map((question, index) => [question.id, index + 1]));

  const [answers, setAnswers] = useState<Answers>({});
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  // Mirrors `answers` for the storage listener, which must not re-run when we
  // are the ones who wrote.
  const answersRef = useRef<Answers>({});
  const groupedRef = useRef(groupedQuestions);
  groupedRef.current = groupedQuestions;

  const stepSectionRef = useRef<HTMLElement>(null);
  const introHeadingRef = useRef<HTMLHeadingElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const scrollTimerRef = useRef<number | null>(null);
  // Set by the reader's own step changes only; a run cleared or restored in
  // another tab must not scroll this one.
  const shouldScrollToStepRef = useRef(false);

  useEffect(() => {
    const adoptStoredAnswers = () => {
      const stored = readRunStatus().answers;
      const current = answersRef.current;
      const isSameAsLocal =
        Object.keys(stored).length === Object.keys(current).length &&
        Object.entries(stored).every(([questionId, optionId]) => current[questionId] === optionId);

      if (isSameAsLocal) {
        return;
      }

      answersRef.current = stored;
      setAnswers(stored);

      // Only jump steps when the run was cleared; another tab answering a
      // question should not move the step this reader is on.
      if (Object.keys(stored).length === 0) {
        setCurrentStepIndex(0);
        return;
      }

      if (Object.keys(current).length === 0) {
        const firstIncompleteIndex = groupedRef.current.findIndex((group) =>
          group.questions.some((question) => !stored[question.id])
        );

        setCurrentStepIndex(firstIncompleteIndex === -1 ? 0 : firstIncompleteIndex);
      }
    };

    adoptStoredAnswers();

    // "Reset current run" used to clear storage while this page kept showing
    // the old answers. Now the screen follows the store: from the reset
    // button, from a restore, or from another tab.
    return subscribeToStorageKey(STORAGE_KEYS.currentRun, adoptStoredAnswers);
  }, []);

  useEffect(
    () => () => {
      if (scrollTimerRef.current !== null) {
        window.clearTimeout(scrollTimerRef.current);
      }
    },
    []
  );

  // After a step change the reader asked for, the new dimension's questions
  // come up to the top and focus travels with them. Without this the page
  // stayed scrolled to the footer and the new questions sat out of view.
  useEffect(() => {
    if (!shouldScrollToStepRef.current) {
      return;
    }

    shouldScrollToStepRef.current = false;
    scrollToElement(stepSectionRef.current, "start");
    introHeadingRef.current?.focus({ preventScroll: true });
  }, [currentStepIndex]);

  const currentAnswers = filterAnswersToCurrent(answers, questions);
  const completedCount = Object.keys(currentAnswers).length;
  const canContinue = completedCount === questions.length;
  const progressPercent = Math.round((completedCount / questions.length) * 100);
  const currentGroup = groupedQuestions[currentStepIndex] ?? groupedQuestions[0];
  const nextGroup = groupedQuestions[currentStepIndex + 1];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === groupedQuestions.length - 1;
  const activeQuestionId = currentGroup?.questions.find((question) => !currentAnswers[question.id])?.id;

  const changeStep = (index: number) => {
    const nextIndex = Math.min(Math.max(index, 0), groupedQuestions.length - 1);

    if (nextIndex === currentStepIndex) {
      scrollToElement(stepSectionRef.current, "start");
      introHeadingRef.current?.focus({ preventScroll: true });
      return;
    }

    shouldScrollToStepRef.current = true;
    setCurrentStepIndex(nextIndex);
  };

  // Persist on every choice: previously only "Save and continue" wrote to
  // storage, and that button stays disabled until all 24 are answered, so a
  // refresh or a nav click mid-questionnaire lost every answer.
  const handleChange = (questionId: string, optionId: string) => {
    const isNewAnswer = !currentAnswers[questionId];
    const nextAnswers = { ...answers, [questionId]: optionId };

    answersRef.current = nextAnswers;
    setAnswers(nextAnswers);
    saveAnswers(nextAnswers);

    // A fresh answer carries the reader to the next open question in the
    // step, or to the step's button once the step is done. Changing an
    // earlier answer leaves the page where it is.
    if (!isNewAnswer || !currentGroup) {
      return;
    }

    const stepQuestions = currentGroup.questions;
    const answeredIndex = stepQuestions.findIndex((question) => question.id === questionId);
    const nextOpen =
      stepQuestions.slice(answeredIndex + 1).find((question) => !nextAnswers[question.id]) ??
      stepQuestions.find((question) => !nextAnswers[question.id]);

    if (scrollTimerRef.current !== null) {
      window.clearTimeout(scrollTimerRef.current);
    }

    scrollTimerRef.current = window.setTimeout(() => {
      scrollTimerRef.current = null;

      if (nextOpen) {
        scrollToElement(document.getElementById(questionElementId(nextOpen.id)), "start");
      } else {
        scrollToElement(footerRef.current, "end");
      }
    }, SCROLL_AFTER_ANSWER_MS);
  };

  const handleSave = () => {
    saveAnswers(currentAnswers);
    router.push("/weights");
  };

  if (!isReady) {
    return null;
  }

  return (
    <>
      <PageHeader eyebrow={t.questionnaire.eyebrow} title={t.questionnaire.title} actions={<ResetProgressButton />} />

      <div className="sticky top-0 z-20 border-b border-hairline bg-canvas/95 py-3 backdrop-blur">
        <div className="mb-2 flex items-baseline justify-between gap-4 text-label">
          <p className="shrink-0 font-medium text-ink/70">
            {t.questionnaire.answered(completedCount, questions.length)}
          </p>
          {currentGroup ? (
            <p className="min-w-0 truncate text-ink/60">
              {t.questionnaire.stepOf(currentStepIndex + 1, groupedQuestions.length)} · {currentGroup.dimension.label}
            </p>
          ) : null}
        </div>
        <div className="h-1 rounded-pill bg-action-primary/10">
          <div
            className="h-1 rounded-pill bg-action-primary transition-[width] duration-motion-emphasis ease-interaction motion-reduce:transition-none"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <section aria-labelledby="steps-heading">
        <h2 id="steps-heading" className="text-section-title text-ink">
          {t.questionnaire.stepsHeading}
        </h2>
        <ol role="list" className="mt-5 grid grid-cols-2 gap-x-6 sm:grid-cols-3 xl:grid-cols-6">
          {groupedQuestions.map((group, index) => {
            const answeredCount = group.questions.filter(
              (question) => currentAnswers[question.id]
            ).length;
            const isComplete = answeredCount === group.questions.length;
            const isCurrent = index === currentStepIndex;

            return (
              <li key={group.dimension.id} className="border-t border-hairline">
                <button
                  type="button"
                  onClick={() => changeStep(index)}
                  aria-current={isCurrent ? "step" : undefined}
                  className={`interaction-step -mt-px flex w-full items-center gap-3 border-t-2 py-4 text-left transition-colors duration-motion-standard ease-interaction motion-reduce:transition-none ${
                    isCurrent
                      ? "border-accent-warm text-ink"
                      : isComplete
                        ? "border-transparent text-ink hover:border-ink/20"
                        : "border-transparent text-ink/70 hover:border-ink/20 hover:text-ink"
                  }`}
                >
                  <DimensionProgressRing
                    answeredCount={answeredCount}
                    totalCount={group.questions.length}
                    isComplete={isComplete}
                  />
                  <span className="min-w-0">
                    <span className="block text-eyebrow">{t.questionnaire.step(index + 1)}</span>
                    <span className="mt-1 block text-body-sm font-semibold">{group.dimension.label}</span>
                    <span className="mt-1 block text-label text-ink/65">
                      {isComplete ? (
                        t.questionnaire.done
                      ) : (
                        <>
                          {t.questionnaire.ofCount(answeredCount, group.questions.length)}
                          <span className="sr-only">{t.questionnaire.answeredSuffix}</span>
                        </>
                      )}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </section>

      {currentGroup ? (
        <section ref={stepSectionRef} className="scroll-mt-24 border-t border-hairline pt-6 sm:pt-8">
          <DimensionIntroHeader
            dimension={currentGroup.dimension}
            guidingQuestion={t.questionnaire.guiding[currentGroup.dimension.id]}
            eyebrow={t.questionnaire.currentDimension}
            headingRef={introHeadingRef}
          />

          <div className="mt-8 divide-y divide-hairline border-t border-hairline">
            {currentGroup.questions.map((question) => (
              <QuestionCard
                key={question.id}
                question={question}
                value={currentAnswers[question.id]}
                onChange={handleChange}
                numberLabel={t.questionnaire.questionOf(questionNumbers.get(question.id) ?? 0, questions.length)}
                isActive={question.id === activeQuestionId}
              />
            ))}
          </div>
        </section>
      ) : null}

      <div
        ref={footerRef}
        className="flex flex-col gap-3 border-t border-hairline pt-6 sm:flex-row sm:items-center sm:justify-between"
      >
        <QuietLink href="/" className="-mx-2 self-center sm:self-auto">
          {t.questionnaire.backHome}
        </QuietLink>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
          {isLastStep && !canContinue ? (
            <p className="text-center text-label text-ink/60 sm:mr-2 sm:text-right">
              {t.questionnaire.remaining(questions.length - completedCount)}
            </p>
          ) : null}

          {/* Always present, so the pair does not jump between steps. */}
          <SecondaryButton onClick={() => changeStep(currentStepIndex - 1)} disabled={isFirstStep} className="px-5">
            {t.questionnaire.previous}
          </SecondaryButton>

          {isLastStep ? (
            <PrimaryButton onClick={handleSave} disabled={!canContinue} className="w-full sm:w-auto">
              {t.questionnaire.saveContinue}
            </PrimaryButton>
          ) : (
            <PrimaryButton type="button" onClick={() => changeStep(currentStepIndex + 1)} className="w-full sm:w-auto">
              {nextGroup ? t.questionnaire.nextStep(nextGroup.dimension.label) : t.questionnaire.next}
              <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4 shrink-0" strokeWidth={2} />
            </PrimaryButton>
          )}
        </div>
      </div>
    </>
  );
}

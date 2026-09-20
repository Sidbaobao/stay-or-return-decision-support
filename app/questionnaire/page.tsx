"use client";

import { RefObject, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { usePrerequisiteGuard } from "@/lib/guards";
import { filterAnswersToCurrent, saveAnswers, STORAGE_KEYS, subscribeToStorageKey } from "@/lib/storage";
import { readRunStatus } from "@/lib/run-state";
import { useContent } from "@/lib/i18n/content";
import { useLocale, useLocalizedTitle } from "@/lib/i18n/provider";
import { Answers, Dimension, Question } from "@/types";
import { Band } from "@/components/ui/band";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { ResetProgressButton } from "@/components/ui/reset-progress-button";
import { QuietLink } from "@/components/ui/quiet-button";
import { PartRail } from "@/components/questionnaire/part-rail";
import { padIndex, QuestionCard, questionElementId } from "@/components/questionnaire/question-card";

// Lets the highlight slide before the page moves on to the next question.
const SCROLL_AFTER_ANSWER_MS = 260;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function scrollToElement(element: HTMLElement | null, block: ScrollLogicalPosition) {
  element?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block });
}

// A key press answers the open question unless the reader is typing.
function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  if (target.isContentEditable || target.tagName === "TEXTAREA" || target.tagName === "SELECT") {
    return true;
  }

  return target.tagName === "INPUT" && (target as HTMLInputElement).type !== "radio";
}

type DimensionIntroHeaderProps = {
  dimension: Dimension;
  index: number;
  total: number;
  headingRef: RefObject<HTMLHeadingElement | null>;
};

function DimensionIntroHeader({ dimension, index, total, headingRef }: DimensionIntroHeaderProps) {
  return (
    <div>
      <p className="num text-label" style={{ color: `rgb(var(--color-dim-${dimension.id}))` }}>
        {padIndex(index + 1)}
        <span className="text-ink/35"> / {padIndex(total)}</span>
      </p>
      {/* Focus lands here after a step change, so keyboard and screen
          reader users arrive with the new questions. */}
      <h2 ref={headingRef} tabIndex={-1} className="mt-2 text-display text-ink outline-none">
        {dimension.label}
      </h2>
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
  const footerRef = useRef<HTMLElement>(null);
  const scrollTimerRef = useRef<number | null>(null);
  // Set by the reader's own step changes only; a run cleared or restored in
  // another tab must not scroll this one.
  const shouldScrollToStepRef = useRef(false);
  // A link into one question (#question-<id>, from the home page's word
  // flow) opens its part and scrolls to it once the part is on screen.
  const pendingQuestionRef = useRef<string | null>(null);

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

      if (Object.keys(current).length === 0 && !pendingQuestionRef.current) {
        const firstIncompleteIndex = groupedRef.current.findIndex((group) =>
          group.questions.some((question) => !stored[question.id])
        );

        setCurrentStepIndex(firstIncompleteIndex === -1 ? 0 : firstIncompleteIndex);
      }
    };

    const match = window.location.hash.match(/^#question-(.+)$/);

    if (match) {
      const questionId = decodeURIComponent(match[1]);
      const index = groupedRef.current.findIndex((group) =>
        group.questions.some((question) => question.id === questionId)
      );

      if (index !== -1) {
        pendingQuestionRef.current = questionId;
        setCurrentStepIndex(index);
      }
    }

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
  // come up to the top and focus travels with them.
  useEffect(() => {
    if (!shouldScrollToStepRef.current) {
      return;
    }

    shouldScrollToStepRef.current = false;
    scrollToElement(stepSectionRef.current, "start");
    introHeadingRef.current?.focus({ preventScroll: true });
  }, [currentStepIndex]);

  useEffect(() => {
    const questionId = pendingQuestionRef.current;

    if (!isReady || !questionId) {
      return;
    }

    const element = document.getElementById(questionElementId(questionId));

    if (!element) {
      return;
    }

    pendingQuestionRef.current = null;
    const frameId = window.requestAnimationFrame(() => scrollToElement(element, "center"));

    return () => window.cancelAnimationFrame(frameId);
  }, [isReady, currentStepIndex]);

  const currentAnswers = filterAnswersToCurrent(answers, questions);
  const completedCount = Object.keys(currentAnswers).length;
  const canContinue = completedCount === questions.length;
  const progressPercent = Math.round((completedCount / questions.length) * 100);
  const currentGroup = groupedQuestions[currentStepIndex] ?? groupedQuestions[0];
  const nextGroup = groupedQuestions[currentStepIndex + 1];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === groupedQuestions.length - 1;
  const activeQuestion = currentGroup?.questions.find((question) => !currentAnswers[question.id]);

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

  // Persist on every choice: a refresh or a nav click mid-questionnaire
  // must never lose an answer.
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
        scrollToElement(document.getElementById(questionElementId(nextOpen.id)), "center");
      } else {
        scrollToElement(footerRef.current, "end");
      }
    }, SCROLL_AFTER_ANSWER_MS);
  };

  // The keys 1, 2 and 3 answer the open question.
  const activeQuestionRef = useRef(activeQuestion);
  activeQuestionRef.current = activeQuestion;
  const handleChangeRef = useRef(handleChange);
  handleChangeRef.current = handleChange;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey || isTypingTarget(event.target)) {
        return;
      }

      const choice = Number(event.key);
      const question = activeQuestionRef.current;

      if (!(choice >= 1 && choice <= 3) || !question) {
        return;
      }

      const option = question.options[choice - 1];

      if (!option) {
        return;
      }

      event.preventDefault();
      handleChangeRef.current(question.id, option.id);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleSave = () => {
    saveAnswers(currentAnswers);
    router.push("/weights");
  };

  if (!isReady) {
    return null;
  }

  const railGroups = groupedQuestions.map((group) => ({
    dimension: group.dimension,
    answeredCount: group.questions.filter((question) => currentAnswers[question.id]).length,
    totalCount: group.questions.length
  }));

  return (
    <>
      <Band padding="header">
        <div className="flex items-end justify-between gap-4">
          <h1 tabIndex={-1} className="text-page-title text-ink outline-none">
            {t.questionnaire.title}
            <span className="sr-only">{t.questionnaire.keysHint}</span>
          </h1>
          <ResetProgressButton />
        </div>
      </Band>

      {/* Sticks under the header: the count in the mono face and a line
          that fills, with a little light on its tip. */}
      <div className="glass-bar sticky top-0 z-20 w-full shadow-stuck">
        <div className="mx-auto w-full max-w-site px-page-gutter py-3">
          <div className="flex items-baseline justify-between gap-4 text-label">
            <p className="num">
              <span className="text-ink">{padIndex(completedCount)}</span>
              <span className="text-ink/40"> / {questions.length}</span>
              <span className="sr-only">{t.questionnaire.answeredSuffix}</span>
            </p>
            {currentGroup ? (
              <p className="min-w-0 truncate text-ink/55">
                <span className="num">{padIndex(currentStepIndex + 1)}</span> · {currentGroup.dimension.label}
              </p>
            ) : null}
          </div>
          <div className="mt-2 h-0.5 rounded-pill bg-progress-track">
            <div
              className="h-0.5 rounded-pill bg-action-primary transition-[width] duration-motion-slide ease-slide motion-reduce:transition-none"
              style={{ width: `${progressPercent}%`, boxShadow: "0 0 14px rgb(var(--color-action-primary) / 0.7)" }}
            />
          </div>
        </div>
      </div>

      <Band ref={stepSectionRef} className="scroll-mt-20">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-16">
          <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
            <h2 id="steps-heading" className="sr-only">
              {t.questionnaire.stepsHeading}
            </h2>
            <PartRail groups={railGroups} currentIndex={currentStepIndex} onSelect={changeStep} />
          </div>

          {currentGroup ? (
            <div className="min-w-0">
              <DimensionIntroHeader
                dimension={currentGroup.dimension}
                index={currentStepIndex}
                total={groupedQuestions.length}
                headingRef={introHeadingRef}
              />

              <div className="mt-10 space-y-14">
                {currentGroup.questions.map((question) => (
                  <QuestionCard
                    key={question.id}
                    question={question}
                    value={currentAnswers[question.id]}
                    onChange={handleChange}
                    number={questionNumbers.get(question.id) ?? 0}
                    numberLabel={t.questionnaire.questionOf(questionNumbers.get(question.id) ?? 0, questions.length)}
                    isActive={question.id === activeQuestion?.id}
                  />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </Band>

      <Band ref={footerRef} tone="white" padding="tight" as="div">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <QuietLink href="/" className="-mx-2 self-center sm:self-auto">
            {t.questionnaire.backHome}
          </QuietLink>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
            {isLastStep && !canContinue ? (
              <p className="num text-center text-label text-ink/55 sm:mr-2 sm:text-right">
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
      </Band>
    </>
  );
}

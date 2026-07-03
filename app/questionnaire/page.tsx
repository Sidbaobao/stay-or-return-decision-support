"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  HeartHandshake,
  Scale,
  Sprout,
  Stamp,
  Sun,
  type LucideIcon
} from "lucide-react";
import { questions } from "@/data/questions";
import { dimensions } from "@/data/dimensions";
import { usePrerequisiteGuard } from "@/lib/guards";
import { filterAnswersToCurrent, loadAppState, saveAnswers } from "@/lib/storage";
import { Answers, Dimension, DimensionId } from "@/types";
import { PageHeader } from "@/components/ui/page-header";
import { PrimaryButton } from "@/components/ui/primary-button";
import { QuestionCard } from "@/components/questionnaire/question-card";

const groupedQuestions = dimensions.map((dimension) => ({
  dimension,
  questions: questions.filter((question) => question.dimensionId === dimension.id)
}));

const dimensionIntroById: Record<
  DimensionId,
  {
    Icon: LucideIcon;
    guidingQuestion: string;
  }
> = {
  career: {
    Icon: Briefcase,
    guidingQuestion: "Where can you realistically build the career you want?"
  },
  salary_cost: {
    Icon: Scale,
    guidingQuestion: "Where does your money actually go further for the life you want?"
  },
  immigration: {
    Icon: Stamp,
    guidingQuestion: "How much does visa and status uncertainty weigh on you?"
  },
  family_emotion: {
    Icon: HeartHandshake,
    guidingQuestion: "How strong is the pull of the people back home?"
  },
  lifestyle: {
    Icon: Sun,
    guidingQuestion: "Which daily life genuinely feels more like you?"
  },
  long_term: {
    Icon: Sprout,
    guidingQuestion: "Which path do you trust more over the next ten years?"
  }
};

type DimensionProgressRingProps = {
  answeredCount: number;
  totalCount: number;
  isCurrent: boolean;
  isComplete: boolean;
};

function DimensionProgressRing({
  answeredCount,
  totalCount,
  isCurrent,
  isComplete
}: DimensionProgressRingProps) {
  const size = isCurrent ? 52 : 46;
  const strokeWidth = 4;
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressRatio = totalCount === 0 ? 0 : answeredCount / totalCount;
  const dashOffset = circumference * (1 - progressRatio);

  return (
    <div
      className={`relative shrink-0 rounded-pill ${
        isCurrent
          ? "bg-action-primary/10 p-1 shadow-legacy-sm"
          : "bg-surface-strong/70 p-0.5"
      }`}
      role="img"
      aria-label={`${answeredCount} of ${totalCount} questions answered`}
    >
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
};

function DimensionIntroHeader({ dimension }: DimensionIntroHeaderProps) {
  const { Icon, guidingQuestion } = dimensionIntroById[dimension.id];

  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-tile bg-accent-warm/10 text-accent-warm shadow-legacy-sm">
        <Icon aria-hidden="true" strokeWidth={1.8} className="h-7 w-7" />
      </div>

      <div className="min-w-0 space-y-3">
        <div>
          <p className="text-eyebrow text-ink-accent">
            Current dimension
          </p>
          <h2 className="mt-2 font-serif text-section-title text-ink">
            {dimension.label}
          </h2>
        </div>
        <p className="max-w-measure text-body text-ink/70">
          {dimension.description}
        </p>
        <p className="max-w-measure border-l-2 border-accent-warm/40 pl-4 text-body-sm font-medium text-ink">
          {guidingQuestion}
        </p>
      </div>
    </div>
  );
}

export default function QuestionnairePage() {
  const isReady = usePrerequisiteGuard("none");
  const router = useRouter();
  const [answers, setAnswers] = useState<Answers>({});
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const loadedAnswers = filterAnswersToCurrent(loadAppState().answers, questions);
    const firstIncompleteIndex = groupedQuestions.findIndex((group) =>
      group.questions.some((question) => !loadedAnswers[question.id])
    );

    setAnswers(loadedAnswers);
    setCurrentStepIndex(firstIncompleteIndex === -1 ? 0 : firstIncompleteIndex);
  }, []);

  const currentAnswers = filterAnswersToCurrent(answers, questions);
  const completedCount = Object.keys(currentAnswers).length;
  const canContinue = completedCount === questions.length;
  const progressPercent = Math.round((completedCount / questions.length) * 100);
  const currentGroup = groupedQuestions[currentStepIndex] ?? groupedQuestions[0];
  const currentGroupAnsweredCount =
    currentGroup?.questions.filter((question) => currentAnswers[question.id]).length ?? 0;
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === groupedQuestions.length - 1;

  const handleChange = (questionId: string, optionId: string) => {
    setAnswers((currentAnswers) => ({
      ...currentAnswers,
      [questionId]: optionId
    }));
  };

  const handleSave = () => {
    saveAnswers(currentAnswers);
    router.push("/weights");
  };

  const goToPreviousStep = () => {
    setCurrentStepIndex((currentIndex) => Math.max(currentIndex - 1, 0));
  };

  const goToNextStep = () => {
    setCurrentStepIndex((currentIndex) =>
      Math.min(currentIndex + 1, groupedQuestions.length - 1)
    );
  };

  if (!isReady) {
    return null;
  }

  return (
    <>
      <PageHeader
        eyebrow="Step 1"
        title="Questionnaire"
        description="Answer based on your current situation."
      />

      <div className="sticky top-3 z-20 rounded-pill border border-border bg-surface/95 px-4 py-3 shadow-legacy-sm backdrop-blur">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-label font-medium text-ink/70">
          <span>
            {completedCount} of {questions.length} answered
          </span>
          <span>{questions.length - completedCount} remaining</span>
        </div>
        <div className="h-2 rounded-pill bg-action-primary/10">
          <div
            className="h-2 rounded-pill bg-action-primary transition-[width] duration-motion-emphasis ease-interaction motion-reduce:transition-none"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <section>
        <h2 className="text-section-title text-ink">Questionnaire steps</h2>
        <p className="mt-2 max-w-measure text-body-sm text-ink/70">
          Move through one dimension at a time — you can jump back to any step.
        </p>
        <div className="-mx-2 mt-5 overflow-x-auto px-2">
          <div className="flex min-w-max gap-3 pb-1">
            {groupedQuestions.map((group, index) => {
              const answeredCount = group.questions.filter(
                (question) => currentAnswers[question.id]
              ).length;
              const isComplete = answeredCount === group.questions.length;
              const isCurrent = index === currentStepIndex;

              return (
                <button
                  key={group.dimension.id}
                  type="button"
                  onClick={() => setCurrentStepIndex(index)}
                  data-selected={isCurrent ? "true" : "false"}
                  className={`interaction-option min-w-64 rounded-tile border p-4 text-left ${
                    isCurrent
                      ? "border-accent-warm/50 bg-surface-selected text-ink"
                      : isComplete
                        ? "border-action-primary/30 bg-surface-strong/85 text-ink"
                        : "border-ink/10 bg-surface-raised text-ink/65"
                  }`}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  <span className="flex items-start gap-3">
                    <DimensionProgressRing
                      answeredCount={answeredCount}
                      totalCount={group.questions.length}
                      isCurrent={isCurrent}
                      isComplete={isComplete}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="text-eyebrow block">
                        Step {index + 1}
                      </span>
                      <span className="mt-2 block text-body-sm font-semibold">
                        {group.dimension.label}
                      </span>
                      <span className="mt-3 block text-label text-ink/65">
                        {isComplete ? "Done" : `${answeredCount} of ${group.questions.length}`}
                      </span>
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {currentGroup ? (
        <section>
          <DimensionIntroHeader dimension={currentGroup.dimension} />

          <p className="mb-6 mt-6 text-body-sm text-ink/65">
            <span className="font-medium text-ink">
              {currentGroupAnsweredCount} of {currentGroup.questions.length}
            </span>{" "}
            questions answered in this dimension.
          </p>

          <div className="space-y-4">
            {currentGroup.questions.map((question) => (
              <QuestionCard
                key={question.id}
                question={question}
                value={currentAnswers[question.id]}
                onChange={handleChange}
              />
            ))}
          </div>
        </section>
      ) : null}

      <div className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/"
          className="interaction-quiet -mx-1 self-center rounded-control px-1 py-1 text-sm font-medium text-ink/70 hover:text-ink sm:self-auto"
        >
          Back to home
        </Link>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          {!isFirstStep ? (
            <button
              type="button"
              onClick={goToPreviousStep}
              className="interaction-secondary inline-flex min-h-11 items-center justify-center rounded-pill border border-ink/10 px-5 text-sm font-medium text-ink"
            >
              Previous
            </button>
          ) : null}

          {isLastStep ? (
            <PrimaryButton onClick={handleSave} disabled={!canContinue} className="w-full sm:w-auto">
              Save and continue to weights
            </PrimaryButton>
          ) : (
            <PrimaryButton type="button" onClick={goToNextStep} className="w-full sm:w-auto">
              Next
            </PrimaryButton>
          )}
        </div>
      </div>
    </>
  );
}

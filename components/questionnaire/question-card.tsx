import { Question } from "@/types";
import { SegmentedOptions } from "@/components/questionnaire/segmented-options";

type QuestionCardProps = {
  question: Question;
  value?: string;
  onChange: (questionId: string, optionId: string) => void;
  // The reader's place in the whole questionnaire, 1 to 24.
  number: number;
  // "Question 3 of 24", for screen readers.
  numberLabel: string;
  // The first open question in the part, the one the reader is on.
  isActive: boolean;
};

export function questionElementId(questionId: string) {
  return `question-${questionId}`;
}

export function padIndex(value: number) {
  return String(value).padStart(2, "0");
}

// One question: its number in the mono face down the left, the prompt, and
// the three answers in one track. The open question carries a pulsing dot;
// an answered one steps back until the pointer returns to it.
export function QuestionCard({ question, value, onChange, number, numberLabel, isActive }: QuestionCardProps) {
  const isAnswered = value !== undefined;

  return (
    <section
      id={questionElementId(question.id)}
      className="group grid scroll-mt-32 grid-cols-[2.75rem_minmax(0,1fr)] gap-x-2 sm:grid-cols-[4rem_minmax(0,1fr)] sm:gap-x-4"
    >
      <div className="flex items-start gap-2 pt-1.5">
        <span aria-hidden="true" className={`pulse-dot mt-2 ${isActive ? "" : "invisible"}`} />
        <span
          aria-hidden="true"
          className={`num text-label transition-colors duration-motion-standard ease-interaction motion-reduce:transition-none ${
            isActive ? "text-accent-warm" : isAnswered ? "text-ink/40" : "text-ink/55"
          }`}
        >
          {padIndex(number)}
        </span>
        <span className="sr-only">{numberLabel}</span>
      </div>

      <div className="min-w-0">
        <h3
          id={`${question.id}-prompt`}
          className={`text-card-title transition-colors duration-motion-standard ease-interaction motion-reduce:transition-none sm:text-[1.5rem] sm:leading-[1.3] ${
            isAnswered ? "text-ink/55 group-hover:text-ink/85" : "text-ink"
          }`}
        >
          {question.prompt}
        </h3>

        <SegmentedOptions
          name={question.id}
          options={question.options}
          value={value}
          labelledBy={`${question.id}-prompt`}
          onChange={(optionId) => onChange(question.id, optionId)}
        />
      </div>
    </section>
  );
}

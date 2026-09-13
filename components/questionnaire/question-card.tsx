import { Question } from "@/types";

type QuestionCardProps = {
  question: Question;
  value?: string;
  onChange: (questionId: string, optionId: string) => void;
};

// One question in the dimension's list: a hairline-divided block. The
// options keep their outlines, because they are the controls.
export function QuestionCard({ question, value, onChange }: QuestionCardProps) {
  return (
    <section className="py-7">
      <div className="space-y-2">
        <h3 id={`${question.id}-prompt`} className="text-card-title text-ink">
          {question.prompt}
        </h3>
        {question.helpText ? <p className="max-w-measure text-body-sm text-ink/65">{question.helpText}</p> : null}
      </div>

      <div className="mt-5 space-y-3" role="radiogroup" aria-labelledby={`${question.id}-prompt`}>
        {question.options.map((option) => {
          const isSelected = value === option.id;

          return (
            <label
              key={option.id}
              data-selected={isSelected ? "true" : "false"}
              className={`interaction-option group block cursor-pointer rounded-option border px-5 py-4 ${
                isSelected
                  ? "border-accent-warm/70 bg-surface-selected"
                  : "border-ink/10 bg-surface-raised"
              }`}
            >
              <input
                type="radio"
                name={question.id}
                value={option.id}
                checked={isSelected}
                onChange={() => onChange(question.id, option.id)}
                className="sr-only"
              />
              <div className="flex items-start gap-4">
                <span
                  className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-pill border transition-[border-color,background-color,box-shadow,color] duration-motion-standard ease-interaction motion-reduce:transition-none ${
                    isSelected
                      ? "border-accent-warm bg-accent-warm text-surface-strong ring-4 ring-accent-warm/10"
                      : "border-ink/20 bg-surface-strong group-hover:border-accent-warm/50"
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-pill bg-current transition-[transform,opacity] duration-motion-standard ease-interaction motion-reduce:transition-none ${
                      isSelected ? "scale-100 opacity-100" : "scale-0 opacity-0"
                    }`}
                  />
                </span>
                <span className="min-w-0 text-body font-medium text-ink">{option.label}</span>
              </div>
            </label>
          );
        })}
      </div>
    </section>
  );
}

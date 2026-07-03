import {
  FileText,
  ListChecks,
  SlidersHorizontal,
  type LucideIcon
} from "lucide-react";
import { HeroSection } from "@/components/home/hero-section";
import { TwoPathsVideoSection } from "@/components/home/two-paths-video-section";

type StepSectionProps = {
  step: string;
  title: string;
  description: string;
  Icon: LucideIcon;
  iconClassName: string;
};

function StepSection({
  step,
  title,
  description,
  Icon,
  iconClassName
}: StepSectionProps) {
  return (
    <section className="rounded-card border border-home-border/25 bg-home-surface/78 p-6 shadow-home-glow backdrop-blur-sm sm:p-8">
      <div className="flex items-center justify-between gap-4">
        <p className="text-eyebrow text-accent-warm">{step}</p>
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-tile border ${iconClassName}`}
        >
          <Icon aria-hidden="true" strokeWidth={1.8} className="h-5 w-5" />
        </span>
      </div>
      <h2 className="mt-8 text-section-title text-surface-strong">{title}</h2>
      <p className="mt-3 text-body text-surface-strong/70">{description}</p>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <HeroSection />

      <section
        id="how-it-works"
        className="relative isolate overflow-hidden bg-hero px-4 pb-20 pt-24 text-surface-strong sm:px-6 lg:px-8"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{ backgroundImage: "var(--gradient-home-atmosphere)" }}
        />

        <div className="mx-auto flex w-full max-w-6xl flex-col">
          <div className="max-w-3xl">
            <p className="text-eyebrow text-accent-warm">How it works</p>
            <h2 className="mt-3 text-page-title text-surface-strong">
              Three steps. Clear reasoning.
            </h2>
            <p className="mt-3 max-w-measure text-body text-surface-strong/70">
              Your answers and priorities stay visible from start to finish.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <StepSection
              step="Step 1"
              title="Answer questions"
              description="Answer practical questions across six decision dimensions."
              Icon={ListChecks}
              iconClassName="border-path-stay/35 bg-path-stay/15 text-surface-strong"
            />

            <StepSection
              step="Step 2"
              title="Set priorities"
              description="Set how much each dimension should shape the result."
              Icon={SlidersHorizontal}
              iconClassName="border-accent-warm/35 bg-accent-warm/15 text-surface-strong"
            />

            <StepSection
              step="Step 3"
              title="Review output"
              description="See the scores, tradeoffs, uncertainty, and decision memo."
              Icon={FileText}
              iconClassName="border-path-return/35 bg-path-return/15 text-surface-strong"
            />
          </div>

          <TwoPathsVideoSection />

          <div className="rounded-card border border-home-border/25 bg-home-surface-raised/72 p-6 shadow-home-glow backdrop-blur-sm lg:p-8">
            <p className="text-eyebrow text-accent-warm">Methodology note</p>
            <p className="mt-3 max-w-measure text-body-sm text-surface-strong/70">
              A reflection tool for clearer tradeoffs, not legal, financial, or immigration advice.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

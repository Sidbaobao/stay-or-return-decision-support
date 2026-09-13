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
};

// One column per step, separated by hairlines rather than framed as cards.
function StepSection({ step, title, description, Icon }: StepSectionProps) {
  return (
    <section className="py-6 md:px-6 md:py-0 md:first:pl-0 md:last:pr-0 lg:px-8">
      <div className="flex items-center gap-3 text-accent-warm">
        <Icon aria-hidden="true" strokeWidth={1.8} className="h-5 w-5 shrink-0" />
        <p className="text-eyebrow">{step}</p>
      </div>
      <h3 className="mt-5 text-section-title text-surface-strong">{title}</h3>
      <p className="mt-3 max-w-measure text-body text-surface-strong/70">{description}</p>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <HeroSection />

      <section
        id="how-it-works"
        className="relative isolate overflow-hidden bg-hero px-page-gutter pb-20 pt-24 text-surface-strong"
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
          </div>

          <div className="mt-10 grid divide-y divide-surface-strong/10 border-t border-surface-strong/10 md:grid-cols-3 md:divide-x md:divide-y-0 md:pt-8">
            <StepSection
              step="Step 1"
              title="Answer questions"
              description="Practical questions across six decision dimensions."
              Icon={ListChecks}
            />

            <StepSection
              step="Step 2"
              title="Set priorities"
              description="Decide how much each dimension counts."
              Icon={SlidersHorizontal}
            />

            <StepSection
              step="Step 3"
              title="Review output"
              description="See the scores, tradeoffs, uncertainty, and decision memo."
              Icon={FileText}
            />
          </div>

          <TwoPathsVideoSection />

          <div className="py-16 text-center lg:py-24">
            <p className="mx-auto max-w-3xl text-balance font-serif text-section-title text-surface-strong/90">
              A decision this big deserves your clearest thinking.
            </p>
          </div>

          <footer className="border-t border-surface-strong/10 pt-8">
            <p className="mx-auto max-w-measure text-center text-label text-surface-strong/70">
              A reflection tool for clearer tradeoffs, not legal, financial, or immigration advice.
            </p>
          </footer>
        </div>
      </section>
    </>
  );
}

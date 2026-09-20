import { HeroSection } from "@/components/home/hero-section";
import { HomeClosing, HowItWorks } from "@/components/home/how-it-works";
import { TwoPathsVideoSection } from "@/components/home/two-paths-video-section";
import { DecorativeBoundary } from "@/components/ui/decorative-boundary";

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

        <div className="mx-auto flex w-full max-w-site flex-col">
          <HowItWorks />
          <DecorativeBoundary>
            <TwoPathsVideoSection />
          </DecorativeBoundary>
          <HomeClosing />
        </div>
      </section>
    </>
  );
}

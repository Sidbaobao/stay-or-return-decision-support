"use client";

import { DecisionMapCanvas } from "@/components/home/decision-map-canvas";
import { FactorFlow } from "@/components/home/factor-flow";
import { HomeProgressCta } from "@/components/home/home-progress-cta";
import { DecorativeBoundary } from "@/components/ui/decorative-boundary";
import { useLocale } from "@/lib/i18n/provider";

export function HeroSection() {
  const { t } = useLocale();

  return (
    <section className="relative isolate min-h-[92svh] overflow-hidden bg-hero text-surface-strong">
      {/* The field is decoration: if it fails on a device, the dark ground stays and the page goes on. */}
      <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,#000_0%,#000_66%,rgba(0,0,0,0.74)_76%,rgba(0,0,0,0.28)_88%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,#000_0%,#000_66%,rgba(0,0,0,0.74)_76%,rgba(0,0,0,0.28)_88%,transparent_100%)]">
        <DecorativeBoundary>
          <DecisionMapCanvas />
        </DecorativeBoundary>
      </div>

      <div className="absolute inset-0" style={{ backgroundImage: "var(--gradient-hero-vignette)" }} />

      <div className="relative z-10 flex min-h-[92svh] w-full flex-col justify-center pb-12 pt-28">
        <div className="mx-auto w-full max-w-6xl px-page-gutter text-center">
          <h1 className="text-balance text-display text-surface-strong">{t.home.heroTitle}</h1>
          <ul className="num mt-6 flex flex-wrap justify-center gap-x-7 gap-y-2 text-label text-surface-strong/60">
            {t.home.heroFacts.map((fact) => (
              <li key={fact}>{fact}</li>
            ))}
          </ul>

          <div className="mt-8 flex w-full justify-center sm:w-auto">
            <HomeProgressCta />
          </div>
        </div>

        {/* What the decision turns on, drifting under the question. The rows
            are decoration for the eye and a way in for the hand: each word
            opens its question. */}
        <DecorativeBoundary>
          <FactorFlow />
        </DecorativeBoundary>
      </div>
    </section>
  );
}

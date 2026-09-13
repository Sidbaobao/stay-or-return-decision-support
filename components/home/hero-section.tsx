"use client";

import { DecisionMapCanvas } from "@/components/home/decision-map-canvas";
import { HomeProgressCta } from "@/components/home/home-progress-cta";
import { useLocale } from "@/lib/i18n/provider";

export function HeroSection() {
  const { t } = useLocale();

  return (
    <section className="relative isolate min-h-[88svh] overflow-hidden bg-hero text-surface-strong">
      <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,#000_0%,#000_66%,rgba(0,0,0,0.74)_76%,rgba(0,0,0,0.28)_88%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,#000_0%,#000_66%,rgba(0,0,0,0.74)_76%,rgba(0,0,0,0.28)_88%,transparent_100%)]">
        <DecisionMapCanvas />
      </div>

      <div className="absolute inset-0" style={{ backgroundImage: "var(--gradient-hero-vignette)" }} />

      <div className="relative z-10 mx-auto flex min-h-[88svh] w-full max-w-6xl flex-col items-center justify-center px-page-gutter pb-20 pt-28 text-center">
        <h1 className="text-display text-surface-strong">{t.home.heroTitle}</h1>
        <p className="mt-5 text-body-lg text-surface-strong/75">{t.home.heroSubtitle}</p>

        <div className="mt-8 flex w-full justify-center sm:w-auto">
          <HomeProgressCta />
        </div>
      </div>
    </section>
  );
}

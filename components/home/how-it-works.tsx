"use client";

import { FileText, ListChecks, SlidersHorizontal, type LucideIcon } from "lucide-react";
import { useLocale } from "@/lib/i18n/provider";

const stepIcons: LucideIcon[] = [ListChecks, SlidersHorizontal, FileText];

// The three steps, one column each, separated by hairlines rather than
// framed as cards. The copy comes from the dictionary in the same order.
export function HowItWorks() {
  const { t } = useLocale();

  return (
    <>
      <div>
        <p className="text-eyebrow text-accent-warm">{t.home.howItWorks}</p>
        <h2 className="mt-3 text-page-title text-surface-strong">{t.home.threeSteps}</h2>
      </div>

      <div className="mt-10 grid divide-y divide-surface-strong/10 border-t border-surface-strong/10 md:grid-cols-3 md:divide-x md:divide-y-0 md:pt-8">
        {t.home.steps.map((step, index) => {
          const Icon = stepIcons[index] ?? FileText;

          return (
            <section key={step.step} className="py-6 md:px-6 md:py-0 md:first:pl-0 md:last:pr-0 lg:px-8">
              <div className="flex items-center gap-3 text-accent-warm">
                <Icon aria-hidden="true" strokeWidth={1.8} className="h-5 w-5 shrink-0" />
                <p className="text-eyebrow">{step.step}</p>
              </div>
              <h3 className="mt-5 text-section-title text-surface-strong">{step.title}</h3>
              <p className="mt-3 text-body text-surface-strong/70">{step.description}</p>
            </section>
          );
        })}
      </div>
    </>
  );
}

export function HomeClosing() {
  const { t } = useLocale();

  return (
    <>
      <div className="py-16 text-center lg:py-24">
        <p className="mx-auto text-balance font-serif text-section-title text-surface-strong/90">
          {t.home.closing}
        </p>
      </div>

      <footer className="border-t border-surface-strong/10 pt-8">
        <p className="mx-auto text-center text-label text-surface-strong/70">{t.home.footer}</p>
      </footer>
    </>
  );
}

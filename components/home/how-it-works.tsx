"use client";

import Link from "next/link";
import { FileText, ListChecks, SlidersHorizontal, type LucideIcon } from "lucide-react";
import { HomeProgressCta } from "@/components/home/home-progress-cta";
import { LanguageToggle } from "@/components/layout/language-toggle";
import { useRunStatus } from "@/lib/run-state";
import { useLocale } from "@/lib/i18n/provider";

const stepIcons: LucideIcon[] = [ListChecks, SlidersHorizontal, FileText];

// The three steps, one column each, separated by space. The copy comes
// from the dictionary in the same order.
export function HowItWorks() {
  const { t } = useLocale();

  return (
    <>
      <h2 className="text-page-title text-surface-strong">{t.home.howItWorks}</h2>

      <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8 lg:gap-12">
        {t.home.steps.map((step, index) => {
          const Icon = stepIcons[index] ?? FileText;

          return (
            <section key={step.step}>
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

// The four steps, numbered as in the header; the ones after the questions
// wait until the questions are answered.
const footerSteps = [
  { href: "/questionnaire", key: "questionnaire", step: "01", gated: false },
  { href: "/weights", key: "weights", step: "02", gated: true },
  { href: "/results", key: "results", step: "03", gated: true },
  { href: "/report", key: "memo", step: "04", gated: true }
] as const;

const footerLinkClassName =
  "interaction-quiet inline-flex items-center gap-2.5 rounded-control text-surface-strong/75 hover:text-surface-strong";

// The end of the home page: the question once more with the way in beside
// it, then the site's footer, which is where the one line that has to be
// said belongs.
export function HomeClosing() {
  const { t } = useLocale();
  const status = useRunStatus();
  const isUnlocked = status?.isComplete ?? false;

  return (
    <>
      <div className="mt-20 grid gap-8 lg:mt-28 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-16">
        <p className="text-balance text-page-title text-surface-strong">{t.home.heroTitle}</p>
        <div className="lg:justify-self-end">
          <HomeProgressCta align="end" />
        </div>
      </div>

      <footer className="mt-20 grid gap-10 lg:mt-28 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)] lg:gap-12">
        <div>
          <p className="text-lg font-semibold tracking-tight text-surface-strong">{t.brand}</p>
          <ul className="num mt-4 space-y-1.5 text-body-sm text-surface-strong/55">
            {t.home.heroFacts.map((fact) => (
              <li key={fact}>{fact}</li>
            ))}
          </ul>
        </div>

        <ul className="space-y-2.5 text-body-sm">
          {footerSteps.map((item) => {
            const label = t.nav[item.key];
            const isLocked = item.gated && !isUnlocked;

            return (
              <li key={item.href}>
                {isLocked ? (
                  <span
                    aria-disabled="true"
                    title={t.nav.lockedReason}
                    className="inline-flex cursor-not-allowed items-center gap-2.5 text-surface-strong/35"
                  >
                    <span aria-hidden="true" className="num text-[0.6875rem]">
                      {item.step}
                    </span>
                    {label}
                    <span className="sr-only">, {t.nav.lockedReason}</span>
                  </span>
                ) : (
                  <Link href={item.href} className={footerLinkClassName}>
                    <span aria-hidden="true" className="num text-[0.6875rem] text-surface-strong/45">
                      {item.step}
                    </span>
                    {label}
                  </Link>
                )}
              </li>
            );
          })}
          <li>
            <Link href="/profile" className={footerLinkClassName}>
              {t.nav.profile}
            </Link>
          </li>
        </ul>

        <div className="flex flex-col gap-5 lg:items-end lg:text-right">
          <LanguageToggle variant="light" />
          <p className="text-label text-surface-strong/55">{t.home.footer}</p>
        </div>
      </footer>
    </>
  );
}

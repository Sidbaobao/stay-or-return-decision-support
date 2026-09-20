"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Lock } from "lucide-react";
import { useRunStatus } from "@/lib/run-state";
import { useLocale } from "@/lib/i18n/provider";
import { Dictionary } from "@/lib/i18n";
import { LanguageToggle } from "@/components/layout/language-toggle";
import { ProfileChip } from "@/components/layout/profile-chip";

// Weights always exist (they default), so finishing the questionnaire is the
// only real gate. The four steps carry their number in the mono face.
const navItems = [
  { href: "/", key: "home", requirement: "none", step: null },
  { href: "/questionnaire", key: "questionnaire", requirement: "none", step: "01" },
  { href: "/weights", key: "weights", requirement: "answers", step: "02" },
  { href: "/results", key: "results", requirement: "answers", step: "03" },
  { href: "/report", key: "memo", requirement: "answers", step: "04" }
] as const;

type NavBarProps = {
  pathname: string;
  isHome: boolean;
  isUnlocked: boolean;
  t: Dictionary;
  className: string;
};

// One row of links with a single underline that slides from the page you
// left to the one you are on. The header stays across navigations, so the
// slide is what tells the reader the frame held and only the page moved.
function NavBar({ pathname, isHome, isUnlocked: hasCompletedQuestionnaire, t, className }: NavBarProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState<{ x: number; width: number; ready: boolean }>({
    x: 0,
    width: 0,
    ready: false
  });
  const hasActive = navItems.some((item) => item.href === pathname);

  const measure = useCallback(() => {
    const list = listRef.current;
    const active = list?.querySelector<HTMLElement>('[aria-current="page"]');

    if (!list || !active) {
      setIndicator((current) => ({ ...current, ready: false }));
      return;
    }

    const listRect = list.getBoundingClientRect();
    const activeRect = active.getBoundingClientRect();
    setIndicator({ x: activeRect.left - listRect.left + list.scrollLeft, width: activeRect.width, ready: true });
  }, []);

  useEffect(() => {
    measure();
    // Fonts arriving after hydration change the widths.
    if ("fonts" in document) {
      void document.fonts.ready.then(measure);
    }

    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure, pathname]);

  return (
    <nav aria-label={t.nav.primary} className={className}>
      <div ref={listRef} className="relative flex items-center gap-5">
        {navItems.map((item) => {
          const label = t.nav[item.key];
          const isActive = pathname === item.href;
          const isUnlocked = item.requirement === "none" || hasCompletedQuestionnaire;
          const baseClassName = "inline-flex items-center gap-1.5 whitespace-nowrap text-sm";
          const unlockedClassName = isHome
            ? isActive
              ? "font-medium text-surface-strong"
              : "text-surface-strong/70 hover:text-surface-strong"
            : isActive
              ? "font-medium text-ink"
              : "text-ink/60 hover:text-ink";
          const stepNumber = item.step ? (
            <span aria-hidden="true" className={`num text-[0.6875rem] ${isActive ? "text-action-primary" : "opacity-45"}`}>
              {item.step}
            </span>
          ) : null;
          const statusIcon =
            item.requirement === "none" || isUnlocked ? null : (
              <Lock aria-hidden="true" className="h-3.5 w-3.5 shrink-0" strokeWidth={1.8} />
            );

          if (isUnlocked) {
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`${baseClassName} interaction-quiet -mx-1 rounded-control px-1 py-1 ${unlockedClassName}`}
              >
                {stepNumber}
                {label}
              </Link>
            );
          }

          return (
            <span
              key={item.href}
              role="link"
              aria-disabled="true"
              aria-current={isActive ? "page" : undefined}
              aria-label={`${label}, ${t.nav.lockedReason}`}
              title={t.nav.lockedReason}
              className={`${baseClassName} cursor-not-allowed select-none ${
                isHome ? "text-surface-strong/35" : "text-ink/30"
              }`}
            >
              {stepNumber}
              {label}
              {statusIcon}
            </span>
          );
        })}

        <span
          aria-hidden="true"
          className="nav-indicator"
          data-ready={indicator.ready && hasActive ? "true" : "false"}
          style={{ transform: `translateX(${indicator.x}px)`, width: `${indicator.width}px` }}
        />
      </div>
    </nav>
  );
}

export function TopNav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const status = useRunStatus();
  const isUnlocked = status?.isComplete ?? false;
  const { t } = useLocale();

  return (
    <header
      className={
        // On the home page the header floats over the hero; elsewhere it is
        // the first band of the night.
        `transition-colors duration-motion-emphasis ease-interaction motion-reduce:transition-none ${
          isHome ? "absolute left-0 top-0 z-30 w-full bg-transparent" : "relative z-30 bg-canvas"
        }`
      }
    >
      <div className="mx-auto w-full max-w-6xl px-page-gutter py-4">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className={`interaction-quiet rounded-control text-lg font-semibold tracking-tight ${
              isHome ? "text-surface-strong" : "text-ink"
            }`}
          >
            {t.brand}
          </Link>

          <NavBar
            pathname={pathname}
            isHome={isHome}
            isUnlocked={isUnlocked}
            t={t}
            className="hidden md:block"
          />

          <div className="flex items-center gap-4">
            <LanguageToggle variant={isHome ? "light" : "default"} />
            <ProfileChip variant={isHome ? "light" : "default"} />
          </div>
        </div>

        <NavBar
          pathname={pathname}
          isHome={isHome}
          isUnlocked={isUnlocked}
          t={t}
          className="-mx-1 mt-3 overflow-x-auto px-1 pb-2 pt-1 md:hidden"
        />
      </div>
    </header>
  );
}

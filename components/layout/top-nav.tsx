"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Lock } from "lucide-react";
import { useRunStatus } from "@/lib/run-state";
import { useLocale } from "@/lib/i18n/provider";
import { Dictionary } from "@/lib/i18n";
import { LanguageToggle } from "@/components/layout/language-toggle";
import { ProfileChip } from "@/components/layout/profile-chip";

// Weights always exist (they default), so finishing the questionnaire is the
// only real gate. The "Set your weights first" lock could never engage.
const navItems = [
  { href: "/", key: "home", requirement: "none" },
  { href: "/questionnaire", key: "questionnaire", requirement: "none" },
  { href: "/weights", key: "weights", requirement: "answers" },
  { href: "/results", key: "results", requirement: "answers" },
  { href: "/report", key: "memo", requirement: "answers" }
] as const;

type NavLinksProps = {
  pathname: string;
  isHome: boolean;
  isUnlocked: boolean;
  t: Dictionary;
};

function NavLinks({ pathname, isHome, isUnlocked: hasCompletedQuestionnaire, t }: NavLinksProps) {
  return navItems.map((item) => {
    const label = t.nav[item.key];
    const isActive = pathname === item.href;
    const isUnlocked = item.requirement === "none" || hasCompletedQuestionnaire;
    const baseClassName = "inline-flex items-center gap-1.5 whitespace-nowrap text-sm";
    const unlockedClassName = isHome
      ? isActive
        ? "font-medium text-surface-strong"
        : "text-surface-strong/70 hover:text-surface-strong"
      : isActive
        ? "font-medium text-action-primary"
        : "text-ink/70 hover:text-ink";

    const statusIcon = item.requirement === "none" ? null : (
      <span className="inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center" aria-hidden="true">
        <Lock
          className={`h-3.5 w-3.5 ${isUnlocked ? "invisible" : "visible"}`}
          strokeWidth={1.8}
        />
      </span>
    );

    if (isUnlocked) {
      return (
        <Link
          key={item.href}
          href={item.href}
          aria-current={isActive ? "page" : undefined}
          className={`${baseClassName} interaction-nav -mx-1 rounded-control px-1 py-1 ${unlockedClassName}`}
        >
          {statusIcon}
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
        aria-label={`${label}. ${t.nav.lockedReason}`}
        title={t.nav.lockedReason}
        className={`${baseClassName} cursor-not-allowed select-none ${
          isHome ? "text-surface-strong/35" : "text-ink/35"
        }`}
      >
        {statusIcon}
        {label}
      </span>
    );
  });
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
        isHome
          ? "absolute left-0 top-0 z-30 w-full border-b border-surface-strong/10 bg-transparent"
          : "border-b border-surface-strong/60 bg-surface-strong/85 backdrop-blur"
      }
    >
      <div className="mx-auto w-full max-w-6xl px-page-gutter py-4">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className={`interaction-quiet rounded-control text-lg font-semibold ${
              isHome ? "text-surface-strong" : "text-ink"
            }`}
          >
            {t.brand}
          </Link>

          <nav aria-label={t.nav.primary} className="hidden items-center gap-5 md:flex">
            <NavLinks pathname={pathname} isHome={isHome} isUnlocked={isUnlocked} t={t} />
          </nav>

          <div className="flex items-center gap-4">
            {/* The language switch lives on the home page. */}
            {isHome ? <LanguageToggle variant="light" /> : null}
            <ProfileChip variant={isHome ? "light" : "default"} />
          </div>
        </div>

        <nav
          aria-label={t.nav.primary}
          className={`-mx-1 mt-3 flex items-center gap-4 overflow-x-auto px-1 pb-1 pt-3 md:hidden ${
            isHome ? "border-t border-surface-strong/10" : "border-t border-ink/10"
          }`}
        >
          <NavLinks pathname={pathname} isHome={isHome} isUnlocked={isUnlocked} t={t} />
        </nav>
      </div>
    </header>
  );
}

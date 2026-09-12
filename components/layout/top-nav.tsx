"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Lock } from "lucide-react";
import { useRunStatus } from "@/lib/run-state";
import { ResetProgressButton } from "@/components/ui/reset-progress-button";
import { ProfileChip } from "@/components/layout/profile-chip";

// Weights always exist (they default), so finishing the questionnaire is the
// only real gate. The "Set your weights first" lock could never engage.
const navItems = [
  { href: "/", label: "Home", requirement: "none" },
  { href: "/questionnaire", label: "Questionnaire", requirement: "none" },
  { href: "/weights", label: "Weights", requirement: "answers" },
  { href: "/results", label: "Results", requirement: "answers" },
  { href: "/report", label: "Memo", requirement: "answers" }
] as const;

type NavLinksProps = {
  pathname: string;
  isHome: boolean;
  isUnlocked: boolean;
};

const LOCKED_REASON = "Complete the questionnaire first.";

function NavLinks({ pathname, isHome, isUnlocked: hasCompletedQuestionnaire }: NavLinksProps) {
  return navItems.map((item) => {
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
          {item.label}
        </Link>
      );
    }

    return (
      <span
        key={item.href}
        role="link"
        aria-disabled="true"
        aria-current={isActive ? "page" : undefined}
        aria-label={`${item.label}. ${LOCKED_REASON}`}
        title={LOCKED_REASON}
        className={`${baseClassName} cursor-not-allowed select-none ${
          isHome ? "text-surface-strong/35" : "text-ink/35"
        }`}
      >
        {statusIcon}
        {item.label}
      </span>
    );
  });
}

export function TopNav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const status = useRunStatus();
  const isUnlocked = status?.isComplete ?? false;

  return (
    <header
      className={
        isHome
          ? "absolute left-0 top-0 z-30 w-full border-b border-surface-strong/10 bg-transparent"
          : "border-b border-surface-strong/60 bg-surface-strong/85 backdrop-blur"
      }
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className={`interaction-quiet rounded-control text-lg font-semibold ${
              isHome ? "text-surface-strong" : "text-ink"
            }`}
          >
            Stay or Return
          </Link>

          <nav aria-label="Primary navigation" className="hidden items-center gap-5 md:flex">
            <NavLinks pathname={pathname} isHome={isHome} isUnlocked={isUnlocked} />
          </nav>

          <div className="flex items-center gap-3">
            <ResetProgressButton variant={isHome ? "light" : "default"} />
            <ProfileChip variant={isHome ? "light" : "default"} />
          </div>
        </div>

        <nav
          aria-label="Primary navigation"
          className={`-mx-1 mt-3 flex items-center gap-4 overflow-x-auto px-1 pb-1 pt-3 md:hidden ${
            isHome ? "border-t border-surface-strong/10" : "border-t border-ink/10"
          }`}
        >
          <NavLinks pathname={pathname} isHome={isHome} isUnlocked={isUnlocked} />
        </nav>
      </div>
    </header>
  );
}

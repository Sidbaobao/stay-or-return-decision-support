import Link from "next/link";
import { ComponentPropsWithRef, ReactNode } from "react";

// Text-only actions: View, Restore, Delete, Keep, Not now. One recipe with a
// tone and a size, instead of the per-site class strings that drifted in
// weight, hover colour and touch size.

export type QuietTone = "neutral" | "caution" | "primary" | "danger" | "inherit";
export type QuietSize = "sm" | "xs";

const toneClassName: Record<QuietTone, string> = {
  neutral: "text-ink/65 hover:text-ink",
  // Reads as neutral until touched: a destructive trigger that should not
  // shout before anyone reaches for it.
  caution: "text-ink/65 hover:text-path-return",
  primary: "text-action-primary hover:text-action-primary-hover",
  danger: "text-path-return",
  // Takes the surrounding colour: the dark home hero.
  inherit: "text-current opacity-65 hover:opacity-100"
};

const sizeClassName: Record<QuietSize, string> = {
  sm: "min-h-9 px-2 py-1 text-sm",
  xs: "min-h-6 px-1 py-0.5 text-xs leading-5"
};

export function quietButtonClassName(
  tone: QuietTone = "neutral",
  size: QuietSize = "sm",
  className = ""
) {
  return `interaction-quiet inline-flex items-center rounded-control font-medium ${sizeClassName[size]} ${toneClassName[tone]} ${className}`.trim();
}

type QuietButtonProps = ComponentPropsWithRef<"button"> & {
  children: ReactNode;
  tone?: QuietTone;
  size?: QuietSize;
};

export function QuietButton({
  children,
  className = "",
  tone,
  size,
  type = "button",
  ...props
}: QuietButtonProps) {
  return (
    <button type={type} {...props} className={quietButtonClassName(tone, size, className)}>
      {children}
    </button>
  );
}

type QuietLinkProps = {
  href: string;
  children: ReactNode;
  tone?: QuietTone;
  size?: QuietSize;
  className?: string;
};

export function QuietLink({ href, children, tone, size, className }: QuietLinkProps) {
  return (
    <Link href={href} className={quietButtonClassName(tone, size, className)}>
      {children}
    </Link>
  );
}

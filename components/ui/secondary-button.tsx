import Link from "next/link";
import { ButtonHTMLAttributes, ReactNode } from "react";

// The one secondary button: control radius, hairline border, 44px touch
// target. Sites used to copy the class string with small drifts (pill vs
// control radius, missing min-height, different ink opacities).

type SecondaryVariant = "default" | "light";

const sharedClassName =
  "inline-flex min-h-11 items-center justify-center rounded-control border px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-60";

const variantClassName: Record<SecondaryVariant, string> = {
  default: "interaction-secondary border-ink/15 text-ink/75",
  light: "interaction-secondary interaction-secondary-dark border-surface-strong/25 text-surface-strong/75"
};

export function secondaryButtonClassName(variant: SecondaryVariant = "default", className = "") {
  return `${sharedClassName} ${variantClassName[variant]} ${className}`.trim();
}

type SecondaryButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: SecondaryVariant;
  className?: string;
};

export function SecondaryButtonLink({ href, children, variant, className }: SecondaryButtonLinkProps) {
  return (
    <Link href={href} className={secondaryButtonClassName(variant, className)}>
      {children}
    </Link>
  );
}

type SecondaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: SecondaryVariant;
};

export function SecondaryButton({
  children,
  className = "",
  variant,
  type = "button",
  ...props
}: SecondaryButtonProps) {
  return (
    <button type={type} {...props} className={secondaryButtonClassName(variant, className)}>
      {children}
    </button>
  );
}

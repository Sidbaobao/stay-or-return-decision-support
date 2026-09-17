import { ComponentPropsWithoutRef, ElementType, forwardRef, ReactNode } from "react";

// The page is a stack of bands. A band runs edge to edge in one of three
// tones and holds its content in the site's column; two bands of different
// tones meet with no line between them, two of the same tone read as one.
// Inside a band, blocks are separated by space alone.

type BandTone = "canvas" | "white" | "warm";
type BandPadding = "default" | "tight" | "header" | "none";

const toneClassName: Record<BandTone, string> = {
  canvas: "",
  white: "bg-surface-strong",
  warm: "bg-surface-warm"
};

const paddingClassName: Record<BandPadding, string> = {
  default: "py-band",
  tight: "py-6",
  // A page header: room above, little below, so the next band sits close.
  header: "pt-band pb-4",
  none: ""
};

type BandProps = {
  tone?: BandTone;
  padding?: BandPadding;
  as?: "section" | "div" | "footer" | "aside";
  className?: string;
  innerClassName?: string;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<"section">, "className" | "children">;

export const Band = forwardRef<HTMLElement, BandProps>(function Band(
  { tone = "canvas", padding = "default", as = "section", className = "", innerClassName = "", children, ...rest },
  ref
) {
  const Tag = as as ElementType;

  return (
    <Tag
      ref={ref}
      className={`w-full ${toneClassName[tone]} ${paddingClassName[padding]} ${className}`.replace(/\s+/g, " ").trim()}
      {...rest}
    >
      <div className={`mx-auto w-full max-w-6xl px-page-gutter ${innerClassName}`.trim()}>{children}</div>
    </Tag>
  );
});

// A heading column beside a content column on wide screens, stacked on
// narrow ones. The offset itself separates the block from its neighbours.
export function OffsetGrid({ aside, children, className = "" }: { aside: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={`offset-grid ${className}`.trim()}>
      <div className="min-w-0">{aside}</div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

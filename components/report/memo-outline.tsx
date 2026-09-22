"use client";

import { useEffect, useRef, useState } from "react";
import { padIndex } from "@/components/questionnaire/question-card";

export type OutlineItem = {
  id: string;
  label: string;
};

type MemoOutlineProps = {
  items: OutlineItem[];
  orientation: "vertical" | "horizontal";
  ariaLabel: string;
};

// Where the reading line sits: the section that has passed this point
// (35% down the viewport) is the one the reader is in.
const READING_LINE = 0.35;
// A click keeps its section current until the reader scrolls this far
// away from where the click landed.
const PIN_TOLERANCE_PX = 40;

type Pin = {
  id: string;
  y: number | null;
};

function isAtBottom() {
  return window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
}

// The memo's four sections as a list: a column beside the sheet on a wide
// screen, a strip of tabs above it on a phone. Clicking scrolls to the
// section; scrolling keeps the current one marked. At the foot of the page,
// where the last sections cannot reach the reading line, the last one in
// view counts; a click keeps its section marked until the reader moves on.
export function MemoOutline({ items, orientation, ariaLabel }: MemoOutlineProps) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");
  const pinRef = useRef<Pin | null>(null);

  useEffect(() => {
    let frameId = 0;

    const update = () => {
      frameId = 0;
      const pin = pinRef.current;

      if (pin) {
        if (pin.y === null || Math.abs(window.scrollY - pin.y) < PIN_TOLERANCE_PX) {
          setActiveId(pin.id);
          return;
        }

        pinRef.current = null;
      }

      const line = window.innerHeight * READING_LINE;
      let current = items[0]?.id ?? "";

      for (const item of items) {
        const element = document.getElementById(item.id);

        if (!element) {
          continue;
        }

        const top = element.getBoundingClientRect().top;

        if (top <= line || (isAtBottom() && top < window.innerHeight)) {
          current = item.id;
        }
      }

      setActiveId(current);
    };

    const schedule = () => {
      if (frameId === 0) {
        frameId = window.requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);

      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [items]);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);

    if (!element) {
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    pinRef.current = { id, y: null };
    setActiveId(id);
    element.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
    // Where the scroll lands is known once it has settled.
    window.setTimeout(() => {
      if (pinRef.current?.id === id) {
        pinRef.current = { id, y: window.scrollY };
      }
    }, prefersReducedMotion ? 0 : 700);
  };

  const isVertical = orientation === "vertical";

  return (
    <nav aria-label={ariaLabel}>
      <ol className={isVertical ? "space-y-0.5" : "-mx-1 flex gap-1 overflow-x-auto px-1"}>
        {items.map((item, index) => {
          const isActive = item.id === activeId;

          return (
            <li key={item.id} className={isVertical ? "" : "shrink-0"}>
              <button
                type="button"
                onClick={() => scrollTo(item.id)}
                aria-current={isActive ? "location" : undefined}
                className={`interaction-step relative flex min-h-11 items-center gap-3 rounded-control px-2.5 text-left text-body-sm transition-colors duration-motion-standard ease-interaction motion-reduce:transition-none ${
                  isActive ? "text-ink" : "text-ink/50 hover:text-ink"
                }`}
              >
                {isVertical ? (
                  <span
                    aria-hidden="true"
                    className={`absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-pill bg-action-primary transition-opacity duration-motion-standard motion-reduce:transition-none ${
                      isActive ? "opacity-100" : "opacity-0"
                    }`}
                  />
                ) : null}
                <span className="num text-[0.6875rem] text-ink/40">{padIndex(index + 1)}</span>
                <span className="whitespace-nowrap">{item.label}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

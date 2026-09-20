"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { QuestionOption } from "@/types";

type SegmentedOptionsProps = {
  name: string;
  options: QuestionOption[];
  value?: string;
  labelledBy: string;
  onChange: (optionId: string) => void;
};

type ThumbState = {
  x: number;
  y: number;
  width: number;
  height: number;
  visible: boolean;
  instant: boolean;
};

const hiddenThumb: ThumbState = { x: 0, y: 0, width: 0, height: 0, visible: false, instant: true };

// Three answers in one track. One highlight slides to the chosen answer,
// measured from the answer's own box so it fits a long English label and a
// short Chinese one alike, in a row on wide screens and a column on a
// phone. The radios underneath keep the keyboard and screen reader
// semantics: arrows move between answers, space picks one.
export function SegmentedOptions({ name, options, value, labelledBy, onChange }: SegmentedOptionsProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const hasShownRef = useRef(false);
  const [thumb, setThumb] = useState<ThumbState>(hiddenThumb);

  const measure = useCallback(() => {
    const track = trackRef.current;
    const selected = value ? track?.querySelector<HTMLElement>(`[data-option-id="${value}"]`) : null;

    if (!track || !selected) {
      hasShownRef.current = false;
      setThumb(hiddenThumb);
      return;
    }

    // The first time the highlight appears it lands in place; after that it
    // slides from where it was.
    const instant = !hasShownRef.current;
    hasShownRef.current = true;
    setThumb({
      x: selected.offsetLeft,
      y: selected.offsetTop,
      width: selected.offsetWidth,
      height: selected.offsetHeight,
      visible: true,
      instant
    });
  }, [value]);

  useLayoutEffect(() => {
    measure();
    const track = trackRef.current;

    if (!track || typeof ResizeObserver === "undefined") {
      return;
    }

    const observer = new ResizeObserver(() => measure());
    observer.observe(track);

    return () => observer.disconnect();
  }, [measure]);

  return (
    <div ref={trackRef} role="radiogroup" aria-labelledby={labelledBy} className="seg mt-5 grid-cols-1 sm:grid-cols-3">
      <span
        aria-hidden="true"
        className="seg-thumb"
        data-visible={thumb.visible ? "true" : "false"}
        style={{
          transform: `translate(${thumb.x}px, ${thumb.y}px)`,
          width: `${thumb.width}px`,
          height: `${thumb.height}px`,
          transitionDuration: thumb.instant ? "0ms" : undefined
        }}
      />

      {options.map((option, index) => {
        const isSelected = value === option.id;

        return (
          <label
            key={option.id}
            data-option-id={option.id}
            className={`seg-option flex min-h-12 cursor-pointer items-center justify-center gap-2 px-4 py-2.5 text-center text-body-sm font-medium focus-within:ring-2 focus-within:ring-surface-strong/80 ${
              isSelected ? "text-ink" : "text-ink/60 hover:bg-surface-strong/[0.04] hover:text-ink"
            }`}
          >
            <input
              type="radio"
              name={name}
              value={option.id}
              checked={isSelected}
              onChange={() => onChange(option.id)}
              className="sr-only"
            />
            <span className="min-w-0">{option.label}</span>
            <span aria-hidden="true" className="num hidden text-[0.6875rem] text-ink/30 lg:inline">
              {index + 1}
            </span>
          </label>
        );
      })}
    </div>
  );
}

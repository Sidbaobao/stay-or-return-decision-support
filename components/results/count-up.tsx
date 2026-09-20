"use client";

import { useEffect, useState } from "react";

type CountUpProps = {
  value: number;
  decimals?: number;
  duration?: number;
  delay?: number;
  // Shown before a positive value: "+11".
  signed?: boolean;
};

// A number that counts up to its value when it appears, easing out hard so
// the last few digits settle slowly. Under reduced motion it is simply the
// value.
export function CountUp({ value, decimals = 0, duration = 1200, delay = 150, signed = false }: CountUpProps) {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(value);
      return;
    }

    let frameId = 0;
    const startTime = window.performance.now() + delay;

    const tick = (now: number) => {
      if (now < startTime) {
        frameId = window.requestAnimationFrame(tick);
        return;
      }

      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setShown(value * eased);

      if (progress < 1) {
        frameId = window.requestAnimationFrame(tick);
      } else {
        setShown(value);
      }
    };

    frameId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frameId);
  }, [value, duration, delay]);

  const prefix = signed && value > 0 ? "+" : "";

  return (
    <>
      {prefix}
      {shown.toFixed(decimals)}
    </>
  );
}

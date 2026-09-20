"use client";

import { CountUp } from "@/components/results/count-up";
import { useLocale } from "@/lib/i18n/provider";

type SplitBarProps = {
  stay: number;
  goBack: number;
  isRevealed: boolean;
};

// The two sides as shares of one bar: staying on the left, going back on
// the right, each side's share as a large number at its end. The bar
// starts even and slides to the split when the page reveals.
export function SplitBar({ stay, goBack, isRevealed }: SplitBarProps) {
  const { t } = useLocale();
  const total = stay + goBack;
  const stayShare = total > 0 ? Math.round((stay / total) * 100) : 50;
  const goBackShare = 100 - stayShare;
  const isStayAhead = stayShare > goBackShare;
  const isGoBackAhead = goBackShare > stayShare;

  return (
    <div role="img" aria-label={`${t.balance.stay} ${stayShare}%, ${t.balance.return} ${goBackShare}%`}>
      <div className="flex items-end justify-between gap-6">
        <div>
          <p
            className={`num text-[3rem] leading-none tracking-tight sm:text-[4rem] ${
              isStayAhead ? "text-path-stay" : "text-ink/40"
            }`}
            style={isStayAhead ? { filter: "drop-shadow(0 0 20px rgb(var(--color-path-stay) / 0.4))" } : undefined}
          >
            <CountUp value={stayShare} />
            <span className="text-[0.5em] text-ink/40">%</span>
          </p>
          <p className="mt-2 text-body-sm font-medium text-path-stay">{t.balance.stay}</p>
        </div>
        <div className="text-right">
          <p
            className={`num text-[3rem] leading-none tracking-tight sm:text-[4rem] ${
              isGoBackAhead ? "text-path-return" : "text-ink/40"
            }`}
            style={isGoBackAhead ? { filter: "drop-shadow(0 0 20px rgb(var(--color-path-return) / 0.4))" } : undefined}
          >
            <CountUp value={goBackShare} />
            <span className="text-[0.5em] text-ink/40">%</span>
          </p>
          <p className="mt-2 text-body-sm font-medium text-path-return">{t.balance.return}</p>
        </div>
      </div>

      <div className="mt-5 flex h-3 gap-0.5 overflow-hidden rounded-pill bg-result-driver-track">
        <div
          className="h-full rounded-l-pill bg-path-stay transition-[width] duration-motion-reveal-long ease-slide motion-reduce:transition-none"
          style={{
            width: isRevealed ? `${stayShare}%` : "50%",
            boxShadow: "0 0 16px rgb(var(--color-path-stay) / 0.55)"
          }}
        />
        <div
          className="h-full flex-1 rounded-r-pill bg-path-return"
          style={{ boxShadow: "0 0 16px rgb(var(--color-path-return) / 0.55)" }}
        />
      </div>
    </div>
  );
}

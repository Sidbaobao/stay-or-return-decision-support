"use client";

import { useEffect, useRef, useState } from "react";
import { buildShareUrl } from "@/lib/share";
import { useLocale } from "@/lib/i18n/provider";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { Answers, Weights } from "@/types";

type ShareResultButtonProps = {
  answers: Answers;
  weights: Weights;
};

type CopyState = "idle" | "copied" | "manual";

export function ShareResultButton({ answers, weights }: ShareResultButtonProps) {
  const { t } = useLocale();
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const manualInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (copyState !== "copied") {
      return;
    }

    const timeoutId = window.setTimeout(() => setCopyState("idle"), 2600);
    return () => window.clearTimeout(timeoutId);
  }, [copyState]);

  useEffect(() => {
    if (copyState === "manual") {
      manualInputRef.current?.select();
    }
  }, [copyState]);

  const handleShare = async () => {
    const url = buildShareUrl(answers, weights);

    if (!url) {
      return;
    }

    setShareUrl(url);

    try {
      await navigator.clipboard.writeText(url);
      setCopyState("copied");
    } catch {
      // Clipboard can be unavailable (permissions, older browsers) — fall
      // back to a visible, preselected field.
      setCopyState("manual");
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <SecondaryButton onClick={handleShare}>{t.share.copy}</SecondaryButton>
        <span aria-live="polite" className="text-sm font-medium text-ink/70">
          {copyState === "copied" ? t.share.copied : ""}
        </span>
      </div>

      {copyState === "manual" && shareUrl ? (
        <div className="mt-3">
          <label htmlFor="share-url-fallback" className="text-label text-ink/65">
            {t.share.manual}
          </label>
          <input
            id="share-url-fallback"
            ref={manualInputRef}
            type="text"
            readOnly
            value={shareUrl}
            onFocus={(event) => event.target.select()}
            className="interaction-field mt-1.5 w-full rounded-control border border-border bg-surface-raised px-3 py-2 text-body-sm text-ink/80"
          />
        </div>
      ) : null}
    </div>
  );
}

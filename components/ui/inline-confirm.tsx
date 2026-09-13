"use client";

import { KeyboardEvent, useEffect, useRef } from "react";
import { QuietButton, QuietSize, QuietTone } from "@/components/ui/quiet-button";
import { useLocale } from "@/lib/i18n/provider";

// A destructive or replacing action asks in place: no modal, no library.
// The question replaces the trigger, keyboard focus lands on the SAFE choice
// (a second Enter can never delete), Escape cancels, and useConfirmFocus
// hands focus back to the trigger afterwards. The prompt is the group's
// accessible name, so focus arriving in the group is what announces it.

type InlineConfirmProps = {
  prompt: string;
  confirmLabel: string;
  cancelLabel?: string;
  tone?: Exclude<QuietTone, "neutral" | "caution">;
  size?: QuietSize;
  onConfirm: () => void;
  onCancel: () => void;
};

export function InlineConfirm({
  prompt,
  confirmLabel,
  cancelLabel,
  tone = "danger",
  size = "sm",
  onConfirm,
  onCancel
}: InlineConfirmProps) {
  const { t } = useLocale();
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    cancelRef.current?.focus();
  }, []);

  const handleKeyDown = (event: KeyboardEvent<HTMLSpanElement>) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      onCancel();
    }
  };

  const isInherited = tone === "inherit";

  return (
    <span
      role="group"
      aria-label={prompt}
      onKeyDown={handleKeyDown}
      className="inline-confirm inline-flex flex-wrap items-center gap-x-1 gap-y-1"
    >
      <span
        className={`mr-1 ${size === "xs" ? "text-xs leading-5" : "text-sm"} ${
          isInherited ? "text-current opacity-65" : "text-ink/70"
        }`}
      >
        {prompt}
      </span>
      <QuietButton tone={tone} size={size} onClick={onConfirm} className="font-semibold">
        {confirmLabel}
      </QuietButton>
      <QuietButton
        ref={cancelRef}
        tone={isInherited ? "inherit" : "neutral"}
        size={size}
        onClick={onCancel}
      >
        {cancelLabel ?? t.confirm.keep}
      </QuietButton>
    </span>
  );
}

// Returns a ref for the trigger button. When the confirm closes without
// confirming, focus returns to that button instead of vanishing. Callers
// whose trigger unmounts on confirm park focus somewhere sensible themselves.
export function useConfirmFocus(isConfirming: boolean) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const wasConfirmingRef = useRef(false);

  useEffect(() => {
    if (wasConfirmingRef.current && !isConfirming) {
      triggerRef.current?.focus();
    }

    wasConfirmingRef.current = isConfirming;
  }, [isConfirming]);

  return triggerRef;
}

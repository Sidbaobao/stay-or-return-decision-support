"use client";

import { useRouter } from "next/navigation";
import { resetAppState } from "@/lib/storage";

type ResetProgressButtonProps = {
  variant?: "light" | "default";
};

export function ResetProgressButton({ variant = "default" }: ResetProgressButtonProps) {
  const router = useRouter();
  const className =
    variant === "light"
      ? "interaction-secondary interaction-secondary-dark rounded-control border border-surface-strong/25 px-4 py-2 text-sm font-medium text-surface-strong/75"
      : "interaction-secondary rounded-pill border border-ink/15 px-4 py-2 text-sm font-medium text-ink/75";

  const handleReset = () => {
    resetAppState();
    router.push("/questionnaire");
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleReset}
      className={className}
    >
      Reset current run
    </button>
  );
}

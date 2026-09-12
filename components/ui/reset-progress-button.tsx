"use client";

import { useRouter } from "next/navigation";
import { resetAppState } from "@/lib/storage";
import { SecondaryButton } from "@/components/ui/secondary-button";

type ResetProgressButtonProps = {
  variant?: "light" | "default";
};

export function ResetProgressButton({ variant = "default" }: ResetProgressButtonProps) {
  const router = useRouter();

  const handleReset = () => {
    resetAppState();
    router.push("/questionnaire");
    router.refresh();
  };

  return (
    <SecondaryButton variant={variant} onClick={handleReset}>
      Reset current run
    </SecondaryButton>
  );
}

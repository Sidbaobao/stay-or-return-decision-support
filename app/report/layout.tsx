import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Memo",
  description: "A personal decision memo with the recommendation, tradeoffs, and next steps."
};

export default function ReportLayout({ children }: { children: ReactNode }) {
  return children;
}

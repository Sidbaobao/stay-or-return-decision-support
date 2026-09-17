import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Memo",
  description: "Your decision, written down: where you land, why, and what to check before you decide."
};

export default function ReportLayout({ children }: { children: ReactNode }) {
  return children;
}

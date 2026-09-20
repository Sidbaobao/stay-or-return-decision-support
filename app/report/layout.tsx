import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Memo",
  description: "A short memo with your result, the main reasons, and what to check before you decide."
};

export default function ReportLayout({ children }: { children: ReactNode }) {
  return children;
}

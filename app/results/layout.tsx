import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Result",
  description: "See which way you lean, what the main reasons are, and what would change the answer."
};

export default function ResultsLayout({ children }: { children: ReactNode }) {
  return children;
}

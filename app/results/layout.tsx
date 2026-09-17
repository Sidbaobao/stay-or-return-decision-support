import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Result",
  description: "Which way you lean, what is behind it, and what would change it."
};

export default function ResultsLayout({ children }: { children: ReactNode }) {
  return children;
}

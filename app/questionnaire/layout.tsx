import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Questions",
  description: "Twenty-four plain questions about work, money, the visa, family, daily life and the next ten years."
};

export default function QuestionnaireLayout({ children }: { children: ReactNode }) {
  return children;
}

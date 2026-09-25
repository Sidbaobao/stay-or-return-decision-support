import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Questions",
  description: "Thirty-six questions about work, money, your visa, your family, daily life and the long term"
};

export default function QuestionnaireLayout({ children }: { children: ReactNode }) {
  return children;
}

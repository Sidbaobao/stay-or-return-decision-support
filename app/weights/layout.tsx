import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Priorities",
  description: "Say which parts of your life count for more, and watch the result follow."
};

export default function WeightsLayout({ children }: { children: ReactNode }) {
  return children;
}

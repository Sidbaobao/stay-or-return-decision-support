import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Priorities",
  description: "Say which parts of your life should count for more"
};

export default function WeightsLayout({ children }: { children: ReactNode }) {
  return children;
}

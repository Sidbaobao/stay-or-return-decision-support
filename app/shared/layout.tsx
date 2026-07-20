import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Shared result",
  description:
    "A read-only Stay or Return result that someone chose to share. Nothing about it is stored on our side.",
  robots: {
    index: false,
    follow: false
  }
};

export default function SharedLayout({ children }: { children: ReactNode }) {
  return children;
}

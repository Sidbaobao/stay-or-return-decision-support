import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Shared result",
  description: "A result someone shared with you, kept in the link itself and stored nowhere",
  robots: {
    index: false,
    follow: false
  }
};

export default function SharedLayout({ children }: { children: ReactNode }) {
  return children;
}

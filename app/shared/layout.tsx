import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Shared result",
  description: "A result someone shared. It lives in the link itself and is stored nowhere.",
  robots: {
    index: false,
    follow: false
  }
};

export default function SharedLayout({ children }: { children: ReactNode }) {
  return children;
}

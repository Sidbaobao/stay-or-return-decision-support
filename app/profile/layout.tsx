import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Your profile",
  description: "Your name and your saved decisions, kept only on this device"
};

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return children;
}

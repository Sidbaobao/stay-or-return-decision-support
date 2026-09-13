import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "My profile",
  description:
    "Your local profile and decision history, saved only on this device and never sent anywhere."
};

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return children;
}

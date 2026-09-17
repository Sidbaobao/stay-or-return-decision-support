"use client";

import { ReactNode } from "react";
import { TopNav } from "@/components/layout/top-nav";

type AppShellProps = {
  children: ReactNode;
};

// The header stays put across navigations; the page below it is a stack of
// full-width bands (see components/ui/band.tsx) that each carry their own
// column. New bands rise into place (app-main in globals.css), so moving
// between pages reads as the content changing under a fixed frame.
export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen">
      <TopNav />
      <main className="app-main flex min-h-screen w-full flex-col">{children}</main>
    </div>
  );
}

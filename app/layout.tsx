import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Fraunces, Inter, Noto_Sans_SC, Noto_Serif_SC } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/app-shell";
import { CHINESE_LANGUAGE_PATTERN } from "@/lib/i18n";
import { LocaleProvider } from "@/lib/i18n/provider";
import { STORAGE_KEYS } from "@/lib/storage/local-store";

// Chinese faces, self-hosted like Inter and Fraunces so no reader ever
// contacts a font CDN. Google serves them sliced by unicode range and
// next/font keeps the slices, so a page only fetches the ranges it shows;
// nothing is preloaded, and the English stacks never reference them.
const notoSans = Noto_Sans_SC({
  weight: ["400", "500", "600"],
  variable: "--font-noto-sans",
  display: "swap",
  preload: false
});

const notoSerif = Noto_Serif_SC({
  weight: ["600", "700"],
  variable: "--font-noto-serif",
  display: "swap",
  preload: false
});

// Inlined in <head>, so it runs before first paint. A reader who chose
// Chinese (or whose browser is Chinese, on a first visit) gets the document
// marked so the English HTML stays hidden until the client has rendered in
// their language; see the locale rules in globals.css. The key and the
// language test are the ones the app itself uses.
const localeBootScript = `(function(){try{var s=localStorage.getItem(${JSON.stringify(
  STORAGE_KEYS.locale
)});var zh=s?JSON.parse(s)==="zh":new RegExp(${JSON.stringify(
  CHINESE_LANGUAGE_PATTERN.source
)},"i").test(navigator.language||"");if(zh){var r=document.documentElement;r.setAttribute("data-locale","zh");r.lang="zh-CN";}}catch(e){}})();`;

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-fraunces",
  display: "swap"
});

const siteDescription =
  "A decision-support tool that helps Chinese international students think through whether to stay in the US or return to China.";

export const metadata: Metadata = {
  title: {
    default: "Stay or Return",
    template: "%s · Stay or Return"
  },
  description: siteDescription,
  openGraph: {
    title: "Stay or Return",
    description: siteDescription,
    type: "website",
    siteName: "Stay or Return"
  },
  twitter: {
    card: "summary",
    title: "Stay or Return",
    description: siteDescription
  }
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    // The boot script may already have switched lang/data-locale to Chinese
    // before React hydrates; that difference is intended, not a bug.
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${fraunces.variable} ${notoSans.variable} ${notoSerif.variable}`}
    >
      <head>
        <script id="locale-boot" dangerouslySetInnerHTML={{ __html: localeBootScript }} />
      </head>
      <body className="font-sans">
        <LocaleProvider>
          <AppShell>{children}</AppShell>
        </LocaleProvider>
      </body>
    </html>
  );
}

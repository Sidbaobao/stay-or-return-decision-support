import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Newsreader, Noto_Serif_SC, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/app-shell";
import { CHINESE_LANGUAGE_PATTERN } from "@/lib/i18n";
import { LocaleProvider } from "@/lib/i18n/provider";
import { STORAGE_KEYS } from "@/lib/storage/local-store";

// Chinese runs in the system faces (PingFang, Hiragino, YaHei), as every
// major Chinese site does. The one web face it loads is a serif for the
// memo's prose, self-hosted so no reader contacts a font CDN; Google
// serves it sliced by unicode range and next/font keeps the slices, so a
// page only fetches the ranges it shows. Nothing is preloaded, and the
// English stacks never reference it.
const notoSerif = Noto_Serif_SC({
  weight: ["500"],
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

// English: a text serif made for reading on screens for headings and the
// memo, a humanist sans for everything else. Both variable; the serif
// carries its optical-size axis so small and large sizes are cut
// differently.
const sans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap"
});

const serif = Newsreader({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-serif",
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
      className={`${sans.variable} ${serif.variable} ${notoSerif.variable}`}
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

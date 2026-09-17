"use client";

import "@/app/globals.css";

type GlobalErrorProps = {
  error: Error & { digest?: string };
};

// Replaces the root layout when even the layout fails, so it carries its
// own <html> and <body>, has no provider to read the language from, and
// says both. The stylesheet still applies; the web fonts do not.
export default function GlobalError({ error }: GlobalErrorProps) {
  return (
    <html lang="en">
      <body className="grid min-h-screen place-items-center bg-canvas px-page-gutter py-12 font-sans text-ink">
        <main className="text-center">
          <h1 className="font-serif text-page-title">Something went wrong.</h1>
          <p className="mt-1 font-serif text-section-title text-ink/80" lang="zh-CN">
            出了点问题。
          </p>
          <p className="mt-4 text-body text-ink/70">Reloading usually fixes it.</p>
          <p className="text-body text-ink/70" lang="zh-CN">
            刷新一般就能解决。
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="interaction-primary mt-8 inline-flex min-h-11 items-center justify-center rounded-control bg-action-primary px-5 py-3 text-sm font-semibold text-surface-strong"
          >
            Reload · 刷新
          </button>
          <pre className="mt-10 overflow-x-auto whitespace-pre-wrap break-words text-label text-ink/60">
            {error.name}: {error.message}
            {error.digest ? `\n${error.digest}` : ""}
          </pre>
        </main>
      </body>
    </html>
  );
}

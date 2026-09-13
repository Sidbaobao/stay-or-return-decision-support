"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Link2 } from "lucide-react";
import { scoreDecision } from "@/lib/scoring";
import { decodeSharePayload, DecodedShare } from "@/lib/share";
import { useRevealOnReady } from "@/lib/run-state";
import { DecisionBalance } from "@/components/results/decision-balance";
import { DimensionLeanRows } from "@/components/results/dimension-lean-rows";
import { getSharedHeadline } from "@/components/results/verdict-copy";
import { PrimaryButtonLink } from "@/components/ui/primary-button";

// Read-only view of a shared run. Everything on this page is decoded from the
// URL fragment (which browsers never send to any server) and recomputed
// locally. It reads and writes nothing about the visitor's own run.

function ErrorCard({ title, body }: { title: string; body: string }) {
  return (
    <section className="mx-auto max-w-measure py-16 text-center">
      <p className="font-serif text-card-title text-ink">{title}</p>
      <p className="mx-auto mt-2 max-w-measure text-body-sm text-ink/65">{body}</p>
      <div className="mt-6 flex justify-center">
        <PrimaryButtonLink href="/">Explore Stay or Return</PrimaryButtonLink>
      </div>
    </section>
  );
}

export default function SharedResultPage() {
  const [decoded, setDecoded] = useState<DecodedShare | null>(null);

  useEffect(() => {
    const readFragment = () => {
      const payload = window.location.hash.replace(/^#/, "");
      setDecoded(payload ? decodeSharePayload(payload) : { status: "invalid" });
    };

    readFragment();
    // Hash-only navigation (e.g. following a corrected link from an error
    // state) doesn't remount the page, so re-decode on hash changes too.
    window.addEventListener("hashchange", readFragment);

    return () => window.removeEventListener("hashchange", readFragment);
  }, []);

  const sharedResult = useMemo(() => {
    if (!decoded || decoded.status !== "ok") {
      return null;
    }

    return scoreDecision(decoded.answers, decoded.weights);
  }, [decoded]);

  const isRevealed = useRevealOnReady(Boolean(sharedResult));

  if (!decoded) {
    return null;
  }

  if (decoded.status === "version-mismatch") {
    return (
      <ErrorCard
        title="This link is from an earlier questionnaire."
        body="It was created with a previous version of Stay or Return, so it can't be displayed accurately anymore. Whoever sent it can re-share from a fresh run."
      />
    );
  }

  if (decoded.status === "invalid" || !sharedResult) {
    return (
      <ErrorCard
        title="This link doesn't work."
        body="It looks incomplete or damaged — shared links carry the whole result inside the link itself, so a truncated copy loses it. Ask for the link again, or try the questionnaire yourself."
      />
    );
  }

  const isStayLeading = sharedResult.recommendedScenario === "stay_us";
  const accentColor = isStayLeading ? "rgb(var(--color-path-stay))" : "rgb(var(--color-path-return))";

  return (
    <>
      <p className="flex max-w-measure items-start gap-2 text-body-sm text-ink/65">
        <Link2 aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.8} />
        A read-only result someone chose to share. It lives entirely in the link — nothing about it
        is stored on our side.
      </p>

      <section className="rounded-feature border border-border bg-surface p-6 shadow-soft sm:p-8">
        <p className="text-eyebrow text-ink-accent">Shared result</p>

        <h1 className="mt-4 max-w-3xl font-serif text-display" style={{ color: accentColor }}>
          {getSharedHeadline(
            sharedResult.recommendedScenario,
            sharedResult.confidence,
            sharedResult.weightedTotals.difference
          )}
        </h1>

        <div className="mt-8 max-w-xl">
          <DecisionBalance
            difference={sharedResult.weightedTotals.difference}
            recommendedScenario={sharedResult.recommendedScenario}
            isRevealed={isRevealed}
          />
        </div>
      </section>

      <section className="border-t border-hairline pt-6 sm:pt-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-eyebrow text-ink-accent">Key drivers</p>
            <h2 className="mt-2 font-serif text-section-title text-ink">Where each dimension pulls</h2>
          </div>
        </div>

        <div className="mt-6">
          <DimensionLeanRows
            contributions={sharedResult.contributions}
            uncertainDimensionIds={sharedResult.uncertainDimensions}
            footnote="Bars show how far this person's answers lean, on one shared scale. The number is each dimension's weighted pull on the result."
          />
        </div>
      </section>

      <footer className="flex flex-col gap-5 border-t border-hairline pt-6 sm:flex-row sm:items-center sm:justify-between sm:pt-8">
        <div>
          <h2 className="font-serif text-section-title text-ink">Facing the same decision?</h2>
          <p className="mt-2 max-w-measure text-body-sm text-ink/70">
            Stay or Return walks you through 24 questions and your own priorities — transparently,
            with nothing stored anywhere but your own browser.
          </p>
        </div>
        <div className="shrink-0">
          <PrimaryButtonLink href="/questionnaire">Try it yourself</PrimaryButtonLink>
        </div>
      </footer>
    </>
  );
}

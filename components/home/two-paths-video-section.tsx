"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type VideoPanelProps = {
  accentClassName: string;
  label: string;
  shouldPlayVideo: boolean;
  src: string;
};

function VideoPanel({ accentClassName, label, shouldPlayVideo, src }: VideoPanelProps) {
  const [hasVideoError, setHasVideoError] = useState(false);

  return (
    <div className="rounded-card border border-home-border/25 bg-home-surface/75 p-3 shadow-home-glow backdrop-blur-sm">
      <div className="relative min-h-[34rem] overflow-hidden rounded-tile bg-hero sm:min-h-[42rem] lg:min-h-[48rem]">
        {!hasVideoError ? (
          <video
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay={shouldPlayVideo}
            loop
            muted
            playsInline
            preload="metadata"
            src={src}
            tabIndex={-1}
            onError={() => setHasVideoError(true)}
          />
        ) : null}
      </div>

      <div className="px-2 pb-2 pt-5">
        <div className={`mb-4 h-1 w-16 rounded-pill ${accentClassName}`} />
        <h3 className="text-section-title text-surface-strong">{label}</h3>
      </div>
    </div>
  );
}

export function TwoPathsVideoSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [shouldPlayVideo, setShouldPlayVideo] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const syncVideoPlayback = () => {
      const canPlay = !motionQuery.matches;
      const videos = Array.from(sectionRef.current?.querySelectorAll("video") ?? []);

      setShouldPlayVideo(canPlay);

      videos.forEach((video) => {
        if (canPlay) {
          video.play().catch(() => {
            // Autoplay can still be blocked by some browser settings; the fallback panel remains readable.
          });
        } else {
          video.pause();
          video.currentTime = 0;
        }
      });
    };

    syncVideoPlayback();
    motionQuery.addEventListener("change", syncVideoPlayback);

    return () => {
      motionQuery.removeEventListener("change", syncVideoPlayback);
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-16 lg:py-24" aria-labelledby="two-paths-heading">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-eyebrow text-accent-warm">Two paths</p>
        <h2 id="two-paths-heading" className="mt-3 text-page-title text-surface-strong">
          See both paths clearly.
        </h2>
        <p className="mt-4 text-body text-surface-strong/70">
          Picture each future before you weigh the tradeoffs.
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <VideoPanel
          accentClassName="bg-path-stay"
          label="Stay in the US"
          shouldPlayVideo={shouldPlayVideo}
          src="/manhattan.mp4"
        />
        <VideoPanel
          accentClassName="bg-path-return"
          label="Return to China"
          shouldPlayVideo={shouldPlayVideo}
          src="/shanghai.mp4"
        />
      </div>

      <div className="mt-8 flex justify-center">
        <Link
          href="/questionnaire"
          className="interaction-primary inline-flex min-h-11 max-w-full items-center justify-center rounded-control bg-action-primary px-5 py-3 text-center text-sm font-semibold leading-5 text-surface-strong"
        >
          Start questionnaire
        </Link>
      </div>
    </section>
  );
}

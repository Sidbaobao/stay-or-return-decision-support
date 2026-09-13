"use client";

import { useEffect, useRef, useState } from "react";
import { PrimaryButtonLink } from "@/components/ui/primary-button";
import { useLocale } from "@/lib/i18n/provider";

type VideoPanelProps = {
  accentClassName: string;
  label: string;
  posterSrc: string;
  shouldLoadVideo: boolean;
  src: string;
};

function VideoPanel({ accentClassName, label, posterSrc, shouldLoadVideo, src }: VideoPanelProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [hasVideoError, setHasVideoError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const showVideo = shouldLoadVideo && !hasVideoError;

  useEffect(() => {
    if (!showVideo) {
      return;
    }

    videoRef.current?.play().catch(() => {
      // Autoplay can still be blocked by some browser settings; the poster stays visible.
    });
  }, [showVideo]);

  // The footage stands on its own: a figure with a caption, not a framed card.
  return (
    <figure>
      <div className="relative min-h-[34rem] overflow-hidden rounded-tile bg-hero sm:min-h-[42rem] lg:min-h-[48rem]">
        {/* The poster stays underneath until frames are actually showing,
            then leaves so the browser composites one layer, not two. */}
        <img
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
          hidden={showVideo && isPlaying}
          loading="lazy"
          src={posterSrc}
        />
        {showVideo ? (
          <video
            ref={videoRef}
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            poster={posterSrc}
            preload="metadata"
            src={src}
            tabIndex={-1}
            onPlaying={() => setIsPlaying(true)}
            onError={() => {
              setIsPlaying(false);
              setHasVideoError(true);
            }}
          />
        ) : null}
      </div>

      <figcaption className="pt-5">
        <div aria-hidden="true" className={`mb-4 h-1 w-16 rounded-pill ${accentClassName}`} />
        <h3 className="text-section-title text-surface-strong">{label}</h3>
      </figcaption>
    </figure>
  );
}

export function TwoPathsVideoSection() {
  const { t } = useLocale();
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isNearView, setIsNearView] = useState(false);
  const [allowsMotion, setAllowsMotion] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const syncMotionPreference = () => {
      setAllowsMotion(!motionQuery.matches);
    };

    syncMotionPreference();
    motionQuery.addEventListener("change", syncMotionPreference);

    return () => {
      motionQuery.removeEventListener("change", syncMotionPreference);
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      setIsNearView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsNearView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "600px 0px" }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, []);

  const shouldLoadVideo = isNearView && allowsMotion;

  return (
    <section ref={sectionRef} className="py-16 lg:py-24" aria-labelledby="two-paths-heading">
      <div className="mx-auto text-center">
        <p className="text-eyebrow text-accent-warm">{t.home.twoPaths}</p>
        <h2 id="two-paths-heading" className="mt-3 text-page-title text-surface-strong">
          {t.home.seeBoth}
        </h2>
        <p className="mt-4 text-body text-surface-strong/70">{t.home.picture}</p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <VideoPanel
          accentClassName="bg-path-stay"
          label={t.home.stay}
          posterSrc="/manhattan-poster.jpg"
          shouldLoadVideo={shouldLoadVideo}
          src="/manhattan.mp4"
        />
        <VideoPanel
          accentClassName="bg-path-return"
          label={t.home.return}
          posterSrc="/shanghai-poster.jpg"
          shouldLoadVideo={shouldLoadVideo}
          src="/shanghai.mp4"
        />
      </div>

      <div className="mt-8 flex justify-center">
        <PrimaryButtonLink href="/questionnaire">{t.cta.start}</PrimaryButtonLink>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./media-section.module.css";

const visibilityThreshold = 0.38;

export function LastPaymentBackground() {
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [canLoadVideo, setCanLoadVideo] = useState(false);
  const [isInViewport, setIsInViewport] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 769px)");
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    let idleCallback = 0;
    let fallbackTimer: ReturnType<typeof globalThis.setTimeout> | undefined;

    const cancelScheduledLoad = () => {
      if (idleCallback !== 0) {
        window.cancelIdleCallback(idleCallback);
        idleCallback = 0;
      }
      if (fallbackTimer !== undefined) {
        globalThis.clearTimeout(fallbackTimer);
        fallbackTimer = undefined;
      }
    };

    const updatePlaybackMode = () => {
      cancelScheduledLoad();

      if (!desktop.matches || reducedMotion.matches) {
        setCanLoadVideo(false);
        setIsVideoReady(false);
        setHasStarted(false);
        setHasEnded(false);
        return;
      }

      if ("requestIdleCallback" in window) {
        idleCallback = window.requestIdleCallback(
          () => setCanLoadVideo(true),
          { timeout: 2000 },
        );
      } else {
        fallbackTimer = globalThis.setTimeout(
          () => setCanLoadVideo(true),
          1200,
        );
      }
    };

    updatePlaybackMode();
    desktop.addEventListener("change", updatePlaybackMode);
    reducedMotion.addEventListener("change", updatePlaybackMode);

    return () => {
      cancelScheduledLoad();
      desktop.removeEventListener("change", updatePlaybackMode);
      reducedMotion.removeEventListener("change", updatePlaybackMode);
    };
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const nextIsVisible =
          entry.isIntersecting &&
          entry.intersectionRatio >= visibilityThreshold;
        setIsInViewport((current) =>
          current === nextIsVisible ? current : nextIsVisible,
        );
      },
      { threshold: [0, visibilityThreshold, 0.75] },
    );

    observer.observe(stage);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !canLoadVideo) {
      return;
    }

    const syncPlayback = () => {
      const shouldPlay =
        isInViewport &&
        isVideoReady &&
        !hasEnded &&
        document.visibilityState === "visible" &&
        !video.ended;

      if (shouldPlay) {
        void video.play().catch(() => {
          // Muted inline playback can still be rejected by browser policy.
        });
      } else {
        video.pause();
      }
    };

    const handleVisibilityChange = () => syncPlayback();

    syncPlayback();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange,
      );
      video.pause();
    };
  }, [canLoadVideo, hasEnded, isInViewport, isVideoReady]);

  return (
    <div
      aria-hidden="true"
      className={styles.videoStage}
      data-testid="last-payment-stage"
      ref={stageRef}
    >
      <picture className={styles.videoPoster}>
        <source
          media="(max-width: 768px)"
          srcSet="/media/last-payment-mobile-poster.webp"
        />
        <img
          alt=""
          decoding="async"
          fetchPriority="low"
          height="720"
          loading="lazy"
          src="/media/last-payment-poster.webp"
          width="1280"
        />
      </picture>

      {canLoadVideo ? (
        <video
          aria-hidden="true"
          autoPlay={isInViewport && !hasEnded}
          className={`${styles.backgroundVideo} ${
            hasStarted ? styles.backgroundVideoReady : ""
          }`}
          controls={false}
          data-testid="last-payment-video"
          disablePictureInPicture
          muted
          onCanPlay={() => setIsVideoReady(true)}
          onEnded={() => setHasEnded(true)}
          onLoadedData={() => setIsVideoReady(true)}
          onPlaying={() => setHasStarted(true)}
          playsInline
          poster="/media/last-payment-poster.webp"
          preload="metadata"
          ref={videoRef}
          tabIndex={-1}
        >
          <source src="/media/last-payment.webm" type="video/webm" />
          <source src="/media/last-payment.mp4" type="video/mp4" />
        </video>
      ) : null}
    </div>
  );
}

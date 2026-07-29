"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./media-section.module.css";

const visibilityThreshold = 0.38;

export function LastPaymentBackground() {
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isInViewportRef = useRef(false);
  const [canLoadVideo, setCanLoadVideo] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

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
    const video = videoRef.current;
    if (!stage || !video || !canLoadVideo) {
      return;
    }

    video.pause();

    const syncPlayback = () => {
      const shouldPlay =
        isInViewportRef.current &&
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

    const observer = new IntersectionObserver(
      ([entry]) => {
        isInViewportRef.current =
          entry.isIntersecting &&
          entry.intersectionRatio >= visibilityThreshold;
        syncPlayback();
      },
      { threshold: [0, visibilityThreshold, 0.75] },
    );

    const handleVisibilityChange = () => syncPlayback();

    observer.observe(stage);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      observer.disconnect();
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange,
      );
      video.pause();
      isInViewportRef.current = false;
    };
  }, [canLoadVideo]);

  return (
    <div
      aria-hidden="true"
      className={styles.videoStage}
      ref={stageRef}
    >
      <picture className={styles.videoPoster}>
        <img
          alt=""
          decoding="async"
          fetchPriority="low"
          height="941"
          loading="lazy"
          src="/media/media-studio.webp"
          width="1672"
        />
      </picture>

      {canLoadVideo ? (
        <video
          aria-hidden="true"
          autoPlay
          className={`${styles.backgroundVideo} ${
            hasStarted ? styles.backgroundVideoReady : ""
          }`}
          controls={false}
          disablePictureInPicture
          muted
          onPlaying={() => setHasStarted(true)}
          playsInline
          poster="/media/media-studio.webp"
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

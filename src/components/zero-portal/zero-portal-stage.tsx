"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import styles from "./zero-portal-stage.module.css";

const ZeroPortalScene = dynamic(
  () =>
    import("./zero-portal-scene").then((module) => module.ZeroPortalScene),
  {
    ssr: false,
  },
);

export function ZeroPortalStage() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [canRenderWebGl, setCanRenderWebGl] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = window.matchMedia("(min-width: 900px)");

    const updateCapability = () => {
      setCanRenderWebGl(desktop.matches && !reducedMotion.matches);
    };

    updateCapability();
    reducedMotion.addEventListener("change", updateCapability);
    desktop.addEventListener("change", updateCapability);

    return () => {
      reducedMotion.removeEventListener("change", updateCapability);
      desktop.removeEventListener("change", updateCapability);
    };
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin: "160px 0px", threshold: 0.01 },
    );
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  return (
    <div aria-hidden="true" className={styles.stage} ref={stageRef}>
      <div
        className={`${styles.fallback} ${
          isReady && canRenderWebGl ? styles.fallbackHidden : ""
        }`}
      />
      {canRenderWebGl ? (
        <div className={`${styles.canvas} ${isReady ? styles.canvasReady : ""}`}>
          <ZeroPortalScene
            active={isVisible}
            onReady={() => setIsReady(true)}
          />
        </div>
      ) : null}
      <div className={styles.edgeFade} />
    </div>
  );
}

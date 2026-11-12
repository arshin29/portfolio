"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  getSkySettingsForHour,
  subscribeSkyUpdate,
  SkySettings,
} from "@/lib/skyController";

export default function MeadowGarden() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const meadowRef = useRef<any>(null);
  const [hasFallback, setHasFallback] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Maintain active sky settings for real-time WebGL uniform updates
  const activeSettingsRef = useRef<SkySettings>(
    getSkySettingsForHour(new Date().getHours() + new Date().getMinutes() / 60)
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Subscribe to dynamic weather and time of day transitions
  useEffect(() => {
    const applyFooterStyles = (settings: SkySettings) => {
      const light = Number.isFinite(settings?.light) ? settings.light : 0.5;
      const cloud = Number.isFinite(settings?.cloud) ? settings.cloud : 0.2;
      const rain = Number.isFinite(settings?.rain) ? settings.rain : 0;
      const L = light * (1 - cloud * 0.1 - rain * 0.12);
      const R = Math.max(0, Math.min(1, (0.65 - light) / 0.5));
      const footer = containerRef.current?.closest("footer") as HTMLElement | null;
      if (footer) {
        footer.style.setProperty("--meadow-brightness", String(0.3 + L * 0.7));
        footer.style.setProperty("--meadow-saturation", String(0.58 + L * 0.42));
        footer.style.setProperty("--meadow-tint", settings.glow || "#fff");
        footer.style.setProperty("--meadow-haze", settings.bottom || "#24334a");
        footer.style.setProperty(
          "--meadow-tint-opacity",
          String(0.03 + (1 - L) * 0.2 + R * 0.12)
        );
        footer.style.setProperty("--paper-illumination", String(0.74 + L * 0.26));
        footer.style.setProperty("--paper-night-mix", `${R * 100}%`);
        footer.style.setProperty("--paper-night-tint", String(R * 0.12));
        footer.style.setProperty("--paper-highlight", String(0.18 + L * 0.82));
      }
    };

    // Apply initially
    applyFooterStyles(activeSettingsRef.current);

    const unsubscribe = subscribeSkyUpdate((newSettings) => {
      activeSettingsRef.current = newSettings;
      applyFooterStyles(newSettings);
      meadowRef.current?.update?.(newSettings);
    });

    return () => unsubscribe();
  }, []);

  // Initialize Three.js WebGL scene with authentic high-density instanced grass
  useEffect(() => {
    if (!canvasRef.current) return;
    let isDisposed = false;

    // Use footer element if available so hover interaction and lantern light follow across entire section
    const surfaceElement =
      (containerRef.current?.closest("footer") as HTMLElement) ||
      containerRef.current ||
      canvasRef.current;

    import("./meadow/meadowEngine")
      .then(({ initMeadow }) => {
        if (isDisposed || !canvasRef.current) return;
        meadowRef.current = initMeadow(canvasRef.current, {
          settings: activeSettingsRef.current,
          paused: false,
          reduced: prefersReducedMotion,
          surface: surfaceElement,
        });
      })
      .catch((err) => {
        console.warn("WebGL meadow unavailable, using photographic fallback:", err);
        setHasFallback(true);
      });

    return () => {
      isDisposed = true;
      try {
        meadowRef.current?.dispose?.();
        meadowRef.current = null;
      } catch {}
    };
  }, []);

  // Update reduced motion state reactively without rebuilding the 3D scene
  useEffect(() => {
    meadowRef.current?.pause?.(false, prefersReducedMotion);
  }, [prefersReducedMotion]);

  return (
    <div
      ref={containerRef}
      className="meadow-garden w-full relative z-10"
      data-fallback={hasFallback}
      aria-hidden="true"
    >
      {hasFallback ? (
        <img
          src="/sky/meadow-photographic-v2-optimized.webp"
          alt=""
          width="2172"
          height="724"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <canvas ref={canvasRef} className="w-full h-full block touch-pan-y" />
      )}
    </div>
  );
}

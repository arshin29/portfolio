"use client";

import React, { useEffect, useRef, useState } from "react";
import FireworksOverlay from "./FireworksOverlay";
import {
  getSkySettingsForHour,
  subscribeSkyUpdate,
  SkySettings,
} from "@/lib/skyController";

export default function LivingSky() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const skyInstanceRef = useRef<{
    update: (settings: any) => void;
    pause: (paused: boolean, reduced?: boolean) => void;
    dispose: () => void;
  } | null>(null);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [skyReady, setSkyReady] = useState(false);
  const [fireworksActive, setFireworksActive] = useState(false);
  const [soundActive, setSoundActive] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 1. Immediately apply current sky theme before asynchronous module fetching
    const now = new Date();
    const currentHour = now.getHours() + now.getMinutes() / 60;
    const initial = getSkySettingsForHour(currentHour);

    const applySkyTheme = (settings: SkySettings) => {
      const isNight = settings.light < 0.45;
      const root = document.documentElement;
      root.classList.toggle("dark", isNight);
      root.setAttribute("data-theme", isNight ? "night" : "day");
      root.style.setProperty("--daylight", isNight ? "0" : "1");
      root.style.setProperty("--theme-blend", isNight ? "0" : "1");
      root.style.setProperty("--sky-ink", isNight ? "#f6f8fd" : "#162332");
      root.style.setProperty("--sky-secondary", isNight ? "#cbd5e1" : "#344353");
      root.style.setProperty("--sky-top", settings.top);
      root.style.setProperty("--sky-mid", settings.bottom);
      root.style.setProperty("--sky-bottom", settings.bottom);
      root.style.setProperty("--sky-fallback-top", settings.top);
      root.style.setProperty("--sky-fallback-bottom", settings.bottom);
    };

    applySkyTheme(initial);

    // Check WebGL availability
    try {
      const gl =
        canvas.getContext("webgl2", { alpha: false, antialias: false }) ||
        canvas.getContext("webgl", { alpha: false, antialias: false });
      if (!gl) {
        setHasWebGL(false);
        return;
      }
    } catch {
      setHasWebGL(false);
      return;
    }

    let disposed = false;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Dynamically import skyScene to ensure SSR safety and bundle optimization
    import("@/components/meadow/skyScene")
      .then(({ createSky }) => {
        if (disposed || !canvasRef.current) return;

        const sky = createSky(
          canvasRef.current,
          {
            top: initial.top,
            bottom: initial.bottom,
            glow: initial.glow,
            light: initial.light,
            sun: initial.solarAltitude / 90,
            sunX: initial.sunX,
            cloud: initial.cloud,
            rain: initial.rain,
            wind: initial.wind,
            windGust: initial.windGust,
            windX: initial.windX,
            hour: currentHour,
          },
          false,
          prefersReducedMotion
        );

        skyInstanceRef.current = sky;

        // Smoothly fade in canvas only after WebGL renders its first frames
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (!disposed) {
              setSkyReady(true);
            }
          });
        });
      })
      .catch((err) => {
        console.warn(
          "LivingSky WebGL failed to load, falling back to CSS background:",
          err
        );
        setHasWebGL(false);
      });

    // Subscribe to skyController updates (from dial scrubber, city change, or presets)
    const unsubscribe = subscribeSkyUpdate((settings: SkySettings) => {
      applySkyTheme(settings);

      // Check if night fireworks should be active
      const isNight = settings.isNight ?? (settings.light < 0.45);
      const shouldShowFireworks = !!(isNight && settings.nightFireworks);
      setFireworksActive(shouldShowFireworks);
      setSoundActive(!!settings.ambientSound);

      if (skyInstanceRef.current) {
        skyInstanceRef.current.update({
          top: settings.top,
          bottom: settings.bottom,
          glow: settings.glow,
          light: settings.light,
          sun: settings.solarAltitude / 90,
          sunX: settings.sunX,
          cloud: settings.cloud,
          rain: settings.rain,
          wind: settings.wind,
          windGust: settings.windGust,
          windX: settings.windX,
          hour:
            typeof (settings as any).hour === "number"
              ? (settings as any).hour
              : undefined,
          previewHour:
            typeof (settings as any).previewHour === "number"
              ? (settings as any).previewHour
              : undefined,
        });
      }
    });

    return () => {
      disposed = true;
      unsubscribe();
      if (skyInstanceRef.current) {
        try {
          skyInstanceRef.current.dispose();
        } catch {
          // ignore
        }
        skyInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <>
      <div
        className="living-sky fixed inset-0 pointer-events-none z-[-2] overflow-hidden"
        aria-hidden="true"
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full block"
          style={{
            opacity: skyReady ? 1 : 0,
            transition: "opacity 0.7s ease-out",
          }}
        />
      </div>

      {/* Fireworks canvas layer rendered right above the sky canvas and behind content */}
      <FireworksOverlay active={fireworksActive} soundEnabled={soundActive} />
    </>
  );
}

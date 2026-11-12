"use client";

import React, { useEffect, useRef, useState } from "react";
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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

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

    const applySkyTheme = (settings: SkySettings) => {
      const isNight = settings.light < 0.45;
      const root = document.documentElement;
      root.classList.toggle("dark", isNight);
      root.style.setProperty("--daylight", isNight ? "0" : "1");
      root.style.setProperty("--theme-blend", isNight ? "0" : "1");
      root.style.setProperty("--sky-ink", isNight ? "#f6f8fd" : "#162332");
      root.style.setProperty("--sky-secondary", isNight ? "#cbd5e1" : "#344353");
      root.style.setProperty("--sky-top", settings.top);
      root.style.setProperty("--sky-bottom", settings.bottom);
    };

    // Dynamically import skyScene to ensure SSR safety and bundle optimization
    import("@/components/meadow/skyScene")
      .then(({ createSky }) => {
        if (disposed || !canvasRef.current) return;

        // Get initial settings based on current local time
        const now = new Date();
        const currentHour = now.getHours() + now.getMinutes() / 60;
        const initial = getSkySettingsForHour(currentHour);

        // Apply dark mode and theme variables matching sky brightness
        applySkyTheme(initial);

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
    <div
      className="living-sky fixed inset-0 pointer-events-none z-[-2] overflow-hidden"
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{
          opacity: hasWebGL ? 1 : 0,
          transition: "opacity 0.6s ease-out",
        }}
      />
    </div>
  );
}

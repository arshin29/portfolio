"use client";

import React, { useEffect, useRef, useState } from "react";
import { createSticker, StickerController } from "@/lib/sticker3d";

interface InteractiveStickerProps {
  src: string;
  label?: string;
  tilt?: number;
}

export default function InteractiveSticker({
  src,
  label = "",
  tilt = -5,
}: InteractiveStickerProps) {
  const [ready, setReady] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let disposed = false;
    let controller: StickerController | null = null;
    let isIntersecting = false;
    let initialized = false;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const updateVisibility = () => {
      controller?.setRunning(isIntersecting && !document.hidden);
    };

    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry.isIntersecting;
        if (!isIntersecting) {
          controller?.reset();
        }
        if (isIntersecting && !initialized) {
          initialized = true;
          createSticker(canvas, container, {
            src,
            label,
            tilt,
            reduced: prefersReducedMotion,
          })
            .then((instance) => {
              if (disposed) {
                instance.dispose();
                return;
              }
              controller = instance;
              setReady(true);
              updateVisibility();
            })
            .catch((err) => {
              console.warn("3D sticker fallback:", err);
            });
        }
        updateVisibility();
      },
      { rootMargin: "200px" }
    );

    observer.observe(container);
    document.addEventListener("visibilitychange", updateVisibility);

    return () => {
      disposed = true;
      observer.disconnect();
      document.removeEventListener("visibilitychange", updateVisibility);
      controller?.dispose();
    };
  }, [src, label, tilt]);

  return (
    <span
      className="pc-sticker"
      ref={containerRef}
      data-ready={ready || undefined}
      style={{ "--tilt": `${tilt}deg` } as React.CSSProperties}
    >
      <span className="pc-cut">
        <img
          src={src}
          width={288}
          height={288}
          alt=""
          draggable={false}
          onError={(e) => {
            e.currentTarget.style.visibility = "hidden";
          }}
        />
      </span>
      <canvas className="pc-sticker-canvas" ref={canvasRef} aria-hidden="true" />
    </span>
  );
}

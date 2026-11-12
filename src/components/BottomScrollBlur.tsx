"use client";

import React, { useEffect, useRef } from "react";

// Slices matching thoufik.space progressive blur architecture
const BLUR_STEPS = [0.5, 1, 2, 4, 7, 11, 16];
const curve = (e: number) => e ** 1.45;

function getMask(stepIndex: number, total: number, direction: "top" | "bottom") {
  const r = (e: number) => `${(curve(Math.min(e, total) / total) * 100).toFixed(2)}%`;
  return `linear-gradient(${direction === "top" ? "to top" : "to bottom"}, transparent ${r(stepIndex)}, black ${r(stepIndex + 1)}, black ${r(stepIndex + 2)}, transparent ${r(stepIndex + 3)})`;
}

interface BottomScrollBlurProps {
  position?: "bottom" | "top";
  height?: string;
  zIndex?: number;
  tint?: string;
}

export default function BottomScrollBlur({
  position = "bottom",
  height = "var(--sky-bottom-blur-height, 6.5rem)",
  zIndex = 18,
  tint,
}: BottomScrollBlurProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let ticking = false;
    let prevLevel = 1;
    const root = document.documentElement;

    const updateScroll = () => {
      ticking = false;

      // 1. Dynamic viewport bottom blur responsiveness
      // Remains fully active as user scrolls through the page, softening all passing content
      const scrollY = window.scrollY;
      const scrollFactor = Math.min(1, Math.max(0.6, scrollY / 50));
      containerRef.current?.style.setProperty("--edge-scroll", String(scrollFactor));

      // 2. Footer Meadow transition (matching thoufik.space)
      // When reaching the 3D grass meadow at the bottom, gracefully fade out the edge blur
      // so the grass terrain and flowers remain completely crisp and unclouded
      const footerElement = document.querySelector("#contact") || document.querySelector(".meadow-footer");
      if (footerElement) {
        const winH = window.innerHeight;
        const fadeEnd = winH * 1.15;
        const fadeStart = winH * 0.85;
        const rect = footerElement.getBoundingClientRect();
        const footerLevel = Math.max(0, Math.min(1, (rect.top - fadeStart) / (fadeEnd - fadeStart)));

        if (footerLevel === 0 || footerLevel === 1 || Math.abs(prevLevel - footerLevel) >= 0.01) {
          prevLevel = footerLevel;
          root.style.setProperty("--sky-footer-fade", String(footerLevel));
          if (footerLevel === 0) {
            root.dataset.footerFade = "off";
          } else {
            delete root.dataset.footerFade;
          }
        }
      }
    };

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateScroll);
      }
    };

    updateScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      root.style.removeProperty("--sky-footer-fade");
      delete root.dataset.footerFade;
    };
  }, []);

  const total = BLUR_STEPS.length;

  return (
    <div
      ref={containerRef}
      className={`edge-fade edge-fade--${position}`}
      aria-hidden="true"
      style={{
        height,
        zIndex,
        ["--edge-level" as any]: "var(--sky-footer-fade, 1)",
        ["--edge-tint" as any]: tint || "var(--sky-bottom)",
        ["--edge-scroll" as any]: "1",
      }}
    >
      {BLUR_STEPS.map((blurPx, idx) => {
        const mask = getMask(idx, total, position);
        return (
          <span
            key={blurPx}
            style={{
              backdropFilter: `blur(${blurPx}px)`,
              WebkitBackdropFilter: `blur(${blurPx}px)`,
              maskImage: mask,
              WebkitMaskImage: mask,
            }}
          />
        );
      })}
      <i />
    </div>
  );
}

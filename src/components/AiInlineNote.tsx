"use client";

import React, { useState, useEffect, useRef } from "react";

interface AiTool {
  name: "claude" | "chatgpt" | "gemini";
  label: string;
}

const AI_TOOLS: AiTool[] = [
  { name: "claude", label: "Claude" },
  { name: "chatgpt", label: "ChatGPT" },
  { name: "gemini", label: "Gemini" },
];

export default function AiInlineNote() {
  const [activeToolIdx, setActiveToolIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const containerRef = useRef<HTMLSpanElement>(null);
  const hintMeasureRef = useRef<HTMLSpanElement>(null);
  const fullMeasureRef = useRef<HTMLSpanElement>(null);

  const [widths, setWidths] = useState({ hint: 28, full: 140 });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Measure content widths accurately
  useEffect(() => {
    const updateWidths = () => {
      const hintW = hintMeasureRef.current?.getBoundingClientRect().width ?? 28;
      const fullW = fullMeasureRef.current?.getBoundingClientRect().width ?? 140;
      if (hintW > 0 && fullW > 0) {
        setWidths({ hint: hintW, full: fullW });
      }
    };

    updateWidths();
    const ro = new ResizeObserver(updateWidths);
    if (hintMeasureRef.current) ro.observe(hintMeasureRef.current);
    if (fullMeasureRef.current) ro.observe(fullMeasureRef.current);
    return () => ro.disconnect();
  }, []);

  // 1500ms cycle interval matching Thoufik's reference
  useEffect(() => {
    if (prefersReducedMotion) return;
    const interval = setInterval(() => {
      setActiveToolIdx((prev) => (prev + 1) % AI_TOOLS.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  const currentTool = AI_TOOLS[activeToolIdx];
  const isRevealed = isHovered || isExpanded || isFocused;
  const targetWidth = isRevealed ? (isExpanded ? widths.full : widths.hint) : 0;

  return (
    <span
      ref={containerRef}
      className="sky-inline-note select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsExpanded(false);
      }}
    >
      <button
        type="button"
        aria-expanded={isExpanded}
        aria-label={
          isExpanded
            ? "Super intelligence — collapse"
            : "AI — reveal super intelligence"
        }
        onClick={() => setIsExpanded((prev) => !prev)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setIsFocused(false);
          setIsExpanded(false);
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setIsExpanded(false);
            setIsHovered(false);
            containerRef.current?.blur();
          }
        }}
        className="cursor-pointer font-inherit text-inherit"
      >
        {/* Rotating AI Brand Icon */}
        <span
          className="sky-ai-brand"
          data-tool={currentTool.name}
          aria-hidden="true"
        >
          <span
            key={currentTool.name}
            style={{
              transition: prefersReducedMotion
                ? "none"
                : "opacity 0.2s ease-out, filter 0.2s ease-out",
              opacity: 1,
              filter: "blur(0px)",
            }}
          >
            {currentTool.name === "claude" && (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <path d="M13 12L18.5 5M7.63965 3L12.5 12L13.6865 3M4.48381 6.71679L11.9872 12M3 12L11.9872 12.473M12.2244 13.177L7 20M4.84194 16.8682L11.2824 12.9758M11.5 21L12.665 13.177M21 14L13.1846 12.668M21 10.5788L13 12.3223M16.779 19.646L12.8876 13.3772M19.3566 18.207L13.313 12.9893" />
              </svg>
            )}

            {currentTool.name === "chatgpt" && (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <path d="M11.7453 14.85L6.90436 12V7C6.90436 4.79086 8.72949 3 10.9809 3C12.3782 3 13.6113 3.6898 14.3458 4.74128" />
                <path d="M9.59961 19.1791C10.3266 20.2757 11.5866 21.0008 13.0192 21.0008C15.2707 21.0008 17.0958 19.21 17.0958 17.0008V12.0008L12.1612 9.0957" />
                <path d="M9.45166 13.5L9.45123 7.66938L13.8642 5.16938C15.814 4.06481 18.3072 4.72031 19.4329 6.63348C20.1593 7.86806 20.1388 9.32466 19.5089 10.4995" />
                <path d="M4.48963 13.4993C3.8595 14.6742 3.83887 16.131 4.56539 17.3657C5.6911 19.2789 8.18428 19.9344 10.1341 18.8298L14.5471 16.3298L14.643 10.7344" />
                <path d="M17.0959 17.6309C18.4415 17.5734 19.7295 16.8634 20.4529 15.634C21.5786 13.7209 20.9106 11.2745 18.9608 10.1699L14.5478 7.66992L9.48907 10.4255" />
                <path d="M6.90454 6.36938C5.55865 6.42662 4.27032 7.13672 3.54684 8.3663C2.42113 10.2795 3.08917 12.7258 5.03896 13.8304L9.45196 16.3304L14.5 13.5807" />
              </svg>
            )}

            {currentTool.name === "gemini" && (
              <svg
                width="16"
                height="16"
                viewBox="1 1 22 22"
                aria-hidden="true"
                className="w-4 h-4"
              >
                <defs>
                  <linearGradient
                    id="gemini-badge-grad"
                    x1="0"
                    y1="1"
                    x2="1"
                    y2="0"
                  >
                    <stop
                      offset="0%"
                      stopColor="color-mix(in oklab, #fff, #4285f4 calc(var(--theme-blend, 0) * 100%))"
                    />
                    <stop
                      offset="45%"
                      stopColor="color-mix(in oklab, #fff, #7b72e9 calc(var(--theme-blend, 0) * 100%))"
                    />
                    <stop
                      offset="75%"
                      stopColor="color-mix(in oklab, #fff, #b56ad5 calc(var(--theme-blend, 0) * 100%))"
                    />
                    <stop
                      offset="100%"
                      stopColor="color-mix(in oklab, #fff, #d96570 calc(var(--theme-blend, 0) * 100%))"
                    />
                  </linearGradient>
                </defs>
                <path
                  fill="url(#gemini-badge-grad)"
                  d="M2 12C7.523 12 12 7.523 12 2C12 7.523 16.477 12 22 12C16.477 12 12 16.477 12 22C12 16.477 7.523 12 2 12Z"
                />
              </svg>
            )}
          </span>
        </span>

        {/* AI Label with Strike-Through & Smooth Expansion */}
        <span className="sky-ai-label">
          <span className="sky-ai-shorthand" aria-hidden="true">
            <em
              style={{
                fontStyle: isRevealed ? "italic" : "normal",
                opacity: isRevealed ? 0.55 : 1,
                transition: "opacity 0.15s ease-out, font-style 0.15s ease-out",
              }}
            >
              AI
              <span
                className="sky-ai-strike"
                style={{
                  transform: isRevealed ? "scaleX(1)" : "scaleX(0)",
                }}
              />
            </em>

            {/* Revealed Text Container */}
            <span
              className="sky-ai-reveal"
              style={{
                opacity: isRevealed ? 1 : 0,
                width: `${targetWidth}px`,
                marginLeft: isRevealed ? "5px" : "0px",
                transition: prefersReducedMotion
                  ? "none"
                  : "width 0.3s cubic-bezier(0.2, 0, 0, 1), opacity 0.25s ease-out, margin-left 0.25s ease-out",
              }}
            >
              {/* Measurement targets for precise animated width */}
              <span
                ref={hintMeasureRef}
                className="sky-ai-measure"
                aria-hidden="true"
              >
                SI?
              </span>
              <span
                ref={fullMeasureRef}
                className="sky-ai-measure"
                aria-hidden="true"
              >
                Super Intelligence
              </span>

              {/* Normal-flow sizer providing container height */}
              <span
                className="sky-ai-reveal-sizer"
                aria-hidden="true"
                style={{ visibility: "hidden" }}
              >
                {isExpanded ? "Super Intelligence" : "SI?"}
              </span>

              {/* Reveal text states */}
              <span
                className="sky-ai-reveal-text"
                style={{
                  opacity: isExpanded ? 0 : 1,
                  transform: isExpanded ? "translateX(-8px)" : "translateX(0)",
                  filter: isExpanded ? "blur(4px)" : "blur(0px)",
                  pointerEvents: "none",
                  transition: prefersReducedMotion
                    ? "none"
                    : "opacity 0.24s cubic-bezier(0.2, 0, 0, 1), transform 0.24s cubic-bezier(0.2, 0, 0, 1), filter 0.24s cubic-bezier(0.2, 0, 0, 1)",
                }}
              >
                SI?
              </span>
              <span
                className="sky-ai-reveal-text"
                style={{
                  opacity: isExpanded ? 1 : 0,
                  transform: isExpanded ? "translateX(0)" : "translateX(8px)",
                  filter: isExpanded ? "blur(0px)" : "blur(4px)",
                  pointerEvents: "none",
                  transition: prefersReducedMotion
                    ? "none"
                    : "opacity 0.3s cubic-bezier(0.2, 0, 0, 1), transform 0.3s cubic-bezier(0.2, 0, 0, 1), filter 0.3s cubic-bezier(0.2, 0, 0, 1)",
                }}
              >
                Super Intelligence
              </span>
            </span>
          </span>
        </span>
      </button>
    </span>
  );
}

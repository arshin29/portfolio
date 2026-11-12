"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { MainProject } from "@/data/projects";
import InteractiveSticker from "./InteractiveSticker";

interface PostageStampProps {
  project: MainProject;
  headlineTitle: string;
  accentColor?: string;
  gradientTones?: [string, string];
  imageSrc?: string;
  imagePosition?: string;
  stickerSrc?: string;
  previewComponent?: React.ReactNode;
  marks?: [[string, string], [string, string]];
  resultsTitle?: string;
  results?: [string, string][];
  story?: string;
  facts?: string[];
  readMin?: number;
}

function PostMark({
  id,
  ring,
  middle,
  tone = "blue",
}: {
  id: string;
  ring: string;
  middle: string;
  tone?: "blue" | "green";
}) {
  return (
    <svg className="pc-mark" data-tone={tone} viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <path id={id} d="M50,50 m-35,0 a35,35 0 1,1 70,0 a35,35 0 1,1 -70,0" />
        <filter id={`${id}-ink`} x="-4%" y="-4%" width="108%" height="108%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves={2} seed={4} result="warp" />
          <feDisplacementMap in="SourceGraphic" in2="warp" scale={2.4} result="rough" />
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={3} seed={9} result="grain" />
          <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 2.6 -.55" result="speckle" />
          <feComposite in="rough" in2="speckle" operator="in" />
        </filter>
      </defs>
      <g filter={`url(#${id}-ink)`}>
        <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="2.6" />
        <circle cx="50" cy="50" r="28" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <text fontSize="10" letterSpacing="1.6" fill="currentColor">
          <textPath href={`#${id}`} textLength={ring.length < 19 ? 214 : undefined} lengthAdjust="spacing">
            {ring}
          </textPath>
        </text>
        <text
          x="50"
          y="54.5"
          textAnchor="middle"
          fontSize={middle.length > 5 ? 10.5 : 13}
          letterSpacing={middle.length > 5 ? 0.6 : 0}
          fontWeight="700"
          fill="currentColor"
        >
          {middle}
        </text>
      </g>
    </svg>
  );
}

export default function PostageStamp({
  project,
  headlineTitle,
  accentColor = "#2c4288",
  gradientTones = ["#3a2a8a", "#9a7cf2"],
  imageSrc,
  imagePosition,
  stickerSrc,
  previewComponent,
  marks = [
    [`${project.name.toUpperCase()} · 2024 ·`, "VERIFIED"],
    ["PORTFOLIO · LIVE ·", "WORK"],
  ],
  resultsTitle = "Key Outcomes",
  results,
  story,
  facts,
  readMin = 5,
}: PostageStampProps) {
  const [isTurned, setIsTurned] = useState(false);
  const stampRef = useRef<HTMLDivElement | null>(null);
  const animFrameRef = useRef<number>(0);

  // Auto-flip threshold on mobile scroll (matching thoufik.space)
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 600px)");
    let lastState: boolean | null = null;
    let ticking = 0;

    const checkMobileFlip = () => {
      ticking = 0;
      const el = stampRef.current;
      if (!el || !mq.matches) {
        lastState = null;
        return;
      }
      const rect = el.getBoundingClientRect();
      const mid = rect.top + rect.height / 2;
      const enterThreshold = window.innerHeight * 0.7;
      const exitThreshold = rect.height * 0.3;
      const dir = lastState === true ? 1 : -1;
      const shouldTurn = mid < enterThreshold + 28 * dir && rect.bottom > exitThreshold - 6 * dir;
      if (shouldTurn !== lastState) {
        lastState = shouldTurn;
        setIsTurned(shouldTurn);
      }
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = requestAnimationFrame(checkMobileFlip);
      }
    };

    checkMobileFlip();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(ticking);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const el = stampRef.current;
      if (!el || e.pointerType === "touch" || isTurned) return;
      if ((e.target as HTMLElement).closest(".pc-stamp")) return;

      const { clientX, clientY } = e;
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const normX = (clientX - rect.left) / rect.width;
        const normY = (clientY - rect.top) / rect.height;
        el.style.setProperty("--mx", (normX * 100).toFixed(1));
        el.style.setProperty("--my", (normY * 100).toFixed(1));
        el.style.setProperty("--rx", `${((0.5 - normY) * 9).toFixed(2)}deg`);
        el.style.setProperty("--ry", `${((normX - 0.5) * 12).toFixed(2)}deg`);
        el.dataset.live = "true";
      });
    },
    [isTurned]
  );

  const handlePointerLeave = useCallback(() => {
    cancelAnimationFrame(animFrameRef.current);
    const el = stampRef.current;
    if (el) {
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
      el.style.setProperty("--mx", "50");
      el.style.setProperty("--my", "40");
      delete el.dataset.live;
    }
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as HTMLElement;
      // Do not flip if clicked directly on an interactive link/button
      if (target.closest("a") || target.closest("button.pc-key")) {
        return;
      }
      setIsTurned((prev) => !prev);
    },
    []
  );

  const finalResults =
    results || [
      ["100%", "Grounded Architecture"],
      ["< 300ms", "Optimized Query Latency"],
      ["Live", "Production Deployment"],
    ];

  const finalStory =
    story ||
    project.description ||
    "A full-stack application engineered with modern frontend, performant APIs, and structured database design.";

  const finalFacts =
    facts ||
    project.features.slice(0, 3) || [
      "Next.js & TypeScript",
      "Tailwind CSS & Node.js",
      "Production-ready architecture",
    ];

  const projectUrl = project.liveUrl || project.githubUrl || "#";

  return (
    <div
      ref={stampRef}
      className="pc select-none"
      style={{
        ["--accent" as any]: accentColor,
      }}
      data-turned={isTurned ? "true" : undefined}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
      aria-label={`Project postcard: ${project.name}. Click to ${isTurned ? "turn back" : "turn over"}.`}
    >
      <div className="pc-tilt">
        <div className="pc-turner">
          {/* =============================================================
              FRONT SIDE (Authentic Postage Postcard)
             ============================================================= */}
          <div className="pc-side pc-front" aria-hidden={isTurned}>
            <span className="pc-paper">
              {/* Left Column: Title, Tagline, Recipient & Postmark */}
              <span className="pc-left">
                <span className="pc-title">{headlineTitle}</span>
                <span className="pc-about">{project.tagline}</span>
                <span className="pc-field">
                  <span>To</span>
                  <em>{project.name}</em>
                </span>
                <span className="pc-marks">
                  <PostMark
                    id={`${project.id}-m1`}
                    ring={marks[0][0]}
                    middle={marks[0][1]}
                    tone="blue"
                  />
                  <PostMark
                    id={`${project.id}-m2`}
                    ring={marks[1][0]}
                    middle={marks[1][1]}
                    tone="green"
                  />
                </span>
              </span>

              {/* Right Column: Full-Bleed Mockup Frame */}
              <span className="pc-frame">
                <span
                  className="pc-mock"
                  data-kind="screen"
                  style={
                    {
                      "--from": gradientTones[0],
                      "--to": gradientTones[1],
                    } as React.CSSProperties
                  }
                >
                  <span className="pc-grain" />
                  <span className="pc-devices">
                    <span className="pc-shot">
                      {imageSrc ? (
                        <img
                          src={imageSrc}
                          alt={project.name}
                          loading="lazy"
                          decoding="async"
                          draggable={false}
                          style={imagePosition ? { objectPosition: imagePosition } : undefined}
                        />
                      ) : (
                        previewComponent
                      )}
                      <span className="pc-glass" />
                    </span>
                  </span>
                </span>
              </span>
            </span>

            {/* Central Holographic Glitter 3D Peeling Sticker */}
            {stickerSrc && (
              <InteractiveSticker
                src={stickerSrc}
                label={project.name}
                tilt={project.id === "documind" ? 6 : -5}
              />
            )}
          </div>

          {/* =============================================================
              BACK SIDE (Postcard Back Kraft Paper Layout)
             ============================================================= */}
          <div className="pc-side pc-back" aria-hidden={!isTurned}>
            <span className="pc-paper pc-kraft">
              {/* Back Left Column: Key Outcomes / Stats */}
              <span className="pc-back-col pc-back-changed">
                <span className="pc-title">{resultsTitle}</span>
                <dl className="pc-stats">
                  {finalResults.map(([metric, label]) => (
                    <div key={label}>
                      <dd data-long={metric.length > 9 || undefined}>{metric}</dd>
                      <dt>{label}</dt>
                    </div>
                  ))}
                </dl>
              </span>

              {/* Back Right Column: About the work, facts & stamp link */}
              <span className="pc-back-col pc-back-story">
                <span className="pc-title">About the work</span>
                <span className="pc-story">{finalStory}</span>
                <ul className="pc-facts">
                  {finalFacts.map((fact) => (
                    <li key={fact}>{fact}</li>
                  ))}
                </ul>

                <a
                  className="pc-stamp"
                  href={projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${project.name} live application`}
                  tabIndex={isTurned ? 0 : -1}
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="pc-stamp-lift">
                    <span className="pc-stamp-paper" />
                    <span className="pc-stamp-time">
                      <b>{readMin}</b>
                      <small>min</small>
                    </span>
                    <span className="pc-stamp-block">
                      <span className="pc-stamp-big">
                        Read more
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M4 12h15M13 6l6 6-6 6" />
                        </svg>
                      </span>
                    </span>
                  </span>
                </a>
              </span>
            </span>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="pc-key"
        aria-pressed={isTurned}
        onClick={(e) => {
          e.stopPropagation();
          setIsTurned((p) => !p);
        }}
      >
        {isTurned
          ? `Turn the ${project.name} postcard back to its front`
          : `Turn the ${project.name} postcard over to see its results`}
      </button>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import MonogramLogo from "./MonogramLogo";
import AiInlineNote from "./AiInlineNote";
import TechBadge from "./TechBadge";

interface PhraseItem {
  text: string;
  icon: React.ReactNode;
}

const PHRASES: PhraseItem[] = [
  {
    text: "crafts with taste",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="w-[18px] h-[18px]"
      >
        <path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.21 1.21 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72" />
        <path d="m14 7 3 3" />
        <path d="M5 6v4" />
        <path d="M19 14v4" />
        <path d="M10 2v2" />
        <path d="M7 8H3" />
        <path d="M21 16h-4" />
        <path d="M11 3H9" />
      </svg>
    ),
  },
  {
    text: "builds in code",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="w-[18px] h-[18px]"
      >
        <path d="m18 16 4-4-4-4" />
        <path d="m6 8-4 4 4 4" />
        <path d="m14.5 4-5 16" />
      </svg>
    ),
  },
  {
    text: "thinks in systems",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="w-[18px] h-[18px]"
      >
        <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.9a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
        <path d="m22 12.5-8.58 3.9a2 2 0 0 1-1.66 0L2.6 12.5" />
        <path d="m22 17.5-8.58 3.9a2 2 0 0 1-1.66 0L2.6 17.5" />
      </svg>
    ),
  },
];

export default function Hero() {
  const [currentPhraseIdx, setCurrentPhraseIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // 4500ms rotation interval matching Thoufik reference
  useEffect(() => {
    if (prefersReducedMotion || isPaused) return;
    const interval = setInterval(() => {
      triggerNextPhrase();
    }, 4500);
    return () => clearInterval(interval);
  }, [prefersReducedMotion, isPaused]);

  const triggerNextPhrase = () => {
    if (prefersReducedMotion) {
      setCurrentPhraseIdx((prev) => (prev + 1) % PHRASES.length);
      return;
    }
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentPhraseIdx((prev) => (prev + 1) % PHRASES.length);
      setIsTransitioning(false);
    }, 180);
  };

  const handleScrollToContact = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const contactElement = document.getElementById("contact");
    if (contactElement) {
      contactElement.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });
    }
    window.dispatchEvent(new Event("sky:open-contact"));
  };

  const currentPhrase = PHRASES[currentPhraseIdx];
  const letters = Array.from(currentPhrase.text);

  return (
    <section className="sky-intro w-full flex flex-col justify-start relative select-none">
      {/* 1. Geometric Outlined Monogram Logo for Arshin */}
      <div>
        <MonogramLogo />
      </div>

      {/* 2. Main Heading (Static) */}
      <h1 id="sky-intro-title">
        Hi, I&apos;m Arshin.
      </h1>

      {/* 3. Subtitle with Static First Half + Rotating Second Half */}
      <p className="sky-positioning">
        A product designer who{" "}
        <button
          type="button"
          className="sky-changing-phrase"
          data-phrase={currentPhraseIdx}
          aria-label={`${currentPhrase.text}. Click to show next description.`}
          onClick={triggerNextPhrase}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
        >
          <span className="sky-phrase-artwork" aria-hidden="true">
            {letters.map((char, i) => {
              const ratio = i / Math.max(1, letters.length - 1);
              const fromVar = ratio < 0.52 ? "--sky-phrase-from" : "--sky-phrase-middle";
              const toVar = ratio < 0.52 ? "--sky-phrase-middle" : "--sky-phrase-to";
              const progress = ratio < 0.52 ? ratio / 0.52 : (ratio - 0.52) / 0.48;

              return (
                <span
                  key={`${currentPhraseIdx}-${i}`}
                  className="sky-phrase-letter"
                  style={
                    {
                      "--sky-letter-ink": `color-mix(in srgb, var(${fromVar}), var(${toVar}) ${progress * 100}%)`,
                      color: `var(--sky-letter-ink, color-mix(in srgb, var(${fromVar}), var(${toVar}) ${progress * 100}%))`,
                      transition: prefersReducedMotion
                        ? "none"
                        : "opacity 0.28s ease-out, filter 0.28s ease-out, transform 0.28s ease-out",
                      transitionDelay: prefersReducedMotion ? "0ms" : `${i * 18}ms`,
                      opacity: isTransitioning ? 0 : 1,
                      transform: isTransitioning
                        ? "translateY(5px)"
                        : "translateY(0px)",
                      filter: isTransitioning ? "blur(6px)" : "blur(0px)",
                    } as React.CSSProperties
                  }
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              );
            })}
            <span
              className="sky-phrase-icon"
              style={{
                color: "var(--sky-phrase-to, #f2b6dd)",
                transition: prefersReducedMotion
                  ? "none"
                  : "opacity 0.28s ease-out, transform 0.28s ease-out",
                transitionDelay: prefersReducedMotion
                  ? "0ms"
                  : `${letters.length * 18}ms`,
                opacity: isTransitioning ? 0 : 1,
                transform: isTransitioning
                  ? "scale(0.8) translateY(4px)"
                  : "scale(1) translateY(0px)",
              }}
            >
              {currentPhrase.icon}
            </span>
          </span>
        </button>
      </p>

      {/* 4. Intro Paragraphs with Authentic Inline AI Note & Frosted Glass Tech Badges */}
      <div className="sky-story">
        <p>
          I am a full-stack developer blending code, design and{" "}
          <AiInlineNote /> to build modern digital experiences.
        </p>

        <p>
          I work with <TechBadge name="React" />,{" "}
          <TechBadge name="Next.js" />,{" "}
          <TechBadge name="TypeScript" />,{" "}
          <TechBadge name="Node.js" />,{" "}
          <TechBadge name="NestJS" />,{" "}
          <TechBadge name="PostgreSQL" /> and{" "}
          <TechBadge name="Figma" />, using AI-powered tools to turn ideas into
          polished, functional products.
        </p>
      </div>

      {/* 5. Authentic Reference Frosted Glass "Let's talk" CTA Button */}
      <div className="sky-story-links">
        <a
          href="#contact"
          onClick={handleScrollToContact}
          className="sky-pill sky-talk-btn select-none group cursor-pointer"
          aria-controls="contact"
        >
          <span>Let&apos;s talk</span>
          <span className="sky-swap" aria-hidden="true">
            <span className="sky-swap-a">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-[18px] h-[18px]"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </span>
            <span className="sky-swap-b">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-[18px] h-[18px]"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </span>
          </span>
        </a>
      </div>
    </section>
  );
}

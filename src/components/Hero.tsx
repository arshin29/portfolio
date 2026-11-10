"use client";

import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import DecorativeRadial from "./DecorativeRadial";

const ROTATING_PHRASES = [
  "Full-Stack Developer",
  "UI/UX Enthusiast",
  "Digital Product Builder",
  "Creative Problem Solver",
];

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;

    let timeoutId: NodeJS.Timeout;
    const intervalId = setInterval(() => {
      setPrevIndex(currentIndex);
      setCurrentIndex((prev) => (prev + 1) % ROTATING_PHRASES.length);

      timeoutId = setTimeout(() => {
        setPrevIndex(null);
      }, 550);
    }, 2800);

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [currentIndex, prefersReducedMotion]);

  const handleScrollToContact = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const contactElement = document.getElementById("contact");
    if (contactElement) {
      contactElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="min-h-screen min-h-[100svh] lg:h-[900px] w-full flex flex-col justify-start relative overflow-hidden py-16 sm:py-20 lg:py-0">
      {/* Centered Editorial Content Column (770px wide, left edge ~479px at 1728px viewport) */}
      <div className="w-full max-w-[770px] mx-auto px-6 sm:px-8 relative lg:pt-[142px] z-10">
        {/* 1. Small Decorative Mark (around 142px from top) */}
        <div className="w-9 h-9 rounded-xl bg-white/[0.08] border border-white/[0.14] text-white flex items-center justify-center font-mono font-medium text-xs tracking-tight shadow-inner select-none">
          AB
        </div>

        {/* 2. Main Heading (begins around 218px from top, mt-[40px] from 178px mark bottom) */}
        <h1 className="mt-8 lg:mt-[40px] text-4xl sm:text-5xl lg:text-[52px] font-medium tracking-[-0.04em] text-[#f6f8fd] leading-[1.08]">
          Arshin Bhande.
        </h1>

        {/* 3. Rotating Subtitle (directly beneath the heading) */}
        <div
          className="mt-2 lg:mt-2.5 h-[32px] sm:h-[36px] lg:h-[40px] overflow-hidden relative"
          aria-live="polite"
          aria-atomic="true"
        >
          {prefersReducedMotion ? (
            <span className="absolute inset-0 flex items-center text-xl sm:text-2xl lg:text-[25px] text-[#a9bad1] font-normal tracking-[-0.02em] leading-snug">
              {ROTATING_PHRASES[0]}
            </span>
          ) : (
            ROTATING_PHRASES.map((phrase, i) => {
              const isCurrent = i === currentIndex;
              const isPrev = i === prevIndex;

              let stateClasses = "translate-y-full opacity-0 pointer-events-none";
              if (isCurrent) {
                stateClasses =
                  "translate-y-0 opacity-100 z-10 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]";
              } else if (isPrev) {
                stateClasses =
                  "-translate-y-full opacity-0 z-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]";
              }

              return (
                <span
                  key={phrase}
                  className={`absolute inset-0 flex items-center text-xl sm:text-2xl lg:text-[25px] text-[#a9bad1] font-normal tracking-[-0.02em] leading-snug will-change-transform ${stateClasses}`}
                >
                  {phrase}
                </span>
              );
            })
          )}
        </div>

        {/* 4. Introduction Paragraphs */}
        <div className="mt-8 lg:mt-[48px] space-y-3.5 max-w-2xl">
          <p className="text-base sm:text-[17px] text-[#c5d3e6] leading-[1.65] font-normal">
            I&apos;m a Full-Stack Developer who enjoys turning ideas into useful, well-designed digital experiences.
          </p>
          <p className="text-base sm:text-[17px] text-[#c5d3e6] leading-[1.65] font-normal">
            I work across frontend and backend development, building web applications that are both functional and easy to use.
          </p>
          <p className="text-base sm:text-[17px] text-[#c5d3e6] leading-[1.65] font-normal">
            I enjoy exploring new technologies, solving problems, and using AI tools to make my development process smarter and more efficient.
          </p>

          <p className="text-xs sm:text-sm font-mono text-[#8fa4bf] pt-1">
            Building from India, creating for everywhere.
          </p>
        </div>

        {/* 5. CTA Button */}
        <div className="mt-10 lg:mt-[80px]">
          <a
            href="#contact"
            onClick={handleScrollToContact}
            className="h-11 sm:h-12 px-6 sm:px-7 rounded-full bg-[#f6f8fd] text-[#0d1726] font-medium text-sm inline-flex items-center gap-2.5 hover:bg-white hover:shadow-xl hover:shadow-white/10 transition-all duration-200 group"
          >
            <span>Let&apos;s talk</span>
            <ArrowRight className="w-4 h-4 text-[#0d1726]/80 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>

      {/* Ambient Decorative Radial Graphic (positioned cleanly on right side, non-intrusive) */}
      <div className="hidden xl:block absolute right-[-40px] 2xl:right-[60px] top-[200px] pointer-events-none opacity-25 2xl:opacity-35 select-none">
        <DecorativeRadial />
      </div>
    </section>
  );
}

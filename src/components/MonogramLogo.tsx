"use client";

import React, { useState } from "react";

export default function MonogramLogo({ className = "" }: { className?: string }) {
  const [rotation, setRotation] = useState({ rx: 0, ry: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setRotation({
      rx: -(y / (rect.height / 2)) * 12,
      ry: (x / (rect.width / 2)) * 12,
    });
  };

  const handleMouseLeave = () => {
    setRotation({ rx: 0, ry: 0 });
    setIsHovered(false);
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`sky-hero-logo select-none ${className}`}
      data-ready="true"
      title="Arshin Monogram Mark"
      aria-label="Rotate Arshin logo with drag or arrow keys"
      role="button"
      tabIndex={0}
      style={{ perspective: "800px" }}
    >
      <div
        style={{
          transform: `rotateX(${rotation.rx}deg) rotateY(${rotation.ry}deg)`,
          transition: isHovered ? "transform 0.1s ease-out" : "transform 0.4s cubic-bezier(0.2, 0, 0, 1)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          viewBox="30 30 135 135"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="sky-hero-logo-fallback w-full h-full filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <linearGradient id="hero-logo-grad" x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#e6f7ff" />
              <stop offset="0.35" stopColor="#ffffff" />
              <stop offset="0.68" stopColor="#c9a3e8" />
              <stop offset="1" stopColor="#f6fbff" />
            </linearGradient>
          </defs>
          {/* Arshin Monogram Arch */}
          <path
            d="M 52 140 C 58 140 62 134 66 122 L 93 52 C 95 47 100 47 102 52 L 129 122 C 133 134 137 140 143 140"
            fill="none"
            stroke="url(#hero-logo-grad)"
            strokeWidth="5.39494"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Looping Ribbon Crossbar matching Thoufik's capsule loop aesthetic & proportions */}
          <path
            d="M 45 97 C 45 91.6 49.4 87.2 54.8 87.2 H 140.2 C 145.6 87.2 150 91.6 150 97 C 150 102.4 145.6 106.8 140.2 106.8 H 54.8 C 49.4 106.8 45 102.4 45 97 Z"
            fill="none"
            stroke="url(#hero-logo-grad)"
            strokeWidth="5.39494"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";

export interface ConstellationNode {
  id: string;
  name: string;
  category: "Frontend" | "Backend" | "Database" | "Design" | "Tools";
  primary?: boolean;
  pulse?: string;
  desktop: {
    x: number;
    y: number;
    labelPos: "top" | "bottom" | "left" | "right";
  };
  mobile: {
    x: number;
    y: number;
    labelPos: "top" | "bottom" | "left" | "right";
  };
}

export interface ConstellationConnection {
  from: string;
  to: string;
}

export interface ConstellationCategory {
  name: string;
  desktop: { x: number; y: number };
  mobile: { x: number; y: number };
}

const CONSTELLATION_NODES: ConstellationNode[] = [
  // --- FRONTEND ---
  {
    id: "react",
    name: "React",
    category: "Frontend",
    primary: true,
    pulse: "twinkle-1",
    desktop: { x: 26, y: 32, labelPos: "top" },
    mobile: { x: 50, y: 11, labelPos: "bottom" },
  },
  {
    id: "nextjs",
    name: "Next.js",
    category: "Frontend",
    primary: true,
    pulse: "twinkle-2",
    desktop: { x: 38, y: 18, labelPos: "top" },
    mobile: { x: 82, y: 16, labelPos: "bottom" },
  },
  {
    id: "typescript",
    name: "TypeScript",
    category: "Frontend",
    primary: true,
    pulse: "twinkle-3",
    desktop: { x: 39, y: 44, labelPos: "bottom" },
    mobile: { x: 80, y: 26, labelPos: "bottom" },
  },
  {
    id: "javascript",
    name: "JavaScript",
    category: "Frontend",
    primary: false,
    desktop: { x: 15, y: 46, labelPos: "bottom" },
    mobile: { x: 18, y: 26, labelPos: "bottom" },
  },
  {
    id: "tailwind",
    name: "Tailwind CSS",
    category: "Frontend",
    primary: false,
    desktop: { x: 14, y: 20, labelPos: "top" },
    mobile: { x: 18, y: 17, labelPos: "bottom" },
  },

  // --- DESIGN ---
  {
    id: "figma",
    name: "Figma",
    category: "Design",
    primary: false,
    desktop: { x: 7, y: 36, labelPos: "bottom" },
    mobile: { x: 22, y: 41, labelPos: "bottom" },
  },

  // --- BACKEND ---
  {
    id: "nodejs",
    name: "Node.js",
    category: "Backend",
    primary: true,
    pulse: "twinkle-4",
    desktop: { x: 58, y: 24, labelPos: "top" },
    mobile: { x: 76, y: 41, labelPos: "bottom" },
  },
  {
    id: "nestjs",
    name: "NestJS",
    category: "Backend",
    primary: false,
    desktop: { x: 73, y: 16, labelPos: "top" },
    mobile: { x: 48, y: 48, labelPos: "bottom" },
  },
  {
    id: "restapis",
    name: "REST APIs",
    category: "Backend",
    primary: false,
    desktop: { x: 77, y: 36, labelPos: "right" },
    mobile: { x: 82, y: 51, labelPos: "bottom" },
  },

  // --- DATABASE ---
  {
    id: "postgres",
    name: "PostgreSQL",
    category: "Database",
    primary: true,
    pulse: "twinkle-1",
    desktop: { x: 74, y: 68, labelPos: "bottom" },
    mobile: { x: 72, y: 64, labelPos: "bottom" },
  },
  {
    id: "prisma",
    name: "Prisma",
    category: "Database",
    primary: false,
    desktop: { x: 88, y: 74, labelPos: "bottom" },
    mobile: { x: 28, y: 64, labelPos: "bottom" },
  },

  // --- TOOLS ---
  {
    id: "vercel",
    name: "Vercel",
    category: "Tools",
    primary: false,
    desktop: { x: 49, y: 56, labelPos: "top" },
    mobile: { x: 50, y: 78, labelPos: "bottom" },
  },
  {
    id: "git",
    name: "Git",
    category: "Tools",
    primary: false,
    desktop: { x: 25, y: 75, labelPos: "bottom" },
    mobile: { x: 18, y: 91, labelPos: "bottom" },
  },
  {
    id: "github",
    name: "GitHub",
    category: "Tools",
    primary: false,
    desktop: { x: 38, y: 84, labelPos: "bottom" },
    mobile: { x: 48, y: 91, labelPos: "bottom" },
  },
  {
    id: "docker",
    name: "Docker",
    category: "Tools",
    primary: false,
    desktop: { x: 52, y: 80, labelPos: "bottom" },
    mobile: { x: 80, y: 82, labelPos: "bottom" },
  },
  {
    id: "shopify",
    name: "Shopify",
    category: "Tools",
    primary: false,
    desktop: { x: 18, y: 62, labelPos: "bottom" },
    mobile: { x: 18, y: 81, labelPos: "bottom" },
  },
  {
    id: "aitools",
    name: "AI Tools",
    category: "Tools",
    primary: false,
    desktop: { x: 65, y: 86, labelPos: "bottom" },
    mobile: { x: 80, y: 92, labelPos: "bottom" },
  },
];

const CONSTELLATION_CONNECTIONS: ConstellationConnection[] = [
  // Frontend Intra-Cluster
  { from: "figma", to: "tailwind" },
  { from: "figma", to: "react" },
  { from: "tailwind", to: "react" },
  { from: "javascript", to: "react" },
  { from: "javascript", to: "typescript" },
  { from: "react", to: "nextjs" },
  { from: "react", to: "typescript" },
  { from: "nextjs", to: "typescript" },

  // Frontend <-> Backend Bridge
  { from: "typescript", to: "nodejs" },
  { from: "nextjs", to: "vercel" },
  { from: "vercel", to: "github" },

  // Backend Intra-Cluster
  { from: "nodejs", to: "nestjs" },
  { from: "nodejs", to: "restapis" },
  { from: "nestjs", to: "restapis" },

  // Backend <-> Database Bridge
  { from: "nodejs", to: "postgres" },
  { from: "nestjs", to: "prisma" },
  { from: "postgres", to: "prisma" },

  // Tools Intra-Cluster & Bridges
  { from: "react", to: "shopify" },
  { from: "shopify", to: "git" },
  { from: "git", to: "github" },
  { from: "github", to: "docker" },
  { from: "docker", to: "nodejs" },
  { from: "docker", to: "aitools" },
  { from: "postgres", to: "aitools" },
];

const CONSTELLATION_CATEGORIES: ConstellationCategory[] = [
  { name: "Frontend", desktop: { x: 25, y: 6 }, mobile: { x: 50, y: 4 } },
  { name: "Backend", desktop: { x: 67, y: 6 }, mobile: { x: 76, y: 35 } },
  { name: "Design", desktop: { x: 7, y: 26 }, mobile: { x: 22, y: 35 } },
  { name: "Database", desktop: { x: 81, y: 57 }, mobile: { x: 72, y: 58 } },
  { name: "Tools", desktop: { x: 42, y: 96 }, mobile: { x: 50, y: 72 } },
];

export default function Skills() {
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const nodeMap = new Map(CONSTELLATION_NODES.map((n) => [n.id, n]));

  return (
    <section id="skills" className="py-20 md:py-28 scroll-mt-16 sm:scroll-mt-20">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10">
        {/* Section Heading */}
        <div className="mb-12 md:mb-14">
          <h2 className="text-2xl sm:text-3xl font-medium tracking-[-0.035em] text-[#f6f8fd]">
            Technical Skills
          </h2>

          <p className="text-sm sm:text-base text-[#a7b8cf] mt-2 max-w-2xl leading-relaxed">
            Technologies and tools I work with across application development, backend services, and database management.
          </p>
        </div>

        {/* Tech Constellation Canvas */}
        <div
          className="relative w-full h-[740px] md:h-[580px] select-none rounded-2xl overflow-hidden"
          onMouseLeave={() => setHoveredNodeId(null)}
        >
          {/* Subtle Ambient Cosmic Glow Behind Clusters */}
          <div
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{
              backgroundImage: `
                radial-gradient(circle at 28% 28%, rgba(56, 115, 185, 0.12) 0%, transparent 45%),
                radial-gradient(circle at 70% 25%, rgba(65, 125, 205, 0.10) 0%, transparent 42%),
                radial-gradient(circle at 75% 70%, rgba(50, 95, 160, 0.10) 0%, transparent 40%),
                radial-gradient(circle at 38% 78%, rgba(45, 85, 145, 0.10) 0%, transparent 42%)
              `,
            }}
          />

          {/* SVG Connecting Lines Canvas */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
            <defs>
              <filter id="constellation-glow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="rgba(195, 225, 255, 0.65)" />
              </filter>
            </defs>

            <g>
              {CONSTELLATION_CONNECTIONS.map((conn) => {
                const fromNode = nodeMap.get(conn.from);
                const toNode = nodeMap.get(conn.to);
                if (!fromNode || !toNode) return null;

                const fromCoords = isMobile ? fromNode.mobile : fromNode.desktop;
                const toCoords = isMobile ? toNode.mobile : toNode.desktop;

                const isRelated =
                  hoveredNodeId && (conn.from === hoveredNodeId || conn.to === hoveredNodeId);
                const isDimmed = hoveredNodeId && !isRelated;

                const strokeColor = isRelated
                  ? "rgba(215, 235, 255, 0.78)"
                  : isDimmed
                  ? "rgba(148, 163, 184, 0.05)"
                  : "rgba(148, 163, 184, 0.16)";

                const strokeWidth = isRelated ? 1.5 : 1;
                const filter = isRelated ? "url(#constellation-glow)" : "none";

                return (
                  <line
                    key={`${conn.from}-${conn.to}`}
                    x1={`${fromCoords.x}%`}
                    y1={`${fromCoords.y}%`}
                    x2={`${toCoords.x}%`}
                    y2={`${toCoords.y}%`}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    filter={filter}
                    className={
                      prefersReducedMotion
                        ? ""
                        : "transition-[stroke,stroke-width,opacity] duration-300 ease-out"
                    }
                  />
                );
              })}
            </g>
          </svg>

          {/* Category Group Badges */}
          <div className="absolute inset-0 pointer-events-none">
            {CONSTELLATION_CATEGORIES.map((cat) => {
              const coords = isMobile ? cat.mobile : cat.desktop;
              return (
                <div
                  key={cat.name}
                  style={{
                    position: "absolute",
                    left: `${coords.x}%`,
                    top: `${coords.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                  className="text-[10px] sm:text-[11px] font-mono tracking-[0.24em] text-[#5b7596] uppercase select-none flex items-center gap-1.5 opacity-80"
                >
                  <span className="w-1 h-1 rounded-full bg-[#5b7596]" />
                  <span>{cat.name}</span>
                </div>
              );
            })}
          </div>

          {/* Interactive Technology Nodes */}
          <div className="absolute inset-0">
            {CONSTELLATION_NODES.map((node) => {
              const coords = isMobile ? node.mobile : node.desktop;
              const isHovered = hoveredNodeId === node.id;
              const isNeighbor =
                hoveredNodeId &&
                CONSTELLATION_CONNECTIONS.some(
                  (c) =>
                    (c.from === hoveredNodeId && c.to === node.id) ||
                    (c.to === hoveredNodeId && c.from === node.id)
                );
              const isDimmed = hoveredNodeId && !isHovered && !isNeighbor;

              // Text styling
              const textColor = isHovered
                ? "text-white"
                : isNeighbor
                ? "text-[#f0f6ff]"
                : isDimmed
                ? "text-[#475d75]"
                : node.primary
                ? "text-[#f6f8fd]"
                : "text-[#9bb0cb]";

              const textSize = node.primary
                ? "text-[13px] sm:text-[14px] font-medium"
                : "text-[11px] sm:text-[12px] font-normal";

              // Star Point styling
              const starSize = node.primary ? "w-2 h-2" : "w-1.5 h-1.5";
              const starColor = isHovered
                ? "bg-white shadow-[0_0_12px_rgba(255,255,255,0.95)] scale-125"
                : isNeighbor
                ? "bg-[#dbe7f7] shadow-[0_0_8px_rgba(180,215,255,0.6)]"
                : isDimmed
                ? "bg-[#3e526a] opacity-40"
                : node.primary
                ? "bg-[#f6f8fd] shadow-[0_0_6px_rgba(255,255,255,0.55)]"
                : "bg-[#7d99b8]";

              // Label position offset
              let labelClass = "absolute whitespace-nowrap transition-all duration-200 pointer-events-none ";
              if (coords.labelPos === "top") {
                labelClass += "bottom-full mb-1.5 left-1/2 -translate-x-1/2";
              } else if (coords.labelPos === "bottom") {
                labelClass += "top-full mt-1.5 left-1/2 -translate-x-1/2";
              } else if (coords.labelPos === "left") {
                labelClass += "right-full mr-2.5 top-1/2 -translate-y-1/2 text-right";
              } else if (coords.labelPos === "right") {
                labelClass += "left-full ml-2.5 top-1/2 -translate-y-1/2 text-left";
              }

              return (
                <div
                  key={node.id}
                  id={`skill-node-${node.id}`}
                  style={{
                    position: "absolute",
                    left: `${coords.x}%`,
                    top: `${coords.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  onClick={() => setHoveredNodeId((prev) => (prev === node.id ? null : node.id))}
                  tabIndex={0}
                  role="button"
                  aria-label={`${node.name} (${node.category})`}
                  onFocus={() => setHoveredNodeId(node.id)}
                  onBlur={() => setHoveredNodeId(null)}
                  className="group/node p-2.5 -m-2.5 flex items-center justify-center cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-blue-300/40 rounded-full"
                >
                  {/* Outer Aura on Hover */}
                  <div
                    className={`absolute w-6 h-6 rounded-full bg-blue-300/[0.14] transition-all duration-300 pointer-events-none ${
                      isHovered ? "opacity-100 scale-125" : "opacity-0 scale-90"
                    }`}
                  />

                  {/* Core Star Point */}
                  <div
                    className={`${starSize} ${starColor} rounded-full transition-all duration-300 ${
                      !isHovered && !prefersReducedMotion && node.pulse ? node.pulse : ""
                    }`}
                  />

                  {/* Node Label */}
                  <span
                    className={`${labelClass} ${textSize} ${textColor} tracking-tight ${
                      isHovered ? "drop-shadow-[0_0_8px_rgba(255,255,255,0.85)]" : ""
                    }`}
                  >
                    {node.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Subtle Celestial Twinkle Styles */}
      <style jsx>{`
        @keyframes subtle-twinkle {
          0%,
          100% {
            opacity: 0.45;
            transform: scale(0.92);
          }
          50% {
            opacity: 1;
            transform: scale(1.15);
          }
        }

        .twinkle-1 {
          animation: subtle-twinkle 4.2s ease-in-out infinite;
        }
        .twinkle-2 {
          animation: subtle-twinkle 5.5s ease-in-out 1.2s infinite;
        }
        .twinkle-3 {
          animation: subtle-twinkle 3.8s ease-in-out 2.1s infinite;
        }
        .twinkle-4 {
          animation: subtle-twinkle 6s ease-in-out 0.8s infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .twinkle-1,
          .twinkle-2,
          .twinkle-3,
          .twinkle-4 {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}

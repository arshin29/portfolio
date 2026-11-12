"use client";

import React, { useState } from "react";
import { ArrowRight } from "lucide-react";

interface TimelineItem {
  id: string;
  title: string;
  role: string;
  dates: string;
  detail: string;
  barLeft: number;
  barWidth: number;
  present?: boolean;
}

// Verified milestones only (strictly no fabricated employment or titles)
const TIMELINE_ITEMS: TimelineItem[] = [
  {
    id: "webster-co",
    title: "Webster Co.",
    role: "Full Stack Developer",
    dates: "Mar 2024 — Present",
    detail:
      "Full-stack web applications, REST APIs, and database architecture with TypeScript and Node.js.",
    // On 2020-2026 axis (7 years = 84 months):
    // Mar 2024 is month 50. 50 / 84 = 59.524%
    // Present (Nov 2026) is month 82.5. (82.5 - 50) / 84 = 38.69%
    barLeft: 59.524,
    barWidth: 38.69,
    present: true,
  },
  {
    id: "fullstack-dev",
    title: "Independent Full-Stack Project Development",
    role: "Full-Stack Development",
    dates: "2023 — Present",
    detail:
      "Architecting and developing full-stack web applications end-to-end, including TripNext, DocuMind, and Stockly with Next.js, REST APIs, and relational databases.",
    // On 2020-2026 axis (7 years = 84 months):
    // 2023 is month 36. 36 / 84 = 42.857%
    // Present (Nov 2026) is month 82.5. (82.5 - 36) / 84 = 55.357%
    barLeft: 42.857,
    barWidth: 55.357,
    present: true,
  },
  {
    id: "bsc-cs",
    title: "Bachelor of Science in Computer Science",
    role: "Undergraduate Degree · 8.79 CGPA",
    dates: "2021 — 2024",
    detail:
      "Core foundational coursework covering Data Structures & Algorithms, Relational Database Management Systems (RDBMS), Object-Oriented Programming, and Software Engineering.",
    // 2021 is month 12. 12 / 84 = 14.285%
    // Graduation (mid 2024) is month 54. (54 - 12) / 84 = 50.0%
    barLeft: 14.285,
    barWidth: 50.0,
    present: false,
  },
];

const YEARS = [2020, 2021, 2022, 2023, 2024, 2025, 2026];

export default function ExperienceTimeline() {
  const [openId, setOpenId] = useState<string | null>(null);

  const handleExploreClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.getElementById("side-projects");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* =========================================================================
          1. INTRODUCTORY BLOCK: "Sky's the limit"
          ========================================================================= */}
      <section className="sky-door" aria-labelledby="sky-door-title">
        <h2 id="sky-door-title">Sky’s the limit</h2>
        <p>
          Take a walk through my experiments and the other work I’ve explored along the way.
        </p>
        <span className="sd-wrap">
          <span className="sd-glow" aria-hidden="true" />
          <a
            href="#side-projects"
            onClick={handleExploreClick}
            className="sky-pill sky-door-btn"
            aria-label="Explore my canvas"
          >
            <span className="sd-label">
              Explore my canvas
              <span className="sky-swap" aria-hidden="true">
                <span className="sky-swap-a">
                  <ArrowRight size={18} />
                </span>
                <span className="sky-swap-b">
                  <ArrowRight size={18} />
                </span>
              </span>
            </span>
          </a>
        </span>
      </section>

      {/* =========================================================================
          2. MINIMALIST EXPERIENCE TIMELINE
          ========================================================================= */}
      <section id="experience" className="sky-experience" aria-labelledby="experience-title">
        <h2 id="experience-title">Experience</h2>

        <div className="sky-timeline">
          {/* Year Axis with vertical tick markers */}
          <div className="sky-timeline-axis" aria-hidden="true">
            {YEARS.map((yr, idx) => (
              <span
                key={yr}
                style={{ ["--p" as any]: idx / YEARS.length }}
              >
                {yr}
              </span>
            ))}
          </div>

          {/* Timeline Items List */}
          <ol className="sky-timeline-list">
            {TIMELINE_ITEMS.map((item) => {
              const isOpen = openId === item.id;
              return (
                <li
                  key={item.id}
                  className="sky-timeline-item"
                  data-open={isOpen ? "" : undefined}
                  onClick={() => setOpenId((prev) => (prev === item.id ? null : item.id))}
                >
                  <div className="sky-timeline-head">
                    <h3>
                      <button
                        type="button"
                        className="sky-timeline-toggle"
                        aria-expanded={isOpen}
                      >
                        {item.title}
                      </button>
                    </h3>
                    <span className="sky-timeline-dates">{item.dates}</span>
                  </div>

                  <p className="sky-timeline-role">{item.role}</p>
                  <p className="sky-timeline-detail">{item.detail}</p>

                  <div className="sky-timeline-track" aria-hidden="true">
                    <i
                      className="sky-timeline-bar"
                      data-present={item.present ? "" : undefined}
                      style={{
                        left: `${item.barLeft}%`,
                        width: `${item.barWidth}%`,
                      }}
                    />
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>
    </div>
  );
}

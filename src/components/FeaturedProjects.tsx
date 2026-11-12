"use client";

import React from "react";
import { FEATURED_PROJECTS } from "@/data/projects";
import PostageStamp from "./PostageStamp";

export default function FeaturedProjects() {
  const tripnext = FEATURED_PROJECTS.find((p) => p.id === "tripnext") || FEATURED_PROJECTS[0];
  const documind = FEATURED_PROJECTS.find((p) => p.id === "documind") || FEATURED_PROJECTS[1];

  return (
    <section id="work" className="w-full py-8 sm:py-16 relative">
      <div className="project-postcards">
        {/* 1. TripNext Postage Stamp */}
        <PostageStamp
          project={tripnext}
          headlineTitle="Travel discovery and itinerary planning"
          accentColor="#c96f49"
          gradientTones={["#d97d54", "#f7c8a4"]}
          imageSrc="/projects/tripnext.jpg"
          imagePosition="75% center"
          stickerSrc="/zyephr-sticker.png"
          marks={[
            ["TRIPNEXT · 2024 ·", "ITIN"],
            ["EXPLORE · LIVE ·", "TRAVEL"],
          ]}
          resultsTitle="Key Outcomes"
          results={[
            ["100%", "Interactive destination maps"],
            ["< 250ms", "Relational itinerary query time"],
            ["1-Click", "Collaborative itinerary sharing"],
          ]}
          story="I designed and built TripNext as an all-in-one travel discovery and collaborative itinerary platform with live destination mapping, relational PostgreSQL trip scheduling, and responsive UI."
          facts={[
            "Next.js & TypeScript",
            "PostgreSQL & Prisma",
            "Full-stack relational schema",
          ]}
          readMin={5}
        />

        {/* 2. DocuMind Postage Stamp */}
        <PostageStamp
          project={documind}
          headlineTitle="Document workspace with grounded AI"
          accentColor="#4a3e72"
          gradientTones={["#151936", "#423382"]}
          imageSrc="/projects/documind.jpg"
          imagePosition="82% center"
          stickerSrc="/airtribe-sticker.png"
          marks={[
            ["DOCUMIND · AI ·", "DOCS"],
            ["WORKSPACE · LIVE ·", "AI"],
          ]}
          resultsTitle="Key Capabilities"
          results={[
            ["100%", "Grounded AI accuracy on documents"],
            ["< 1.2s", "Automated document indexing"],
            ["PDF + DOCX", "Multi-format vector search"],
          ]}
          story="I designed and engineered DocuMind to give teams an intelligent workspace for uploading, parsing, and chatting with documents using grounded AI retrieval and relational storage."
          facts={[
            "Next.js 15 & NestJS",
            "PostgreSQL & Vector search",
            "Grounded document retrieval",
          ]}
          readMin={4}
        />
      </div>
    </section>
  );
}

"use client";

import React from "react";
import TicketCard from "./TicketCard";

const SIDE_PROJECTS = [
  {
    id: "fraganote",
    name: "Fraganote",
    premise: "High-fidelity luxury perfume storefront recreation.",
    formula: "Shopify Storefront · Next.js / Tailwind",
    imageSrc: "/projects/fraganote.jpg",
    imagePosition: "center",
    storyHref: "https://github.com/arshin29",
    href: "https://fraganote-shopify.vercel.app/",
    toneA: "#72472b",
    toneB: "#cca07c",
    tags: ["SHOPIFY RECREATION", "ECOMMERCE FRONTEND"],
  },
  {
    id: "chime",
    name: "Chime",
    premise: "Real-time direct messaging with instant delivery via WebSockets.",
    formula: "WebSocket System · React / TypeScript",
    imageSrc: "/projects/chime.jpg",
    imagePosition: "center 40%",
    storyHref: "https://github.com/arshin29/chime",
    href: "https://chime-a2fi.vercel.app/",
    toneA: "#244c92",
    toneB: "#76a2e4",
    tags: ["REAL-TIME CHAT", "WEBSOCKET SYSTEM"],
  },
  {
    id: "blinkit",
    name: "Blinkit",
    premise: "10-minute grocery delivery store recreation with responsive cart workflows.",
    formula: "Quick Commerce · REST API Architecture",
    imageSrc: "/projects/blinkit.jpg",
    imagePosition: "center",
    storyHref: "https://github.com/arshin29/blinkit-clone",
    href: "https://blinkit-clone-six-green.vercel.app/",
    toneA: "#1e5b38",
    toneB: "#56b078",
    tags: ["QUICK COMMERCE", "NEXT.JS ARCHITECTURE"],
  },
];

export default function AdditionalProjects() {
  return (
    <section
      id="side-projects"
      className="independent-projects"
      aria-labelledby="side-projects-title"
    >
      <div className="independent-intro">
        <h2 id="side-projects-title">Side projects</h2>
      </div>

      <div className="project-tickets">
        {SIDE_PROJECTS.map((project) => (
          <TicketCard
            key={project.id}
            id={project.id}
            name={project.name}
            premise={project.premise}
            formula={project.formula}
            imageSrc={project.imageSrc}
            imagePosition={project.imagePosition}
            storyHref={project.storyHref}
            href={project.href}
            toneA={project.toneA}
            toneB={project.toneB}
            tags={project.tags}
          />
        ))}
      </div>
    </section>
  );
}

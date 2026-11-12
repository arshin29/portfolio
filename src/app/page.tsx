import LivingSky from "@/components/LivingSky";
import InteractiveSkyWidget from "@/components/InteractiveSkyWidget";
import Hero from "@/components/Hero";
import FeaturedProjects from "@/components/FeaturedProjects";
import AdditionalProjects from "@/components/AdditionalProjects";
import ExperienceTimeline from "@/components/ExperienceTimeline";
import Contact from "@/components/Contact";
import BottomScrollBlur from "@/components/BottomScrollBlur";

export default function Home() {
  return (
    <div className="sky-app min-h-screen w-full relative">
      {/* 0. Living WebGL Procedural Dynamic Sky */}
      <LivingSky />

      {/* 1. Independently positioned floating weather & time widget */}
      <InteractiveSkyWidget />

      {/* 2. Soft progressive bottom blur transition */}
      <BottomScrollBlur />

      <main className="flex-1 w-full flex flex-col items-center relative z-10">
        {/* 2. Hero Section with Monogram Logo & Bio */}
        <Hero />

        {/* 3. Selected Work: 3D Interactive Postage Stamps */}
        <FeaturedProjects />

        {/* 4. Side Projects: Boarding Pass Ticket Cards */}
        <AdditionalProjects />

        {/* 5. Experience & Education Timeline Scrubber (2021 — 2026) */}
        <ExperienceTimeline />

        {/* 6. Touch Some Grass, 3D Meadow & Crumpled Paper Note Form */}
        <Contact />
      </main>
    </div>
  );
}

import InteractiveSkyWidget from "@/components/InteractiveSkyWidget";
import Hero from "@/components/Hero";
import FeaturedProjects from "@/components/FeaturedProjects";
import AdditionalProjects from "@/components/AdditionalProjects";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Education from "@/components/Education";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      {/* Independently positioned floating location & time widget */}
      <InteractiveSkyWidget />
      <main className="flex-1 w-full">
        <Hero />
        <FeaturedProjects />
        <AdditionalProjects />
        <About />
        <Skills />
        <Education />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

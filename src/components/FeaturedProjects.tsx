import { FEATURED_PROJECTS } from "@/data/projects";
import { ArrowUpRight } from "lucide-react";

export default function FeaturedProjects() {
  return (
    <section id="featured-projects" className="py-24 sm:py-32 lg:py-40 scroll-mt-16 sm:scroll-mt-20">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10">
        {/* Section Header */}
        <div className="mb-20 sm:mb-24 lg:mb-28">
          <h2 className="text-2xl sm:text-3xl font-medium tracking-[-0.035em] text-[#f6f8fd]">
            Featured Projects
          </h2>
          <p className="text-sm sm:text-base text-[#a7b8cf] mt-2 max-w-xl leading-relaxed">
            Primary full-stack development applications, backend architectures, and database systems.
          </p>
        </div>

        {/* Minimal Editorial Project Index (No imagery, no cards, no divider lines) */}
        <div className="space-y-20 sm:space-y-24 lg:space-y-32">
          {FEATURED_PROJECTS.map((project, idx) => {
            const projectNumber = `0${idx + 1}`;

            return (
              <article
                key={project.id}
                className="group/entry relative"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-8 items-start">
                  {/* Left Column: Small, understated project number */}
                  <div className="md:col-span-2 pt-1 sm:pt-2">
                    <span className="font-mono text-xs sm:text-sm text-[#7e93af] tracking-widest select-none">
                      {projectNumber}
                    </span>
                  </div>

                  {/* Center Column: Large Title, Short Description, Inline Tech Stack */}
                  <div className="md:col-span-9 space-y-3.5 sm:space-y-4 max-w-2xl">
                    {/* Project Title Row */}
                    <div className="flex items-baseline gap-3.5 flex-wrap">
                      <h3 className="text-3xl sm:text-4xl lg:text-[44px] font-medium tracking-[-0.035em] text-[#f6f8fd] leading-[1.12]">
                        {project.liveUrl ? (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-white transition-colors cursor-pointer inline-flex items-center gap-2 group-hover/entry:text-white"
                            title={`Open live ${project.name} deployment in a new tab`}
                          >
                            <span>{project.name}</span>
                          </a>
                        ) : (
                          <span>{project.name}</span>
                        )}
                      </h3>

                      {project.inDevelopment && (
                        <span className="text-[11px] font-mono text-amber-300/80 px-2.5 py-0.5 rounded-full bg-amber-400/[0.08] border border-amber-400/20 select-none">
                          In Development
                        </span>
                      )}
                    </div>

                    {/* Short Description with comfortable line spacing */}
                    <p className="text-base sm:text-[17px] text-[#c5d3e6] font-normal leading-relaxed">
                      {project.tagline}
                    </p>

                    {/* Technology names displayed as simple muted inline text */}
                    <div className="font-mono text-xs sm:text-[13px] text-[#8fa4bf] tracking-wide pt-0.5">
                      {project.techInline || project.technologies.join(" / ")}
                    </div>

                    {/* Discreet GitHub Link */}
                    {project.githubUrl && (
                      <div className="pt-2">
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-mono text-[#8fa4bf] hover:text-[#f6f8fd] transition-colors"
                        >
                          <span className="underline underline-offset-4">Explore on GitHub</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Small arrow aligned towards the right side of the entry */}
                  <div className="hidden md:flex md:col-span-1 justify-end pt-2 sm:pt-3">
                    {project.liveUrl ? (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Open live ${project.name} website`}
                        className="text-[#7e93af] group-hover/entry:text-white group-hover/entry:translate-x-1 group-hover/entry:-translate-y-1 transition-all duration-200 cursor-pointer"
                      >
                        <ArrowUpRight className="w-6 h-6 stroke-[1.8]" />
                      </a>
                    ) : (
                      <div className="text-white/20 select-none">
                        <ArrowUpRight className="w-6 h-6 stroke-[1.5]" />
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

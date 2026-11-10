import { ADDITIONAL_PROJECTS } from "@/data/projects";
import { ArrowUpRight } from "lucide-react";

export default function AdditionalProjects() {
  return (
    <section id="additional-projects" className="py-20 md:py-28 scroll-mt-16 sm:scroll-mt-20">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10">
        {/* Section Heading */}
        <div className="mb-12 md:mb-14">
          <h2 className="text-2xl sm:text-3xl font-medium tracking-[-0.035em] text-[#f6f8fd]">
            Additional Projects
          </h2>
          <p className="text-sm sm:text-base text-[#a7b8cf] mt-2 max-w-2xl leading-relaxed">
            Secondary projects, technical recreations, and personal demo storefronts created to study specific e-commerce patterns and frontend workflows. These are independent development studies, distinct from client work.
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
          {ADDITIONAL_PROJECTS.map((project, index) => {
            const destinationUrl = project.liveUrl || project.githubUrl || "#";
            const isLastOdd = index === ADDITIONAL_PROJECTS.length - 1 && ADDITIONAL_PROJECTS.length % 2 !== 0;

            return (
              <a
                key={project.id}
                href={destinationUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${project.name} in a new tab`}
                className={`group/card block p-6 rounded-xl border border-white/[0.08] bg-[#0f1b2d]/60 hover:bg-[#0f1b2d]/90 hover:border-white/[0.18] transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50 ${
                  isLastOdd
                    ? "md:col-span-2 md:justify-self-center md:w-[calc(50%-0.625rem)] lg:w-[calc(50%-0.75rem)]"
                    : ""
                }`}
              >
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-[11px] font-mono text-[#7e95b3]">
                        {project.type}
                      </span>
                      <ArrowUpRight className="w-4 h-4 text-[#7e95b3] group-hover/card:text-white group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5 transition-all duration-200 shrink-0" />
                    </div>

                    <h3 className="text-lg font-medium tracking-tight text-[#f6f8fd] group-hover/card:text-white transition-colors">
                      {project.name}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#9bb0cb] mt-2 leading-relaxed">
                      {project.summary}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/[0.06] text-[11px] font-mono text-[#7e95b3]">
                    {project.technologies.join(" · ")}
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

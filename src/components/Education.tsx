export default function Education() {
  return (
    <section id="education" className="py-20 md:py-28 scroll-mt-16 sm:scroll-mt-20">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10">
        <h2 className="text-2xl sm:text-3xl font-medium tracking-[-0.035em] text-[#f6f8fd] mb-8 md:mb-10">
          Education
        </h2>

        <div className="p-6 sm:p-7 rounded-xl border border-white/[0.08] bg-[#0f1b2d]/60">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
            <div>
              <h3 className="text-lg sm:text-xl font-medium text-[#f6f8fd]">
                Bachelor of Science in Computer Science
              </h3>
              <p className="text-sm text-[#9bb0cb] mt-1.5 leading-relaxed">
                Foundational coursework covering Data Structures &amp; Algorithms, Database Management Systems, Object-Oriented Programming, and Computer Networks.
              </p>
            </div>

            <div className="mt-1 sm:mt-0 font-mono text-sm font-semibold text-blue-300 whitespace-nowrap">
              CGPA: 8.79
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-12 sm:py-16 text-xs font-mono text-[#8fa4bf]">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          &copy; {new Date().getFullYear()} Arshin Bhande. All rights reserved.
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com/arshin29"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#c5d3e6] hover:text-white transition-colors inline-flex items-center gap-1"
          >
            <span>GitHub</span>
            <ArrowUpRight className="w-3 h-3 text-[#8fa4bf]" />
          </a>
        </div>
      </div>
    </footer>
  );
}

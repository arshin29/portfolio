export interface SkillGroup {
  category: string;
  skills: string[];
}

export const TECHNICAL_SKILLS: SkillGroup[] = [
  {
    category: "Frontend",
    skills: ["React", "Next.js", "JavaScript", "TypeScript", "Tailwind CSS"],
  },
  {
    category: "Backend",
    skills: ["Node.js", "NestJS", "REST APIs"],
  },
  {
    category: "Database",
    skills: ["PostgreSQL", "Prisma"],
  },
  {
    category: "Tools",
    skills: ["Git", "GitHub", "Docker", "Vercel"],
  },
  {
    category: "Additional",
    skills: ["Shopify", "Figma", "AI-assisted development tools"],
  },
];

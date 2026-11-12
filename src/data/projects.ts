export interface MainProject {
  id: string;
  name: string;
  tagline: string;
  description: string;
  status?: string;
  inDevelopment?: boolean;
  features: string[];
  technologies: string[];
  techInline?: string;
  githubUrl?: string;
  liveUrl?: string;
}

export interface SecondaryProject {
  id: string;
  name: string;
  type: "Application Recreation" | "Shopify Storefront" | "Shopify Storefront Recreation" | "Web Application";
  summary: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  isStorefrontRecreation: boolean;
}

export const FEATURED_PROJECTS: MainProject[] = [
  {
    id: "tripnext",
    name: "TripNext",
    tagline: "Full-stack travel discovery and planning platform.",
    description:
      "A complete travel application built to streamline trip discovery and itinerary planning. It connects an interactive discovery interface with user authentication, saved travel spots, map integrations, and relational database storage for customized trip scheduling.",
    features: [
      "Destination discovery",
      "User authentication",
      "Saved destinations",
      "Map integration",
      "Database integration",
      "Travel planning functionality",
    ],
    technologies: [
      "Next.js",
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "REST APIs",
      "Tailwind CSS",
    ],
    techInline: "React / Next.js / NestJS / PostgreSQL",
    githubUrl: "https://github.com/arshin29/tripnext",
    liveUrl: "https://tripnext-web.vercel.app",
  },
  {
    id: "documind",
    name: "DocuMind",
    tagline: "AI-powered document management and workspace.",
    description:
      "A workspace application designed for organizing, managing, and interacting with document collections. Supports direct PDF file uploads, automated text processing, and document-grounded AI queries backed by custom backend APIs and relational database storage.",
    features: [
      "Document management and organization",
      "PDF uploads and processing",
      "Document-based AI interactions",
      "Backend API development",
      "Database architecture",
    ],
    technologies: [
      "Next.js",
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "REST APIs",
      "Tailwind CSS",
    ],
    techInline: "Next.js / NestJS / Prisma / PostgreSQL",
    githubUrl: "https://github.com/arshin29/documind",
    liveUrl: "https://web-two-iota-20.vercel.app",
  },
  {
    id: "stockly",
    name: "Stockly",
    tagline: "Inventory management application with product tracking and CRUD functionality.",
    description:
      "An inventory system engineered for product tracking, real-time stock monitoring, and operational record keeping. Built around a PostgreSQL database modeled with Prisma, providing RESTful endpoints for CRUD operations, multi-condition filtering, and sorting.",
    status: "In Development",
    inDevelopment: true,
    features: [
      "Product management and CRUD operations",
      "Search, filtering, and sorting",
      "REST API integration",
      "PostgreSQL and Prisma",
    ],
    technologies: [
      "React",
      "TypeScript",
      "Node.js",
      "REST APIs",
      "PostgreSQL",
      "Prisma",
    ],
    techInline: "Next.js / NestJS / Prisma / PostgreSQL",
    githubUrl: "https://github.com/arshin29/stockly",
  },
];

export const ADDITIONAL_PROJECTS: SecondaryProject[] = [
  {
    id: "fraganote",
    name: "Fraganote",
    type: "Shopify Storefront Recreation",
    summary:
      "A Shopify storefront recreation capturing the aesthetic and shopping experience of a luxury fragrance brand.",
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    liveUrl: "https://fraganote-shopify.vercel.app/",
    githubUrl: "https://github.com/arshin29",
    isStorefrontRecreation: true,
  },
  {
    id: "chime",
    name: "Chime",
    type: "Web Application",
    summary:
      "A real-time direct messaging web application inspired by Instagram Direct, featuring instant message delivery via WebSockets, typing indicators, presence, and interactive reactions.",
    technologies: ["React", "TypeScript", "Tailwind CSS", "WebSockets"],
    liveUrl: "https://chime-a2fi.vercel.app/",
    githubUrl: "https://github.com/arshin29/chime",
    isStorefrontRecreation: false,
  },
  {
    id: "blinkit",
    name: "Blinkit",
    type: "Application Recreation",
    summary:
      "A grocery e-commerce recreation demonstrating frontend and backend development, featuring catalogue navigation, cart workflows, and responsive interface design.",
    technologies: ["React", "TypeScript", "Node.js", "REST APIs", "Tailwind CSS"],
    liveUrl: "https://blinkit-clone-six-green.vercel.app",
    githubUrl: "https://github.com/arshin29/blinkit-clone",
    isStorefrontRecreation: false,
  },
  {
    id: "and-india",
    name: "AND India",
    type: "Shopify Storefront Recreation",
    summary:
      "A Shopify storefront recreation of the contemporary fashion brand, featuring product grids, variant selections, and mobile-friendly shopping flows.",
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    liveUrl: "https://shopify-recreation.vercel.app/",
    githubUrl: "https://github.com/arshin29",
    isStorefrontRecreation: true,
  },
  {
    id: "3d-print-calculator",
    name: "3D Print Calculator",
    type: "Web Application",
    summary:
      "A commercial 3D printing cost and selling price intelligence calculator for the Bambu Lab P2S, computing per-gram material costing, machine wear amortization, electricity, and pricing tiers.",
    technologies: ["React", "TypeScript", "Tailwind CSS"],
    liveUrl: "https://3d-print-calculator-pink.vercel.app/",
    githubUrl: "https://github.com/arshin29",
    isStorefrontRecreation: false,
  },
  {
    id: "produce-matcher",
    name: "Produce Matcher",
    type: "Web Application",
    summary:
      "An AI-powered food discovery application that matches fruits and vegetables to nutritional queries using natural language evaluation and interactive physics simulation.",
    technologies: ["React", "JavaScript", "TypeSafe AI", "Matter.js", "Tailwind CSS"],
    liveUrl: "https://jev-produce-matcher.vercel.app/",
    githubUrl: "https://github.com/arshin29/jev-produce-matcher",
    isStorefrontRecreation: false,
  },
];

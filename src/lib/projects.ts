export interface Project {
  slug: string;
  name: string;
  // One line, used under the case-study title and in its metadata and OG image.
  summary: string;
  description: string;
  role: string;
  year: string;
  tech: string[];
  repo: string;
  live?: string;
  image: { src: string; alt: string };
}

// Name, description, tech and links come from the repos' READMEs and descriptions on github.com/AyoubObeidi;
// year and role from each repo's creation date and commit history. Screenshots are in public/projects/.
export const projects: Project[] = [
  {
    slug: "vertex",
    name: "Vertex",
    summary: "A learning platform with plain-language search that jumps to the exact second a topic is taught.",
    role: "Solo developer",
    year: "2026",
    description:
      "A learning platform where authors create courses in Sanity and a Next.js site serves them. Learners search in plain language and get ranked cards that jump to the exact second in a lesson's video where the topic is taught.",
    tech: ["TypeScript", "Next.js", "Sanity", "Tailwind CSS", "AI SDK", "Clerk"],
    repo: "https://github.com/AyoubObeidi/vertex-learning-platform",
    live: "https://vertex-iota-ashy.vercel.app",
    image: {
      src: "/projects/vertex.png",
      alt: "Vertex home page with the headline “Search your learning in plain English” and a search box",
    },
  },
  {
    slug: "folio-cv",
    name: "Folio CV",
    summary: "A free, private CV builder that runs entirely in the browser.",
    role: "Solo developer",
    year: "2026",
    description:
      "A free, private CV builder that runs entirely in the browser. No accounts and no server: CVs stay in IndexedDB, with nine ATS-friendly templates and PDF, Word and text exports.",
    tech: ["TypeScript", "Next.js", "React", "Tailwind CSS", "Zustand", "Zod"],
    repo: "https://github.com/AyoubObeidi/folio-cv",
    live: "https://folio-cv-theta.vercel.app",
    image: {
      src: "/projects/folio-cv.png",
      alt: "Folio CV home page with the headline “A free CV builder. Nothing leaves your browser.” next to a sample CV",
    },
  },
  {
    slug: "theft-detection",
    name: "Theft Detection",
    summary: "A video surveillance system that spots shoplifting and loitering across live camera feeds.",
    role: "[PLACEHOLDER] Your role",
    year: "2026",
    description:
      "A video surveillance system for retail spaces. It watches several camera feeds at once to detect shoplifting, loitering and restricted-area intrusions, then sounds an alarm and sends alerts by email and Telegram.",
    tech: ["Python", "FastAPI", "OpenCV", "YOLOv8", "Next.js", "SQLite"],
    repo: "https://github.com/AyoubObeidi/Theft-Detection",
    image: {
      src: "/projects/theft-detection.png",
      alt: "Theft Detection dashboard showing active cameras, today's alerts, a live feed and alert charts",
    },
  },
];

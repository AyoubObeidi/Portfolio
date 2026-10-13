import {
  siCss,
  siDiscord,
  siEslint,
  siGit,
  siGithub,
  siGreensock,
  siHtml5,
  siInstagram,
  siJavascript,
  siNextdotjs,
  siNodedotjs,
  siPnpm,
  siPrettier,
  siReact,
  siTailwindcss,
  siTypescript,
  siVercel,
  siX,
} from "simple-icons";
import type { BrandIconData } from "./icons";

export type BioSegment = string | { strong: string };

export interface SocialCard {
  icon: BrandIconData;
  title: string;
  subtitle: string;
  action: string;
  href: string;
  variant: "neutral" | "accent";
}

export interface ProfileLink {
  label: string;
  href: string;
  icon: BrandIconData;
}

export interface Skill {
  label: string;
  icon: BrandIconData;
}

export interface Profile {
  name: string;
  handle: string;
  status: string;
  location: string;
  timeZone: string;
  avatar?: { src: string; alt: string };
  email: string;
  resume?: string;
  bio: BioSegment[][];
  socialCards: SocialCard[];
  links: ProfileLink[];
  skills: Skill[];
  githubUsername: string;
}

// Every value below is [PLACEHOLDER] content. Replace it with your own.
export const profile: Profile = {
  name: "Ayoub Obeidi",
  handle: "@your-handle",
  status: "[PLACEHOLDER] Building something",
  location: "Djelfa, Algeria",
  // IANA time zone for the live clock, e.g. "Africa/Casablanca".
  timeZone: "Africa/Algiers",
  // Add a photo to public/ and set e.g. { src: "/avatar.jpg", alt: "Portrait of …" }.
  avatar: undefined,
  email: "ayoubmacos05@gmail.com",
  // Add your CV to public/ and set e.g. "/resume.pdf" to show a Resume button in the footer.
  resume: undefined,
  bio: [
    ["Hi, I'm a ", { strong: "Frontend Developer" }],
    ["[PLACEHOLDER] What you're building, and who it helps."],
    ["[PLACEHOLDER] One line about how you like to work."],
  ],
  socialCards: [
    {
      icon: siX,
      title: "[PLACEHOLDER] Your name",
      subtitle: "@your-handle",
      action: "Follow",
      href: "#",
      variant: "neutral",
    },
    {
      icon: siDiscord,
      title: "[PLACEHOLDER] Community",
      subtitle: "[PLACEHOLDER] Who it's for",
      action: "Join",
      href: "#",
      variant: "accent",
    },
  ],
  links: [
    { label: "GitHub", href: "https://github.com/AyoubObeidi", icon: siGithub },
    { label: "Instagram", href: "https://www.instagram.com/ayouboobeidi/", icon: siInstagram },
  ],
  // [PLACEHOLDER] Defaults are the tools this site is built with; swap in your own stack.
  skills: [
    { label: "Next.js", icon: siNextdotjs },
    { label: "React", icon: siReact },
    { label: "TypeScript", icon: siTypescript },
    { label: "JavaScript", icon: siJavascript },
    { label: "Tailwind CSS", icon: siTailwindcss },
    { label: "GSAP", icon: siGreensock },
    { label: "HTML", icon: siHtml5 },
    { label: "CSS", icon: siCss },
    { label: "Node.js", icon: siNodedotjs },
    { label: "Vercel", icon: siVercel },
    { label: "Git", icon: siGit },
    { label: "GitHub", icon: siGithub },
    { label: "pnpm", icon: siPnpm },
    { label: "ESLint", icon: siEslint },
    { label: "Prettier", icon: siPrettier },
  ],
  // [PLACEHOLDER] Guessed from your git user name; confirm it matches your GitHub login.
  githubUsername: "AyoubObeidi",
};

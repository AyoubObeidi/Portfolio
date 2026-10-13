import {
  siCss,
  siEslint,
  siFigma,
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
} from "simple-icons";
import type { BrandIconData } from "./icons";

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
  role: string;
  // Shows the "Open to work" badge next to the role.
  available: boolean;
  location: string;
  timeZone: string;
  avatar?: { src: string; alt: string };
  email: string;
  resume?: string;
  // First paragraph is the lead; the rest render quieter.
  bio: string[];
  links: ProfileLink[];
  skills: Skill[];
  githubUsername: string;
}

export const profile: Profile = {
  name: "Ayoub Obeidi",
  role: "Frontend Developer",
  available: true,
  location: "Djelfa, Algeria",
  // IANA time zone for the live clock in the nav.
  timeZone: "Africa/Algiers",
  // Add a photo to public/ and set e.g. { src: "/avatar.jpg", alt: "Portrait of …" }.
  avatar: undefined,
  email: "ayoubmacos05@gmail.com",
  // Add your CV to public/ and set e.g. "/resume.pdf" to show a Resume button in the footer.
  resume: undefined,
  bio: [
    "I build fast, considered interfaces for the web — mostly with React and Next.js. Right now I'm working on tools that make learning and job-hunting less painful.",
    "I like small teams, short feedback loops, and shipping the boring details properly.",
  ],
  links: [
    { label: "GitHub", href: "https://github.com/AyoubObeidi", icon: siGithub },
    { label: "Instagram", href: "https://www.instagram.com/ayouboobeidi/", icon: siInstagram },
  ],
  // Split in half for the two marquee rows.
  skills: [
    { label: "TypeScript", icon: siTypescript },
    { label: "JavaScript", icon: siJavascript },
    { label: "Tailwind CSS", icon: siTailwindcss },
    { label: "GSAP", icon: siGreensock },
    { label: "HTML", icon: siHtml5 },
    { label: "CSS", icon: siCss },
    { label: "Next.js", icon: siNextdotjs },
    { label: "React", icon: siReact },
    { label: "pnpm", icon: siPnpm },
    { label: "ESLint", icon: siEslint },
    { label: "Prettier", icon: siPrettier },
    { label: "Node.js", icon: siNodedotjs },
    { label: "Vercel", icon: siVercel },
    { label: "Git", icon: siGit },
    { label: "GitHub", icon: siGithub },
    { label: "Figma", icon: siFigma },
  ],
  githubUsername: "AyoubObeidi",
};

/**
 * Typed access to the portfolio content.
 *
 * All text/content lives in `portfolio.json` — edit that file to update the
 * site. This module only adds TypeScript types on top of it, so a typo or a
 * missing field in the JSON fails the build instead of breaking at runtime.
 */
import data from "./portfolio.json";

export interface Profile {
  name: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github?: string;
}

export interface Section {
  id: string;
  label: string;
}

export interface Project {
  title: string;
  /** Short qualifier shown under the title, e.g. "Gold & silver store" */
  subtitle?: string;
  image: string;
  tags: string[];
  /** Intro paragraph. Optional: some projects are described only by bullets. */
  description?: string;
  /** Bullet points shown in the project details */
  highlights?: string[];
  /** Omit for projects without a public URL */
  live?: string;
  github?: string;
  /** Screenshot of the live site, served from /public. Regenerate with `npm run previews`. */
  preview?: string;
}

export interface Experience {
  title: string;
  company: string;
  /** Industry/product shown next to the company, e.g. "Fintech" */
  sector?: string;
  location?: string;
  duration: string;
  current?: boolean;
  /** Intro paragraph. Optional: some roles are described only by bullets. */
  description?: string;
  highlights?: string[];
}

export interface Education {
  institution: string;
  degree: string;
  duration: string;
  location?: string;
}

export interface SkillCategory {
  title: string;
  /** Name of a lucide icon registered in `@/lib/icons` */
  icon: string;
  skills: string[];
}

export interface About {
  paragraphs: string[];
  chips: { icon: string; label: string }[];
  stats: { value: number; suffix: string; label: string }[];
}

export const profile: Profile = data.profile;
export const sections: Section[] = data.sections;
export const heroRoles: string[] = data.hero.roles;
export const about: About = data.about;
export const skillCategories: SkillCategory[] = data.skillCategories;
export const projects: Project[] = data.projects;
export const experiences: Experience[] = data.experiences;
export const education: Education[] = data.education;

/** Every skill from the CV, flattened — feeds the home-page tech ticker. */
export const techStack: string[] = skillCategories.flatMap((c) => c.skills);

/** One-line lead for cards: the intro paragraph, or the first bullet if there isn't one. */
export const leadText = (item: { description?: string; highlights?: string[] }): string =>
  item.description ?? item.highlights?.[0] ?? "";

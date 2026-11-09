// Content shapes shared by the data files and the components that render them.
export type SectionId =
  | 'hero'
  | 'olympus-vision'
  | 'careomni'
  | 'projects'
  | 'experience'
  | 'certifications'
  | 'skills'
  | 'writing'
  | 'contact';

export type PrivateRepoNote = 'Private repo · walkthrough on request';

export type FeaturedProject = {
  id: 'olympus-vision' | 'careomni';
  name: string;
  tagline: string;
  problem: string;
  built: string[];
  proof: string[];
  stack: string[];
  repo: { url: string } | { private: true; note: PrivateRepoNote };
  liveUrl?: string;
};

export type ProjectCard = {
  name: string;
  summary: string;
  tags: string[];
  repoUrl: string;
};

export type Role = {
  org: string;
  title: string;
  label?: 'Internship';
  /** Start month, formatted YYYY-MM. */
  start: string;
  /** End month formatted YYYY-MM, or 'present'. */
  end: string | 'present';
  points: string[];
};

export type Certification = {
  name: string;
  issuer: 'AWS' | 'Huawei';
  /** Issue month, formatted YYYY-MM. */
  issued: string;
  verifyUrl?: string;
  badgeImage?: string;
};

export type SkillGroup = {
  name: 'Cloud' | 'IaC & delivery' | 'Networking' | 'Backend';
  items: string[];
};

export type Article = {
  title: string;
  url: string;
  /** Publish date, formatted YYYY-MM-DD. */
  date: string;
  summary: string;
  topics: string[];
};

export type Education = {
  school: string;
  degree: string;
  grade: string;
};

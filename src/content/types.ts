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
  | 'testimonials'
  | 'contact';

export type Testimonial = {
  /** A contiguous excerpt of the client's own words; "…" marks any cut. */
  quote: string;
  /** Who said it, generalised so private clients are not named. */
  credit: string;
  /** What the work was, as the review platform lists it. */
  context: string;
  source: 'Upwork' | 'LinkedIn';
  /** Star rating out of 5, only where the platform shows one. */
  rating?: number;
};

export type PrivateRepoNote = 'Private repo · walkthrough on request';

export type DemoVideo = {
  src: string;
  poster: string;
  /** English WebVTT captions, required because the recording has speech. */
  captions: string;
  width: number;
  height: number;
  caption: string;
};

export type FeaturedProject = {
  id: 'olympus-vision' | 'careomni';
  name: string;
  tagline: string;
  problem: string;
  built: string[];
  proof: string[];
  /** Heading for the chip list: technologies are "Built with", design pieces are "Architecture". */
  stackLabel: string;
  stack: string[];
  repo: { url: string } | { private: true; note: PrivateRepoNote };
  liveUrl?: string;
  /** A recorded walkthrough, served from public/. Width and height are the encoded pixel size. */
  demoVideo?: DemoVideo;
  /** Subject line for a "request a demo login" email; demo credentials are never published. */
  demoLoginSubject?: string;
  /** Headline numbers shown as a stat row; every figure must come from a cited source. */
  stats?: ProjectStat[];
};

export type ProjectStat = {
  value: string;
  label: string;
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
  /** The issuer's official badge artwork, imported from src/assets/badges. */
  badgeImage?: ImageMetadata;
};

export type SkillGroup = {
  name: 'Solutions' | 'Cloud' | 'IaC & delivery' | 'Networking' | 'Backend';
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

/** A leadership role held alongside the degree. */
export type UniversityActivity = {
  role: string;
  group: string;
  result: string;
};

export type Education = {
  school: string;
  degree: string;
  /** Start and end years, formatted YYYY. */
  startYear: string;
  endYear: string;
  grade: string;
  activities: UniversityActivity[];
};

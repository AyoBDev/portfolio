// Turns the site's content into a plain, structured CV. Keeping this separate from the PDF
// rendering means the CV always says exactly what the site says, and it can be tested as data.
import { SITE } from '../../config/site';
import { SITE_URL } from '../../../site-url.mjs';
import { COPY } from '../../content/copy';
import { ROLES, EDUCATION } from '../../content/experience';
import { FEATURED, MORE_PROJECTS } from '../../content/projects';
import { SKILLS } from '../../content/skills';
import { CERTS } from '../../content/certifications';
import { formatMonth, formatMonthRange } from '../dates';

/** The headings applicant tracking systems look for, in the order recruiters expect. */
export const CV_SECTION_TITLES = [
  'Summary',
  'Experience',
  'Projects',
  'Skills',
  'Certifications',
  'Education',
] as const;
export type CvSectionTitle = (typeof CV_SECTION_TITLES)[number];

const PRESENT_LABEL = 'Present';
const INLINE_SEPARATOR = ' · ';
/** Side-project tags mix tech with context ('Startup', 'Hackathon'), so they aren't called a stack. */
const MORE_PROJECTS_TAGS_LABEL = 'Keywords';

export type CvItem = {
  heading?: string;
  /** Organisation, issuer or other context shown beside the heading. */
  subheading?: string;
  dates?: string;
  text?: string;
  bullets?: string[];
};

export type CvSection = { title: CvSectionTitle; items: CvItem[] };

export type CvDocument = {
  name: string;
  title: string;
  /** Phone, email and location, in that order. */
  contact: string[];
  links: string[];
  sections: CvSection[];
};

export type CvContent = {
  site: typeof SITE;
  siteUrl: string;
  summary: string;
  roles: typeof ROLES;
  featured: typeof FEATURED;
  moreProjects: typeof MORE_PROJECTS;
  skills: typeof SKILLS;
  certs: typeof CERTS;
  education: typeof EDUCATION;
};

const DEFAULT_CONTENT: CvContent = {
  site: SITE,
  siteUrl: SITE_URL,
  summary: `${COPY.hero.headline} ${COPY.hero.credentialLine.split(INLINE_SEPARATOR).join('. ')}.`,
  roles: ROLES,
  featured: FEATURED,
  moreProjects: MORE_PROJECTS,
  skills: SKILLS,
  certs: CERTS,
  education: EDUCATION,
};

/** 'https://www.linkedin.com/in/x' becomes 'linkedin.com/in/x': shorter, and still parsed as a link. */
function displayUrl(url: string): string {
  return url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
}

function experienceItems(roles: CvContent['roles']): CvItem[] {
  return roles.map((role) => ({
    heading: role.title,
    subheading: role.label ? `${role.org} (${role.label})` : role.org,
    dates: formatMonthRange(role.start, role.end, PRESENT_LABEL),
    bullets: role.points,
  }));
}

function projectItems(featured: CvContent['featured'], more: CvContent['moreProjects']): CvItem[] {
  const featuredItems = featured.map((project) => ({
    heading: project.name,
    subheading: project.tagline,
    text: project.problem,
    bullets: [...project.proof, `${project.stackLabel}: ${project.stack.join(', ')}`],
  }));
  const moreItems = more.map((project) => ({
    heading: project.name,
    text: project.summary,
    bullets: [`${MORE_PROJECTS_TAGS_LABEL}: ${project.tags.join(', ')}`],
  }));
  return [...featuredItems, ...moreItems];
}

function educationItems(education: CvContent['education']): CvItem[] {
  const degree: CvItem = {
    heading: education.degree,
    subheading: education.school,
    dates: `${education.startYear} – ${education.endYear}`,
    text: `Grade: ${education.grade}`,
  };
  const activities = education.activities.map((activity) => ({
    heading: activity.role,
    subheading: activity.group,
    text: activity.result,
  }));
  return [degree, ...activities];
}

export function buildCvDocument(content: CvContent = DEFAULT_CONTENT): CvDocument {
  const { site } = content;
  const sections: Record<CvSectionTitle, CvItem[]> = {
    Summary: [{ text: content.summary }],
    Experience: experienceItems(content.roles),
    Projects: projectItems(content.featured, content.moreProjects),
    Skills: content.skills.map((group) => ({
      text: `${group.name}: ${group.items.join(', ')}`,
    })),
    // A CV lists certifications newest first, whatever order the site shows them in.
    Certifications: [...content.certs]
      .sort((a, b) => b.issued.localeCompare(a.issued))
      .map((cert) => ({
        heading: cert.name,
        subheading: cert.issuer,
        dates: formatMonth(cert.issued),
      })),
    Education: educationItems(content.education),
  };
  return {
    name: site.name,
    title: site.title,
    contact: [site.phone, site.email, `${site.basedIn} (open to ${site.location.toLowerCase()})`],
    links: [content.siteUrl, site.links.linkedin, site.links.github].map(displayUrl),
    sections: CV_SECTION_TITLES.map((title) => ({
      title,
      items: sections[title],
    })),
  };
}

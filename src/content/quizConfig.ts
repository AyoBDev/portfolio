import type { SectionId } from './types';
import type { HiringFocus, ProofPreference } from '../lib/quiz';

/** The page's natural section order, used for everything the quiz does not move. */
export const DEFAULT_SECTION_ORDER: SectionId[] = [
  'hero',
  'olympus-vision',
  'careomni',
  'projects',
  'experience',
  'certifications',
  'skills',
  'writing',
  'testimonials',
  'contact',
];

/** Sections pinned to the ends of the page regardless of the answers. */
export const FIRST_SECTION: SectionId = 'hero';
export const LAST_SECTION: SectionId = 'contact';

/** Sections that best back up each kind of proof, in the order they should appear. */
export const PROOF_PRIORITY: Record<ProofPreference, SectionId[]> = {
  production: ['olympus-vision', 'careomni', 'projects'],
  certs: ['certifications', 'experience'],
  incidents: ['olympus-vision', 'experience'],
  code: ['olympus-vision', 'projects'],
  clients: ['testimonials', 'experience'],
};

/** Which featured project leads when both are shown, based on what the recruiter hires for. */
export const FOCUS_LEAD: Record<HiringFocus, 'olympus-vision' | 'careomni'> = {
  cloud: 'olympus-vision',
  systems: 'olympus-vision',
  platform: 'olympus-vision',
  backend: 'careomni',
};

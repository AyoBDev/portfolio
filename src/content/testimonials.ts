import type { Testimonial } from './types';

// Excerpts are copied word for word from public reviews. Clients are credited by role,
// not name: the agency owner's company must never be named (see the privacy deny-list).
export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'He helped us streamline complex workflows, build automations, and improve systems across payroll, reporting, and internal operations. What I truly appreciate about Ayo is his problem-solving mindset and willingness to dig into complex processes and find practical solutions.',
    credit: 'Owner, home-care agency',
    context: 'Client for several years · Feb 2026',
    source: 'LinkedIn',
  },
  {
    quote:
      "After supplying him with my 'vision' for the product in question, he talked me through how he would deliver it and even suggested additional features that made the product better. … When I made a few last minute suggestions at different stages, Ayo took these onboard without complaint and still delivered everything on time and exceeded expectations.",
    credit: 'Upwork client',
    context: 'No-code MVP · May–Jun 2025',
    source: 'Upwork',
    rating: 5,
  },
  {
    quote:
      'Ayo is super smart and creative in finding solutions. He helped us solve numerous complex scenarios. I can recommend him to anyone trying to create an API integration.',
    credit: 'Upwork client',
    context: 'Make.com and Zapier integrations · 2023–2024',
    source: 'Upwork',
    rating: 5,
  },
];

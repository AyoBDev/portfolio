// Identity and contact details used across the site (head tags, JSON-LD, contact links).
export const SITE = {
  name: 'Ayomikun Ayobami',
  title: 'Systems & Cloud Engineer',
  email: 'ayobamitunmise99@gmail.com',
  /** Shown only on the downloadable CV, not on the page itself. */
  phone: '+234 806 116 9617',
  /** Where the generated CV is served (src/pages/Ayomikun-Ayobami-CV.pdf.ts builds it). */
  cvPath: '/Ayomikun-Ayobami-CV.pdf',
  /** Where you're based, for the CV header. */
  basedIn: 'Nigeria',
  mailSubject: 'Call about a Systems / Cloud Engineer role',
  location: 'Remote',
  links: {
    github: 'https://github.com/AyoBDev',
    linkedin: 'https://www.linkedin.com/in/ayomikun-ayobami',
    upwork: 'https://www.upwork.com/freelancers/~01f037b49074acf50b',
    medium: 'https://medium.com/@ayobamitunmise99',
  },
} as const;

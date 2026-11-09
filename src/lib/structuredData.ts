import type { SITE } from '../config/site';
import type { Certification } from '../content/types';

type SiteIdentity = typeof SITE;

/** schema.org Person markup so search engines connect the role, profiles and credentials. */
export function buildPersonJsonLd(site: SiteIdentity, certs: Certification[], siteUrl: string): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: site.name,
    jobTitle: site.title,
    url: `${siteUrl}/`,
    email: `mailto:${site.email}`,
    sameAs: Object.values(site.links),
    hasCredential: certs.map((cert) => ({
      '@type': 'EducationalOccupationalCredential',
      name: cert.name,
      credentialCategory: 'certification',
      recognizedBy: { '@type': 'Organization', name: cert.issuer },
      ...(cert.verifyUrl ? { url: cert.verifyUrl } : {}),
    })),
  };
}

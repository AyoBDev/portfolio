import { describe, expect, test } from 'vitest';
import { buildPersonJsonLd } from '../../src/lib/structuredData';
import { SITE } from '../../src/config/site';
import type { Certification } from '../../src/content/types';

const CERTS_FIXTURE: Certification[] = [
  { name: 'AWS Certified Solutions Architect – Professional', issuer: 'AWS', issued: '2025-03' },
  { name: 'HCIA-Cloud Service', issuer: 'Huawei', issued: '2024-06', verifyUrl: 'https://example.com/verify/1' },
];

describe('buildPersonJsonLd', () => {
  test('person json-ld names the role, links profiles and lists credentials', () => {
    const ld = buildPersonJsonLd(SITE, CERTS_FIXTURE, 'https://example.pages.dev') as any;
    expect(ld['@type']).toBe('Person');
    expect(ld.name).toBe('Ayomikun Ayobami');
    expect(ld.jobTitle).toBe('Solutions Engineer');
    expect(ld.url).toBe('https://example.pages.dev/');
    expect(ld.sameAs).toEqual(expect.arrayContaining([SITE.links.github, SITE.links.linkedin, SITE.links.upwork, SITE.links.medium]));
    expect(ld.hasCredential.map((c: any) => c.name)).toContain('AWS Certified Solutions Architect – Professional');
  });
});

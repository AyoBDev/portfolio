import { expect, test } from 'vitest';
import { FEATURED, MORE_PROJECTS } from '../../src/content/projects';
import { ROLES, EDUCATION } from '../../src/content/experience';
import { CERTS } from '../../src/content/certifications';
import { ARTICLES } from '../../src/content/articles';
import { SKILLS } from '../../src/content/skills';
import { COPY } from '../../src/content/copy';
import { TESTIMONIALS } from '../../src/content/testimonials';
import { DEFAULT_SECTION_ORDER } from '../../src/content/quizConfig';
import { DENYLIST_SKIP_MESSAGE, findForbiddenTerms, loadDenylist } from '../support/denylist';

test('careomni has no repo link and the private note', () => {
  const c = FEATURED.find((p) => p.id === 'careomni')!;
  expect('url' in c.repo).toBe(false);
  expect(c.repo).toMatchObject({ private: true, note: 'Private repo · walkthrough on request' });
});
test('public repos all point at AyoBDev on GitHub', () => {
  const urls = [
    ...MORE_PROJECTS.map((p) => p.repoUrl),
    ...FEATURED.flatMap((p) => ('url' in p.repo ? [p.repo.url] : [])),
  ];
  expect(urls.length).toBeGreaterThan(0);
  urls.forEach((u) => expect(u).toMatch(/^https:\/\/github\.com\/AyoBDev\//));
});
test('NOC role is labelled Internship, Mar–Aug 2026', () => {
  expect(ROLES.find((r) => r.org.includes('University of Ilorin'))).toMatchObject({
    label: 'Internship',
    start: '2026-03',
    end: '2026-08',
  });
});
test('roles are newest first', () => {
  expect(ROLES.map((r) => r.org.split(' ')[0])).toEqual(['Arthurite', 'University', 'Opsters', 'Upwork']);
});
test('certs match the spec', () => {
  expect(CERTS.map((c) => [c.name, c.issued])).toEqual([
    ['AWS Certified Solutions Architect – Professional', '2025-11'],
    ['AWS Certified Solutions Architect – Associate', '2024-12'],
    ['Huawei HCIA-Datacom', '2025-06'],
  ]);
});
test('four Medium articles, newest first', () => {
  expect(ARTICLES).toHaveLength(4);
  expect(ARTICLES.map((a) => a.date)).toEqual([...ARTICLES.map((a) => a.date)].sort().reverse());
});
test('five skill groups, solutions first, and education', () => {
  expect(SKILLS.map((g) => g.name)).toEqual(['Solutions', 'Cloud', 'IaC & delivery', 'Networking', 'Backend']);
  expect(EDUCATION.grade).toBe('4.39 / 5.0');
});
test('the Arthurite role shows the solutions work from the resume', () => {
  const arthurite = ROLES.find((r) => r.org === 'Arthurite Integrated')!.points.join(' ');
  for (const fact of ['running-cost estimates', 'technical specifications', 'Powering Mobility & EV Ecosystems', 'eSwap OS', 'EV cost comparator'])
    expect(arthurite).toContain(fact);
  expect(FEATURED.find((p) => p.id === 'olympus-vision')!.proof.join(' ')).toContain('ONE WITH AI');
});
test('the NOC internship lists its networking work, monitored with SolarWinds', () => {
  const noc = ROLES.find((r) => r.label === 'Internship')!;
  expect(noc.points.length).toBeGreaterThanOrEqual(6);
  expect(noc.points.join(' ')).toContain('SolarWinds');
  expect(noc.points.join(' ')).toContain('50,000');
  expect(noc.points.join(' ')).toContain('Ubiquiti');
  expect(SKILLS.find((g) => g.name === 'Networking')!.items).toEqual(expect.arrayContaining(['SolarWinds', 'VLANs']));
});
test('education lists the university leadership roles', () => {
  expect(EDUCATION.activities.map((a) => a.group)).toEqual(['NATECSS student association', 'Huawei Student Club']);
  for (const activity of EDUCATION.activities) expect(activity.result.length).toBeGreaterThan(0);
});
test('copy has a band line per section and a pitch per answer', () => {
  expect(Object.keys(COPY.bands).sort()).toEqual([...DEFAULT_SECTION_ORDER].sort());
  expect(Object.keys(COPY.pitch.focus)).toHaveLength(5);
  expect(Object.keys(COPY.pitch.proof)).toHaveLength(5);
  expect(Object.keys(COPY.quiz.proof.options)).toHaveLength(5);
  expect(Object.keys(COPY.diagram)).toHaveLength(8);
  expect(COPY.incident.options.filter((o) => o.correct)).toHaveLength(1);
});
test('copy contains no placeholder or forbidden text', () => {
  const all = JSON.stringify({ COPY, FEATURED, MORE_PROJECTS, ROLES, ARTICLES, SKILLS, EDUCATION, TESTIMONIALS });
  expect(all).not.toMatch(/TODO|lorem|TBD/i);
  expect(all).not.toContain('—');
});

const denylist = loadDenylist();
test.skipIf(denylist.length === 0)('content contains no deny-listed terms', () => {
  const all = JSON.stringify({ COPY, FEATURED, MORE_PROJECTS, ROLES, ARTICLES, SKILLS, EDUCATION, TESTIMONIALS });
  expect(findForbiddenTerms(all, denylist)).toEqual([]);
});
if (denylist.length === 0) console.warn(DENYLIST_SKIP_MESSAGE);

// Olympus Vision was a team build; Ayomikun was its backend and cloud engineer.
test('Olympus Vision is never described as a solo build', () => {
  const olympus = FEATURED.find((project) => project.id === 'olympus-vision');
  const olympusText = JSON.stringify(olympus);
  expect(olympusText).not.toMatch(/sole|solo/i);
  expect(olympusText).toContain('Backend and cloud engineer');
  expect(COPY.pitch.proof.production).not.toMatch(/sole-builder/i);
});

import { expect, test } from 'vitest';
import { SITE } from '../../src/config/site';
import { ROLES, EDUCATION } from '../../src/content/experience';
import { CERTS } from '../../src/content/certifications';
import { FEATURED } from '../../src/content/projects';
import { buildCvDocument, CV_SECTION_TITLES } from '../../src/lib/cv/buildCvDocument';
import { renderCvPdf } from '../../src/lib/cv/renderCvPdf';
import { formatMonthRange } from '../../src/lib/dates';
import { extractPdfText } from '../support/pdfText';
import { findForbiddenTerms, loadDenylist } from '../support/denylist';

const MAX_PAGES = 2;

test('CV uses the standard ATS section headings, in order', () => {
  expect(buildCvDocument().sections.map((s) => s.title)).toEqual([...CV_SECTION_TITLES]);
  expect(CV_SECTION_TITLES).toEqual([
    'Summary',
    'Experience',
    'Projects',
    'Skills',
    'Certifications',
    'Education',
  ]);
});

test('CV header carries name, title and every contact detail', () => {
  const cv = buildCvDocument();
  expect(cv.name).toBe(SITE.name);
  expect(cv.title).toBe(SITE.title);
  expect(cv.contact).toEqual(expect.arrayContaining([SITE.email, SITE.phone]));
});

test('CV experience comes straight from the site roles, newest first', () => {
  const experience = buildCvDocument().sections.find((s) => s.title === 'Experience')!;
  expect(experience.items.map((i) => i.heading)).toEqual(ROLES.map((r) => r.title));
  expect(experience.items[0].dates).toBe(formatMonthRange(ROLES[0].start, ROLES[0].end, 'Present'));
});

test('rendered PDF reads cleanly as text, in order, within two pages', async () => {
  const { text, pageCount } = await extractPdfText(await renderCvPdf(buildCvDocument()));
  expect(pageCount).toBeLessThanOrEqual(MAX_PAGES);
  const mustAppearInOrder = [
    SITE.name,
    SITE.email,
    'Summary',
    'Experience',
    ROLES[0].title,
    formatMonthRange(ROLES[0].start, ROLES[0].end, 'Present'),
    'Projects',
    FEATURED[0].name,
    'Skills',
    'Certifications',
    CERTS[0].name,
    'Education',
    EDUCATION.school,
    EDUCATION.activities[0].role,
  ];
  let cursor = 0;
  for (const expected of mustAppearInOrder) {
    const found = text.indexOf(expected, cursor);
    expect(found, `"${expected}" missing or out of order`).toBeGreaterThanOrEqual(0);
    cursor = found + expected.length;
  }
  expect(text).toContain(SITE.phone);
});

test('rendered PDF never names a deny-listed client', async (context) => {
  const terms = loadDenylist();
  if (terms.length === 0) context.skip();
  const { text } = await extractPdfText(await renderCvPdf(buildCvDocument()));
  expect(findForbiddenTerms(text, terms)).toEqual([]);
});

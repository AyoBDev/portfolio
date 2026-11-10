import { expect, test } from 'vitest';
import { COPY } from '../../src/content/copy';
import { DEFAULT_SECTION_ORDER } from '../../src/content/quizConfig';
import {
  answersToQuery,
  buildPitch,
  matchedSections,
  orderSections,
  parseAnswers,
  type HiringFocus,
  type ProofPreference,
} from '../../src/lib/quiz';

const FOCUSES: HiringFocus[] = ['cloud', 'systems', 'platform', 'backend'];
const PROOFS: ProofPreference[] = ['production', 'certs', 'incidents', 'code', 'clients'];

test('incidents for cloud leads with Olympus then experience', () => {
  expect(orderSections({ focus: 'cloud', proof: 'incidents' })).toEqual(
    ['hero','olympus-vision','experience','careomni','projects','certifications','skills','writing','testimonials','contact']);
});
test('clients puts the testimonials straight after the hero, then experience', () => {
  expect(orderSections({ focus: 'platform', proof: 'clients' }).slice(0, 3)).toEqual(['hero', 'testimonials', 'experience']);
  expect(parseAnswers('?for=platform&proof=clients')).toEqual({ focus: 'platform', proof: 'clients' });
});
test('backend + production puts CareOmni before Olympus', () => {
  expect(orderSections({ focus: 'backend', proof: 'production' }).slice(1, 4)).toEqual(['careomni','olympus-vision','projects']);
});
test('every answer pair keeps every section exactly once, hero first, contact last', () => {
  for (const focus of FOCUSES)
    for (const proof of PROOFS) {
      const o = orderSections({ focus, proof });
      expect(new Set(o).size).toBe(DEFAULT_SECTION_ORDER.length); expect(o).toHaveLength(DEFAULT_SECTION_ORDER.length);
      expect(o[0]).toBe('hero'); expect(o.at(-1)).toBe('contact');
    }
});
test('parseAnswers rejects junk and partial input', () => {
  expect(parseAnswers('?for=banana&proof=code')).toBeNull();
  expect(parseAnswers('?proof=')).toBeNull();
  expect(parseAnswers('')).toBeNull();
  expect(parseAnswers('?for=constructor&proof=code')).toBeNull();
  expect(parseAnswers('?for=systems&proof=certs')).toEqual({ focus: 'systems', proof: 'certs' });
  expect(parseAnswers('for=systems&proof=certs')).toEqual({ focus: 'systems', proof: 'certs' });
});
test('answersToQuery round-trips', () => {
  const a = { focus: 'platform', proof: 'code' } as const;
  expect(answersToQuery(a)).toBe('?for=platform&proof=code');
  expect(parseAnswers(answersToQuery(a))).toEqual(a);
});
test('pitch is built from copy, non-empty for every pair', () => {
  expect(buildPitch({ focus: 'cloud', proof: 'certs' })).toBe(`${COPY.pitch.focus.cloud} ${COPY.pitch.proof.certs}`);
  for (const focus of FOCUSES) for (const proof of PROOFS)
    expect(buildPitch({ focus, proof }).length).toBeGreaterThan(0);
});
test('matchedSections is the proof priority list', () => {
  expect(matchedSections({ focus: 'cloud', proof: 'certs' })).toEqual(['certifications', 'experience']);
});
test('COPY.pitch keys match the quiz answer types', () => {
  expect(Object.keys(COPY.pitch.focus).sort()).toEqual([...FOCUSES].sort());
  expect(Object.keys(COPY.pitch.proof).sort()).toEqual([...PROOFS].sort());
});

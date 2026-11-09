import { expect, test } from 'vitest';
import { formatMonth, formatMonthRange, formatDay } from '../../src/lib/dates';

test('formatMonth turns YYYY-MM into a short month and year', () => {
  expect(formatMonth('2025-03')).toBe('Mar 2025');
  expect(formatMonth('2024-12')).toBe('Dec 2024');
});
test('formatMonthRange joins with an en dash and keeps the present label', () => {
  expect(formatMonthRange('2025-03', 'present', 'Present')).toBe('Mar 2025 – Present');
  expect(formatMonthRange('2026-03', '2026-08', 'Present')).toBe('Mar 2026 – Aug 2026');
});
test('formatDay turns YYYY-MM-DD into day, short month and year', () => {
  expect(formatDay('2026-11-09')).toBe('9 Nov 2026');
});

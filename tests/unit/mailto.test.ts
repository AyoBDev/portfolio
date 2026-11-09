import { expect, test } from 'vitest';
import { buildMailtoUrl } from '../../src/lib/mailto';

test('mailto encodes subject', () => {
  expect(buildMailtoUrl('ayobamitunmise99@gmail.com', 'Call about a Systems / Cloud Engineer role')).toBe(
    'mailto:ayobamitunmise99@gmail.com?subject=Call%20about%20a%20Systems%20%2F%20Cloud%20Engineer%20role',
  );
});
test('mailto adds an encoded body when given', () => {
  expect(buildMailtoUrl('jane.doe@example.com', 'Hi', 'Line one & two')).toBe(
    'mailto:jane.doe@example.com?subject=Hi&body=Line%20one%20%26%20two',
  );
});

import { readFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';
import { DENYLIST_SKIP_MESSAGE, findForbiddenTerms, loadDenylist } from '../support/denylist';

const BUILT_HOME_PAGE = 'dist/index.html';
const denylist = loadDenylist();

test('built page contains no deny-listed terms', () => {
  test.skip(denylist.length === 0, DENYLIST_SKIP_MESSAGE);
  const html = readFileSync(BUILT_HOME_PAGE, 'utf8');
  expect(findForbiddenTerms(html, denylist)).toEqual([]);
});

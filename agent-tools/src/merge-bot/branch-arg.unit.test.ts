import { describe, expect, it } from 'vitest';

import { isUrlSafeBranchName } from './branch-arg.js';

/**
 * The URL-safety policy `merge-bot retire` and `merge-bot pull-request open`
 * lay over git's ref grammar: which branch names may travel in a URL path or
 * query as they are. Pure.
 */

describe('isUrlSafeBranchName', () => {
  it.each(['feat/branch-retire', 'coordination/2026-09-28-87689e', 'docs/a_b.c'])(
    'admits a name this estate cuts: %s',
    (name) => {
      expect(isUrlSafeBranchName(name)).toBe(true);
    },
  );

  it.each(['issue#12', '%2e%2e/tags/v1', 'a b', 'naïve', ''])(
    'refuses a name a URL or a ref path would read as something else: %s',
    (name) => {
      expect(isUrlSafeBranchName(name)).toBe(false);
    },
  );
});

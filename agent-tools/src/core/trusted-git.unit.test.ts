import { describe, expect, it } from 'vitest';

import { TRUSTED_GIT_PATH, trustedGitEnv } from './trusted-git.js';

describe('trustedGitEnv', () => {
  it('pins PATH to the trusted system directories, preserving other vars', () => {
    expect(trustedGitEnv({ PATH: '/opt/homebrew/bin:/usr/bin', HOME: '/home/u' })).toEqual({
      PATH: TRUSTED_GIT_PATH,
      HOME: '/home/u',
    });
  });

  it('sets PATH even when the base env has none', () => {
    expect(trustedGitEnv({}).PATH).toBe(TRUSTED_GIT_PATH);
  });
});

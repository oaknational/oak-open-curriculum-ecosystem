import { describe, expect, it } from 'vitest';

import { resolveGitSha } from '../src/git-sha.js';

describe('resolveGitSha', () => {
  it('prefers GIT_SHA_OVERRIDE', () => {
    const result = resolveGitSha({
      GIT_SHA_OVERRIDE: '3ad6f452abc123def4567890abc123def4567890',
      VERCEL_GIT_COMMIT_SHA: 'c8b666485ecb08b5dc27e428737b4077c0531f57',
    });

    expect(result).toEqual({
      ok: true,
      value: {
        value: '3ad6f452abc123def4567890abc123def4567890',
        source: 'GIT_SHA_OVERRIDE',
      },
    });
  });

  it('uses VERCEL_GIT_COMMIT_SHA when no override is present', () => {
    const result = resolveGitSha({
      VERCEL_GIT_COMMIT_SHA: 'c8b666485ecb08b5dc27e428737b4077c0531f57',
    });

    expect(result).toEqual({
      ok: true,
      value: {
        value: 'c8b666485ecb08b5dc27e428737b4077c0531f57',
        source: 'VERCEL_GIT_COMMIT_SHA',
      },
    });
  });

  it('returns undefined when no git metadata is present', () => {
    const result = resolveGitSha({});

    expect(result).toEqual({
      ok: true,
      value: undefined,
    });
  });
});

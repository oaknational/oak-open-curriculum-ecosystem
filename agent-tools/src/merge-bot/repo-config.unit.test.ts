import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { defaultPrivateKeyPath, loadMergeBotRepoConfig } from './repo-config.js';

const VALID = JSON.stringify({
  appSlug: 'jimbot-oakington-iii',
  appId: '4352989',
  repo: 'oaknational/oak-open-curriculum-ecosystem',
});

describe('loadMergeBotRepoConfig', () => {
  it('reads and validates .github/merge-bot.json under the repo root', () => {
    const paths: string[] = [];
    const result = loadMergeBotRepoConfig({
      repoRoot: '/repo',
      readFileImpl: (filePath) => {
        paths.push(filePath);
        return VALID;
      },
    });
    expect(result).toEqual({
      ok: true,
      value: {
        appSlug: 'jimbot-oakington-iii',
        appId: '4352989',
        repo: 'oaknational/oak-open-curriculum-ecosystem',
      },
    });
    // The product reads a host-joined path; the expectation derives the same
    // host form so the assertion holds on every platform.
    expect(paths).toEqual([join('/repo', '.github', 'merge-bot.json')]);
  });

  it('rejects unknown keys, malformed slugs, and non-numeric ids (strict boundary)', () => {
    for (const bad of [
      { ...JSON.parse(VALID), extra: true },
      { ...JSON.parse(VALID), appSlug: 'Not A Slug' },
      { ...JSON.parse(VALID), appId: 'abc' },
      { ...JSON.parse(VALID), repo: 'no-slash' },
    ]) {
      const result = loadMergeBotRepoConfig({
        repoRoot: '/repo',
        readFileImpl: () => JSON.stringify(bad),
      });
      expect(result.ok).toBe(false);
    }
  });

  it('names the config path when unreadable and rejects invalid JSON', () => {
    const missing = loadMergeBotRepoConfig({
      repoRoot: '/repo',
      readFileImpl: () => {
        throw new Error('ENOENT');
      },
    });
    expect(missing.ok).toBe(false);
    if (!missing.ok) {
      expect(missing.error.message).toContain(join('.github', 'merge-bot.json'));
    }

    const invalid = loadMergeBotRepoConfig({ repoRoot: '/repo', readFileImpl: () => '{nope' });
    expect(invalid.ok).toBe(false);
  });
});

describe('defaultPrivateKeyPath', () => {
  it('derives ~/.config/<appSlug>/private-key.pem', () => {
    expect(defaultPrivateKeyPath({ home: '/test-home', appSlug: 'jimbot-oakington-iii' })).toBe(
      join('/test-home', '.config', 'jimbot-oakington-iii', 'private-key.pem'),
    );
  });
});

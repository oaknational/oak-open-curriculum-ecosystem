import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { defaultPrivateKeyPath, loadMergeBotRepoConfig } from './repo-config.js';

const VALID = JSON.stringify({
  appSlug: 'jimbot-oakington-iii',
  appId: '4352989',
  repo: 'acme/widgets',
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
        repo: 'acme/widgets',
      },
    });
    // The product reads a host-joined path; the expectation derives the same
    // host form so the assertion holds on every platform.
    expect(paths).toEqual([join('/repo', '.github', 'merge-bot.json')]);
  });

  it('reads the labels the clone states for the pull requests its bot opens', () => {
    const result = loadMergeBotRepoConfig({
      repoRoot: '/repo',
      readFileImpl: () => JSON.stringify({ ...JSON.parse(VALID), pullRequestLabels: ['fleet'] }),
    });

    expect(result).toMatchObject({ ok: true, value: { pullRequestLabels: ['fleet'] } });
  });

  it('reads the authors whose open pull requests the clone counts as its lanes', () => {
    const result = loadMergeBotRepoConfig({
      repoRoot: '/repo',
      readFileImpl: () =>
        JSON.stringify({ ...JSON.parse(VALID), laneAuthors: ['hubot[bot]', 'ada'] }),
    });

    expect(result).toMatchObject({ ok: true, value: { laneAuthors: ['hubot[bot]', 'ada'] } });
  });

  it('rejects unknown keys, malformed slugs, and non-numeric ids (strict boundary)', () => {
    for (const bad of [
      { ...JSON.parse(VALID), extra: true },
      // An empty list would count nobody, which is a limit that limits nothing.
      { ...JSON.parse(VALID), laneAuthors: [] },
      { ...JSON.parse(VALID), laneAuthors: [' '] },
      { ...JSON.parse(VALID), laneAuthors: 'ada' },
      { ...JSON.parse(VALID), pullRequestLabels: 'fleet' },
      { ...JSON.parse(VALID), pullRequestLabels: [' '] },
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

  it('names the config path and the template to copy when unreadable, and rejects invalid JSON', () => {
    const missing = loadMergeBotRepoConfig({
      repoRoot: '/repo',
      readFileImpl: () => {
        throw new Error('ENOENT');
      },
    });
    expect(missing.ok).toBe(false);
    if (!missing.ok) {
      expect(missing.error.message).toContain(join('.github', 'merge-bot.json'));
      expect(missing.error.message).toContain(join('.github', 'merge-bot.json.example'));
      expect(missing.error.message).toContain('ENOENT');
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

import { describe, expect, it } from 'vitest';

import {
  compareSemanticVersions,
  parseSemanticVersion,
  runVercelIgnoreCommand,
} from './vercel-ignore-production-non-release-build.mjs';

const noopWriter = {
  write() {
    // Intentionally discarded in tests that only care about the return value.
  },
};

describe('parseSemanticVersion', () => {
  it('parses stable semantic versions', () => {
    expect(parseSemanticVersion('1.5.0')).toStrictEqual({
      major: 1,
      minor: 5,
      patch: 0,
      prerelease: [],
    });
  });

  it('parses prerelease identifiers', () => {
    expect(parseSemanticVersion('2.0.0-rc.1')).toStrictEqual({
      major: 2,
      minor: 0,
      patch: 0,
      prerelease: ['rc', '1'],
    });
  });

  it('returns undefined for invalid versions', () => {
    expect(parseSemanticVersion('development')).toBeUndefined();
  });
});

describe('compareSemanticVersions', () => {
  it('orders release versions numerically', () => {
    expect(compareSemanticVersions('1.6.0', '1.5.9')).toBeGreaterThan(0);
    expect(compareSemanticVersions('1.5.0', '1.5.0')).toBe(0);
    expect(compareSemanticVersions('1.4.9', '1.5.0')).toBeLessThan(0);
  });

  it('treats stable releases as greater than prereleases', () => {
    expect(compareSemanticVersions('1.5.0', '1.5.0-rc.1')).toBeGreaterThan(0);
  });
});

describe('runVercelIgnoreCommand', () => {
  const repositoryRoot = '/repo';
  const rootPackageJsonPath = '/repo/package.json';

  function createReadFile(currentVersion = '1.5.0') {
    return (filePath) => {
      if (filePath !== rootPackageJsonPath) {
        throw new Error(`Unexpected file path: ${filePath}`);
      }

      return JSON.stringify({ version: currentVersion });
    };
  }

  it('continues preview builds without consulting git', () => {
    const stdout = [];

    const result = runVercelIgnoreCommand({
      repositoryRoot,
      env: { VERCEL_ENV: 'preview' },
      stdout: { write: (text) => stdout.push(text) },
      stderr: noopWriter,
      readFile: createReadFile(),
      executeGitCommand: () => {
        throw new Error('git should not be called outside production');
      },
    });

    expect(result).toStrictEqual({ exitCode: 1 });
    expect(stdout.join('')).toContain('outside production');
  });

  it('continues the first production deployment when no previous sha is available', () => {
    const stdout = [];

    const result = runVercelIgnoreCommand({
      repositoryRoot,
      env: { VERCEL_ENV: 'production' },
      stdout: { write: (text) => stdout.push(text) },
      stderr: noopWriter,
      readFile: createReadFile('1.5.0'),
      executeGitCommand: () => {
        throw new Error('git should not be called without a previous sha');
      },
    });

    expect(result).toStrictEqual({ exitCode: 1 });
    expect(stdout.join('')).toContain('No VERCEL_GIT_PREVIOUS_SHA');
  });

  it('cancels production builds when the version did not advance', () => {
    const stdout = [];

    const result = runVercelIgnoreCommand({
      repositoryRoot,
      env: {
        VERCEL_ENV: 'production',
        VERCEL_GIT_PREVIOUS_SHA: 'abc1234',
      },
      stdout: { write: (text) => stdout.push(text) },
      stderr: noopWriter,
      readFile: createReadFile('1.5.0'),
      executeGitCommand: (args) => {
        expect(args).toStrictEqual(['show', 'abc1234:package.json']);
        return JSON.stringify({ version: '1.5.0' });
      },
    });

    expect(result).toStrictEqual({ exitCode: 0 });
    expect(stdout.join('')).toContain('Cancelling production build');
  });

  it('cancels production builds when the version regresses', () => {
    const stdout = [];

    const result = runVercelIgnoreCommand({
      repositoryRoot,
      env: {
        VERCEL_ENV: 'production',
        VERCEL_GIT_PREVIOUS_SHA: 'abc1234',
      },
      stdout: { write: (text) => stdout.push(text) },
      stderr: noopWriter,
      readFile: createReadFile('1.4.9'),
      executeGitCommand: () => JSON.stringify({ version: '1.5.0' }),
    });

    expect(result).toStrictEqual({ exitCode: 0 });
    expect(stdout.join('')).toContain('did not advance');
  });

  it('continues production builds when the version advances', () => {
    const stdout = [];

    const result = runVercelIgnoreCommand({
      repositoryRoot,
      env: {
        VERCEL_ENV: 'production',
        VERCEL_GIT_PREVIOUS_SHA: 'abc1234',
      },
      stdout: { write: (text) => stdout.push(text) },
      stderr: noopWriter,
      readFile: createReadFile('1.6.0'),
      executeGitCommand: () => JSON.stringify({ version: '1.5.0' }),
    });

    expect(result).toStrictEqual({ exitCode: 1 });
    expect(stdout.join('')).toContain('advanced from 1.5.0 to 1.6.0');
  });

  it('fetches the previous sha when the shallow clone does not contain it', () => {
    const gitCalls = [];

    const result = runVercelIgnoreCommand({
      repositoryRoot,
      env: {
        VERCEL_ENV: 'production',
        VERCEL_GIT_PREVIOUS_SHA: 'abc1234',
      },
      stdout: noopWriter,
      stderr: noopWriter,
      readFile: createReadFile('1.6.0'),
      executeGitCommand: (args) => {
        gitCalls.push([...args]);

        if (gitCalls.length === 1) {
          throw new Error('fatal: bad object');
        }

        if (gitCalls.length === 2) {
          expect(args).toStrictEqual(['fetch', '--depth=1', 'origin', 'abc1234']);
          return '';
        }

        expect(args).toStrictEqual(['show', 'abc1234:package.json']);
        return JSON.stringify({ version: '1.5.0' });
      },
    });

    expect(result).toStrictEqual({ exitCode: 1 });
    expect(gitCalls).toStrictEqual([
      ['show', 'abc1234:package.json'],
      ['fetch', '--depth=1', 'origin', 'abc1234'],
      ['show', 'abc1234:package.json'],
    ]);
  });

  it('continues the build when the previous deployed version cannot be resolved', () => {
    const stderr = [];

    const result = runVercelIgnoreCommand({
      repositoryRoot,
      env: {
        VERCEL_ENV: 'production',
        VERCEL_GIT_PREVIOUS_SHA: 'abc1234',
      },
      stdout: noopWriter,
      stderr: { write: (text) => stderr.push(text) },
      readFile: createReadFile('1.6.0'),
      executeGitCommand: () => {
        throw new Error('fatal: could not read from remote repository');
      },
    });

    expect(result).toStrictEqual({ exitCode: 1 });
    expect(stderr.join('')).toContain(
      'Could not resolve the previous deployed root package version',
    );
  });
});

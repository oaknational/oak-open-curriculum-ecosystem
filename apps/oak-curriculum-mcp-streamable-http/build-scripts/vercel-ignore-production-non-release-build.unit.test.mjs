import { describe, expect, it } from 'vitest';

import { runVercelIgnoreCommand } from './vercel-ignore-production-non-release-build.mjs';

/**
 * Tests mirror the truth table in ADR-163 §10 (second amendment,
 * 2026-04-24). Each `it` covers one table row; the fetch-fallback
 * `it` preserves the shallow-git-history recovery proof documented
 * in plan §3.3 item 4.
 */

const REPOSITORY_ROOT = '/repo';
const ROOT_PACKAGE_JSON_PATH = '/repo/package.json';

function captureWriter() {
  const chunks = [];
  return {
    write(text) {
      chunks.push(text);
    },
    text: () => chunks.join(''),
  };
}

function packageReadFile(current) {
  return (filePath, encoding) => {
    if (filePath !== ROOT_PACKAGE_JSON_PATH) {
      throw new Error(`Unexpected file path: ${filePath}`);
    }
    if (encoding !== 'utf8') {
      throw new Error(`Unexpected encoding: ${encoding}`);
    }
    if (current === 'MISSING_FILE') {
      throw new Error('ENOENT: no such file');
    }
    if (current === 'INVALID_JSON') {
      return '{ not-json';
    }
    if (current === 'MISSING_VERSION') {
      return JSON.stringify({});
    }
    return JSON.stringify({ version: current });
  };
}

function queuedGitCommand(...outcomes) {
  const queue = [...outcomes];
  const calls = [];
  const fn = (args, cwd) => {
    calls.push({ args: [...args], cwd });
    const outcome = queue.shift();
    if (!outcome) {
      throw new Error('executeGitCommand called with no remaining outcomes');
    }
    if (outcome.kind === 'throw') {
      throw new Error(outcome.message);
    }
    return outcome.text;
  };
  fn.calls = calls;
  return fn;
}

describe('runVercelIgnoreCommand — ADR-163 §10 truth table', () => {
  it('row 1: branch !== main → continues without consulting git or the file system', () => {
    const stdout = captureWriter();
    const stderr = captureWriter();
    const readFile = () => {
      throw new Error('readFile should not be called when branch is not main');
    };
    const executeGitCommand = () => {
      throw new Error('executeGitCommand should not be called when branch is not main');
    };

    const result = runVercelIgnoreCommand({
      repositoryRoot: REPOSITORY_ROOT,
      env: {
        VERCEL_GIT_COMMIT_REF: 'feat/otel_sentry_enhancements',
        VERCEL_GIT_PREVIOUS_SHA: 'abc1234',
      },
      stdout,
      stderr,
      readFile,
      executeGitCommand,
    });

    expect(result).toStrictEqual({ exitCode: 1 });
    expect(stdout.text()).toContain('not main');
    expect(stderr.text()).toBe('');
  });

  it('row 2: main, current resolvable, previous unresolvable (sha unset) → continues (first build)', () => {
    const stdout = captureWriter();
    const stderr = captureWriter();
    const executeGitCommand = queuedGitCommand();

    const result = runVercelIgnoreCommand({
      repositoryRoot: REPOSITORY_ROOT,
      env: {
        VERCEL_GIT_COMMIT_REF: 'main',
      },
      stdout,
      stderr,
      readFile: packageReadFile('1.5.0'),
      executeGitCommand,
    });

    expect(result).toStrictEqual({ exitCode: 1 });
    expect(stdout.text()).toContain('Continuing production build');
    expect(stdout.text()).toContain('current=1.5.0');
    expect(stdout.text()).toContain('previous=unknown (treating as first build)');
    expect(executeGitCommand.calls).toStrictEqual([]);
    expect(stderr.text()).toBe('');
  });

  it('row 3: main, current === previous → CANCELS (version did not advance)', () => {
    const stdout = captureWriter();
    const stderr = captureWriter();
    const executeGitCommand = queuedGitCommand({
      kind: 'return',
      text: JSON.stringify({ version: '1.5.0' }),
    });

    const result = runVercelIgnoreCommand({
      repositoryRoot: REPOSITORY_ROOT,
      env: {
        VERCEL_GIT_COMMIT_REF: 'main',
        VERCEL_GIT_PREVIOUS_SHA: 'abc1234',
      },
      stdout,
      stderr,
      readFile: packageReadFile('1.5.0'),
      executeGitCommand,
    });

    expect(result).toStrictEqual({ exitCode: 0 });
    expect(stdout.text()).toContain('Cancelling production build');
    expect(stdout.text()).toContain('1.5.0 did not advance beyond previous deployed version 1.5.0');
    expect(executeGitCommand.calls).toStrictEqual([
      { args: ['show', 'abc1234:package.json'], cwd: REPOSITORY_ROOT },
    ]);
    expect(stderr.text()).toBe('');
  });

  it('row 3 variant: main, current < previous (regression) → CANCELS', () => {
    const stdout = captureWriter();
    const stderr = captureWriter();
    const executeGitCommand = queuedGitCommand({
      kind: 'return',
      text: JSON.stringify({ version: '1.5.0' }),
    });

    const result = runVercelIgnoreCommand({
      repositoryRoot: REPOSITORY_ROOT,
      env: {
        VERCEL_GIT_COMMIT_REF: 'main',
        VERCEL_GIT_PREVIOUS_SHA: 'abc1234',
      },
      stdout,
      stderr,
      readFile: packageReadFile('1.4.9'),
      executeGitCommand,
    });

    expect(result).toStrictEqual({ exitCode: 0 });
    expect(stdout.text()).toContain('Cancelling production build');
    expect(stdout.text()).toContain('1.4.9 did not advance beyond previous deployed version 1.5.0');
    expect(stderr.text()).toBe('');
  });

  it('row 4: main, current > previous → continues (semantic-release advanced the version)', () => {
    const stdout = captureWriter();
    const stderr = captureWriter();
    const executeGitCommand = queuedGitCommand({
      kind: 'return',
      text: JSON.stringify({ version: '1.5.0' }),
    });

    const result = runVercelIgnoreCommand({
      repositoryRoot: REPOSITORY_ROOT,
      env: {
        VERCEL_GIT_COMMIT_REF: 'main',
        VERCEL_GIT_PREVIOUS_SHA: 'abc1234',
      },
      stdout,
      stderr,
      readFile: packageReadFile('1.6.0'),
      executeGitCommand,
    });

    expect(result).toStrictEqual({ exitCode: 1 });
    expect(stdout.text()).toContain('Continuing production build');
    expect(stdout.text()).toContain('current=1.6.0');
    expect(stdout.text()).toContain('previous=1.5.0');
    expect(stderr.text()).toBe('');
  });

  it('row 5: main, current unresolvable → CANCELS with stderr diagnostic', () => {
    const stdout = captureWriter();
    const stderr = captureWriter();
    const executeGitCommand = () => {
      throw new Error('executeGitCommand should not be called when current is unresolvable');
    };

    const result = runVercelIgnoreCommand({
      repositoryRoot: REPOSITORY_ROOT,
      env: {
        VERCEL_GIT_COMMIT_REF: 'main',
        VERCEL_GIT_PREVIOUS_SHA: 'abc1234',
      },
      stdout,
      stderr,
      readFile: packageReadFile('MISSING_VERSION'),
      executeGitCommand,
    });

    expect(result).toStrictEqual({ exitCode: 0 });
    expect(stderr.text()).toContain(
      'The current app version could not be determined from the root package.json file',
    );
    expect(stderr.text()).toContain('cancelling');
    expect(stdout.text()).toBe('');
  });

  it('row 2 variant: main, previous resolvable-via-fetch-fallback → runs fetch then re-shows, continues when current > previous', () => {
    const stdout = captureWriter();
    const stderr = captureWriter();
    const executeGitCommand = queuedGitCommand(
      { kind: 'throw', message: 'fatal: bad object abc1234' },
      { kind: 'return', text: '' },
      { kind: 'return', text: JSON.stringify({ version: '1.5.0' }) },
    );

    const result = runVercelIgnoreCommand({
      repositoryRoot: REPOSITORY_ROOT,
      env: {
        VERCEL_GIT_COMMIT_REF: 'main',
        VERCEL_GIT_PREVIOUS_SHA: 'abc1234',
      },
      stdout,
      stderr,
      readFile: packageReadFile('1.6.0'),
      executeGitCommand,
    });

    expect(result).toStrictEqual({ exitCode: 1 });
    expect(executeGitCommand.calls).toStrictEqual([
      { args: ['show', 'abc1234:package.json'], cwd: REPOSITORY_ROOT },
      { args: ['fetch', '--depth=1', 'origin', 'abc1234'], cwd: REPOSITORY_ROOT },
      { args: ['show', 'abc1234:package.json'], cwd: REPOSITORY_ROOT },
    ]);
    expect(stdout.text()).toContain('Continuing production build');
    expect(stdout.text()).toContain('current=1.6.0');
    expect(stdout.text()).toContain('previous=1.5.0');
    expect(stderr.text()).toBe('');
  });

  it('row 2 variant: main, previous unresolvable even after fetch-fallback → continues silently (no stderr)', () => {
    const stdout = captureWriter();
    const stderr = captureWriter();
    const executeGitCommand = queuedGitCommand(
      { kind: 'throw', message: 'fatal: bad object abc1234' },
      { kind: 'throw', message: 'fatal: could not read from remote repository' },
    );

    const result = runVercelIgnoreCommand({
      repositoryRoot: REPOSITORY_ROOT,
      env: {
        VERCEL_GIT_COMMIT_REF: 'main',
        VERCEL_GIT_PREVIOUS_SHA: 'abc1234',
      },
      stdout,
      stderr,
      readFile: packageReadFile('1.6.0'),
      executeGitCommand,
    });

    expect(result).toStrictEqual({ exitCode: 1 });
    expect(stdout.text()).toContain('Continuing production build');
    expect(stdout.text()).toContain('previous=unknown (treating as first build)');
    expect(stderr.text()).toBe('');
  });
});

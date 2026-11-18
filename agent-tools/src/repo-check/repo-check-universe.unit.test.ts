import { describe, expect, it } from 'vitest';

import type { RepoCheckCommandResult, RepoCheckRuntime } from './repo-check-types.js';
import { readTrackedTreeResult, stagedFiles } from './repo-check-universe.js';

/**
 * The file universes read from literal git outputs through a fake runtime
 * (tests never use or create IO: `testing-strategy.md` §Philosophy). Every
 * read fails closed: a git failure is the gate's failure, in git's own words,
 * never an empty list.
 */

/** What each git read answers, keyed by the read: the index listing, the working tree diff, the index modes, the staged diff. */
interface GitAnswers {
  readonly tracked?: RepoCheckCommandResult;
  readonly gone?: RepoCheckCommandResult;
  readonly stage?: RepoCheckCommandResult;
  readonly staged?: RepoCheckCommandResult;
}

const ok = (stdout: string): RepoCheckCommandResult => ({
  status: 0,
  signal: null,
  stdout,
  stderr: '',
});

const failed = (status: number | null, stderr: string): RepoCheckCommandResult => ({
  status,
  signal: status === null ? 'SIGTERM' : null,
  stdout: '',
  stderr,
});

function readOf(args: readonly string[]): keyof GitAnswers {
  if (args[0] === 'diff-files') {
    return 'gone';
  }
  if (args[0] === 'diff') {
    return 'staged';
  }
  return args[1] === '--cached' ? 'stage' : 'tracked';
}

/** A runtime whose git answers from the fixture; a read the fixture leaves out answers an empty success. */
function gitRuntime(answers: GitAnswers): RepoCheckRuntime {
  return {
    runCaptured: (command, args) => {
      expect(command).toBe('git');
      return answers[readOf(args)] ?? ok('');
    },
    runInherited: () => {
      throw new Error('the universe never spawns an inherited child');
    },
  };
}

describe('readTrackedTreeResult', () => {
  it('reads the tracked files, those gone from the working tree, and the symlinks', () => {
    const result = readTrackedTreeResult(
      gitRuntime({
        tracked: ok('a.md\u0000gone.ts\u0000link\u0000'),
        gone: ok('gone.ts\u0000'),
        stage: ok('100644 aaaa 0\ta.md\u0000100644 bbbb 0\tgone.ts\u0000120000 cccc 0\tlink\u0000'),
      }),
    );

    expect(result).toStrictEqual({
      ok: true,
      value: {
        tracked: ['a.md', 'gone.ts', 'link'],
        goneFromWorkingTree: new Set(['gone.ts']),
        symlinks: new Set(['link']),
      },
    });
  });

  it('reads nothing gone and no symlinks as empty sets', () => {
    const result = readTrackedTreeResult(
      gitRuntime({ tracked: ok('a.md\u0000'), stage: ok('100644 aaaa 0\ta.md\u0000') }),
    );

    expect(result).toStrictEqual({
      ok: true,
      value: { tracked: ['a.md'], goneFromWorkingTree: new Set(), symlinks: new Set() },
    });
  });

  it("fails in git's own words when listing the tracked files fails", () => {
    const result = readTrackedTreeResult(
      gitRuntime({ tracked: failed(128, 'fatal: not a git repository\n') }),
    );

    expect(result).toStrictEqual({ ok: false, error: 'fatal: not a git repository' });
  });

  it('names the read when git fails without a word', () => {
    const result = readTrackedTreeResult(gitRuntime({ tracked: failed(128, '') }));

    expect(result).toStrictEqual({
      ok: false,
      error: 'git ls-files failed while discovering tracked files',
    });
  });

  it('refuses a listing that names no tracked file', () => {
    const result = readTrackedTreeResult(gitRuntime({ tracked: ok('') }));

    expect(result).toStrictEqual({
      ok: false,
      error: 'git listed no tracked file; run the gate from the repository root',
    });
  });

  it('fails when reading the working tree changes fails', () => {
    const result = readTrackedTreeResult(
      gitRuntime({ tracked: ok('a.md\u0000'), gone: failed(129, 'error: unknown option') }),
    );

    expect(result).toStrictEqual({ ok: false, error: 'error: unknown option' });
  });

  it('fails when reading the index modes fails, rather than treating no file as a symlink', () => {
    const result = readTrackedTreeResult(
      gitRuntime({ tracked: ok('a.md\u0000'), stage: failed(null, 'git was killed by SIGTERM') }),
    );

    expect(result).toStrictEqual({ ok: false, error: 'git was killed by SIGTERM' });
  });
});

describe('stagedFiles', () => {
  it('reads the staged files without the symlinks among them', () => {
    const files = stagedFiles(
      gitRuntime({
        staged: ok('a.md\u0000link\u0000b.ts\u0000'),
        stage: ok('100644 aaaa 0\ta.md\u0000120000 cccc 0\tlink\u0000100644 bbbb 0\tb.ts\u0000'),
      }),
    );

    expect(files).toStrictEqual(['a.md', 'b.ts']);
  });

  it('reads nothing staged as no file', () => {
    expect(stagedFiles(gitRuntime({}))).toStrictEqual([]);
  });

  it("throws in git's own words when the staged read fails", () => {
    expect(() => stagedFiles(gitRuntime({ staged: failed(128, 'fatal: bad index\n') }))).toThrow(
      'fatal: bad index',
    );
  });
});

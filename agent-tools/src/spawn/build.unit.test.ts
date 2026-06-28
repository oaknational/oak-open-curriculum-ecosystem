import { err, isErr, isOk, ok } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import { buildWorktree, type PnpmRunner } from './build.js';

const WT = '/workspace/oak-spawn-flow';

interface Call {
  readonly args: readonly string[];
  readonly cwd: string;
}

/** A recording {@link PnpmRunner} fake — the injected seam for these unit tests. */
function recording(): { readonly run: PnpmRunner; readonly calls: Call[] } {
  const calls: Call[] = [];
  const run: PnpmRunner = (args, cwd) => {
    calls.push({ args, cwd });
    return ok(undefined);
  };
  return { run, calls };
}

describe('buildWorktree', () => {
  it('runs pnpm install then pnpm build in the worktree, in that order', () => {
    const { run, calls } = recording();

    const result = buildWorktree({ worktreePath: WT, runPnpm: run });

    expect(isOk(result)).toBe(true);
    expect(calls).toEqual([
      { args: ['install'], cwd: WT },
      { args: ['build'], cwd: WT },
    ]);
  });

  it('returns err naming the path when pnpm install fails, and does not attempt build', () => {
    const calls: Call[] = [];
    const run: PnpmRunner = (args, cwd) => {
      calls.push({ args, cwd });
      return args[0] === 'install' ? err(new Error('install boom')) : ok(undefined);
    };

    const result = buildWorktree({ worktreePath: WT, runPnpm: run });

    expect(isErr(result)).toBe(true);
    if (isErr(result)) {
      expect(result.error.message).toMatch(/install/u);
      expect(result.error.message).toContain(WT);
      expect(result.error.cause).toBeInstanceOf(Error);
    }
    // build must not run once install has failed.
    expect(calls).toEqual([{ args: ['install'], cwd: WT }]);
  });

  it('returns err naming the path when pnpm build fails', () => {
    const run: PnpmRunner = (args) =>
      args[0] === 'build' ? err(new Error('build boom')) : ok(undefined);

    const result = buildWorktree({ worktreePath: WT, runPnpm: run });

    expect(isErr(result)).toBe(true);
    if (isErr(result)) {
      expect(result.error.message).toMatch(/build/u);
      expect(result.error.message).toContain(WT);
    }
  });
});

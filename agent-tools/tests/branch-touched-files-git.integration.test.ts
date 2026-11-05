import { describe, expect, it } from 'vitest';

import { readBranchTouchedFileReport, readGitStdout } from '../src/branch-touched-files/git';
import type { GitCommandExecutor } from '../src/branch-touched-files/git';

describe('branch touched files git boundary', () => {
  it('runs the given git arguments in the inherited environment, returning trimmed stdout', () => {
    const calls: {
      readonly file: string;
      readonly args: readonly string[];
      readonly env: NodeJS.ProcessEnv | undefined;
    }[] = [];
    const execFileSync: GitCommandExecutor = (file, args, options) => {
      calls.push({ file, args, env: options.env });
      return 'abc123\n';
    };

    expect(
      readGitStdout({
        repoRoot: 'repo-root',
        args: ['rev-parse', '--show-toplevel'],
        execFileSync,
      }),
    ).toBe('abc123');
    // The whole call: git by name, in the inherited environment.
    expect(calls).toStrictEqual([
      { file: 'git', args: ['rev-parse', '--show-toplevel'], env: undefined },
    ]);
  });

  it('propagates git command failures', () => {
    const execFileSync: GitCommandExecutor = () => {
      throw new Error('git failed');
    };

    expect(() =>
      readGitStdout({
        repoRoot: 'repo-root',
        args: ['merge-base', 'origin/main', 'HEAD'],
        execFileSync,
      }),
    ).toThrow('git failed');
  });

  it('uses one injected git boundary for merge-base and changed-file commands', () => {
    const calls: { readonly file: string; readonly args: readonly string[] }[] = [];
    const execFileSync: GitCommandExecutor = (file, args) => {
      calls.push({ file, args });
      return calls.length === 1 ? 'abc123\n' : 'b.ts\na.ts\nb.ts\n';
    };

    expect(
      readBranchTouchedFileReport({
        repoRoot: 'repo-root',
        baseRef: 'origin/main',
        headRef: 'HEAD',
        execFileSync,
      }),
    ).toStrictEqual({
      baseRef: 'origin/main',
      headRef: 'HEAD',
      mergeBase: 'abc123',
      files: ['a.ts', 'b.ts'],
      count: 2,
      severity: 'ok',
    });
    expect(calls).toStrictEqual([
      { file: 'git', args: ['merge-base', 'origin/main', 'HEAD'] },
      { file: 'git', args: ['diff', '--name-only', 'abc123..HEAD'] },
    ]);
  });
});

import { describe, expect, it } from 'vitest';

import { readBranchTouchedFileReport, readGitStdout } from '../src/branch-touched-files/git';
import type { GitCommandExecutor } from '../src/branch-touched-files/git';

describe('branch touched files git boundary', () => {
  it('runs git through a trusted PATH boundary', () => {
    const calls: {
      readonly file: string;
      readonly args: readonly string[];
      readonly path: string | undefined;
    }[] = [];
    const execFileSync: GitCommandExecutor = (file, args, options) => {
      calls.push({ file, args, path: options.env?.PATH });
      return 'abc123\n';
    };

    expect(
      readGitStdout({
        repoRoot: 'repo-root',
        args: ['rev-parse', '--show-toplevel'],
        execFileSync,
      }),
    ).toBe('abc123');
    expect(calls).toStrictEqual([
      {
        file: 'git',
        args: ['rev-parse', '--show-toplevel'],
        path: '/usr/bin:/bin',
      },
    ]);
  });

  it('routes an explicit absolute git path through a single-entry trusted PATH', () => {
    const calls: {
      readonly file: string;
      readonly path: string | undefined;
    }[] = [];
    const execFileSync: GitCommandExecutor = (file, _args, options) => {
      calls.push({ file, path: options.env?.PATH });
      return 'abc123\n';
    };

    expect(
      readGitStdout({
        repoRoot: 'repo-root',
        args: ['rev-parse', '--show-toplevel'],
        execFileSync,
        gitPath: '/nix/store/git/bin/git',
      }),
    ).toBe('abc123');
    expect(calls).toStrictEqual([
      {
        file: 'git',
        path: '/nix/store/git/bin',
      },
    ]);
  });

  it('rejects relative git path overrides', () => {
    const execFileSync: GitCommandExecutor = () => 'abc123\n';

    expect(() =>
      readGitStdout({
        repoRoot: 'repo-root',
        args: ['rev-parse', '--show-toplevel'],
        execFileSync,
        gitPath: 'git',
      }),
    ).toThrow('--git requires an absolute path to a git executable');
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
    const calls: (readonly string[])[] = [];
    const execFileSync: GitCommandExecutor = (_file, args) => {
      calls.push(args);
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
      ['merge-base', 'origin/main', 'HEAD'],
      ['diff', '--name-only', 'abc123..HEAD'],
    ]);
  });
});

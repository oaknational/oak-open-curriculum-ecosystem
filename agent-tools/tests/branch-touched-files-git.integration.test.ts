import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { readBranchTouchedFileReport, readGitStdout } from '../src/branch-touched-files/git';
import type { GitCommandExecutor } from '../src/branch-touched-files/git';

describe('branch touched files git boundary', () => {
  it('executes git by its absolute trusted path, not by name via PATH', () => {
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
    expect(calls).toHaveLength(1);
    expect(calls[0]?.args).toStrictEqual(['rev-parse', '--show-toplevel']);
    // The hardening is the absolute binary path itself — not a PATH override.
    expect(path.isAbsolute(calls[0]?.file ?? '')).toBe(true);
    expect(path.basename(calls[0]?.file ?? '')).toBe('git');
    expect(calls[0]?.env).toBeUndefined();
  });

  it('executes an explicit absolute --git override verbatim', () => {
    const calls: {
      readonly file: string;
      readonly env: NodeJS.ProcessEnv | undefined;
    }[] = [];
    const execFileSync: GitCommandExecutor = (file, _args, options) => {
      calls.push({ file, env: options.env });
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
        file: '/nix/store/git/bin/git',
        env: undefined,
      },
    ]);
  });

  it('rejects a --git override that is not named git', () => {
    const execFileSync: GitCommandExecutor = () => 'abc123\n';

    expect(() =>
      readGitStdout({
        repoRoot: 'repo-root',
        args: ['rev-parse', '--show-toplevel'],
        execFileSync,
        gitPath: '/usr/bin/not-git',
      }),
    ).toThrow('--git must point to an executable named git');
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

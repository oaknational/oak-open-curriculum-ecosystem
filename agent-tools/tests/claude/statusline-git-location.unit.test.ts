/**
 * Unit coverage for the pure git-location resolution: fail-loud classification
 * of a git invocation (the one valid empty state kept distinct from an error),
 * worktree counting, and coordination-branch selection.
 *
 * All inputs are explicit literals — no filesystem, no process, no git.
 */
import { describe, expect, it } from 'vitest';

import {
  classifyGitOutcome,
  coordinationToParts,
  countWorktrees,
  parsePrimaryWorktreeRoot,
  selectCoordinationBranch,
} from '../../src/claude/statusline-git-location';

describe('classifyGitOutcome', () => {
  it('returns the trimmed value on a clean exit with output', () => {
    expect(classifyGitOutcome({ status: 0, stdout: '  main\n', stderr: '' })).toEqual({
      kind: 'value',
      value: 'main',
    });
  });

  it('returns empty on a clean exit with no output', () => {
    expect(classifyGitOutcome({ status: 0, stdout: '\n', stderr: '' })).toEqual({ kind: 'empty' });
  });

  it('returns outside-repo when git reports the directory is not a repository', () => {
    expect(
      classifyGitOutcome({
        status: 128,
        stdout: '',
        stderr: 'fatal: not a git repository (or any of the parent directories): .git',
      }),
    ).toEqual({ kind: 'outside-repo' });
  });

  it('surfaces an unexpected non-zero exit as a loud error with the stderr detail', () => {
    expect(
      classifyGitOutcome({
        status: 1,
        stdout: '',
        stderr: 'fatal: ref HEAD is not a symbolic ref',
      }),
    ).toEqual({ kind: 'error', detail: 'fatal: ref HEAD is not a symbolic ref' });
  });

  it('synthesises a detail when a non-zero exit carries no stderr', () => {
    expect(classifyGitOutcome({ status: 129, stdout: '', stderr: '   ' })).toEqual({
      kind: 'error',
      detail: 'git exited 129',
    });
  });

  it('reports a signal kill as an error rather than swallowing it', () => {
    expect(classifyGitOutcome({ status: null, stdout: '', stderr: '' })).toEqual({
      kind: 'error',
      detail: 'git exited on signal',
    });
  });
});

describe('countWorktrees', () => {
  it('counts a single main working tree', () => {
    const porcelain = 'worktree /repo\nHEAD abc\nbranch refs/heads/main\n';
    expect(countWorktrees(porcelain)).toBe(1);
  });

  it('counts the main tree plus linked worktrees', () => {
    const porcelain = [
      'worktree /repo',
      'HEAD aaa',
      'branch refs/heads/coordination/pilot',
      '',
      'worktree /repo-wt-a',
      'HEAD bbb',
      'branch refs/heads/feat/a',
      '',
      'worktree /repo-wt-b',
      'HEAD ccc',
      'branch refs/heads/feat/b',
      '',
    ].join('\n');
    expect(countWorktrees(porcelain)).toBe(3);
  });

  it('does not count a "worktree" substring that is not a record line', () => {
    const porcelain = 'worktree /repo\nbranch refs/heads/worktree-pilot\n';
    expect(countWorktrees(porcelain)).toBe(1);
  });
});

describe('selectCoordinationBranch', () => {
  it('resolves the primary branch and name when both diverge from the working side', () => {
    expect(
      selectCoordinationBranch({
        hasLinkedWorktrees: true,
        primaryBranch: 'coordination/worktree-pilot',
        primaryName: 'oak-open-curriculum-ecosystem',
        workingBranch: 'feat/seat-work',
        workingWorktreeName: 'oak-wt-seat',
      }),
    ).toEqual({
      kind: 'branch',
      branch: 'coordination/worktree-pilot',
      primaryName: 'oak-open-curriculum-ecosystem',
    });
  });

  it('drops the primary name when it equals the working worktree name (no redundant name)', () => {
    expect(
      selectCoordinationBranch({
        hasLinkedWorktrees: true,
        primaryBranch: 'main',
        primaryName: 'oak-open-curriculum-ecosyste-2',
        workingBranch: 'fix/statusline',
        workingWorktreeName: 'oak-open-curriculum-ecosyste-2',
      }),
    ).toEqual({ kind: 'branch', branch: 'main', primaryName: undefined });
  });

  it('keeps the primary name when the working worktree name is unresolved (cannot prove redundancy)', () => {
    expect(
      selectCoordinationBranch({
        hasLinkedWorktrees: true,
        primaryBranch: 'main',
        primaryName: 'oak-open-curriculum-ecosystem',
        workingBranch: 'feat/seat-work',
        workingWorktreeName: undefined,
      }),
    ).toEqual({ kind: 'branch', branch: 'main', primaryName: 'oak-open-curriculum-ecosystem' });
  });

  it('suppresses the coordination branch when it equals the working branch (no redundant line)', () => {
    expect(
      selectCoordinationBranch({
        hasLinkedWorktrees: true,
        primaryBranch: 'main',
        primaryName: 'oak-open-curriculum-ecosystem',
        workingBranch: 'main',
        workingWorktreeName: 'oak-wt-seat',
      }),
    ).toEqual({ kind: 'matches-working' });
  });

  it('still resolves the branch when the working branch is unresolved (cannot prove redundancy)', () => {
    expect(
      selectCoordinationBranch({
        hasLinkedWorktrees: true,
        primaryBranch: 'main',
        primaryName: 'oak-open-curriculum-ecosystem',
        workingBranch: undefined,
        workingWorktreeName: 'oak-wt-seat',
      }),
    ).toEqual({ kind: 'branch', branch: 'main', primaryName: 'oak-open-curriculum-ecosystem' });
  });

  it("shows the coordination branch for a detached-HEAD seat (a short SHA won't match a descriptive branch name like 'main')", () => {
    expect(
      selectCoordinationBranch({
        hasLinkedWorktrees: true,
        primaryBranch: 'main',
        primaryName: 'oak-open-curriculum-ecosystem',
        workingBranch: 'e2796757c',
        workingWorktreeName: 'oak-wt-seat',
      }),
    ).toEqual({ kind: 'branch', branch: 'main', primaryName: 'oak-open-curriculum-ecosystem' });
  });

  it('resolves to none — a valid empty state — in a solo checkout', () => {
    expect(
      selectCoordinationBranch({
        hasLinkedWorktrees: false,
        primaryBranch: 'main',
        primaryName: 'oak-open-curriculum-ecosystem',
        workingBranch: 'main',
        workingWorktreeName: undefined,
      }),
    ).toEqual({ kind: 'none' });
  });

  it('fails loud when a team has linked worktrees but no resolvable coordination branch', () => {
    expect(
      selectCoordinationBranch({
        hasLinkedWorktrees: true,
        primaryBranch: undefined,
        primaryName: 'oak-open-curriculum-ecosystem',
        workingBranch: 'feat/seat-work',
        workingWorktreeName: 'oak-wt-seat',
      }),
    ).toEqual({
      kind: 'error',
      detail: 'linked worktrees exist but the primary checkout branch is unresolved',
    });
  });
});

describe('coordinationToParts', () => {
  it('projects a resolved branch onto the coordination branch and place fields', () => {
    expect(
      coordinationToParts({
        kind: 'branch',
        branch: 'coordination/worktree-pilot',
        primaryName: 'oak-open-curriculum-ecosystem',
      }),
    ).toEqual({
      coordinationBranch: 'coordination/worktree-pilot',
      coordinationPlace: 'oak-open-curriculum-ecosystem',
      error: undefined,
    });
  });

  it('projects a branch with a deduped name onto the branch alone, no place', () => {
    expect(coordinationToParts({ kind: 'branch', branch: 'main', primaryName: undefined })).toEqual(
      {
        coordinationBranch: 'main',
        coordinationPlace: undefined,
        error: undefined,
      },
    );
  });

  it('projects an error onto the loud error field, with no coordination branch or place', () => {
    expect(
      coordinationToParts({ kind: 'error', detail: 'primary checkout root unresolved' }),
    ).toEqual({
      coordinationBranch: undefined,
      coordinationPlace: undefined,
      error: 'primary checkout root unresolved',
    });
  });

  it('projects none onto all-absent — a valid empty state', () => {
    expect(coordinationToParts({ kind: 'none' })).toEqual({
      coordinationBranch: undefined,
      coordinationPlace: undefined,
      error: undefined,
    });
  });

  it('projects matches-working onto all-absent — the coordination branch is redundant, not faulty', () => {
    expect(coordinationToParts({ kind: 'matches-working' })).toEqual({
      coordinationBranch: undefined,
      coordinationPlace: undefined,
      error: undefined,
    });
  });
});

describe('parsePrimaryWorktreeRoot', () => {
  it('returns the first worktree path from porcelain output', () => {
    const porcelain = [
      'worktree /pretend-absolute/path',
      'HEAD 5bbda2fa900000000000000000000000000000000',
      'branch refs/heads/main',
      '',
      'worktree /pretend/absolute/pathoak-sonar-p1',
      'HEAD ac2901fe100000000000000000000000000000000',
      'branch refs/heads/fix/sonar-s8707-cli-path-injection',
      '',
    ].join('\n');

    expect(parsePrimaryWorktreeRoot(porcelain)).toBe('/pretend-absolute/path');
  });

  it('returns undefined for unrecognised output', () => {
    expect(parsePrimaryWorktreeRoot('')).toBeUndefined();
    expect(parsePrimaryWorktreeRoot('fatal: not a git repository')).toBeUndefined();
    expect(parsePrimaryWorktreeRoot('worktree ')).toBeUndefined();
  });
});

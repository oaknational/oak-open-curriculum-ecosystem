import { describe, expect, it, vi } from 'vitest';

import { runPreventAccidentalMajorVersion } from './prevent-accidental-major-version.js';

const GIT_DIR = '/repo/.git';

// A pure `realpath` stand-in: maps each input to its canonical (symlink- and
// `..`-resolved) form without touching the filesystem; unknown inputs throw, as
// `realpathSync` does for a path that does not exist.
const canonical =
  (table: Record<string, string>) =>
  (path: string): string => {
    const resolved = table[path];
    if (resolved === undefined) {
      throw new Error(`ENOENT: no such file or directory, realpath '${path}'`);
    }
    return resolved;
  };

// Covers the git-dir base and every candidate path the suite uses. The
// `..`-escaping candidate canonicalises OUT of the base; the worktree path
// canonicalises to itself, inside the base.
const realpath = canonical({
  '/repo/.git': '/repo/.git',
  '/repo/.git/COMMIT_EDITMSG': '/repo/.git/COMMIT_EDITMSG',
  '/repo/.git/worktrees/wt1/COMMIT_EDITMSG': '/repo/.git/worktrees/wt1/COMMIT_EDITMSG',
  '/repo/.git/../hack/evil': '/repo/hack/evil',
});

describe('runPreventAccidentalMajorVersion', () => {
  it('allows a conventional commit message read from within the git dir', () => {
    const result = runPreventAccidentalMajorVersion({
      commitMsgFile: '/repo/.git/COMMIT_EDITMSG',
      gitDir: GIT_DIR,
      realpath,
      readFile: () => 'fix: tidy the thing',
      writeError: vi.fn(),
    });

    expect(result).toEqual({ exitCode: 0 });
  });

  it('blocks a commit carrying a BREAKING CHANGE footer', () => {
    const result = runPreventAccidentalMajorVersion({
      commitMsgFile: '/repo/.git/COMMIT_EDITMSG',
      gitDir: GIT_DIR,
      realpath,
      readFile: () => 'feat: a thing\n\nBREAKING CHANGE: drops the old API',
      writeError: vi.fn(),
    });

    expect(result).toEqual({ exitCode: 1 });
  });

  it('blocks a `!` bang commit', () => {
    const result = runPreventAccidentalMajorVersion({
      commitMsgFile: '/repo/.git/COMMIT_EDITMSG',
      gitDir: GIT_DIR,
      realpath,
      readFile: () => 'feat!: a breaking thing',
      writeError: vi.fn(),
    });

    expect(result).toEqual({ exitCode: 1 });
  });

  it('allows an empty (not-yet-written) commit message', () => {
    const result = runPreventAccidentalMajorVersion({
      commitMsgFile: '/repo/.git/COMMIT_EDITMSG',
      gitDir: GIT_DIR,
      realpath,
      readFile: () => '',
      writeError: vi.fn(),
    });

    expect(result).toEqual({ exitCode: 0 });
  });

  it('fails when no commit-message file is provided, without reading anything', () => {
    const readFile = vi.fn<(path: string) => string>();
    const writeError = vi.fn<(line: string) => void>();

    const result = runPreventAccidentalMajorVersion({
      commitMsgFile: undefined,
      gitDir: GIT_DIR,
      realpath,
      readFile,
      writeError,
    });

    expect(result).toEqual({ exitCode: 1 });
    expect(writeError).toHaveBeenCalledWith('Error: No commit message file provided');
    expect(readFile).not.toHaveBeenCalled();
  });

  it('rejects a commit-message path resolving outside the git dir, without reading it', () => {
    const readFile = vi.fn<(path: string) => string>(() => 'feat!: injected breaking change');
    const writeError = vi.fn<(line: string) => void>();

    const result = runPreventAccidentalMajorVersion({
      commitMsgFile: '/repo/.git/../hack/evil',
      gitDir: GIT_DIR,
      realpath,
      readFile,
      writeError,
    });

    expect(result).toEqual({ exitCode: 1 });
    expect(readFile).not.toHaveBeenCalled();
    expect(writeError).toHaveBeenCalledWith(expect.stringMatching(/not within/u));
  });

  it('accepts a linked-worktree COMMIT_EDITMSG under the git dir (a repo-root base would wrongly reject it)', () => {
    const result = runPreventAccidentalMajorVersion({
      commitMsgFile: '/repo/.git/worktrees/wt1/COMMIT_EDITMSG',
      gitDir: GIT_DIR,
      realpath,
      readFile: () => 'fix: a worktree commit',
      writeError: vi.fn(),
    });

    expect(result).toEqual({ exitCode: 0 });
  });

  it('returns exit code 1 — never an unhandled crash — when resolving the git dir throws', () => {
    const readFile = vi.fn<(path: string) => string>();
    const writeError = vi.fn<(line: string) => void>();

    // No `gitDir`, so the resolver runs; a missing / non-worktree git throws.
    const result = runPreventAccidentalMajorVersion({
      commitMsgFile: '/repo/.git/COMMIT_EDITMSG',
      resolveGitDir: () => {
        throw new Error('fatal: not a git repository');
      },
      realpath,
      readFile,
      writeError,
    });

    expect(result).toEqual({ exitCode: 1 });
    expect(readFile).not.toHaveBeenCalled();
    expect(writeError).toHaveBeenCalledWith(expect.stringContaining('not a git repository'));
  });
});

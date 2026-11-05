import { describe, expect, it } from 'vitest';

import { failureMessage } from './test-helpers/result-failure.js';
import {
  caseCollisionsOf,
  gitWords,
  parseExactRemoteRef,
  parseRefListing,
  parseSymrefHead,
  parseWorktrees,
} from './retire-parse.js';

/**
 * The `merge-bot retire` parsers: git's text in, typed readings out. Pure;
 * every input here is the literal text git prints.
 */

const SHA_A = 'a'.repeat(40);
const SHA_B = 'b'.repeat(40);

describe('parseSymrefHead', () => {
  it('reads the default branch name and its tip from one remote reading', () => {
    const parsed = parseSymrefHead(`ref: refs/heads/main\tHEAD\n${SHA_A}\tHEAD\n`);

    expect(parsed).toEqual({ ok: true, value: { name: 'main', sha: SHA_A } });
  });

  it('refuses a reading with no symref line', () => {
    expect(parseSymrefHead(`${SHA_A}\tHEAD\n`).ok).toBe(false);
  });

  it('refuses a server-supplied name that would read as a flag in a later argv', () => {
    expect(parseSymrefHead(`ref: refs/heads/-x\tHEAD\n${SHA_A}\tHEAD\n`).ok).toBe(false);
  });

  it('names a refused server-supplied name without its control characters', () => {
    const parsed = parseSymrefHead(`ref: refs/heads/a\u001b[31m\tHEAD\n${SHA_A}\tHEAD\n`);

    expect(parsed.ok).toBe(false);
    expect(failureMessage(parsed)).not.toContain('\u001b');
  });
});

describe('parseExactRemoteRef', () => {
  it('takes the line whose refname equals the branch, and ignores suffix matches', () => {
    // git ls-remote matches any ref ENDING in the pattern after a slash, so a
    // ref named a/refs/heads/zeta answers a probe for refs/heads/zeta.
    const stdout = `${SHA_B}\trefs/heads/a/refs/heads/zeta\n${SHA_A}\trefs/heads/zeta\n`;

    expect(parseExactRemoteRef(stdout, 'zeta')).toEqual({ kind: 'present', sha: SHA_A });
  });

  it('reads a probe that matched only a suffix as absent', () => {
    expect(parseExactRemoteRef(`${SHA_B}\trefs/heads/a/refs/heads/zeta\n`, 'zeta')).toEqual({
      kind: 'absent',
    });
  });

  it('reads empty output as absent', () => {
    expect(parseExactRemoteRef('', 'zeta')).toEqual({ kind: 'absent' });
  });
});

describe('parseRefListing', () => {
  it('maps every full refname to its object name', () => {
    const listing = parseRefListing(
      `refs/heads/main ${SHA_A}\nrefs/remotes/origin/main ${SHA_B}\n`,
    );

    expect(listing.get('refs/heads/main')).toEqual({ sha: SHA_A });
    expect(listing.get('refs/remotes/origin/main')).toEqual({ sha: SHA_B });
    expect(listing.size).toBe(2);
  });

  it('keeps names exact, so two refs that differ only in case stay two', () => {
    const listing = parseRefListing(`refs/heads/main ${SHA_A}\nrefs/heads/Main ${SHA_B}\n`);

    expect(listing.get('refs/heads/main')).toEqual({ sha: SHA_A });
    expect(listing.get('refs/heads/Main')).toEqual({ sha: SHA_B });
  });
});

describe('caseCollisionsOf', () => {
  it('names every other local or tracking ref equal to the branch when case is ignored', () => {
    const listing = parseRefListing(
      [
        `refs/heads/feat/x ${SHA_A} `,
        `refs/heads/Feat/X ${SHA_B} `,
        `refs/remotes/origin/FEAT/x ${SHA_B} `,
        `refs/heads/feat/xy ${SHA_B} `,
      ].join('\n'),
    );

    expect(caseCollisionsOf(listing, 'feat/x')).toEqual([
      'refs/heads/Feat/X',
      'refs/remotes/origin/FEAT/x',
    ]);
  });

  it('finds none when only the exact names exist', () => {
    const listing = parseRefListing(
      `refs/heads/feat/x ${SHA_A} \nrefs/remotes/origin/feat/x ${SHA_B} \n`,
    );

    expect(caseCollisionsOf(listing, 'feat/x')).toEqual([]);
  });
});

describe('parseWorktrees', () => {
  it('reads each worktree path with its branch, a detached one with none, and which are prunable', () => {
    const porcelain = [
      'worktree /repo',
      `HEAD ${SHA_A}`,
      'branch refs/heads/main',
      '',
      'worktree /repo-wt',
      `HEAD ${SHA_B}`,
      'detached',
      '',
      'worktree /gone-wt',
      `HEAD ${SHA_B}`,
      'branch refs/heads/feat/x',
      'prunable gitdir file points to non-existent location',
      '',
    ].join('\n');

    expect(parseWorktrees(porcelain)).toEqual([
      { path: '/repo', branch: 'refs/heads/main', prunable: false },
      { path: '/repo-wt', branch: undefined, prunable: false },
      { path: '/gone-wt', branch: 'refs/heads/feat/x', prunable: true },
    ]);
  });
});

describe('gitWords', () => {
  it("keeps git's first line that is not a hint, with each local absolute path cut to its last part", () => {
    const stderr = [
      "fatal: Unable to create '/srv/repo/.git/refs/heads/feat/x.lock': File exists.",
      '',
      'Another git process seems to be running in this repository.',
    ].join('\n');

    expect(gitWords(stderr)).toBe("fatal: Unable to create 'x.lock': File exists.");
  });

  it("prefers git's fatal or error line to a warning before it", () => {
    expect(
      gitWords('warning: redirecting to https://github.com/acme/w\nfatal: repository not found'),
    ).toBe('fatal: repository not found');
  });

  it('leaves ref names and URLs whole, and drops control characters', () => {
    expect(
      gitWords("hint: try again\nerror: refs/heads/feat/x at 'https://github.com/acme/w'\u001b[2J"),
    ).toBe("error: refs/heads/feat/x at 'https://github.com/acme/w'[2J");
  });
});

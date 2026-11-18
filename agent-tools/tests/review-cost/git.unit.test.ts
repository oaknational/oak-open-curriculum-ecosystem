import { describe, expect, it } from 'vitest';

import { gitDiffStat, isSyncPush } from '../../src/review-cost/git.js';

// The git seam is injected: no process is spawned. `answers` maps each git
// argument list (joined) to its output; an answer of `refused` throws, as the
// real executor does on a non-zero exit.
const REFUSED = Symbol('refused');
const runner =
  (answers: Readonly<Record<string, string | typeof REFUSED>>) =>
  (_file: string, args: readonly string[]): string => {
    const answer = answers[args.join(' ')];
    if (answer === REFUSED) {
      throw new Error(`git ${args.join(' ')}: exit 1`);
    }
    return answer ?? '';
  };

const SYNC_TREE = 'tree-of-the-automatic-merge';

describe('gitDiffStat — a push is measured by its own diff; only a pure base sync measures zero', () => {
  it('sums added and deleted lines and lists the files of an ordinary push', () => {
    const stat = gitDiffStat(
      'a',
      'b',
      runner({
        'rev-list --parents -n 1 b': 'b a',
        'diff --numstat a..b': '10\t2\tsrc/x.ts\n0\t5\tdocs/y.md\n',
      }),
    );
    expect(stat).toStrictEqual({ lines: 17, files: ['src/x.ts', 'docs/y.md'], sync: false });
  });

  it("measures a pure base sync as zero: the merge's tree is exactly git's automatic merge", () => {
    const stat = gitDiffStat(
      'a',
      'm',
      runner({
        'rev-list --parents -n 1 m': 'm a base',
        'merge-tree --write-tree a base': SYNC_TREE,
        'rev-parse m^{tree}': SYNC_TREE,
      }),
    );
    expect(stat).toStrictEqual({ lines: 0, files: [], sync: true });
  });

  it('prices a merge whose tree differs from the automatic merge in full, never as a sync', () => {
    const stat = gitDiffStat(
      'a',
      'm',
      runner({
        'rev-list --parents -n 1 m': 'm a base',
        'merge-tree --write-tree a base': SYNC_TREE,
        'rev-parse m^{tree}': 'tree-with-a-merge-time-edit',
        'diff --numstat a..m': '40\t3\tdocs/base.md\n1\t1\tsrc/cure.ts\n',
      }),
    );
    expect(stat).toStrictEqual({ lines: 45, files: ['docs/base.md', 'src/cure.ts'], sync: false });
  });

  it('prices a merge whose automatic form conflicts in full', () => {
    const stat = gitDiffStat(
      'a',
      'm',
      runner({
        'rev-list --parents -n 1 m': 'm a base',
        'merge-tree --write-tree a base': REFUSED,
        'diff --numstat a..m': '40\t3\tdocs/base.md\n',
      }),
    );
    expect(stat.sync).toBe(false);
  });
});

describe('isSyncPush — one automatic merge of the base over the head the remote holds, and only that', () => {
  const SYNC = {
    'rev-list --parents -n 1 m': 'm a base',
    'merge-base --is-ancestor base tip': '',
    'merge-tree --write-tree a base': SYNC_TREE,
    'rev-parse m^{tree}': SYNC_TREE,
  } as const;

  it('recognises the sync push', () => {
    expect(isSyncPush('a', 'm', 'tip', runner(SYNC))).toBe(true);
  });

  it('refuses a merge whose first parent is not the remote head: other commits ride along', () => {
    expect(
      isSyncPush('a', 'm', 'tip', runner({ ...SYNC, 'rev-list --parents -n 1 m': 'm c base' })),
    ).toBe(false);
  });

  it("refuses a merge of anything but the pull request's base", () => {
    expect(
      isSyncPush(
        'a',
        'm',
        'tip',
        runner({ ...SYNC, 'merge-base --is-ancestor base tip': REFUSED }),
      ),
    ).toBe(false);
  });

  it('refuses a merge carrying an edit that keeps the line counts, and a plain commit', () => {
    expect(
      isSyncPush('a', 'm', 'tip', runner({ ...SYNC, 'rev-parse m^{tree}': 'tree-with-an-edit' })),
    ).toBe(false);
    expect(isSyncPush('a', 'b', 'tip', runner({ 'rev-list --parents -n 1 b': 'b a' }))).toBe(false);
  });
});

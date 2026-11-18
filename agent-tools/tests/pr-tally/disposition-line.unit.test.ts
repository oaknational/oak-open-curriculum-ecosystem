import { describe, expect, it } from 'vitest';

import { parseDispositionLine } from '../../src/pr-tally/disposition-line.js';
import { readBodyDispositions } from '../../src/pr-tally/dispositions.js';
import type { RecordedHarvest } from '../../src/pr-tally/harvest.js';

// Two surfaces: the disposition line's field reader (`parseDispositionLine`),
// and the signed-comment reader (`readBodyDispositions`) that composes it with
// the signature predicate and the marker grammar — the live path the
// review-cost gate runs on every push.

const HEAD = 'abcdef0123456789abcdef0123456789abcdef01';
const SIGNATURE = '\n\n— Nettle guards Pistil (2de368)';

// One signed issue comment per body, on a harvest with one commit and no reviews.
const harvestOf = (...bodies: readonly string[]): RecordedHarvest => ({
  number: 1,
  headRefOid: HEAD,
  baseRefName: 'engraph',
  mergeCommitOid: null,
  commits: [{ oid: HEAD, committedDate: '2026-10-28T10:00:00Z' }],
  reviewThreads: [],
  reviews: [],
  comments: bodies.map((body, index) => ({
    databaseId: 1000 + index,
    author: 'el-graphael',
    createdAt: '2026-10-28T12:00:00Z',
    body: `${body}${SIGNATURE}`,
  })),
});

// A marked line in the recorded shape, with the anchor and item given.
const marked = (anchor: string, item: string, tail = ' ·'): string =>
  `- **Over-bar** · head SHA:abcdef012 · review 9000002 · ${anchor} · ${item}${tail}`;

describe('parseDispositionLine — one signed line per finding, read field by field', () => {
  it('reads the recorded line shape: head prefix, review id, anchor out of its code span, item', () => {
    const line =
      '- **In scope, over-bar** · head SHA:abcdef012 · review 5186656292 · `docs/a.md:154` · item 1 of 3 · Cured in `SHA:fa54733b7`: the paragraph.';
    expect(parseDispositionLine(line)).toStrictEqual({
      headPrefix: 'abcdef012',
      reviewId: '5186656292',
      path: 'docs/a.md',
      line: 154,
      item: 'item 1 of 3',
    });
  });

  it('reads a path that carries colons, an anchor outside a code span, a thread item followed by prose, and no bullet', () => {
    expect(
      parseDispositionLine(
        marked('`C:/work/a.md:7`', 'thread PRRT_1', ' · the same finding, counted once.'),
      ),
    ).toMatchObject({
      path: 'C:/work/a.md',
      line: 7,
      item: 'thread PRRT_1',
    });
    expect(
      parseDispositionLine(
        '**Below-bar** · head SHA:abcdef012 · review PRR_x · docs/a.md:1 · Name the thing ·',
      ),
    ).toMatchObject({
      reviewId: 'PRR_x',
      path: 'docs/a.md',
      line: 1,
      item: 'Name the thing',
    });
  });

  it.each([
    ['no closing separator after the item', marked('`docs/a.md:1`', 'Name the thing', '')],
    [
      'a head reference outside the hex grammar',
      marked('`docs/a.md:1`', 'Name').replace('abcdef012', 'abcdefg'),
    ],
    ['a review id with whitespace', marked('`docs/a.md:1`', 'Name').replace('9000002', '9000 002')],
    ['an anchor without a line number', marked('`docs/a.md`', 'Name')],
    ['an anchor whose line is not digits', marked('`docs/a.md:1x`', 'Name')],
    ['a code span left open inside the anchor', marked('`docs/`a.md:1`', 'Name')],
    [
      'text between the label and the first separator',
      marked('`docs/a.md:1`', 'Name').replace('** ·', '** then ·'),
    ],
    [
      'a label carrying an asterisk',
      marked('`docs/a.md:1`', 'Name').replace('Over-bar', 'Over*bar'),
    ],
  ])('reads a line with %s as no disposition line', (_shape, line) => {
    expect(parseDispositionLine(line)).toBeNull();
  });
});

describe('readBodyDispositions — the field reader on the live path', () => {
  /**
   * Before the cure one regex read the line and backtracked across its
   * whitespace in cubic time: this line, 640 spaces before the anchor and 640
   * after the fourth separator (1,332 characters, no closing separator), took
   * 25.1 s on the authoring host (2026-10-28, quiet, measured once), past the
   * harness's timeout; the field reader reads it in milliseconds. No ceiling
   * is asserted (testing-strategy, no wall-clock ceilings in gated tests).
   */
  it('reads a marked line padded with 1,280 spaces as a batched disposition', () => {
    const line = `- **Over-bar** · head SHA:abcdef0 · review r1 ·${' '.repeat(640)}p:1 ·${' '.repeat(640)}`;
    const { keys, batches } = readBodyDispositions(harvestOf(line));
    expect(keys).toStrictEqual([]);
    expect(batches.map((batch) => batch.heads)).toStrictEqual([['abcdef0']]);
  });

  it('reads a signed comment of two recorded lines as two keys carrying their markers', () => {
    const { keys, batches } = readBodyDispositions(
      harvestOf(
        `${marked('`docs/a.md:1`', 'item 1 of 2')}\n${marked('`docs/b.md:2`', 'item 2 of 2').replace('Over-bar', 'Below-bar')}`,
      ),
    );
    expect(keys.map((key) => [key.path, key.line, key.item, key.marker])).toStrictEqual([
      ['docs/a.md', 1, 'item 1 of 2', 'over-bar'],
      ['docs/b.md', 2, 'item 2 of 2', 'below-bar'],
    ]);
    expect(batches).toStrictEqual([]);
  });

  /**
   * The intake contract names an item on every line. The one-regex reader
   * accepted a whitespace-only item (its item group fed by the whitespace the
   * separator pattern gave back) as a key naming nothing; the field reader
   * reads such a line as no key, so its marker is a batched disposition.
   */
  it('reads a marked line with an empty item as a batched disposition, never a key', () => {
    const { keys, batches } = readBodyDispositions(harvestOf(marked('`docs/a.md:1`', '')));
    expect(keys).toStrictEqual([]);
    expect(batches.map((batch) => batch.heads)).toStrictEqual([['abcdef012']]);
  });
});

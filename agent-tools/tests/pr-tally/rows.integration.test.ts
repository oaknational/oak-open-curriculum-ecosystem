import { describe, expect, it } from 'vitest';

import { parseRecordedHarvest } from '../../src/pr-tally/harvest.js';
import type { RecordedHarvest } from '../../src/pr-tally/harvest.js';
import { buildRows } from '../../src/pr-tally/rows.js';
import pr135 from './fixtures/pr-135-harvest.json' with { type: 'json' };
import pr136 from './fixtures/pr-136-harvest.json' with { type: 'json' };
import pr138 from './fixtures/pr-138-harvest.json' with { type: 'json' };

const COPILOT = 'copilot-pull-request-reviewer';
const CODEX = 'chatgpt-codex-connector';
const EXPECTED = [COPILOT, CODEX];
const SIGNATURE = '\n\n— Nettle guards Pistil (2de368)';

const short = (oid: string) => oid.slice(0, 9);

const EMPTY_THREAD: RecordedHarvest['reviewThreads'][number] = {
  id: '',
  isResolved: false,
  isOutdated: false,
  path: '',
  line: null,
  originalLine: null,
  reviewId: null,
  reviewCommitOid: null,
  comments: [],
};

// The first recorded thread bound to a head at a recorded anchor by a recorded review.
const anchoredThread = (harvest: RecordedHarvest): RecordedHarvest['reviewThreads'][number] => {
  const thread = harvest.reviewThreads.find(
    (candidate) =>
      candidate.reviewCommitOid !== null &&
      candidate.originalLine !== null &&
      candidate.reviewId !== null,
  );
  expect(thread, 'fixture has no anchored bound thread').toBeDefined();
  return thread ?? EMPTY_THREAD;
};
const firstHead = (harvest: RecordedHarvest) => harvest.commits[0]?.oid ?? '';

const review = (
  overrides: Partial<RecordedHarvest['reviews'][number]> & { commitOid: string },
): RecordedHarvest['reviews'][number] => ({
  id: 'PRR_synthetic',
  databaseId: 9000001,
  author: COPILOT,
  state: 'COMMENTED',
  submittedAt: '2026-09-12T12:00:00Z',
  body: '',
  ...overrides,
});

describe('buildRows — one row per settled head, in branch order, counts from recorded fields', () => {
  it('reads the #135 corpus: four settled heads, two superseded, one owed a reviewer', () => {
    const tally = buildRows({ harvest: parseRecordedHarvest(pr135), expectedReviewers: EXPECTED });
    expect(tally.rows.map((row) => [short(row.head), row.raised, row.cureWorthy])).toStrictEqual([
      ['be6f75c05', 15, 0],
      ['ae0e02f22', 20, 0],
      ['4114e2447', 6, 0],
      ['b50820152', 10, 0],
    ]);
    // Every seat reply AND every seat comment ends with a role suffix the
    // signature predicate rejects, so nothing here is a signed disposition:
    // every finding is undispositioned, none manual.
    expect(tally.rows.map((row) => [row.undispositioned, row.manual])).toStrictEqual([
      [15, 0],
      [20, 0],
      [6, 0],
      [10, 0],
    ]);
    expect(tally.unsettled.map((row) => [short(row.head), row.raised, row.owed])).toStrictEqual([
      ['712abe242', 0, EXPECTED],
      ['7f2426877', 0, EXPECTED],
      ['362372eb4', 3, [COPILOT]],
    ]);
    expect(tally.heads.map(short)).toStrictEqual([
      '712abe242',
      '7f2426877',
      'be6f75c05',
      'ae0e02f22',
      '362372eb4',
      '4114e2447',
      'b50820152',
    ]);
  });

  it('reads the #138 corpus: bare signatures disposition every thread; suppressed items only where a one-line disposition names them', () => {
    const tally = buildRows({ harvest: parseRecordedHarvest(pr138), expectedReviewers: EXPECTED });
    expect(
      tally.rows.map((row) => [short(row.head), row.raised, row.cureWorthy, row.undispositioned]),
    ).toStrictEqual([
      ['352ad0ee5', 7, 3, 4],
      ['84dd6291b', 11, 6, 5],
      // One suppressed item's disposition named a thread from an EARLIER review as
      // its key; the dedup rule is same-review, so the item stands undispositioned.
      ['db67da4d5', 10, 9, 1],
      ['a1ec078e2', 9, 9, 0],
      ['33cca25bc', 5, 3, 0],
      ['ebf90ac3b', 3, 1, 2],
      ['fe81ac086', 3, 0, 1],
    ]);
    expect(tally.unsettled.map((row) => short(row.head))).toStrictEqual(['6e2e74bf4']);
  });

  it('counts a body item that restates an inline thread of the same review at the same anchor once', () => {
    const harvest = parseRecordedHarvest(pr138);
    const thread = anchoredThread(harvest);
    const head = thread.reviewCommitOid ?? '';
    const opening = thread.comments[0]?.body.split('\n')[0] ?? '';
    const restating = review({
      id: thread.reviewId ?? '',
      databaseId: null,
      commitOid: head,
      body: `### Suppressed comments (1)\n\n**${thread.path}:${thread.originalLine ?? 0}**\n* ${opening}\n`,
    });
    const raisedFor = (tally: ReturnType<typeof buildRows>) =>
      [...tally.rows, ...tally.unsettled].find((row) => row.head === head)?.raised;
    expect(
      raisedFor(
        buildRows({
          harvest: { ...harvest, reviews: [...harvest.reviews, restating] },
          expectedReviewers: EXPECTED,
        }),
      ),
    ).toBe(raisedFor(buildRows({ harvest, expectedReviewers: EXPECTED })));
  });

  it('surfaces a signed thread disposition that carries no bar marker as manual, never counted', () => {
    const harvest = parseRecordedHarvest(pr138);
    const target = harvest.reviewThreads.find((thread) => thread.comments.length > 1);
    expect(target, 'fixture has no replied thread').toBeDefined();
    const stripped = {
      ...harvest,
      reviewThreads: harvest.reviewThreads.map((thread) =>
        thread.id === target?.id
          ? {
              ...thread,
              comments: thread.comments
                .slice(0, 2)
                .map((comment, index) =>
                  index === 1
                    ? { ...comment, body: `Looked at it, no change.${SIGNATURE}` }
                    : comment,
                ),
            }
          : thread,
      ),
    };
    const row = buildRows({ harvest: stripped, expectedReviewers: EXPECTED }).rows.find(
      (candidate) => candidate.head === target?.reviewCommitOid,
    );
    expect(row?.manual).toBe(1);
  });

  it('counts body findings from a landed review by a reviewer outside the expected set, and reads its prose as manual', () => {
    const harvest = parseRecordedHarvest(pr138);
    const head = firstHead(harvest);
    const claude = review({
      id: 'PRR_claude',
      author: 'claude',
      commitOid: head,
      body: 'Two issues here.',
    });
    const row = buildRows({
      harvest: { ...harvest, reviews: [...harvest.reviews, claude] },
      expectedReviewers: EXPECTED,
    }).rows.find((candidate) => candidate.head === head);
    expect(row?.manual).toBe(1);
    expect(row?.reviewers).toStrictEqual(EXPECTED);
  });

  it('does not let a PENDING draft from an expected reviewer settle a head or contribute findings', () => {
    const harvest = parseRecordedHarvest(pr138);
    const head = firstHead(harvest);
    const withoutCopilot = harvest.reviews.filter(
      (candidate) => !(candidate.commitOid === head && candidate.author === COPILOT),
    );
    const draft = review({
      id: 'PRR_draft',
      commitOid: head,
      state: 'PENDING',
      body: '### Suppressed comments (1)\n\n**docs/a.md:1**\n* draft finding\n',
    });
    const tally = buildRows({
      harvest: { ...harvest, reviews: [...withoutCopilot, draft] },
      expectedReviewers: EXPECTED,
    });
    const row = tally.unsettled.find((candidate) => candidate.head === head);
    expect(row?.owed).toStrictEqual([COPILOT]);
    // Only the Codex thread remains: Copilot's threads and the draft's item are gone with its landed review.
    expect(row?.raised).toBe(1);
  });

  it('holds a head unsettled inside the quiet window when a clock is supplied', () => {
    const harvest = parseRecordedHarvest(pr138);
    const head = harvest.commits.at(-1)?.oid ?? '';
    const latest = harvest.reviews
      .filter((candidate) => candidate.commitOid === head)
      .map((candidate) => Date.parse(candidate.submittedAt))
      .reduce((max, value) => Math.max(max, value), 0);
    const inside = new Date(latest + 5 * 60 * 1000).toISOString();
    const after = new Date(latest + 11 * 60 * 1000).toISOString();
    const settledAt = (now: string) =>
      buildRows({ harvest, expectedReviewers: EXPECTED, now }).rows.some(
        (row) => row.head === head,
      );
    expect(settledAt(inside)).toBe(false);
    expect(settledAt(after)).toBe(true);
  });

  it('binds a one-line disposition to a Codex body item by review and heading when the item has no anchor', () => {
    const harvest = parseRecordedHarvest(pr138);
    const head = firstHead(harvest);
    const codexBody = review({
      id: 'PRR_codexbody',
      databaseId: 9000002,
      author: CODEX,
      commitOid: head,
      body: '**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  Name the thing**\n\nBody.',
    });
    const disposition = {
      databaseId: 9000003,
      author: 'el-graphael',
      createdAt: '2026-09-12T12:30:00Z',
      body: `**In scope, over-bar** · head SHA:${head.slice(0, 9)} · review 9000002 · \`docs/a.md:1\` · Name the thing · Cured in SHA:deadbeef0.${SIGNATURE}`,
    };
    const row = buildRows({
      harvest: {
        ...harvest,
        reviews: [...harvest.reviews, codexBody],
        comments: [...harvest.comments, disposition],
      },
      expectedReviewers: EXPECTED,
    }).rows.find((candidate) => candidate.head === head);
    expect(row?.cureWorthy).toBe(4);
    expect(row?.undispositioned).toBe(4);
  });

  it('reads a signed, marked comment with no parseable line as a batched disposition: the body items of its named heads are manual', () => {
    const harvest = parseRecordedHarvest(pr138);
    const head = firstHead(harvest);
    const batched = {
      databaseId: 9000004,
      author: 'el-graphael',
      createdAt: '2026-09-13T00:00:00Z',
      body: `## Suppressed findings on SHA:${head.slice(0, 9)}, reconciled\n\n**Below-bar** — all four, no reader acts on them.${SIGNATURE}`,
    };
    const row = buildRows({
      harvest: { ...harvest, comments: [...harvest.comments, batched] },
      expectedReviewers: EXPECTED,
    }).rows.find((candidate) => candidate.head === head);
    expect(row?.undispositioned).toBe(0);
    expect(row?.manual).toBe(4);
  });

  it('reads the #136 corpus: role-suffixed replies undispositioned, bare ones counted, the merge commit unsettled', () => {
    const tally = buildRows({ harvest: parseRecordedHarvest(pr136), expectedReviewers: EXPECTED });
    expect(
      tally.rows.map((row) => [short(row.head), row.raised, row.cureWorthy, row.undispositioned]),
    ).toStrictEqual([
      ['180db8de5', 4, 0, 4],
      ['39c627107', 2, 0, 2],
      ['0b1272171', 4, 4, 0],
      ['1ca90fece', 2, 1, 1],
      ['970620e8c', 2, 1, 1],
      ['00314dbf1', 3, 3, 0],
      ['bc6370624', 4, 3, 1],
      ['fa54733b7', 3, 2, 1],
      ['b6c824ddf', 1, 1, 0],
      ['c77909566', 3, 0, 2],
    ]);
    expect(tally.unsettled.map((row) => short(row.head))).toStrictEqual(['7e0c8128c']);
  });

  it('does not count a thread whose originating review is a PENDING draft', () => {
    const harvest = parseRecordedHarvest(pr138);
    const head = firstHead(harvest);
    const draft = review({ id: 'PRR_draft', commitOid: head, state: 'PENDING', submittedAt: '' });
    const draftThread = {
      id: 'PRRT_draft',
      isResolved: false,
      isOutdated: false,
      path: 'docs/a.md',
      line: 1,
      originalLine: 1,
      reviewId: 'PRR_draft',
      reviewCommitOid: head,
      comments: [
        {
          databaseId: 1,
          reviewId: 'PRR_draft',
          author: COPILOT,
          createdAt: '2026-09-12T12:00:00Z',
          body: 'draft',
        },
      ],
    };
    const before = buildRows({ harvest, expectedReviewers: EXPECTED });
    const after = buildRows({
      harvest: {
        ...harvest,
        reviews: [...harvest.reviews, draft],
        reviewThreads: [...harvest.reviewThreads, draftThread],
      },
      expectedReviewers: EXPECTED,
    });
    expect(after.rows[0]?.raised).toBe(before.rows[0]?.raised);
  });

  it('matches a declared expected reviewer to the API login case-insensitively', () => {
    const tally = buildRows({
      harvest: parseRecordedHarvest(pr138),
      expectedReviewers: ['Copilot-Pull-Request-Reviewer', 'CHATGPT-codex-connector'],
    });
    expect(tally.rows).toHaveLength(7);
  });

  it('never anchors the quiet window on the review record a signed reply created', () => {
    const harvest = parseRecordedHarvest(pr138);
    const head = harvest.commits.at(-1)?.oid ?? '';
    const reviewerLatest = harvest.reviews
      .filter((candidate) => candidate.commitOid === head && candidate.author !== 'el-graphael')
      .map((candidate) => Date.parse(candidate.submittedAt))
      .reduce((max, value) => Math.max(max, value), 0);
    const replyReview = review({
      id: 'PRR_reply',
      author: 'el-graphael',
      commitOid: head,
      submittedAt: new Date(reviewerLatest + 30 * 60 * 1000).toISOString(),
    });
    const thread = harvest.reviewThreads.find((candidate) => candidate.reviewCommitOid === head);
    expect(thread, 'fixture has no thread on the final head').toBeDefined();
    const signedReply = {
      databaseId: 2,
      reviewId: 'PRR_reply',
      author: 'el-graphael',
      createdAt: replyReview.submittedAt,
      body: `**Below-bar** — no.${SIGNATURE}`,
    };
    const withReply = {
      ...harvest,
      reviews: [...harvest.reviews, replyReview],
      reviewThreads: harvest.reviewThreads.map((candidate) =>
        candidate.id === thread?.id
          ? { ...candidate, comments: [...candidate.comments, signedReply] }
          : candidate,
      ),
    };
    const now = new Date(reviewerLatest + 35 * 60 * 1000).toISOString();
    expect(
      buildRows({ harvest: withReply, expectedReviewers: EXPECTED, now }).rows.some(
        (row) => row.head === head,
      ),
    ).toBe(true);
  });

  it('accepts a recording whose PENDING draft carries a null submission time', () => {
    const raw = {
      ...pr138,
      reviews: {
        ...pr138.reviews,
        nodes: [
          ...pr138.reviews.nodes,
          {
            id: 'PRR_mine',
            author: { login: 'jimCresswell' },
            state: 'PENDING',
            commit: { oid: pr138.headRefOid },
            submittedAt: null,
            body: '',
          },
        ],
      },
    };
    expect(parseRecordedHarvest(raw).reviews.at(-1)?.submittedAt).toBe('');
  });

  it('dedupes a declared restatement only of a thread from the same review at a unique anchor', () => {
    const harvest = parseRecordedHarvest(pr138);
    const head = firstHead(harvest);
    const restating = review({
      id: 'PRR_same',
      databaseId: 9000005,
      commitOid: head,
      body: '### Suppressed comments (1)\n\n**docs/a.md:7**\n* Said differently.\n',
    });
    const thread = {
      id: 'PRRT_same',
      isResolved: true,
      isOutdated: false,
      path: 'docs/a.md',
      line: 7,
      originalLine: 7,
      reviewId: 'PRR_same',
      reviewCommitOid: head,
      comments: [
        {
          databaseId: 3,
          reviewId: 'PRR_same',
          author: COPILOT,
          createdAt: '2026-09-12T12:00:00Z',
          body: 'The finding.',
        },
        {
          databaseId: 4,
          reviewId: 'PRR_r',
          author: 'el-graphael',
          createdAt: '2026-09-12T12:01:00Z',
          body: `**Over-bar**. Cured.${SIGNATURE}`,
        },
      ],
    };
    const declared = {
      databaseId: 9000006,
      author: 'el-graphael',
      createdAt: '2026-09-12T12:30:00Z',
      body: `**Over-bar** · head SHA:${head.slice(0, 9)} · review 9000005 · \`docs/a.md:7\` · thread PRRT_same · counted once.${SIGNATURE}`,
    };
    const base = buildRows({ harvest, expectedReviewers: EXPECTED }).rows[0];
    const row = buildRows({
      harvest: {
        ...harvest,
        reviews: [...harvest.reviews, restating],
        reviewThreads: [...harvest.reviewThreads, thread],
        comments: [...harvest.comments, declared],
      },
      expectedReviewers: EXPECTED,
    }).rows[0];
    expect(base, 'no first row').toBeDefined();
    expect(row?.raised).toBe((base?.raised ?? 0) + 1);
    expect(row?.cureWorthy).toBe((base?.cureWorthy ?? 0) + 1);
  });
});

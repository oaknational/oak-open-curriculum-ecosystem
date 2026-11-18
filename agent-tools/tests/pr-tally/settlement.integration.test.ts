import { describe, expect, it } from 'vitest';

import { parseRecordedHarvest } from '../../src/pr-tally/harvest.js';
import type { RecordedHarvest } from '../../src/pr-tally/harvest.js';
import { buildRows } from '../../src/pr-tally/rows.js';
import type { TallyRow } from '../../src/pr-tally/rows.js';
import pr138 from './fixtures/pr-138-harvest.json' with { type: 'json' };

const COPILOT = 'copilot-pull-request-reviewer';
const CODEX = 'chatgpt-codex-connector';
const EXPECTED = [COPILOT, CODEX];
const SIGNATURE = '\n\n— Nettle guards Pistil (2de368)';

const firstHead = (harvest: RecordedHarvest) => harvest.commits[0]?.oid ?? '';

const counts = (row: TallyRow | undefined) => ({
  raised: row?.raised ?? 0,
  cureWorthy: row?.cureWorthy ?? 0,
  undispositioned: row?.undispositioned ?? 0,
});

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

// Posted after every review the #138 recording carries (a batch reaches only items that predate it).
const comment = (databaseId: number, body: string, createdAt = '2026-09-13T00:00:00Z') => ({
  databaseId,
  author: 'el-graphael',
  createdAt,
  body: `${body}${SIGNATURE}`,
});

const copilotOneItem = (text: string) =>
  `### 🟡 Changes recommended\n\n<details>\n<summary>Review details</summary>\n\n### Suppressed comments (1)\n\n**docs/a.md:9**\n* ${text}\n\n- **Comments generated:** 0 new\n</details>`;

describe('buildRows — settlement needs a substantive, dated review from a declared reviewer', () => {
  it('never settles any head when the expected reviewer set is empty', () => {
    const tally = buildRows({ harvest: parseRecordedHarvest(pr138), expectedReviewers: [] });
    expect(tally.rows).toStrictEqual([]);
    expect(tally.unsettled).toHaveLength(tally.heads.length);
  });

  it('does not let a tip-bound skip marker from an expected reviewer satisfy its leg', () => {
    const harvest = parseRecordedHarvest(pr138);
    const head = firstHead(harvest);
    const skipped = review({
      id: 'PRR_skip',
      author: CODEX,
      commitOid: head,
      body: 'Unable to review: service unavailable.',
    });
    const withoutCodex = harvest.reviews.filter(
      (candidate) => !(candidate.commitOid === head && candidate.author === CODEX),
    );
    const row = buildRows({
      harvest: { ...harvest, reviews: [...withoutCodex, skipped] },
      expectedReviewers: EXPECTED,
    }).unsettled.find((candidate) => candidate.head === head);
    expect(row?.owed).toStrictEqual([CODEX]);
  });

  it('holds a head open when a landed review binding it carries no submission time', () => {
    const harvest = parseRecordedHarvest(pr138);
    const head = firstHead(harvest);
    const undated = review({
      id: 'PRR_undated',
      author: COPILOT,
      commitOid: head,
      submittedAt: '',
    });
    const tally = buildRows({
      harvest: { ...harvest, reviews: [...harvest.reviews, undated] },
      expectedReviewers: EXPECTED,
      now: '2026-09-13T00:00:00Z',
    });
    expect(tally.rows.some((row) => row.head === head)).toBe(false);
  });

  it('lets the latest signed line for a body item win, as the last thread reply does', () => {
    const harvest = parseRecordedHarvest(pr138);
    const head = firstHead(harvest);
    const codexBody = review({
      id: 'PRR_codexbody',
      databaseId: 9000002,
      author: CODEX,
      commitOid: head,
      body: '**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  Name the thing**\n\nBody.',
    });
    const reference = `head SHA:${head.slice(0, 9)} · review 9000002 · \`docs/a.md:1\` · Name the thing ·`;
    const first = comment(9000003, `**Below-bar** · ${reference} Rejected.`);
    const correction = comment(9000004, `**Over-bar** · ${reference} Cured in SHA:deadbeef0.`);
    const rows = (comments: readonly (typeof first)[]) =>
      buildRows({
        harvest: {
          ...harvest,
          reviews: [...harvest.reviews, codexBody],
          comments: [...harvest.comments, ...comments],
        },
        expectedReviewers: EXPECTED,
      }).rows.find((candidate) => candidate.head === head);
    expect(rows([first])?.cureWorthy).toBe(3);
    expect(rows([first, correction])?.cureWorthy).toBe(4);
  });

  it('reads a batched disposition as manual on the heads it names as heads, never on the cure it cites', () => {
    const harvest = parseRecordedHarvest(pr138);
    const [reviewed, cure] = harvest.commits.map((commit) => commit.oid);
    expect(cure, 'fixture has fewer than two heads').toBeDefined();
    const batched = comment(
      9000005,
      `**Over-bar** — the four on head SHA:${(reviewed ?? '').slice(0, 9)}, together. Cured in SHA:${(cure ?? '').slice(0, 9)}.`,
    );
    const rowsByHead = buildRows({
      harvest: { ...harvest, comments: [...harvest.comments, batched] },
      expectedReviewers: EXPECTED,
    }).rows;
    const base = buildRows({ harvest, expectedReviewers: EXPECTED }).rows;
    expect(rowsByHead.find((row) => row.head === reviewed)?.manual).toBe(4);
    expect(rowsByHead.find((row) => row.head === cure)?.manual).toBe(
      base.find((row) => row.head === cure)?.manual,
    );
  });

  it('reads a bulleted, marked line missing its reference as a batched disposition, never silently', () => {
    const harvest = parseRecordedHarvest(pr138);
    const head = firstHead(harvest);
    const malformed = comment(
      9000006,
      `- **Below-bar** · head SHA:${head.slice(0, 9)} · no reference here.`,
    );
    const row = buildRows({
      harvest: { ...harvest, comments: [...harvest.comments, malformed] },
      expectedReviewers: EXPECTED,
    }).rows.find((candidate) => candidate.head === head);
    expect(row?.undispositioned).toBe(0);
    expect(row?.manual).toBe(4);
  });
});

describe('buildRows — the invariant: nothing the recording does not prove settles or counts', () => {
  it('never reads a code-wrapped cure citation as a head a batched disposition names', () => {
    const harvest = parseRecordedHarvest(pr138);
    const [reviewed, cure] = harvest.commits.map((commit) => commit.oid);
    expect(cure, 'fixture has fewer than two heads').toBeDefined();
    const batched = comment(
      9000007,
      `**Over-bar** — the four on SHA:${(reviewed ?? '').slice(0, 9)}, together. Cured in \`SHA:${(cure ?? '').slice(0, 9)}\`.`,
    );
    const rows = buildRows({
      harvest: { ...harvest, comments: [...harvest.comments, batched] },
      expectedReviewers: EXPECTED,
    }).rows;
    const base = buildRows({ harvest, expectedReviewers: EXPECTED }).rows;
    expect(rows.find((row) => row.head === reviewed)?.manual).toBe(4);
    expect(rows.find((row) => row.head === cure)?.manual).toBe(
      base.find((row) => row.head === cure)?.manual,
    );
  });

  it('reads a skip marker from any reviewer as no finding prose, never as manual', () => {
    const harvest = parseRecordedHarvest(pr138);
    const head = firstHead(harvest);
    const skipped = review({
      id: 'PRR_other_skip',
      author: 'some-other-reviewer',
      commitOid: head,
      body: 'Review skipped: unable to review this pull request.',
    });
    const withSkip = buildRows({
      harvest: { ...harvest, reviews: [...harvest.reviews, skipped] },
      expectedReviewers: EXPECTED,
    }).rows.find((row) => row.head === head);
    const base = buildRows({ harvest, expectedReviewers: EXPECTED }).rows.find(
      (row) => row.head === head,
    );
    expect(withSkip?.manual).toBe(base?.manual);
    expect(withSkip?.raised).toBe(base?.raised);
  });

  it('reads a marked line missing its reference as batched even beside a line that parses', () => {
    const harvest = parseRecordedHarvest(pr138);
    const head = firstHead(harvest);
    const codexBody = review({
      id: 'PRR_codexbody',
      databaseId: 9000002,
      author: CODEX,
      commitOid: head,
      body: '**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  Name the thing**\n\nBody.',
    });
    const mixed = comment(
      9000008,
      `- **Over-bar** · head SHA:${head.slice(0, 9)} · review 9000002 · \`docs/a.md:1\` · Name the thing · Cured in SHA:deadbeef0.\n- **Below-bar** · head SHA:${head.slice(0, 9)} · the rest, together.`,
    );
    const row = buildRows({
      harvest: {
        ...harvest,
        reviews: [...harvest.reviews, codexBody],
        comments: [...harvest.comments, mixed],
      },
      expectedReviewers: EXPECTED,
    }).rows.find((candidate) => candidate.head === head);
    expect(row?.cureWorthy).toBe(4);
    expect(row?.undispositioned).toBe(0);
    expect(row?.manual).toBe(4);
  });

  it('attributes a marked line missing its reference to the head that line names, never to a sibling line\u2019s head', () => {
    const harvest = parseRecordedHarvest(pr138);
    const [first, second] = harvest.commits.map((commit) => commit.oid);
    expect(second, 'fixture has fewer than two heads').toBeDefined();
    const codexBody = review({
      id: 'PRR_codexbody',
      databaseId: 9000002,
      author: CODEX,
      commitOid: first ?? '',
      body: '**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  Name the thing**\n\nBody.',
    });
    const mixed = comment(
      9000009,
      `- **Over-bar** · head SHA:${(first ?? '').slice(0, 9)} · review 9000002 · \`docs/a.md:1\` · Name the thing · Cured in SHA:deadbeef0.\n- **Below-bar** · head SHA:${(second ?? '').slice(0, 9)} · the rest, together.`,
    );
    const rows = buildRows({
      harvest: {
        ...harvest,
        reviews: [...harvest.reviews, codexBody],
        comments: [...harvest.comments, mixed],
      },
      expectedReviewers: EXPECTED,
    }).rows;
    const base = buildRows({ harvest, expectedReviewers: EXPECTED }).rows;
    expect(rows.find((row) => row.head === first)?.manual).toBe(
      base.find((row) => row.head === first)?.manual,
    );
    expect(rows.find((row) => row.head === second)?.undispositioned).toBe(0);
  });

  it('counts a signed opening finding from a reviewer: only replies are dispositions', () => {
    const harvest = parseRecordedHarvest(pr138);
    const head = firstHead(harvest);
    const signedFinding = {
      id: 'PRRT_peer',
      isResolved: false,
      isOutdated: false,
      path: 'docs/a.md',
      line: 3,
      originalLine: 3,
      reviewId: 'PRR_peer',
      reviewCommitOid: head,
      comments: [
        {
          databaseId: 5,
          reviewId: 'PRR_peer',
          author: 'peer-seat',
          createdAt: '2026-09-12T12:00:00Z',
          body: `A finding, signed by the reviewing seat.${SIGNATURE}`,
        },
      ],
    };
    const peerReview = review({ id: 'PRR_peer', author: 'peer-seat', commitOid: head });
    const base = buildRows({ harvest, expectedReviewers: EXPECTED }).rows.find(
      (row) => row.head === head,
    );
    const row = buildRows({
      harvest: {
        ...harvest,
        reviews: [...harvest.reviews, peerReview],
        reviewThreads: [...harvest.reviewThreads, signedFinding],
      },
      expectedReviewers: EXPECTED,
    }).rows.find((candidate) => candidate.head === head);
    expect(row?.raised).toBe((base?.raised ?? 0) + 1);
    expect(row?.undispositioned).toBe((base?.undispositioned ?? 0) + 1);
  });

  it('reads a signed, marked line naming no head as an unbound batch: every unnamed body item is manual', () => {
    const harvest = parseRecordedHarvest(pr138);
    const head = firstHead(harvest);
    const unbound = comment(9000010, '**Below-bar** — the rest, all of them, together.');
    const row = buildRows({
      harvest: { ...harvest, comments: [...harvest.comments, unbound] },
      expectedReviewers: EXPECTED,
    }).rows.find((candidate) => candidate.head === head);
    expect(row?.undispositioned).toBe(0);
    expect(row?.manual).toBe(4);
  });

  it('dedupes a declared restatement of an anchorless Codex item at the anchor the line records', () => {
    const harvest = parseRecordedHarvest(pr138);
    const head = firstHead(harvest);
    const codexBody = review({
      id: 'PRR_codex_same',
      databaseId: 9000011,
      author: CODEX,
      commitOid: head,
      body: '**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  Said differently**\n\nBody.',
    });
    const thread = {
      id: 'PRRT_codex_same',
      isResolved: true,
      isOutdated: false,
      path: 'docs/a.md',
      line: 7,
      originalLine: 7,
      reviewId: 'PRR_codex_same',
      reviewCommitOid: head,
      comments: [
        {
          databaseId: 6,
          reviewId: 'PRR_codex_same',
          author: CODEX,
          createdAt: '2026-09-12T12:00:00Z',
          body: 'The finding.',
        },
        {
          databaseId: 7,
          reviewId: 'PRR_r2',
          author: 'el-graphael',
          createdAt: '2026-09-12T12:01:00Z',
          body: `**Over-bar**. Cured.${SIGNATURE}`,
        },
      ],
    };
    const declared = comment(
      9000012,
      `**Over-bar** · head SHA:${head.slice(0, 9)} · review 9000011 · \`docs/a.md:7\` · thread PRRT_codex_same · counted once.`,
    );
    const base = buildRows({ harvest, expectedReviewers: EXPECTED }).rows.find(
      (row) => row.head === head,
    );
    const row = buildRows({
      harvest: {
        ...harvest,
        reviews: [...harvest.reviews, codexBody],
        reviewThreads: [...harvest.reviewThreads, thread],
        comments: [...harvest.comments, declared],
      },
      expectedReviewers: EXPECTED,
    }).rows.find((candidate) => candidate.head === head);
    expect(row?.raised).toBe((base?.raised ?? 0) + 1);
    expect(row?.cureWorthy).toBe((base?.cureWorthy ?? 0) + 1);
  });

  it('applies a batch only to the body items that predate it, never to a later review of the head', () => {
    const harvest = parseRecordedHarvest(pr138);
    const head = firstHead(harvest);
    const unbound = comment(9000013, '**Below-bar** — the rest, all of them, together.');
    const later = review({
      id: 'PRR_later',
      databaseId: 9000014,
      commitOid: head,
      submittedAt: '2026-09-14T00:00:00Z',
      body: copilotOneItem('A finding raised after the batch was posted.'),
    });
    const row = buildRows({
      harvest: {
        ...harvest,
        reviews: [...harvest.reviews, later],
        comments: [...harvest.comments, unbound],
      },
      expectedReviewers: EXPECTED,
    }).rows.find((candidate) => candidate.head === head);
    expect(row?.manual).toBe(4);
    expect(row?.undispositioned).toBe(1);
  });

  it('keeps anchoring the quiet window on a review whose opening finding is signed', () => {
    const harvest = parseRecordedHarvest(pr138);
    const head = firstHead(harvest);
    const reviewerLatest = harvest.reviews
      .filter((candidate) => candidate.commitOid === head && candidate.author !== 'el-graphael')
      .map((candidate) => Date.parse(candidate.submittedAt))
      .reduce((max, value) => Math.max(max, value), 0);
    const peerReview = review({
      id: 'PRR_peer',
      author: COPILOT,
      commitOid: head,
      submittedAt: new Date(reviewerLatest + 30 * 60 * 1000).toISOString(),
    });
    const signedOpening = {
      id: 'PRRT_peer',
      isResolved: false,
      isOutdated: false,
      path: 'docs/a.md',
      line: 3,
      originalLine: 3,
      reviewId: 'PRR_peer',
      reviewCommitOid: head,
      comments: [
        {
          databaseId: 8,
          reviewId: 'PRR_peer',
          author: COPILOT,
          createdAt: peerReview.submittedAt,
          body: `A finding, signed.${SIGNATURE}`,
        },
      ],
    };
    const now = new Date(reviewerLatest + 35 * 60 * 1000).toISOString();
    const settled = buildRows({
      harvest: {
        ...harvest,
        reviews: [...harvest.reviews, peerReview],
        reviewThreads: [...harvest.reviewThreads, signedOpening],
      },
      expectedReviewers: EXPECTED,
      now,
    }).rows.some((row) => row.head === head);
    expect(settled).toBe(false);
  });

  it('keeps the items of a structured review whose finding quotes the skip phrase', () => {
    const harvest = parseRecordedHarvest(pr138);
    const head = firstHead(harvest);
    const quoting = review({
      id: 'PRR_quoting',
      databaseId: 9000015,
      commitOid: head,
      body: copilotOneItem('The body "Unable to review: service unavailable" must satisfy no leg.'),
    });
    const base = buildRows({ harvest, expectedReviewers: EXPECTED }).rows.find(
      (row) => row.head === head,
    );
    const row = buildRows({
      harvest: { ...harvest, reviews: [...harvest.reviews, quoting] },
      expectedReviewers: EXPECTED,
    }).rows.find((candidate) => candidate.head === head);
    expect(row?.raised).toBe((base?.raised ?? 0) + 1);
  });

  it('lets a thread line disposition the named thread when the thread carries no reply', () => {
    const harvest = parseRecordedHarvest(pr138);
    const head = firstHead(harvest);
    const codexBody = review({
      id: 'PRR_codex_line',
      databaseId: 9000016,
      author: CODEX,
      commitOid: head,
      body: '**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  Said once**\n\nBody.',
    });
    const thread = {
      id: 'PRRT_codex_line',
      isResolved: true,
      isOutdated: false,
      path: 'docs/a.md',
      line: 8,
      originalLine: 8,
      reviewId: 'PRR_codex_line',
      reviewCommitOid: head,
      comments: [
        {
          databaseId: 9,
          reviewId: 'PRR_codex_line',
          author: CODEX,
          createdAt: '2026-09-12T12:00:00Z',
          body: 'The finding.',
        },
      ],
    };
    const declared = comment(
      9000017,
      `**Over-bar** · head SHA:${head.slice(0, 9)} · review 9000016 · \`docs/a.md:8\` · thread PRRT_codex_line · Cured in SHA:deadbeef0.`,
    );
    const base = buildRows({ harvest, expectedReviewers: EXPECTED }).rows.find(
      (row) => row.head === head,
    );
    const row = buildRows({
      harvest: {
        ...harvest,
        reviews: [...harvest.reviews, codexBody],
        reviewThreads: [...harvest.reviewThreads, thread],
        comments: [...harvest.comments, declared],
      },
      expectedReviewers: EXPECTED,
    }).rows.find((candidate) => candidate.head === head);
    const before = counts(base);
    const after = counts(row);
    expect(after.raised).toBe(before.raised + 1);
    expect(after.cureWorthy).toBe(before.cureWorthy + 1);
    expect(after.undispositioned).toBe(before.undispositioned);
  });
});

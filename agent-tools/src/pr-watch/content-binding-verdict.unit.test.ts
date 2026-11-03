import { describe, expect, it } from 'vitest';

import type { ContentLeg } from './content-binding.js';
import type { HarvestedReview } from './reviewer-legs.js';
import { COPILOT, OLD_TIP, TIP } from './state-reading-fixture.js';
import {
  beforeTheSync,
  CODEX,
  completionComment,
  legLine,
  namesTheInference,
  OTHER_PATCH,
  PATCH,
  refusalLinesOf,
  synced,
  verdictOf,
  verdictWithComment,
} from './test-helpers/content-binding-verdict-fixtures.js';

/**
 * A pull request synced with its base after its reviews: the reviews name
 * the commit before the sync, and the head is the sync merge. When the two
 * carry the same patch against the base, the reviews bind the head by
 * content and the verdict reads the tip reviewed; otherwise the leg stays
 * owed and says why. The fixtures live in
 * `test-helpers/content-binding-verdict-fixtures.ts`.
 */

describe('computePrVerdict — reviews bound by content', () => {
  it('reads a review of the commit before a pure sync as a review of the tip, settling at first green with no run on the synced tip', () => {
    const verdict = verdictOf({
      reviews: [beforeTheSync],
      content: synced(PATCH),
      reviewRuns: { kind: 'read', runs: [] },
      roundRequests: [],
    });
    expect(verdict.state).toBe('SETTLE-READY');
    const leg = legLine(verdict, COPILOT);
    expect(leg.startsWith(`${COPILOT}: SATISFIED`) && namesTheInference(leg)).toBe(true);
    expect(
      verdict.evidence.some(
        (line) =>
          line.startsWith(`tip-bound review body present: ${COPILOT}`) && namesTheInference(line),
      ),
    ).toBe(true);
  });

  it.each<[string, ContentLeg, string]>([
    [
      'the sync changed the content the review saw',
      synced(OTHER_PATCH),
      'carries content that differs from the head',
    ],
    [
      'the head’s content could not be read',
      { kind: 'unread', reason: 'the compare diff could not be read' },
      'is not bound by content: the compare diff could not be read',
    ],
  ])('leaves the leg owed, and says why, when %s', (_why, content, why) => {
    const verdict = verdictOf({ reviews: [beforeTheSync], content });
    expect(verdict.state).toBe('SILENT-WAIT-NO-REVIEWER');
    expect(legLine(verdict, COPILOT)).toBe(
      `${COPILOT}: OWED — no substantive review binds the current tip; the review at ${OLD_TIP.slice(0, 10)} ${why}`,
    );
  });

  it.each<[string, string]>([
    ['a substantive review', 'Reviewed 2 of 2 files.'],
    ['a quota marker', 'Review skipped: the spend limit was reached.'],
    ['an unevaluable skip marker', 'Unable to review: the service is unavailable.'],
  ])('holds %s bound by content while a round is requested, and says why', (_what, body) => {
    const verdict = verdictOf({
      reviews: [{ ...beforeTheSync, body }],
      content: synced(PATCH),
      reviewRequests: [COPILOT],
    });
    expect(verdict.state).not.toMatch(/SETTLE-READY|QUOTA-SKIPPED/u);
    const leg = legLine(verdict, COPILOT);
    expect(leg.startsWith(`${COPILOT}: OWED — no substantive review binds the current tip`)).toBe(
      true,
    );
    expect(leg).toContain('is bound by content and waits for the round requested after it');
  });

  it.each<[string, string]>([
    ['Copilot', COPILOT],
    ['Codex', CODEX],
  ])(
    'holds %s’s review bound by content when a round was asked of it after the review, although GitHub lists no pending request',
    (_who, reviewer) => {
      const verdict = verdictOf({
        expectedReviewers: [reviewer],
        reviews: [{ ...beforeTheSync, author: reviewer }],
        content: synced(PATCH),
        roundRequests: [{ reviewer, at: '2026-07-21T11:40:00Z' }],
      });
      expect(verdict.state).not.toBe('SETTLE-READY');
      expect(legLine(verdict, reviewer)).toContain(
        'is bound by content and waits for the round requested after it',
      );
    },
  );

  it('lets a review bound by content stand when every round asked of its reviewer came before it', () => {
    const verdict = verdictOf({
      reviews: [beforeTheSync],
      content: synced(PATCH),
      roundRequests: [{ reviewer: COPILOT, at: '2026-07-21T11:00:00Z' }],
    });
    expect(verdict.state).toBe('SETTLE-READY');
  });

  it('holds only the reviews a round was asked after, letting a later review bound by content stand', () => {
    const verdict = verdictOf({
      reviews: [beforeTheSync, { ...beforeTheSync, submittedAt: '2026-07-21T11:50:00Z' }],
      content: synced(PATCH),
      roundRequests: [{ reviewer: COPILOT, at: '2026-07-21T11:40:00Z' }],
    });
    expect(verdict.state).toBe('SETTLE-READY');
  });

  it('lets a review of the exact head stand under a round asked after it', () => {
    const verdict = verdictOf({
      reviews: [{ ...beforeTheSync, commitOid: TIP }],
      content: synced(PATCH),
      roundRequests: [{ reviewer: COPILOT, at: '2026-07-21T11:40:00Z' }],
    });
    expect(verdict.state).toBe('SETTLE-READY');
  });

  it('reads a quota marker on the commit before a pure sync as the tip’s, naming the inference', () => {
    const marker: HarvestedReview = {
      ...beforeTheSync,
      body: 'Review skipped: the spend limit was reached.',
    };
    const verdict = verdictOf({ reviews: [marker], content: synced(PATCH) });
    expect(verdict.state).toBe('QUOTA-SKIPPED');
    expect(namesTheInference(legLine(verdict, COPILOT))).toBe(true);
  });
});

describe('computePrVerdict — completion comments bound by content', () => {
  it('reads a completion comment on the commit before a pure sync as a review of the tip, never refusing it as stale', () => {
    const clean = completionComment('IC_1', '**Reviewed commit:** `bbbbbbbbbb`');
    const bound = verdictWithComment(clean, synced(PATCH));
    expect(
      bound.evidence.some(
        (line) =>
          line.includes('IC_1') &&
          line.includes('read as a review of the tip') &&
          namesTheInference(line),
      ),
    ).toBe(true);
    expect(refusalLinesOf(bound, 'IC_1')).toStrictEqual([]);
    expect(refusalLinesOf(verdictWithComment(clean, synced(OTHER_PATCH)), 'IC_1')).toHaveLength(1);
  });

  it('holds a completion comment bound by content when a round was asked of Codex after it', () => {
    const verdict = verdictOf({
      expectedReviewers: [CODEX],
      reviews: [],
      completionComments: {
        reviews: [completionComment('IC_3', '**Reviewed commit:** `bbbbbbbbbb`')],
        refused: [],
        notices: [],
      },
      content: synced(PATCH),
      roundRequests: [{ reviewer: CODEX, at: '2026-07-21T11:45:00Z' }],
    });
    expect(legLine(verdict, CODEX)).toContain(
      'is bound by content and waits for the round requested after it',
    );
  });

  it('never refuses a skip marker bound by content as naming a stale commit, while its leg waits', () => {
    const marker = completionComment(
      'IC_2',
      '**Reviewed commit:** `bbbbbbbbbb` — unable to review',
    );
    const bound = verdictWithComment(marker, synced(PATCH));
    expect(
      legLine(bound, CODEX).startsWith(
        `${CODEX}: OWED — tip-bound skip marker with unevaluable scope`,
      ),
    ).toBe(true);
    expect(refusalLinesOf(bound, 'IC_2')).toStrictEqual([]);
    expect(refusalLinesOf(verdictWithComment(marker, synced(OTHER_PATCH)), 'IC_2')).toHaveLength(1);
  });
});

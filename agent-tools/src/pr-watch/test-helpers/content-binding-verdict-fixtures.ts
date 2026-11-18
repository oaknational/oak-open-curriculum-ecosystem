import type { CompletionCommentReview } from '../completion-comments.js';
import type { ContentLeg, PatchId } from '../content-binding.js';
import { syntheticPatchId } from '../content-fixture.js';
import type { HarvestedReview } from '../reviewer-legs.js';
import { COPILOT, OLD_TIP, settledReading, TIP } from '../state-reading-fixture.js';
import type { PrStateReading, PrVerdict } from '../state-types.js';
import { computePrVerdict } from '../states.js';

/**
 * The fixtures of the content-binding verdict suite: a pull request synced
 * with its base after its reviews, its reviews and completion comments on
 * the commit before the sync, and the readings of the verdict the suite
 * asserts on. The patch-ids are synthetic; `content-reader.ts` reads real
 * ones.
 */

export const CODEX = 'chatgpt-codex-connector';
export const PATCH = syntheticPatchId('1');
export const OTHER_PATCH = syntheticPatchId('f');
// Checks went green on the sync merge at 12:00Z; the reviews came before it.
const FIRST_GREEN = '2026-07-21T12:01:00Z';

/** The content leg of a sync: the head carries PATCH, the reviewed commit the given patch. */
export function synced(reviewedPatch: PatchId): ContentLeg {
  return {
    kind: 'read',
    head: PATCH,
    reviewed: [{ oid: OLD_TIP, content: { kind: 'id', id: reviewedPatch } }],
  };
}

/** Copilot's review of the commit before the sync. */
export const beforeTheSync: HarvestedReview = {
  author: COPILOT,
  state: 'COMMENTED',
  body: 'Reviewed 2 of 2 files.',
  commitOid: OLD_TIP,
  submittedAt: '2026-07-21T11:30:00Z',
};

/** The verdict over the settled reading with the given overrides, at first green. */
export function verdictOf(overrides: Partial<PrStateReading>): PrVerdict {
  return computePrVerdict(settledReading(overrides), FIRST_GREEN);
}

/** The reviewer's leg line: its state, then its detail. */
export function legLine(verdict: PrVerdict, reviewer: string): string {
  return (
    verdict.evidence.find(
      (line) => /^\S+: (SATISFIED|OWED|SKIPPED)/u.test(line) && line.startsWith(`${reviewer}: `),
    ) ?? ''
  );
}

/** Whether a line names the content-binding inference and the three ids it binds. */
export function namesTheInference(line: string): boolean {
  return (
    line.includes('bound by content') &&
    [PATCH, OLD_TIP, TIP].every((id) => line.includes(id.slice(0, 10)))
  );
}

/** A Codex completion comment with the given id and body, left on the commit before the sync. */
export function completionComment(id: string, body: string): CompletionCommentReview {
  return {
    id,
    author: CODEX,
    state: 'COMMENTED',
    body,
    commitOid: OLD_TIP,
    submittedAt: '2026-07-21T11:40:00Z',
    transport: 'completion-comment',
  };
}

/** The verdict over a Copilot review of the tip and one Codex completion comment, under the given content leg. */
export function verdictWithComment(
  review: CompletionCommentReview,
  content: ContentLeg,
): PrVerdict {
  return verdictOf({
    expectedReviewers: [COPILOT, CODEX],
    reviews: [{ ...beforeTheSync, commitOid: TIP }],
    completionComments: { reviews: [review], refused: [], notices: [] },
    content,
  });
}

/** The evidence lines refusing the completion comment with the given id. */
export const refusalLinesOf = (verdict: PrVerdict, id: string): string[] =>
  verdict.evidence.filter(
    (line) => line.startsWith(`${CODEX}: completion comment ${id}`) && line.includes('refused'),
  );

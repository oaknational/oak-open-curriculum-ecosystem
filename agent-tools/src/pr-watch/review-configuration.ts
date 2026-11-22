import { err, ok, type Result } from '@oaknational/result';
import { z } from 'zod';

import { parseWithSchema } from '../core/schema-parse.js';

/**
 * The repository's automatic-review configuration, read from the base
 * branch's rules (`GET /repos/{owner}/{repo}/rules/branches/{branch}`, the
 * `copilot_code_review` rule): what the rulesets say the vendor reviews on
 * its own. The reading is evidence and nothing more: its one consumer is
 * the evidence line below, printed with every reviewer-leg verdict. No leg
 * is decided from it. The legs are computed from the pull request's own
 * history, its reviews and the rounds asked (`reviewer-legs.ts`), so a
 * review the configuration brings is seen when its request appears there.
 *
 * The source read is the repository's: its rulesets, which the rules API
 * exposes. Two things that also decide whether a review follows a push are
 * not read: each ruleset's bypass list, and an author's personal Copilot
 * setting, which no API exposes to the tooling. So the line states what a
 * ruleset on the base branch carries, never whether a given author's push
 * is reviewed; that is read from the pull request's timeline.
 *
 * @packageDocumentation
 */

/**
 * Three states, each named: the rules were not read (why), no Copilot rule
 * binds the branch, or the rule's two switches. `unread` is named with its
 * reason, never shown as an unconfigured branch.
 */
export type ReviewConfiguration =
  | { readonly kind: 'unread'; readonly reason: string }
  | { readonly kind: 'absent' }
  | { readonly kind: 'configured'; readonly reviewOnPush: boolean; readonly reviewDraft: boolean };

const copilotRuleSchema = z.object({
  type: z.literal('copilot_code_review'),
  parameters: z.object({
    review_on_push: z.boolean(),
    review_draft_pull_requests: z.boolean(),
  }),
});
const rulesSchema = z.array(z.object({ type: z.string() }).loose());

/**
 * The Copilot rule out of a branch's rules. Several rulesets may each carry
 * one; a review on push by any of them is a review on push. A Copilot rule
 * whose parameters are missing or misshapen refuses the read rather than
 * reading as "no rule" (a malformed response must never look like an
 * unconfigured branch): every copilot-typed rule must parse, counted.
 */
export function parseReviewConfiguration(value: unknown): Result<ReviewConfiguration, Error> {
  const parsed = parseWithSchema({ label: 'branch rules', schema: rulesSchema, value });
  if (!parsed.ok) {
    return parsed;
  }
  const copilotTyped = parsed.value.filter((rule) => rule.type === 'copilot_code_review');
  const copilot = copilotTyped.flatMap((rule) => {
    const result = copilotRuleSchema.safeParse(rule);
    return result.success ? [result.data] : [];
  });
  if (copilot.length !== copilotTyped.length) {
    return err(new Error('a copilot_code_review rule carries no readable parameters'));
  }
  if (copilot.length === 0) {
    return ok({ kind: 'absent' });
  }
  return ok({
    kind: 'configured',
    reviewOnPush: copilot.some((rule) => rule.parameters.review_on_push),
    reviewDraft: copilot.some((rule) => rule.parameters.review_draft_pull_requests),
  });
}

/**
 * One evidence line naming what the configuration says, or why it is
 * unknown. It claims nothing about any leg, and the configured line says
 * that the switches are those of any ruleset on the base branch, with no
 * bypass list read.
 */
export function reviewConfigurationEvidence(configuration: ReviewConfiguration): string {
  if (configuration.kind === 'unread') {
    return `review configuration unread (${configuration.reason})`;
  }
  if (configuration.kind === 'absent') {
    return 'review configuration: no copilot_code_review rule on the base branch';
  }
  return `review configuration: copilot_code_review review_on_push=${String(configuration.reviewOnPush)} review_draft_pull_requests=${String(configuration.reviewDraft)} (of any ruleset on the base branch; bypass lists not read)`;
}

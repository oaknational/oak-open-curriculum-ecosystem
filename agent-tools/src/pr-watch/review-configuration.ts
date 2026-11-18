import { err, ok, type Result } from '@oaknational/result';
import { z } from 'zod';

import { parseWithSchema } from '../core/schema-parse.js';

/**
 * The repository's automatic-review configuration, read from the base
 * branch's rules (`GET /repos/{owner}/{repo}/rules/branches/{branch}`, the
 * `copilot_code_review` rule): what the vendor reviews on its own, so a leg
 * is owed only where the configuration or a request says so. The tooling
 * once assumed a review on every push; when the owner reduced Copilot's
 * reviews at GitHub to the ready-mark alone (2026-10-15), every later tip
 * read OWED with nothing coming, and no code-class pull request could merge
 * after a settlement push without a hand-made request (the owner's framing,
 * 2026-10-16: read the configuration and derive what is owed from it).
 *
 * The source read is the repository's: its rulesets, which the rules API
 * exposes. An author's personal Copilot setting (automatic review of the
 * author's own pushes) is a separate source no API exposes to the tooling;
 * it is read empirically, by whether later tips receive a review nobody
 * requested (none did on three settlement pushes of 2026-10-16), and an
 * author who enables it makes every later tip owed by the review it brings,
 * which the request surface shows within seconds and the legs read as OWED.
 *
 * @packageDocumentation
 */

/** The login GitHub's Copilot reviewer carries on reviews, requests and check-runs. */
export const COPILOT_REVIEWER_LOGIN = 'copilot-pull-request-reviewer';

/**
 * Three states, each named: the rules were not read (why), no Copilot rule
 * binds the branch, or the rule's two switches. `unread` keeps the legs
 * conservative (owed until a review binds the tip), never a silent pass.
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

/** One evidence line naming what the configuration says, or why it is unknown. */
export function reviewConfigurationEvidence(configuration: ReviewConfiguration): string {
  if (configuration.kind === 'unread') {
    return `review configuration unread (${configuration.reason}): every expected leg stays owed until a review binds the tip`;
  }
  if (configuration.kind === 'absent') {
    return 'review configuration: no copilot_code_review rule on the base branch; every expected leg owed until a review binds the tip';
  }
  return `review configuration: copilot_code_review review_on_push=${String(configuration.reviewOnPush)} review_draft_pull_requests=${String(configuration.reviewDraft)}`;
}

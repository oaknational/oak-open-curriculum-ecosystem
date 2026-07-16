import { err, ok, type Result } from '@oaknational/result';
import { z } from 'zod';

import { CONCERN_KINDS, type ReviewDecision } from './types.js';

const concernDecisionSchema = z
  .object({
    verdict: z.literal('concern'),
    kind: z.enum(CONCERN_KINDS),
    change_index: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  })
  .strict();

const passDecisionSchema = z
  .object({
    verdict: z.literal('pass'),
    kind: z.literal('none'),
    change_index: z.literal(0),
  })
  .strict();

const uncertainDecisionSchema = z
  .object({
    verdict: z.literal('uncertain'),
    kind: z.literal('none'),
    change_index: z.literal(0),
  })
  .strict();

const reviewDecisionSchema = z.discriminatedUnion('verdict', [
  concernDecisionSchema,
  passDecisionSchema,
  uncertainDecisionSchema,
]);

export type ReviewDecisionError =
  | { readonly kind: 'invalid-change-count' }
  | { readonly kind: 'invalid-decision' }
  | { readonly kind: 'change-index-out-of-range' };

/** Validate the model's entire final message against the closed decision shape. */
export function parseReviewDecision(
  message: string,
  changeCount: number,
): Result<ReviewDecision, ReviewDecisionError> {
  if (!Number.isInteger(changeCount) || changeCount < 1 || changeCount > 3) {
    return err({ kind: 'invalid-change-count' });
  }
  const json = parseJson(message);
  if (!json.ok) {
    return json;
  }
  const decision = reviewDecisionSchema.safeParse(json.value);
  if (!decision.success) {
    return err({ kind: 'invalid-decision' });
  }
  if (decision.data.verdict === 'concern' && decision.data.change_index > changeCount) {
    return err({ kind: 'change-index-out-of-range' });
  }
  return ok(decision.data);
}

function parseJson(message: string): Result<unknown, ReviewDecisionError> {
  try {
    const parsed: unknown = JSON.parse(message);
    return ok(parsed);
  } catch {
    return err({ kind: 'invalid-decision' });
  }
}

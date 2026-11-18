import { err, ok, type Result } from '@oaknational/result';

/**
 * The `--expect` flag's grammar, shared by `pr state` and `merge-bot merge`:
 * one value per configured reviewer, as a GitHub login, or the one reserved
 * value `none`. A set declared `none` is EMPTY by the seat's judgement, never
 * by default: the owner's one question (2026-10-27) is "do we need a review
 * in order for this work to be safe and effective?", and a seat that answers
 * no says so where the door can read it, so the verdict's evidence carries
 * the judgement into the merge record. An undeclared set still defaults to
 * the observed surface and never merges.
 *
 * @packageDocumentation
 */

/** The reserved `--expect` value declaring the expected set empty, read in any case. */
const EXPECT_NONE = 'none';

/** One parsed `--expect` value. */
export type ExpectValue =
  { readonly kind: 'none' } | { readonly kind: 'login'; readonly login: string };

/**
 * GitHub login grammar plus the app `[bot]` suffix. A blank or garbage
 * `--expect` value would satisfy the declared-set gate while naming a
 * reviewer that can never be OWED — the one-token way around the
 * settlement guarantee (security D4). `none` is read before the grammar,
 * in any case, so no spelling of it becomes a forever-OWED login.
 */
const EXPECT_GRAMMAR = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})?(?:\[bot\])?$/u;

/** Parse one `--expect` value: a login, or the reserved `none`. */
export function parseExpectValue(value: string): Result<ExpectValue, Error> {
  if (value.toLowerCase() === EXPECT_NONE) {
    return ok({ kind: 'none' });
  }
  if (!EXPECT_GRAMMAR.test(value)) {
    return err(new Error(`--expect must be a GitHub login or ${EXPECT_NONE} (got "${value}")`));
  }
  return ok({ kind: 'login', login: value });
}

/**
 * Resolve the collected `--expect` values to the declared set: `null` when
 * the flag was never given (undeclared), an empty array when it was `none`,
 * else the logins in the order declared. `none` beside a login contradicts
 * itself and is refused.
 */
export function declaredExpectedSet(
  values: readonly ExpectValue[],
): Result<readonly string[] | null, Error> {
  const logins = values.flatMap((value) => (value.kind === 'login' ? [value.login] : []));
  const none = values.some((value) => value.kind === 'none');
  if (none && logins.length > 0) {
    return err(
      new Error(
        `--expect ${EXPECT_NONE} declares no reviewer and cannot be combined with a login (got ${logins.join(', ')})`,
      ),
    );
  }
  if (none) {
    return ok([]);
  }
  return ok(logins.length === 0 ? null : logins);
}

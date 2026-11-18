import type { Result } from '@oaknational/result';

/**
 * A failed Result's message, for tests that assert on it. An ok Result reads
 * as a message no assertion expects, so a positive check on an ok Result
 * fails rather than passing vacuously; pair a negative check with
 * `expect(result.ok).toBe(false)`.
 */
export function failureMessage(result: Result<unknown, Error>): string {
  return result.ok ? '(the result was ok)' : result.error.message;
}

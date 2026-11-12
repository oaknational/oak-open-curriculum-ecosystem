import type { Result } from '@oaknational/result';

import type { PullRequestOutcome } from '../pull-request-report.js';

/**
 * A pull-request verb's refusal reason, for tests that assert on it. A
 * failure, or an outcome that is not a refusal, reads as a message no
 * assertion expects, so a positive check passes only on a refusal and names
 * what happened instead when it does not.
 */
export function refusalReason(result: Result<PullRequestOutcome, Error>): string {
  if (!result.ok) {
    return `(the result failed: ${result.error.message})`;
  }
  return result.value.kind === 'refused'
    ? result.value.reason
    : `(the outcome was ${result.value.kind})`;
}

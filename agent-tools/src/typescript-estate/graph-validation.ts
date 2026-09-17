import { err, ok, type Result } from '@oaknational/result';

import { EstateReviewError } from './errors.js';

export { compareUtf16 as compareGraphText } from './utf16-order.js';

/**
 * Remove the maximal run of trailing '/' characters from a repo prefix.
 *
 * Replaces `value.replace(/\/+$/u, '')`, whose greedy `\/+` before an end
 * anchor restarts and re-backtracks a whole slash run at every slash position:
 * O(n^2) on a long run of slashes that does not end the string. This
 * right-to-left scan visits each trailing character exactly once and never
 * backtracks: O(n). Match semantics are unchanged — one non-global,
 * end-anchored strip of the maximal trailing slash run.
 */
export function withoutTrailingSlashes(value: string): string {
  let end = value.length;
  while (end > 0 && value[end - 1] === '/') {
    end -= 1;
  }
  return value.slice(0, end);
}

export function validateGraphRepoPath(value: string): Result<undefined, EstateReviewError> {
  return value.length > 0 && !value.startsWith('/') && !value.split('/').includes('..')
    ? ok(undefined)
    : err(new EstateReviewError('VALIDATION_FAILED', 'repo path must be non-empty and contained'));
}

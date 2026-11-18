import { describe, expect, it } from 'vitest';

import { isVendorErrorReview } from './vendor-error-reviews.js';

/**
 * A vendor's error review is known by its whole body against the recorded
 * set, whatever the review's state, so a finding that quotes its wording is
 * never read as one.
 */

const COPILOT_ERROR =
  'Copilot encountered an error and was unable to review this pull request. You can try again by re-requesting a review.';

describe('isVendorErrorReview', () => {
  it('reads the recorded Copilot error body as an error review', () => {
    expect(isVendorErrorReview(COPILOT_ERROR)).toBe(true);
  });

  it('reads the same body through changed whitespace as the same error review', () => {
    const rewrapped =
      '\n  Copilot encountered an error and was unable to review\nthis pull request.  You can try again by re-requesting a review.\n\n';
    expect(isVendorErrorReview(rewrapped)).toBe(true);
  });

  it('never reads a clean review, or a finding that quotes the wording, as an error review', () => {
    expect(isVendorErrorReview('🟢 No findings. Reviewed 2 of 2 files.')).toBe(false);
    // The skip phrase's recorded false positive: a finding quoting it.
    expect(
      isVendorErrorReview('The body "Unable to review: service unavailable" must satisfy no leg.'),
    ).toBe(false);
    expect(isVendorErrorReview(`The vendor posted "${COPILOT_ERROR}" on the old tip.`)).toBe(false);
  });
});

describe("isVendorErrorReview — the Codex connector's failed run", () => {
  // The Code Review row of the summary the connector kept on pull request
  // 362, as it posted it on 2026-10-27: `completion-comments.ts` reads the
  // row as a review whose body is the row itself.
  const FAILED_ROW =
    '| 📝 **Code Review** | ⚠️ **Failed** <relative-time datetime="2026-10-27T15:05:50.901506Z">2026-10-27T15:05:50.901506Z</relative-time><br/>We couldn’t complete this review. Comment `@codex review` to try again. | `8f2b7fd` | Manual request |';

  it('reads a summary Code Review row whose status is Failed, as posted, as an error review: the status word is the report', () => {
    expect(isVendorErrorReview(FAILED_ROW)).toBe(true);
    expect(isVendorErrorReview(FAILED_ROW.replace('Manual request', 'New commits'))).toBe(true);
    expect(isVendorErrorReview(`\n  ${FAILED_ROW}\n`)).toBe(true);
  });

  it.each([
    [
      'a completed row',
      '| 📝 **Code Review** | ✅ **Completed** <relative-time datetime="t">t</relative-time> | `1f97bfc` | New commits |',
    ],
    [
      'a running row',
      '| 📝 **Code Review** | 🔄 **Running** since <relative-time datetime="t">t</relative-time> | `1f97bfc` | New commits |',
    ],
    ['a failed row of another review', FAILED_ROW.replace('Code Review', 'Security Review')],
    ['a failed row naming no commit', FAILED_ROW.replace('`8f2b7fd`', '—')],
    ['prose that quotes the row', `The connector posted "${FAILED_ROW}" on the old tip.`],
    ['the row followed by a finding', `${FAILED_ROW}\n\nThe row above says the run failed.`],
  ])('never reads %s as an error review', (_name, body) => {
    expect(isVendorErrorReview(body)).toBe(false);
  });
});

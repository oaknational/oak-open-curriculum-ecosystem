/**
 * Conversation comments a vendor posts about its own service, naming no
 * commit: the Codex connector's usage-limits notice, posted beside each run
 * it fails while its account is over quota. Such a comment is not a
 * reviewer's report and not a refusal of one: it says why the vendor could
 * not review, so the verdict prints it and nothing waits on it. Each entry
 * is a body recorded first-hand, compared whole (trimmed, whitespace
 * collapsed), so a comment that quotes the wording is never read as one.
 *
 * The Codex body is recorded three times: on pull request 362 at
 * 2026-10-22T09:19:06Z and 2026-10-27T15:06:00Z, and on pull request 358 at
 * 2026-10-27T15:01:16Z, each posted seconds after the connector rewrote its
 * summary's Code Review row to Failed (`completion-summary.ts`).
 *
 * This module imports nothing, so both estates carry the same bytes; the
 * whitespace collapse is therefore its own, as `vendor-error-reviews.ts`
 * carries its own.
 *
 * @packageDocumentation
 */

/** The recorded vendor notice bodies, each as the vendor posted it. */
const VENDOR_NOTICE_BODIES: readonly string[] = [
  'Codex usage limits have been reached for code reviews. Please check with the admins of this repo to increase the limits by adding credits.',
];

function collapsed(body: string): string {
  return body.trim().replaceAll(/\s+/gu, ' ');
}

const KNOWN = new Set(VENDOR_NOTICE_BODIES.map(collapsed));

/**
 * Whether a comment body is a recorded vendor notice: the vendor's word on
 * its own service, naming no commit.
 *
 * @param body - The comment's body.
 */
export function isVendorNotice(body: string): boolean {
  return KNOWN.has(collapsed(body));
}

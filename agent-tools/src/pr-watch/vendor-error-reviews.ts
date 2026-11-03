/**
 * Review bodies a vendor posts when its review run failed. Such a review
 * object says that no review occurred, whatever its state, so it satisfies no
 * leg and carries no finding to tally. Each entry is a body recorded
 * first-hand, compared whole (trimmed, whitespace collapsed), so a finding
 * that quotes the wording is never read as one. A wording is added here when
 * it is first recorded; until then the skip-marker pattern in
 * `skip-markers.ts` is the second net.
 *
 * The Copilot body is recorded five times, each state COMMENTED: three on
 * 2026-09-13 and two on 2026-09-28.
 *
 * The Codex connector posts no review object for a run it could not
 * complete: it rewrites its summary comment's Code Review row to the status
 * **Failed**, naming the commit it tried, and `completion-comments.ts` reads
 * that row as a review whose body is the row as posted. The status word is
 * the connector's closed vocabulary (Completed, Running, Failed), so such a
 * body is an error review whatever the row's message, matched whole: a row
 * quoted inside prose, or followed by any text, is not one. Recorded on pull
 * requests 358 and 362, 2026-10-27, each beside a usage-limits notice
 * (`vendor-notices.ts`).
 *
 * This module imports nothing, so both estates carry the same bytes.
 *
 * @packageDocumentation
 */

/** The recorded vendor error bodies, each as the vendor posted it. */
const VENDOR_ERROR_BODIES: readonly string[] = [
  'Copilot encountered an error and was unable to review this pull request. You can try again by re-requesting a review.',
];

// The connector's Failed row, whole: its review cell, its status cell opening
// with the bold status word, its commit cell as an inline-code prefix of at
// least seven hex characters, and any further cells, each free of a pipe.
const CODEX_FAILED_ROW =
  /^\| [^|]*\*\*Code Review\*\* \| [^|]*\*\*Failed\*\*[^|]*\| `[0-9a-f]{7,40}` \|(?: [^|]*\|)*$/u;

function collapsed(body: string): string {
  return body.trim().replaceAll(/\s+/gu, ' ');
}

const KNOWN = new Set(VENDOR_ERROR_BODIES.map(collapsed));

/**
 * Whether a review body is a vendor's error body, recorded whole or the
 * connector's Failed row: the vendor could not review.
 *
 * @param body - The review's body.
 */
export function isVendorErrorReview(body: string): boolean {
  const whole = collapsed(body);
  return KNOWN.has(whole) || CODEX_FAILED_ROW.test(whole);
}

/**
 * The leg-detail note that counts the vendor error reviews among a tip's
 * review bodies, or an empty string when there are none: discarded evidence
 * is counted, never dropped silently.
 *
 * @param bodies - The bodies of the reviews that stand for the tip.
 */
export function vendorErrorNote(bodies: readonly string[]): string {
  const errors = bodies.filter(isVendorErrorReview).length;
  return errors === 0
    ? ''
    : `; ${String(errors)} tip-bound vendor error review${errors === 1 ? '' : 's'} ignored (the vendor could not review this tip)`;
}

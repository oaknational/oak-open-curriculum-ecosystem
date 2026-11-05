/**
 * Skip-marker classification (SKILL: substantive reviews vs SKIPPED markers).
 * A skip phrase alone declares NO REVIEW OCCURRED — such a body must never
 * read SATISFIED. Only a marker whose scope is evaluable (a quota/billing
 * declaration, per the owner ruling 2026-07-21) settles the leg as SKIPPED
 * immediately; an unevaluable marker ("service unavailable") falls through
 * to the checks-green timeout arm instead.
 *
 * The phrase is looked for outside quotation: a double-quoted span or a
 * code span on one line is a reviewer reporting what was said, so a finding
 * that quotes a marker is still a review. A quoted LINE (`>`) is still read,
 * since a vendor posts its own marker in a blockquote, and a marker missed
 * there would read its body as a review. A curly span runs to its closer or
 * to the next opener, whichever comes first, so nested curly quotes mark only
 * the inner span.
 *
 * @packageDocumentation
 */

const SKIP_PATTERN = /review skipped|unable to review/iu;
const QUOTA_PATTERN = /spend limit|overage|quota/iu;
// Each span's class excludes its own opener as well as its closer, so an
// unclosed opener is abandoned at the next opener instead of re-scanned from
// every one: linear over a body of any size (the analyser's S8786 finding).
const QUOTED_SPAN = /"[^"\n]*"|“[^“”\n]*”|`[^`\n]*`/gu;

function unquoted(body: string): string {
  return body.replaceAll(QUOTED_SPAN, ' ');
}

/**
 * Whether a review body is a reviewer's skip marker ("review skipped",
 * "unable to review", outside quotation): a declaration that no review
 * occurred. Such a body satisfies no reviewer leg and carries no finding
 * prose; the tally reads it the same way.
 *
 * @param body - The review's body.
 */
export function isSkipMarker(body: string): boolean {
  return SKIP_PATTERN.test(unquoted(body));
}

/**
 * Whether a skip marker declares a quota or billing scope, which settles the
 * leg as SKIPPED at once.
 *
 * @param body - The review's body.
 */
export function isScopeDeclaredSkip(body: string): boolean {
  return isSkipMarker(body) && QUOTA_PATTERN.test(body);
}

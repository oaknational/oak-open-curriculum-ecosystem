/**
 * The recorded fields a disposition carries, as the pr-lifecycle skill's
 * intake contract defines them (§"The review-round state machine",
 * "Disposition format"): the bar marker is the opening bold span of a signed
 * reply or comment line, and the count reads the marker and nothing else.
 * This module is the marker grammar; it derives nothing from prose.
 */

/** The two bar readings PDR-140's worthiness test yields. */
export type BarMarker = 'over-bar' | 'below-bar';

// The closed grammar of the opening bold span — the span's ENTIRE text: an
// optional scope prefix, exactly one bar token, an optional prong suffix, an
// optional full stop. Anything else in the span (a negation, a second token,
// other words) is no marker. Case-insensitive.
const MARKER_SPAN =
  /^(?:in scope, |out of scope, )?(over-bar|below-bar)(?: on prong (?:one|two))?\.?$/iu;

// A body opens with a marker only when its first non-empty line starts with
// a bold span; the span's text is read up to the closing `**`.
const OPENING_BOLD_SPAN = /^\*\*([^*\n]+)\*\*/u;

/**
 * Read the bar marker a disposition opens with, or `null` when the body opens
 * with no bold span or the span's text is outside the closed grammar.
 */
export function readBarMarker(body: string): BarMarker | null {
  const firstLine = body.split('\n').find((line) => line.trim() !== '') ?? '';
  const span = OPENING_BOLD_SPAN.exec(firstLine.trimStart());
  if (span === null) {
    return null;
  }
  const token = MARKER_SPAN.exec(span[1] ?? '');
  if (token === null) {
    return null;
  }
  return (token[1] ?? '').toLowerCase() === 'over-bar' ? 'over-bar' : 'below-bar';
}

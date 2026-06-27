/**
 * Misconception node-id mint (G2 — settled identity rule).
 *
 * @remarks
 * Mints the kind-qualified misconception node id
 * `misconception:<lessonSlug>#<hash16(normalise(text))>` — content-hash,
 * lesson-scoped, text-only (plan `graph-tools-value-redesign`, deliverable
 * `g2-misconception-view`; design verdict
 * `.agent/reports/g2-misconception-mint-rule-design-2026-06-10.md`):
 *
 * - **Content-hash**: a text edit mints a new id (honest churn); an id can
 *   never silently re-point at different content, and ids are independent of
 *   enumeration order (an ordinal mint would inherit the pipeline's
 *   filesystem-dependent file order).
 * - **Lesson-scoped**: identical texts in different lessons stay distinct
 *   nodes, preserving per-lesson response context (the extractor's
 *   deliberate no-dedup contract).
 * - **Text-only**: the misconception text IS the identity; the response is
 *   payload — a response rewrite updates the node under a stable id.
 *
 * `normalise` applies to the hash input only; the emitted node keeps the raw
 * display text. No unicode transform layer: the corpus is NFC-normalised at
 * source (measured 0/12,858 divergent), pinned by an assertion in the golden
 * vectors, not a transform here.
 */
import { createHash } from 'node:crypto';

/** A kind-qualified misconception node id. */
export type MisconceptionNodeId = `misconception:${string}`;

/**
 * Number of hex characters of the SHA-256 digest used in the id.
 *
 * @remarks
 * 64 bits against a ≤2-entries-per-lesson identity scope makes collisions
 * negligible (birthday bound ≈ 10⁻¹¹ corpus-wide). A deliberate change to
 * this constant (e.g. full-hash ids for greppability) is a visible contract
 * amendment — the golden-vector test pins it.
 */
const HASH_PREFIX_LENGTH = 16;

/**
 * Normalises misconception text for hashing: trim, collapse internal
 * whitespace runs to one space, lowercase.
 *
 * @param text - Raw misconception text
 * @returns The normalised hash input (never used for display)
 */
export function normaliseMisconceptionText(text: string): string {
  return text.trim().replaceAll(/\s+/g, ' ').toLowerCase();
}

/**
 * Mints the kind-qualified, content-hashed misconception node id.
 *
 * @param lessonSlug - The owning lesson's slug (the identity scope qualifier)
 * @param misconceptionText - Raw misconception text (normalised internally)
 * @returns `misconception:<lessonSlug>#<first 16 hex of SHA-256(normalised text)>`
 */
export function mintMisconceptionId(
  lessonSlug: string,
  misconceptionText: string,
): MisconceptionNodeId {
  const digest = createHash('sha256')
    .update(normaliseMisconceptionText(misconceptionText), 'utf8')
    .digest('hex')
    .slice(0, HASH_PREFIX_LENGTH);
  return `misconception:${lessonSlug}#${digest}`;
}

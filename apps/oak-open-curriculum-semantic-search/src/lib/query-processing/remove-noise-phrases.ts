/**
 * Noise phrase removal for search query preprocessing.
 *
 * Removes colloquial filler phrases and pedagogical intent markers
 * that dilute search signal. Pure function with no side effects.
 *
 * @packageDocumentation
 * @see `.agent/plans/semantic-search/part-1-search-excellence.md` Phase B.4
 */

/**
 * Noise phrase patterns to remove from queries.
 *
 * Each pattern is a regex that matches common filler phrases
 * in teacher/student search queries. Patterns are applied
 * case-insensitively in the order defined.
 */
const NOISE_PATTERNS: readonly RegExp[] = [
  // Colloquial filler: "that X stuff" (optionally followed by "for")
  /\bthat\s+(.+?)\s+stuff(\s+for)?/i,

  // Colloquial filler: "the bit where"
  /\bthe\s+bit\s+where\s+(you\s+)?/i,

  // Question starters: "how do I", "how to"
  /\bhow\s+do\s+I\s+/i,
  /\bhow\s+to\s+/i,

  // Question starters: "what is"
  /\bwhat\s+is\s+/i,

  // Pedagogical intent: "teach my students about"
  /\bteach\s+my\s+students\s+about\s+/i,

  // Pedagogical intent: "lesson on"
  /\blesson\s+on\s+/i,

  // Pedagogical intent: "help with"
  /\bhelp\s+with\s+/i,
] as const;

/**
 * Remove noise phrases from a search query.
 *
 * Applies pattern matching to remove common filler phrases that
 * dilute search signal. Preserves the core curriculum terms.
 *
 * **Pure function**: No side effects, deterministic output.
 *
 * @param query - The search query to clean
 * @returns Query with noise phrases removed, trimmed
 *
 * @example
 * ```typescript
 * removeNoisePhrases('that sohcahtoa stuff for triangles')
 * // Returns: 'sohcahtoa triangles'
 *
 * removeNoisePhrases('how to solve quadratic equations')
 * // Returns: 'solve quadratic equations'
 * ```
 */
export function removeNoisePhrases(query: string): string {
  let cleaned = query;

  // Apply each noise pattern in sequence
  for (const pattern of NOISE_PATTERNS) {
    // Special handling for "that X stuff" pattern - extract X
    if (pattern.source.includes('that')) {
      cleaned = cleaned.replace(pattern, '$1');
    } else {
      // For other patterns, just remove them
      cleaned = cleaned.replace(pattern, '');
    }
  }

  // Normalize whitespace and trim
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  return cleaned;
}

/**
 * Noise phrase removal for search query preprocessing.
 *
 * Removes colloquial filler phrases and pedagogical intent markers
 * that dilute search signal. Pure function with no side effects.
 *
 * @packageDocumentation
 */

/**
 * Noise phrase patterns to remove from queries.
 *
 * Each pattern is a regex matching common filler phrases
 * in teacher/student search queries. Applied case-insensitively.
 */
const NOISE_PATTERNS: readonly RegExp[] = [
  /\bthat\s+(.+?)\s+stuff(\s+for)?/i,
  /\bthe\s+bit\s+where\s+(you\s+)?/i,
  /\bhow\s+do\s+I\s+/i,
  /\bhow\s+to\s+/i,
  /\bwhat\s+is\s+/i,
  /\bteach\s+my\s+students\s+about\s+/i,
  /\blesson\s+on\s+/i,
  /\bhelp\s+with\s+/i,
];

/**
 * Remove noise phrases from a search query.
 *
 * @param query - The search query to clean
 * @returns Query with noise phrases removed, trimmed
 */
export function removeNoisePhrases(query: string): string {
  let cleaned = query;

  for (const pattern of NOISE_PATTERNS) {
    if (pattern.source.includes('that')) {
      cleaned = cleaned.replace(pattern, '$1');
    } else {
      cleaned = cleaned.replace(pattern, '');
    }
  }

  return cleaned.replace(/\s+/g, ' ').trim();
}

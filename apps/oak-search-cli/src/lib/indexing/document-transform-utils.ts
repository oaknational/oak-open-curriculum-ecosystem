/**
 * Utility functions for document transformation.
 * Pure functions that support document creation.
 */

/** Normalises year values to string array. */
export function normaliseYears(year: unknown, yearSlug: unknown): string[] | undefined {
  if (typeof year === 'number' || typeof year === 'string') {
    return [String(year)];
  }
  if (typeof yearSlug === 'string') {
    return [yearSlug];
  }
  return undefined;
}

/** Extracts a passage from text. */
export function extractPassage(text: string): string {
  const cleaned = text.replace(/\s+/g, ' ').trim();
  const sentences = cleaned.split(/(?<=[.!?])\s+/u);
  return sentences.slice(0, 2).join(' ').slice(0, 300);
}

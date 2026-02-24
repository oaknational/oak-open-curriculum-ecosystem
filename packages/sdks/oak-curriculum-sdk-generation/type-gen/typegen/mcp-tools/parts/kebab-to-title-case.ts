/**
 * Converts a kebab-case tool name to a human-readable title.
 *
 * @example
 * kebabToTitleCase('get-key-stages') // returns 'Get Key Stages'
 * kebabToTitleCase('get-lessons-transcript') // returns 'Get Lessons Transcript'
 *
 * @param name - The kebab-case tool name
 * @returns A human-readable title with each word capitalized
 */
export function kebabToTitleCase(name: unknown): string {
  if (typeof name !== 'string' || name === '') {
    throw new TypeError(`Name must be a string, given: ${String(name)}`);
  }

  return name
    .split(/[^a-zA-Z0-9]+/)
    .map((word) => {
      const lower = word.toLowerCase();
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(' ');
}

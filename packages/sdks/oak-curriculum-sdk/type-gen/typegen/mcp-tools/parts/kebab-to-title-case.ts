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
export function kebabToTitleCase(name: string): string {
  if (name === '') {
    return '';
  }

  return name
    .split('-')
    .map((word) => {
      const lower = word.toLowerCase();
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(' ');
}

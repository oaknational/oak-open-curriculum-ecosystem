import type { OperationObject } from 'openapi3-ts/oas31';

/**
 * Build tool description in git commit message format:
 * - First paragraph: OpenAPI summary (short title/overview)
 * - Blank line
 * - Remaining paragraphs: Full description
 *
 * This helps AI agents quickly understand tool purpose from the summary,
 * with detailed information available in the body.
 */
export function toToolDescription(operation: OperationObject): string | undefined {
  const summary = typeof operation.summary === 'string' ? operation.summary.trim() : '';
  const rawDescription = typeof operation.description === 'string' ? operation.description : '';

  // Transform "This endpoint" to "This tool" in the description
  const description = rawDescription
    // eslint-disable-next-line @typescript-eslint/prefer-string-starts-ends-with
    .replace(/\bThis endpoint\b/gi, (match) => (match[0] === 'T' ? 'This tool' : 'this tool'))
    .replace(/\s+/g, ' ')
    .trim();

  // Build git commit message style: summary\n\ndescription
  if (summary && description) {
    return `${summary}\n\n${description}`;
  }
  if (summary) {
    return summary;
  }
  if (description) {
    return description;
  }
  return undefined;
}

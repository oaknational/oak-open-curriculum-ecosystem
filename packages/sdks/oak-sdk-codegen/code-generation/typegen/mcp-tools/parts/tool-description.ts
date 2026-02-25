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
    .replace(/\bThis endpoint\b/gi, (match) => (match.startsWith('T') ? 'This tool' : 'this tool'))
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

/**
 * Domain prerequisite guidance appended to authenticated tool descriptions.
 *
 * Encourages models to call get-ontology first to understand the curriculum
 * domain before using API tools. Brief to minimize context window impact.
 *
 * @remarks
 * This guidance is only appended to tools that require authentication.
 * Tools with noauth (get-rate-limit, get-changelog) don't receive this
 * guidance as they provide API metadata, not curriculum content.
 */
export const DOMAIN_PREREQUISITE_GUIDANCE = `

PREREQUISITE: If unfamiliar with Oak's curriculum structure, call \`get-ontology\` first to understand key stages, subjects, entity hierarchy, and ID formats.`;

/**
 * Conditionally appends domain prerequisite guidance to tool descriptions.
 *
 * Pure function that adds guidance nudging models to call get-ontology first
 * when they haven't loaded the curriculum domain model.
 *
 * @param description - Base tool description from OpenAPI spec
 * @param requiresAuth - Whether the tool requires OAuth authentication
 * @returns Description with prerequisite appended (if auth required), or original
 *
 * @example
 * ```typescript
 * // Protected tool - gets prerequisite
 * appendPrerequisiteGuidance('Lesson summary', true);
 * // Returns: 'Lesson summary\n\nPREREQUISITE: If unfamiliar with...'
 *
 * // Public tool (noauth) - no prerequisite
 * appendPrerequisiteGuidance('Rate limit status', false);
 * // Returns: 'Rate limit status'
 * ```
 */
export function appendPrerequisiteGuidance(
  description: string | undefined,
  requiresAuth: boolean,
): string | undefined {
  if (!description) {
    return undefined;
  }
  if (!requiresAuth) {
    return description;
  }
  return `${description}${DOMAIN_PREREQUISITE_GUIDANCE}`;
}

/**
 * MCP Tool Name Generation
 *
 * Functions for generating MCP tool names from OpenAPI operations.
 */

/**
 * Generate MCP tool name from path and method
 * This is the SINGLE SOURCE OF TRUTH for MCP tool naming
 *
 * Examples:
 * - /lessons/{lesson}/transcript + GET → oak-get-lessons-transcript
 * - /key-stages/{keyStage}/subject/{subject}/units + GET → oak-get-key-stages-subject-units
 * - /search/lessons + GET → oak-get-search-lessons
 * - /lessons/{lesson}/assets/{type} + GET → oak-get-lessons-asset-type (special case to avoid duplicate)
 */
export function generateMcpToolName(path: string, method: string): string {
  // Special cases to avoid duplicates and reserved words
  // 'type' is a TypeScript keyword, so we use 'assetType' instead
  if (path === '/lessons/{lesson}/assets/{type}') {
    return 'oak-get-lessons-assets-by-type';
  }
  if (path === '/subjects/{subject}' && method === 'get') {
    return 'oak-get-subject-detail';
  }

  // Parse path to extract non-parameter segments
  const segments = path.split('/').filter(Boolean);
  const paramPattern = /^\{[^}]+\}$/;

  // Filter out parameter segments and clean remaining segments
  const nameSegments = segments
    .filter((seg) => !paramPattern.test(seg))
    .map((s) => s.replace(/[^a-zA-Z0-9]+/g, '-'))
    .filter(Boolean);

  // Generate deterministic name: oak-{method}-{segments}
  return `oak-${method.toLowerCase()}-${nameSegments.join('-')}`;
}

import type { OperationObject } from 'openapi3-ts/oas31';

/**
 * Normalises a raw upstream operation description into the form the tool
 * description pipeline operates on: "This endpoint" rewritten to "This
 * tool" (case-preserving), whitespace runs collapsed to single spaces,
 * leading/trailing whitespace trimmed.
 */
export function normaliseUpstreamDescription(rawDescription: string): string {
  return rawDescription
    .replaceAll(/\bThis endpoint\b/gi, (match) =>
      match.startsWith('T') ? 'This tool' : 'this tool',
    )
    .replaceAll(/\s+/g, ' ')
    .trim();
}

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

  const description = normaliseUpstreamDescription(rawDescription);

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
 * Encourages models to call get-curriculum-model first to understand the
 * curriculum domain before using API tools. Brief to minimise context window impact.
 *
 * @remarks
 * This guidance is only appended to tools that require authentication.
 * Tools with noauth (get-rate-limit, get-changelog) don't receive this
 * guidance as they provide API metadata, not curriculum content.
 */
export const DOMAIN_PREREQUISITE_GUIDANCE = `

PREREQUISITE: You MUST call the \`get-curriculum-model\` tool first to understand the curriculum domain.`;

/**
 * Conditionally appends domain prerequisite guidance to tool descriptions.
 *
 * Adds guidance nudging models to call get-curriculum-model first when they
 * haven't loaded the curriculum domain model.
 *
 * @param description - Base tool description from OpenAPI spec
 * @param requiresAuth - Whether the tool requires OAuth authentication
 * @param prerequisiteGuidance - Guidance text to append for authenticated tools
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
  prerequisiteGuidance: string = DOMAIN_PREREQUISITE_GUIDANCE,
): string | undefined {
  if (!description) {
    return undefined;
  }
  if (!requiresAuth) {
    return description;
  }
  return `${description}${prerequisiteGuidance}`;
}

const GET_RATE_LIMIT_NOTE = `

NOTE: A response of limit=0, remaining=0, reset=0 indicates an unlimited API key with no rate cap.`;

/**
 * Guidance appended to asset tool descriptions.
 *
 * Asset `url` fields are authenticated API endpoints that cannot be opened
 * directly in a browser. The primary action is to call `download-asset` to
 * generate a short-lived clickable link. The Oak website is a fallback for
 * transports where `download-asset` is unavailable (e.g. stdio).
 */
const ASSET_DOWNLOAD_NOTE = `

NOTE: The asset \`url\` fields returned by this tool are authenticated API endpoints and cannot be used as direct browser download links. To generate a clickable download link for the user, call the \`download-asset\` tool with the lesson slug and asset type. If \`download-asset\` is not available (e.g. stdio transport), direct users to the lesson page on the Oak website — use the lesson's \`oakUrl\` (e.g. \`https://www.thenational.academy/teachers/lessons/{lessonSlug}\`).`;

/**
 * Disambiguation guidance appended to the generated get-keywords description.
 *
 * Two keywords tools serve different needs (G4b): generated get-keywords is
 * the live-API pass-through; the hand-written get-keyword-graph aggregated
 * tool serves a bounded frequency-ranked subset of the curriculum-graph
 * snapshot. Each tool's description names the other and states when to
 * prefer it, verified end-to-end via `tools/list`.
 */
const GET_KEYWORDS_DISAMBIGUATION_NOTE = `

WHEN TO PREFER WHICH KEYWORDS TOOL: this tool returns the LIVE full keyword set for a key stage + subject — fresh and authoritative (including KS4 during curriculum restructures), alphabetical, unranked, and large at subject scope. For a bounded frequency-ranked subset with lesson connections (token economy + relationship navigation over the curriculum graph), prefer get-keyword-graph, which serves a point-in-time curriculum snapshot.`;

/**
 * Guidance appended to tools that can return a large payload at broad scope.
 *
 * Several tools return everything under a broad anchor (a whole sequence, a
 * whole key-stage + subject) and can exceed a host's per-result token cap. The
 * note names the *real* narrowing each tool supports, so an agent scopes the
 * call up front rather than discovering the limit by truncation mid-task. The
 * note is one line to avoid bloating the agent context budget.
 *
 * @param narrowing - Tool-specific sentence naming that tool's actual narrowing
 * parameters (e.g. `year`/`type`). Keep it terse and grounded in real params.
 */
const largePayloadNote = (narrowing: string): string => `

NOTE: This tool can return a large payload at broad scope and may exceed a host's per-result token limit. ${narrowing}`;

function getToolDescriptionEnhancement(toolName: string): string | undefined {
  switch (toolName) {
    case 'get-rate-limit':
      return GET_RATE_LIMIT_NOTE;
    case 'get-keywords':
      return GET_KEYWORDS_DISAMBIGUATION_NOTE;
    case 'get-lessons-assets':
      // Bounded: one lesson's assets. Asset-download guidance only.
      return ASSET_DOWNLOAD_NOTE;
    case 'get-key-stages-subject-assets':
      // Whole key-stage + subject: compose the large-payload hint onto the asset note.
      return `${ASSET_DOWNLOAD_NOTE}${largePayloadNote(
        'Narrow with `unit` and/or `type` (asset type), or use `get-lessons-assets` for one lesson.',
      )}`;
    case 'get-sequences-assets':
      // Whole sequence (all programmes): compose the large-payload hint onto the asset note.
      return `${ASSET_DOWNLOAD_NOTE}${largePayloadNote(
        'Narrow with `year` and/or `type` (asset type), or use `get-lessons-assets` for one lesson.',
      )}`;
    default:
      return undefined;
  }
}

/**
 * Appends tool-specific guidance for known protocol constraints.
 *
 * @param description - Description after base OpenAPI and prerequisite processing
 * @param toolName - Tool identifier used to resolve enhancement text
 * @returns Enhanced description when an override exists, otherwise original
 */
export function appendToolEnhancements(
  description: string | undefined,
  toolName: string,
): string | undefined {
  if (!description) {
    return undefined;
  }

  const enhancement = getToolDescriptionEnhancement(toolName);
  if (!enhancement) {
    return description;
  }

  return `${description}${enhancement}`;
}

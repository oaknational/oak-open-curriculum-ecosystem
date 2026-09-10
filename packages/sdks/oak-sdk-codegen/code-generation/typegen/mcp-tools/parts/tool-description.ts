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

WHEN TO PREFER WHICH KEYWORDS TOOL: this tool returns the LIVE keyword set for a key stage + subject — fresh and authoritative (including KS4 during curriculum restructures), alphabetical, unranked, and large at subject scope. For a bounded frequency-ranked subset with lesson connections (token economy + relationship navigation over the curriculum graph), prefer get-keyword-graph, which serves a point-in-time curriculum snapshot.`;

/**
 * Pagination guidance for get-keywords.
 *
 * The upstream endpoint enforces a server-side default of \`limit=20\` (spec
 * 0.7.x; live-verified 2026-08-03 — an unpaged science+ks1 call returned 20
 * of 170 keywords), so an unpaged call silently returns only the first page.
 * Since the pagination echo landed (PR 949), the tool result carries the
 * structural next-page signal this note previously had to substitute for,
 * so the guidance now points at that signal instead of a blind page walk.
 */
const GET_KEYWORDS_PAGINATION_NOTE = `

NOTE: This tool is paginated — the server returns at most 20 keywords unless you pass \`limit\` (max 300). The result's \`pagination\` field reports \`hasMore\` and, when more pages exist, the \`nextOffset\`/\`nextLimit\` to pass; follow it until \`hasMore\` is false. Do not infer completeness by counting items against your limit.`;

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

/**
 * Clarification appended to the programmes tools whose upstream descriptions use
 * a loose `y7` shorthand as the slug example. The slug the API actually returns
 * (and that `get-programmes/{programme}` consumes) is the full form, so an agent
 * chaining these tools must use the exact returned string, not the shorthand.
 * One line to bound context cost. The upstream description text is the loose
 * part; the endpoint's own response schema example already uses the full form.
 */
const PROGRAMME_SLUG_NOTE = `

NOTE: Programme slugs are the full form — \`<subject>-<phase>-year-<year>\` plus any KS4 factor — e.g. \`english-secondary-year-7\` or \`english-secondary-year-10-edexcel\`, not the short \`y7\` shorthand used above. Pass the exact slug string this response returns to \`get-programmes\` and its sub-endpoints.`;

/**
 * Canonical per-tool description additions, keyed by tool name.
 *
 * Declarative config, not control flow: each entry is agent-facing guidance
 * appended to one tool's description at codegen time (schema-first permits
 * adding MCP tool metadata here — the additions augment, never contradict, the
 * upstream text). Composed values (asset note + large-payload note) are pre-built
 * so the collection stays pure data. Injected into {@link appendToolEnhancements}
 * as the default, so the append mechanism can be proven against a fake map
 * independent of this content (see testing-strategy.md "Assert effects, not
 * constants" / "Test the engine, not the configuration").
 */
export const TOOL_DESCRIPTION_ADDITIONS: ReadonlyMap<string, string> = new Map([
  ['get-rate-limit', GET_RATE_LIMIT_NOTE],
  // Keywords: disambiguation vs get-keyword-graph, plus explicit paging
  // guidance for the server-enforced limit default.
  ['get-keywords', `${GET_KEYWORDS_DISAMBIGUATION_NOTE}${GET_KEYWORDS_PAGINATION_NOTE}`],
  // Bounded: one lesson's assets. Asset-download guidance only.
  ['get-lessons-assets', ASSET_DOWNLOAD_NOTE],
  // Whole key-stage + subject: compose the large-payload hint onto the asset note.
  [
    'get-key-stages-subject-assets',
    `${ASSET_DOWNLOAD_NOTE}${largePayloadNote(
      'Narrow with `unit` and/or `type` (asset type), or use `get-lessons-assets` for one lesson.',
    )}`,
  ],
  // Whole sequence (all programmes): compose the large-payload hint onto the asset note.
  [
    'get-sequences-assets',
    `${ASSET_DOWNLOAD_NOTE}${largePayloadNote(
      'Narrow with `year` and/or `type` (asset type), or use `get-lessons-assets` for one lesson.',
    )}`,
  ],
  // Programmes tools: clarify the full-form slug against the loose upstream `y7` shorthand.
  ['get-subjects-programmes', PROGRAMME_SLUG_NOTE],
  ['get-programmes', PROGRAMME_SLUG_NOTE],
  // Programme assets return the same authenticated `url` endpoints as the other asset tools.
  ['get-programmes-assets', ASSET_DOWNLOAD_NOTE],
]);

/**
 * Appends an optional per-tool description addition.
 *
 * Mechanism: look the tool up in the injected `additions` map and, when an entry
 * exists, append it to the base description; otherwise return the description
 * unchanged. `additions` is an optional argument defaulting to the canonical
 * {@link TOOL_DESCRIPTION_ADDITIONS}, so the behaviour is exercised with a fake
 * map in tests rather than pinned to the canonical content.
 *
 * @param description - Description after base OpenAPI processing
 * @param toolName - Tool identifier used to resolve the addition
 * @param additions - Per-tool additions map (injected; defaults to canonical)
 * @returns Description with the addition appended when one exists, else unchanged
 */
export function appendToolEnhancements(
  description: string | undefined,
  toolName: string,
  additions: ReadonlyMap<string, string> = TOOL_DESCRIPTION_ADDITIONS,
): string | undefined {
  if (!description) {
    return undefined;
  }

  const addition = additions.get(toolName);
  return addition === undefined ? description : `${description}${addition}`;
}

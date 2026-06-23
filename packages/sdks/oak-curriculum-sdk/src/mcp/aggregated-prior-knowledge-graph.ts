/**
 * `get-prior-knowledge-graph` — bounded anchored prior-knowledge (predecessor)
 * retrieval over the curriculum graph corpus (G1b).
 *
 * "Prior knowledge of unit X" is X's PREDECESSORS: the units that are
 * (transitively, up to a bounded depth) prerequisites of X. The tool is a thin
 * parse-and-dispatch over `priorKnowledgeSubgraph` from
 * `@oaknational/graph-corpus-sdk/curriculum` — the view owns traversal
 * semantics (predecessor direction, depth bounds, anchor resolution); this
 * module owns only the MCP boundary: input validation and the response
 * envelope. There is no whole-corpus path: every call is anchored to the
 * units the caller names.
 *
 * Unknown anchor slugs and the echoed depth are reported as information in
 * the result envelope, never as a recommendation (ADR-194: the data surface
 * is deterministic; the agent is the only reasoner).
 *
 * @see `@oaknational/graph-corpus-sdk/curriculum` — the prior-knowledge view
 *   and its depth constants (the empirical depth table lives in its TSDoc).
 * @see ADR-086 (`docs/architecture/architectural-decisions/086-vocab-gen-graph-export-pattern.md`)
 *   for the corpus extraction methodology.
 */

import type { CallToolResult } from '@modelcontextprotocol/sdk/types';
import { z } from 'zod';
import {
  DEFAULT_PREREQUISITE_DEPTH,
  MAX_PREREQUISITE_DEPTH,
  priorKnowledgeSubgraph,
  type PriorKnowledgeSubgraph,
} from '@oaknational/graph-corpus-sdk/curriculum';
import { SCOPES_SUPPORTED } from './scopes-supported.js';
import { formatError, formatToolResponse } from './universal-tool-shared.js';

/**
 * The anchored input contract for `get-prior-knowledge-graph`.
 *
 * `unitSlugs` anchors the query — slugs are corpus keys (resolve them first
 * via `search`, `fetch`, or `browse-curriculum`), not free text. Unknown slugs
 * are reported in the result's `unknownAnchors`, not errored. `depth` is
 * bounded at the schema: the view's ceiling is encoded here so an
 * out-of-range depth fails at the input boundary with a named constraint.
 */
const PRIOR_KNOWLEDGE_INPUT = z.object({
  unitSlugs: z
    .array(z.string().min(1))
    .describe(
      'Anchor unit slugs (corpus keys, e.g. from search/fetch results). The result is the bounded prior-knowledge subgraph for these units. Unknown slugs are reported back in unknownAnchors, not errored.',
    ),
  depth: z
    .number()
    .int()
    .min(0)
    .max(MAX_PREREQUISITE_DEPTH)
    .optional()
    .describe(
      `Prerequisite-traversal depth: how many predecessor levels to include. Default ${String(DEFAULT_PREREQUISITE_DEPTH)}, maximum ${String(MAX_PREREQUISITE_DEPTH)}.`,
    ),
});

/**
 * The aggregated-tool input carrier — the field map of
 * {@link PRIOR_KNOWLEDGE_INPUT}. Deliberately NOT annotated `: z.ZodRawShape`
 * (the annotation would widen the per-field schema types); the `satisfies`
 * guard in `universal-tools/definitions.ts` enforces the carrier contract.
 */
export const GET_PRIOR_KNOWLEDGE_GRAPH_INPUT_SCHEMA = PRIOR_KNOWLEDGE_INPUT.shape;

const PRIOR_KNOWLEDGE_TOOL_TITLE = 'Oak Curriculum Prior Knowledge Subgraph';

/**
 * Tool definition for the anchored get-prior-knowledge-graph.
 *
 * The depth figures are the predecessor-direction neighbourhood sizes
 * re-measured over the emitted corpus (2026-06-10, sourceVersion 2026-05-21);
 * the canonical table lives in the view's module TSDoc.
 */
export const GET_PRIOR_KNOWLEDGE_GRAPH_TOOL_DEF = {
  title: PRIOR_KNOWLEDGE_TOOL_TITLE,
  description: `Returns the bounded prior-knowledge subgraph for the anchor units you name.

"Prior knowledge of unit X" means X's predecessors: the units that are (transitively, up to the requested depth) prerequisites of X. Edges are prerequisiteFor relationships (prerequisite → dependent), derived from curriculum thread ordering.

The query is anchored, never whole-corpus:
- unitSlugs: the anchor units. Slugs are corpus keys — resolve them first with search, fetch, or browse-curriculum. Unknown slugs are reported in the result's unknownAnchors, not errored.
- depth (optional): predecessor levels to include. Default ${String(DEFAULT_PREREQUISITE_DEPTH)}, maximum ${String(MAX_PREREQUISITE_DEPTH)}. Typical result sizes per anchor: depth 1 ≈ 2 units (median, max 8); depth 2 ≈ 4 units (median, max 21); depth 3 ≈ 8 units (median, max 42).

The result reports nodes (unit metadata: slug, title, subject, key stage, year, prior-knowledge statements, thread memberships), edges, resolvedAnchors, unknownAnchors, and the depth used.

Use this to answer questions like:
- "What should students know before this unit?" (anchor: that unit's slug)
- "Which prerequisite gaps could explain difficulty with this lesson's unit?"
- "What earlier units does this scheme of work build on?"

Complements get-thread-progressions (full thread learning paths) with anchored prior-knowledge detail.`,

  securitySchemes: [{ type: 'oauth2' as const, scopes: SCOPES_SUPPORTED }],

  annotations: {
    readOnlyHint: true as const,
    destructiveHint: false as const,
    idempotentHint: true as const,
    openWorldHint: false as const,
  },

  _meta: {
    securitySchemes: [{ type: 'oauth2' as const, scopes: SCOPES_SUPPORTED }],
  },
} as const;

/** One-line human summary of the bounded subgraph result (information only). */
function summariseSubgraph(subgraph: PriorKnowledgeSubgraph): string {
  const anchorCount = subgraph.resolvedAnchors.length;
  const base = `Prior-knowledge subgraph for ${String(anchorCount)} anchor unit${anchorCount === 1 ? '' : 's'} at depth ${String(subgraph.depth)}: ${String(subgraph.nodes.length)} units, ${String(subgraph.edges.length)} prerequisiteFor edges.`;
  if (subgraph.unknownAnchors.length === 0) {
    return base;
  }
  return `${base} ${String(subgraph.unknownAnchors.length)} unknown anchor slug${subgraph.unknownAnchors.length === 1 ? '' : 's'} reported in unknownAnchors.`;
}

/**
 * Execute the anchored get-prior-knowledge-graph tool.
 *
 * Validation is the schema parse itself — anchor shape and the depth ceiling
 * fall out of {@link PRIOR_KNOWLEDGE_INPUT}. The bounded subgraph is returned
 * in structuredContent with the summary and serialised JSON alongside as
 * TextContent (MCP spec SHOULD for structured results).
 *
 * @param input - Raw MCP tool-call arguments.
 * @returns CallToolResult with the bounded subgraph in structuredContent.
 */
export function runPriorKnowledgeGraphTool(input: unknown): CallToolResult {
  const parsed = PRIOR_KNOWLEDGE_INPUT.safeParse(input);
  if (!parsed.success) {
    return formatError(`Invalid get-prior-knowledge-graph input: ${parsed.error.message}`);
  }

  const result = priorKnowledgeSubgraph(parsed.data.unitSlugs, parsed.data.depth);
  if (!result.ok) {
    // The schema's depth ceiling mirrors the view's, so this branch is
    // defensive: it can only fire if the two ceilings ever drift.
    const error = result.error;
    return formatError(
      error.kind === 'SubgraphDepthExceeded'
        ? `get-prior-knowledge-graph failed: ${error.kind} — requested depth ${String(error.depth)} exceeds the view limit ${String(error.limit)}.`
        : `get-prior-knowledge-graph failed: ${error.kind}.`,
    );
  }

  return formatToolResponse({
    summary: summariseSubgraph(result.value),
    data: result.value,
    status: 'success',
    timestamp: Date.now(),
    toolName: 'get-prior-knowledge-graph',
    annotationsTitle: PRIOR_KNOWLEDGE_TOOL_TITLE,
  });
}

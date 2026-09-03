/**
 * `get-prior-knowledge-graph` — anchored retrieval of each unit's STATED
 * prior knowledge.
 *
 * "Prior knowledge of unit X" is what Oak records on the unit itself: the
 * flat prior-knowledge statements (free-text propositions about what pupils
 * are assumed to know or have experienced before the unit). The tool is a
 * thin parse-and-dispatch over `priorKnowledgeStatements` from
 * `@oaknational/graph-corpus-sdk/curriculum` — anchor resolution plus field
 * projection, no traversal; this module owns only the MCP boundary: input
 * validation and the response envelope. Every call is anchored to the units
 * the caller names; there is no whole-corpus path.
 *
 * The tool previously served a depth-bounded `prerequisiteFor` subgraph.
 * Those edges encode thread adjacency on the year axis (same-year ordering
 * stated-arbitrary — see `graph-corpus-edges.ts`), not epistemic
 * prerequisites, so the stated statements are the honest surface and the
 * subgraph is no longer served. The wire name is unchanged and the retired
 * `depth` input is stripped, not errored (the schema parses in strip mode),
 * so legacy calls keep succeeding — but the response is the statements
 * shape, not the retired nodes/edges/depth envelope. Agent callers read the
 * contract from the tool description each session; nothing in this repo
 * consumes the old shape programmatically.
 *
 * Unknown anchor slugs are reported as information in the result envelope,
 * never as a recommendation (ADR-194: the data surface is deterministic;
 * the agent is the only reasoner).
 *
 * @see `@oaknational/graph-corpus-sdk/curriculum` — the statements view.
 * @see ADR-086 (`docs/architecture/architectural-decisions/086-vocab-gen-graph-export-pattern.md`)
 *   for the corpus extraction methodology.
 */

import type { CallToolResult } from '@modelcontextprotocol/sdk/types';
import { z } from 'zod';
import {
  priorKnowledgeStatements,
  type PriorKnowledgeStatements,
} from '@oaknational/graph-corpus-sdk/curriculum';
import { SCOPES_SUPPORTED } from './scopes-supported.js';
import { formatError, formatToolResponse } from './universal-tool-shared.js';

/**
 * The anchored input contract for `get-prior-knowledge-graph`.
 *
 * `unitSlugs` anchors the query — slugs are corpus keys (resolve them first
 * via `search`, `fetch`, or `browse-curriculum`), not free text. Unknown
 * slugs are reported in the result's `unknownAnchors`, not errored.
 */
const PRIOR_KNOWLEDGE_INPUT = z.object({
  unitSlugs: z
    .array(z.string().min(1))
    .describe(
      "Anchor unit slugs (corpus keys, e.g. from search/fetch results). The result is each anchor unit's stated prior knowledge. Unknown slugs are reported back in unknownAnchors, not errored.",
    )
    .meta({ examples: [['comparing-fractions']] }),
});

/**
 * The aggregated-tool input carrier — the field map of
 * {@link PRIOR_KNOWLEDGE_INPUT}. Deliberately NOT annotated `: z.ZodRawShape`
 * (the annotation would widen the per-field schema types); the `satisfies`
 * guard in `universal-tools/definitions.ts` enforces the carrier contract.
 */
export const GET_PRIOR_KNOWLEDGE_GRAPH_INPUT_SCHEMA = PRIOR_KNOWLEDGE_INPUT.shape;

const PRIOR_KNOWLEDGE_TOOL_TITLE = 'Oak Curriculum Prior Knowledge';

/** Tool definition for the anchored get-prior-knowledge-graph. */
export const GET_PRIOR_KNOWLEDGE_GRAPH_TOOL_DEF = {
  title: PRIOR_KNOWLEDGE_TOOL_TITLE,
  description: `Returns the stated prior knowledge for the anchor units you name.

"Prior knowledge of unit X" means what Oak records on the unit itself: the flat list of prior-knowledge statements — free-text propositions about what pupils are assumed to know or have experienced before the unit. Statements name knowledge, not the units that teach it; judging whether earlier units satisfy them is the caller's reasoning.

The query is anchored, never whole-corpus:
- unitSlugs: the anchor units. Slugs are corpus keys — resolve them first with search, fetch, or browse-curriculum. Unknown slugs are reported in the result's unknownAnchors, not errored.

The result reports units (each with slug, title, subject, key stage, year, priorKnowledge statements, and thread memberships), resolvedAnchors, and unknownAnchors.

Coverage: 17 of Oak's 1,834 units record no prior-knowledge statements, so an empty priorKnowledge array means Oak states none for that unit — not that the unit is missing from the corpus.

Use this to answer questions like:
- "What should students know before this unit?" (anchor: that unit's slug)
- "Which prerequisite gaps could explain difficulty with this lesson's unit?"
- "What earlier units does this scheme of work build on?" (anchor the plan's units, then check the statements against earlier units' content)

Complements get-thread-progressions: use each returned unit's threadSlugs there to see how the concept builds across years.`,

  securitySchemes: [{ type: 'oauth2' as const, scopes: SCOPES_SUPPORTED }],

  annotations: {
    readOnlyHint: true as const,
    destructiveHint: false as const,
    idempotentHint: true as const,
    openWorldHint: false as const,
    title: PRIOR_KNOWLEDGE_TOOL_TITLE,
  },

  _meta: {
    securitySchemes: [{ type: 'oauth2' as const, scopes: SCOPES_SUPPORTED }],
  },
} as const;

/** One-line human summary of the statements result (information only). */
function summariseStatements(result: PriorKnowledgeStatements): string {
  const anchorCount = result.resolvedAnchors.length;
  const statementCount = result.units.reduce(
    (total, unit) => total + unit.priorKnowledge.length,
    0,
  );
  const base = `Stated prior knowledge for ${String(anchorCount)} anchor unit${anchorCount === 1 ? '' : 's'}: ${String(statementCount)} statement${statementCount === 1 ? '' : 's'}.`;
  if (result.unknownAnchors.length === 0) {
    return base;
  }
  return `${base} ${String(result.unknownAnchors.length)} unknown anchor slug${result.unknownAnchors.length === 1 ? '' : 's'} reported in unknownAnchors.`;
}

/**
 * Execute the anchored get-prior-knowledge-graph tool.
 *
 * Validation is the schema parse itself — anchor shape falls out of
 * {@link PRIOR_KNOWLEDGE_INPUT}; retrieval is infallible for parsed input.
 * The statements are returned in structuredContent with the summary and
 * serialised JSON alongside as TextContent (MCP spec SHOULD for structured
 * results).
 *
 * @param input - Raw MCP tool-call arguments.
 * @returns CallToolResult with the stated prior knowledge in structuredContent.
 */
export function runPriorKnowledgeGraphTool(input: unknown): CallToolResult {
  const parsed = PRIOR_KNOWLEDGE_INPUT.safeParse(input);
  if (!parsed.success) {
    return formatError(`Invalid get-prior-knowledge-graph input: ${parsed.error.message}`);
  }

  const result = priorKnowledgeStatements(parsed.data.unitSlugs);

  return formatToolResponse({
    summary: summariseStatements(result),
    data: result,
    status: 'success',
    timestamp: Date.now(),
    toolName: 'get-prior-knowledge-graph',
    annotationsTitle: PRIOR_KNOWLEDGE_TOOL_TITLE,
  });
}

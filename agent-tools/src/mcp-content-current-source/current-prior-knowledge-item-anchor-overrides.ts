/**
 * Reviewed current-source anchors for the stated-statements refactor of
 * get-prior-knowledge-graph (sharded from the item and aggregated anchor
 * override maps at the max-lines gate).
 *
 * The tool's prerequisiteFor subgraph encoded thread adjacency on the year
 * axis, not epistemic prerequisites; it now serves each anchor unit's
 * stated prior-knowledge statements, and the guidance, workflow, and
 * ontology pointers rewrote with it. The cross-tool rows that the
 * curriculum-order change (MCP-681) re-pinned on the same lines — C020,
 * C023, C045, C054, C253 — carry both corrections in the
 * thread-progressions override module, so each item id is declared once.
 * Anchor strings are verbatim from the current sources; changing one is a
 * compliance review act.
 */

const SDK_MCP = 'packages/sdks/oak-curriculum-sdk/src/mcp';
const PRIOR_KNOWLEDGE_GRAPH = `${SDK_MCP}/aggregated-prior-knowledge-graph.ts`;
const ONTOLOGY_DATA = `${SDK_MCP}/ontology-data.ts`;

export const CURRENT_PRIOR_KNOWLEDGE_ITEM_ANCHOR_OVERRIDES = {
  // relatedResources' prior-knowledge pointer rewritten for the
  // stated-statements contract; the threadProgressions pointer is unchanged.
  C290: {
    [ONTOLOGY_DATA]: [
      'Call get-thread-progressions for ordered unit sequences within curriculum threads (instance data)',
      "Call get-prior-knowledge-graph with anchor unit slugs for each unit's stated prior-knowledge statements (what pupils are assumed to know before it)",
    ],
  },
  // The stated-statements refactor: get-prior-knowledge-graph now serves
  // each anchor unit's stated prior-knowledge statements, not the
  // thread-adjacency subgraph. Title, description, input describe, summary,
  // and the error surface all rewrote; the depth input retired via lineage.
  C246: {
    [PRIOR_KNOWLEDGE_GRAPH]: [
      "const PRIOR_KNOWLEDGE_TOOL_TITLE = 'Oak Curriculum Prior Knowledge';",
    ],
  },
  C247: {
    [PRIOR_KNOWLEDGE_GRAPH]: [
      'Returns the stated prior knowledge for the anchor units you name.',
      "Statements name knowledge, not the units that teach it; judging whether earlier units satisfy them is the caller's reasoning.",
    ],
  },
  C248: {
    [PRIOR_KNOWLEDGE_GRAPH]: [
      "Anchor unit slugs (corpus keys, e.g. from search/fetch results). The result is each anchor unit's stated prior knowledge.",
    ],
  },
  C250: {
    [PRIOR_KNOWLEDGE_GRAPH]: [
      'const base = `Stated prior knowledge for ${String(anchorCount)} anchor unit',
    ],
  },
  C251: {
    [PRIOR_KNOWLEDGE_GRAPH]: [
      'return formatError(`Invalid get-prior-knowledge-graph input: ${parsed.error.message}`);',
    ],
  },
} as const;

/**
 * Reviewed current-source anchors for the stated-statements refactor of
 * get-prior-knowledge-graph (sharded from the item and aggregated anchor
 * override maps at the max-lines gate).
 *
 * The tool's prerequisiteFor subgraph encoded thread adjacency on the year
 * axis, not epistemic prerequisites; it now serves each anchor unit's
 * stated prior-knowledge statements, and the guidance, workflow, and
 * ontology pointers rewrote with it. Anchor strings are verbatim from the
 * current sources; changing one is a compliance review act.
 */

const SDK_MCP = 'packages/sdks/oak-curriculum-sdk/src/mcp';
const PRIOR_KNOWLEDGE_GRAPH = `${SDK_MCP}/aggregated-prior-knowledge-graph.ts`;
const TOOL_GUIDANCE_DATA = `${SDK_MCP}/tool-guidance-data.ts`;
const TOOL_GUIDANCE_WORKFLOWS = `${SDK_MCP}/tool-guidance-workflows.ts`;
const ONTOLOGY_DATA = `${SDK_MCP}/ontology-data.ts`;
const AGENT_SUPPORT_METADATA = `${SDK_MCP}/agent-support-tool-metadata.ts`;

export const CURRENT_PRIOR_KNOWLEDGE_ITEM_ANCHOR_OVERRIDES = {
  // The server-instructions sequencing sentence now names each unit's
  // stated prior knowledge rather than claiming a prior-knowledge graph.
  C054: {
    [AGENT_SUPPORT_METADATA]: [
      "Oak's curriculum is fully sequenced: year-ordered progressions, misconception and keyword graphs, and each unit's stated prior knowledge are served by the anchored tools (get-thread-progressions, get-misconception-graph, get-keyword-graph, get-prior-knowledge-graph), so lesson and curriculum plans can build on what a class has already covered.",
    ],
  },
  // C023 is the six toolCategories tools arrays; they are byte-identical,
  // but the baseline anchor spanned the whole toolCategories literal, whose
  // progression whenToUse was rewritten for the stated-statements contract.
  C023: {
    [TOOL_GUIDANCE_DATA]: [
      "      tools: [\n        'search',\n        'user-search',\n        'user-search-query',\n        'explore-topic',\n        'browse-curriculum',\n        'get-subjects',\n        'get-key-stages',\n      ],",
      "      tools: [\n        'get-key-stages-subject-units',\n        'get-key-stages-subject-lessons',\n        'get-sequences',\n        'get-subjects-years',\n      ],",
      "      tools: [\n        'fetch',\n        'get-lessons-summary',\n        'get-lessons-transcript',\n        'get-lessons-quiz',\n        'get-lessons-assets',\n        'get-units-summary',\n        'download-asset',\n      ],",
      "      tools: [\n        'get-threads',\n        'get-threads-units',\n        'get-thread-progressions',\n        'get-prior-knowledge-graph',\n      ],",
      "      tools: [\n        'get-subjects-programmes',\n        'get-programmes',\n        'get-programmes-units',\n        'get-programmes-questions',\n        'get-programmes-assets',\n      ],",
      "      tools: ['get-curriculum-model'],",
    ],
  },
  // The trackProgression workflow's step 3 was rewritten for the
  // stated-statements contract of get-prior-knowledge-graph.
  C045: {
    [TOOL_GUIDANCE_WORKFLOWS]: [
      "'Get the stated prior knowledge for the thread units found in steps 1-2, anchored by their slugs'",
      'returns: "Each anchor unit\'s stated prior-knowledge statements"',
    ],
  },
  // relatedResources' prior-knowledge pointer rewritten for the
  // stated-statements contract; the threadProgressions pointer is unchanged.
  C290: {
    [ONTOLOGY_DATA]: [
      'Call get-thread-progressions for ordered unit sequences within curriculum threads (instance data)',
      "Call get-prior-knowledge-graph with anchor unit slugs for each unit's stated prior-knowledge statements (what pupils are assumed to know before it)",
    ],
  },
  // get-prior-knowledge-graph now serves each unit's stated prior-knowledge
  // statements, not the thread-adjacency subgraph; the progression guidance
  // was rewritten to match.
  C020: {
    [TOOL_GUIDANCE_DATA]: [
      "Use get-prior-knowledge-graph with anchor unit slugs for each unit's stated prior knowledge — the statements Oak records about what pupils are assumed to know before it.",
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

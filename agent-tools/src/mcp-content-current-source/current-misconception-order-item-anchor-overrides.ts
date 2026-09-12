/**
 * Reviewed anchors and revision verdicts for the `get-misconception-graph`
 * items re-pinned when the tool stopped serving alphabetical order (2026-09-04,
 * MCP-682): a thread's units are windowed in Oak's per-subject curriculum
 * order, and a unit's lessons are listed in Oak's authored teaching order,
 * replacing the id-sorted edge adjacency both had read. Anchor strings are
 * verbatim from the current sources. Split out of the aggregated override map
 * at the file-size gate, mirroring the thread-progressions module.
 */

const MISCONCEPTION_GRAPH =
  'packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-misconception-graph.ts';

export const CURRENT_MISCONCEPTION_ORDER_ITEM_ANCHOR_OVERRIDES = {
  // The tool description: the unit and thread anchor bullets now state the
  // ordering basis, and a dedicated ordering paragraph states it once more.
  C234: {
    [MISCONCEPTION_GRAPH]: [
      "- unitSlugs: the core anchor; each unit returns every placed lesson with its misconceptions, in Oak's authored teaching order",
      "Ordering is a deterministic projection of Oak's authored order, not a single global sequence.",
    ],
  },
  // The unit-anchor field description.
  C236: {
    [MISCONCEPTION_GRAPH]: [
      'Unit anchor: unit slugs (corpus keys). Returns each unit with every placed lesson and its misconceptions, in Oak’s authored teaching order.',
    ],
  },
  // The thread-anchor field description.
  C237: {
    [MISCONCEPTION_GRAPH]: [
      'Thread anchor: one thread slug (corpus key). Returns a unit-granular window over the thread in Oak’s curriculum order,',
    ],
  },
} as const;

export const CURRENT_MISCONCEPTION_ORDER_ITEM_REVISION_OVERRIDES = {
  C234: 'modified',
  C236: 'modified',
  C237: 'modified',
} as const;

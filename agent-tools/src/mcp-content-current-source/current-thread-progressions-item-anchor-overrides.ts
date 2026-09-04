/**
 * Reviewed anchors and revision verdicts for the items re-pinned when thread
 * sequences moved to curriculum order (2026-09-03): the served thread
 * progression is one run per subject in Oak's authored curriculum order
 * (years ascending; within a year, the subject sequence's unit order),
 * replacing the year-only ordering whose within-year tie-break was
 * alphabetical and the "within one year the order is not curricular" clause
 * it carried. Anchor strings are verbatim from the current sources. Split
 * out of the aggregated and guidance override maps at the file-size gate.
 */

const SDK_MCP = 'packages/sdks/oak-curriculum-sdk/src/mcp';
const THREAD_PROGRESSIONS = `${SDK_MCP}/aggregated-thread-progressions.ts`;
const AGENT_SUPPORT_METADATA = `${SDK_MCP}/agent-support-tool-metadata.ts`;
const TOOL_GUIDANCE_DATA = `${SDK_MCP}/tool-guidance-data.ts`;
const TOOL_GUIDANCE_WORKFLOWS = `${SDK_MCP}/tool-guidance-workflows.ts`;
const ONTOLOGY_DATA = `${SDK_MCP}/ontology-data.ts`;

export const CURRENT_THREAD_PROGRESSIONS_ITEM_ANCHOR_OVERRIDES = {
  // The tool description, the detail-anchor field description, and the
  // progression summary state per-subject runs in curriculum order.
  C253: {
    [THREAD_PROGRESSIONS]: [
      "- threadSlug: the detail anchor; returns that ONE thread's full unit progression as one run per subject the thread spans — never the whole thread estate.",
      "Ordering semantics: each run is Oak's curriculum order for that subject — years ascending (earliest → latest), and within a year the authored unit order of the subject's sequence;",
    ],
  },
  C254: {
    [THREAD_PROGRESSIONS]: [
      'Detail anchor: one thread slug (corpus key). Returns that thread’s full unit progression, one curriculum-ordered run per subject. Exactly one anchor mode per call.',
    ],
  },
  C258: {
    [THREAD_PROGRESSIONS]: [
      'unit placements${span} in ${String(runs)} subject run',
      'each in curriculum order.',
    ],
  },
  // The server instructions' sequenced-curriculum paragraph.
  C054: {
    [AGENT_SUPPORT_METADATA]: [
      "Oak's curriculum is fully sequenced: curriculum-ordered thread progressions, prior-knowledge, misconception, and keyword graphs are served by the anchored graph tools",
    ],
  },
  // The progression category's whenToUse.
  C020: {
    [TOOL_GUIDANCE_DATA]: [
      "Use get-thread-progressions anchored by a threadSlug for one thread's curriculum-ordered progression (one run per subject), or by subject + keyStage to discover which of the ${String(threadProgressionStats.threadCount)} threads to anchor.",
    ],
  },
  // C023's baseline anchor spanned the whole toolCategories block, which
  // carried the progression whenToUse line; the six tool-name arrays it
  // governs are byte-identical, so it re-pins on those arrays alone.
  C023: {
    [TOOL_GUIDANCE_DATA]: [
      "tools: [\n        'search',\n        'user-search',\n        'user-search-query',\n        'explore-topic',\n        'browse-curriculum',\n        'get-subjects',\n        'get-key-stages',\n      ],",
      "tools: [\n        'get-key-stages-subject-units',\n        'get-key-stages-subject-lessons',\n        'get-sequences',\n        'get-subjects-years',\n      ],",
      "tools: [\n        'fetch',\n        'get-lessons-summary',\n        'get-lessons-transcript',\n        'get-lessons-quiz',\n        'get-lessons-assets',\n        'get-units-summary',\n        'download-asset',\n      ],",
      "tools: [\n        'get-threads',\n        'get-threads-units',\n        'get-thread-progressions',\n        'get-prior-knowledge-graph',\n      ],",
      "tools: [\n        'get-subjects-programmes',\n        'get-programmes',\n        'get-programmes-units',\n        'get-programmes-questions',\n        'get-programmes-assets',\n      ],",
      "tools: ['get-curriculum-model'],",
    ],
  },
  // The track-progression workflow's step 2.
  C045: {
    [TOOL_GUIDANCE_WORKFLOWS]: [
      "action: 'Get the curriculum-ordered progression for the thread found in step 1',",
      "'That thread’s unit progression, one run per subject in Oak’s curriculum order (years ascending, the subject sequence’s unit order within a year)',",
    ],
  },
  // The ontology's thread characteristics.
  C292: {
    [ONTOLOGY_DATA]: [
      "'Curriculum-ordered: A thread’s units follow Oak’s authored curriculum order within each subject — years ascending, and within a year the subject sequence’s unit order; a thread spanning subjects runs separately per subject',",
    ],
  },
} as const;

export const CURRENT_THREAD_PROGRESSIONS_ITEM_REVISION_OVERRIDES = {
  C253: 'modified',
  C254: 'modified',
  C258: 'modified',
  C054: 'modified',
  C020: 'modified',
  // C023's six tool-name arrays are byte-identical; only its baseline span moved.
  C023: 'unchanged',
  C045: 'modified',
  C292: 'modified',
} as const;

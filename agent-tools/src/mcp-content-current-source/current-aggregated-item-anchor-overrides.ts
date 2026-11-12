/**
 * Reviewed anchors for aggregated-tool items whose baseline fragments were
 * intentionally modified on latest main: MCP-300 rewrote the aggregated
 * descriptions and added `annotations.title` to every tool. The app and
 * widget items that evolved alongside are in
 * `current-app-item-anchor-overrides.ts`. Anchor strings are verbatim from
 * the current sources.
 */

const SDK_MCP = 'packages/sdks/oak-curriculum-sdk/src/mcp';
const SEARCH_DEF = `${SDK_MCP}/aggregated-search/tool-definition.ts`;
const SEARCH_SCHEMA = `${SDK_MCP}/aggregated-search/flat-zod-schema.ts`;
const EXPLORE_DEF = `${SDK_MCP}/aggregated-explore/tool-definition.ts`;
const USER_SEARCH_DEF = `${SDK_MCP}/aggregated-user-search/tool-definition.ts`;
const BROWSE_DEF = `${SDK_MCP}/aggregated-browse/tool-definition.ts`;
const FETCH_EXECUTION = `${SDK_MCP}/aggregated-fetch/execution.ts`;
const ASSET_DOWNLOAD_DEF = `${SDK_MCP}/aggregated-asset-download/definition.ts`;
const CURRICULUM_MODEL_DEF = `${SDK_MCP}/aggregated-curriculum-model/definition.ts`;
const KEYWORD_GRAPH = `${SDK_MCP}/aggregated-keyword-graph.ts`;
const AGENT_SUPPORT_METADATA = `${SDK_MCP}/agent-support-tool-metadata.ts`;
const ORIENTATION_GUIDANCE = 'packages/sdks/oak-curriculum-sdk/src/mcp/orientation-guidance.ts';
const UNIVERSAL_EXECUTOR = 'packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/executor.ts';
const TOOL_DESCRIPTION_PARTS =
  'packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/tool-description.ts';
const EXPLORE_EXECUTION = `${SDK_MCP}/aggregated-explore/execution.ts`;
const GENERATE_MARKDOWN_DOCS =
  'packages/sdks/oak-sdk-codegen/code-generation/generate-markdown-docs.ts';

export const CURRENT_AGGREGATED_ITEM_ANCHOR_OVERRIDES = {
  C001: {
    [ORIENTATION_GUIDANCE]: [
      "export const PRIMARY_ORIENTATION_TOOL_NAME = 'get-curriculum-model' as const;",
    ],
  },
  C006: {
    [ORIENTATION_GUIDANCE]: ['export const SERVER_INSTRUCTIONS = generateServerInstructions();'],
  },
  // MCP-365: the baseline anchor ran to the template literal's closing
  // backtick; the owner-directed brand-provenance paragraph now closes the
  // generated instructions, so this item re-pins on its unchanged routing
  // paragraph alone.
  C055: {
    [AGENT_SUPPORT_METADATA]: [
      'For questions that are not about curriculum content — about the mechanisms by which the content is delivered, about this MCP app or its associated services, or about the repository itself — use the oak-under-the-hood tool to orient yourself to the Oak Open Curriculum Ecosystem.',
    ],
  },
  // MCP-366: the baseline anchor carried the deleted includeContextHint
  // line; the surviving formatToolResponse call anchors on its summary line.
  C057: {
    [UNIVERSAL_EXECUTOR]: ['summary: `${title}: ${String(result.value.status)}`,'],
  },
  C066: {
    [SEARCH_DEF]: [
      'description: `Hybrid lexical and semantic search across lessons, units, threads and sequences,',
    ],
  },
  // MCP-755: `year` now applies to the units scope as well as lessons, and
  // states what an exact age filter excludes, because a unit pitched one year
  // either side of the year asked for was silently unreachable.
  C078: {
    [SEARCH_SCHEMA]: [
      "Filter by year group number. Lessons and units scopes. Filters exactly, so content pitched one year either side — including across a key stage boundary — is excluded; omit it, or search the adjacent year too, when a year group is the teacher's intended pitch rather than a hard limit.",
    ],
  },
  C067: {
    [SEARCH_DEF]: ["title: 'Search Curriculum',"],
  },
  C101: {
    [EXPLORE_DEF]: ['description: `Explore a topic across the entire Oak curriculum in one call.'],
  },
  C102: {
    [EXPLORE_DEF]: ["title: 'Explore Topic',"],
  },
  C120: {
    [USER_SEARCH_DEF]: ["title: 'User Search',"],
  },
  C138: {
    [BROWSE_DEF]: ["description: `Browse what's available in Oak's curriculum without searching."],
  },
  C139: {
    [BROWSE_DEF]: ["title: 'Browse Curriculum',"],
  },
  C152: {
    [FETCH_EXECUTION]: ['description: `Fetch curriculum resource by canonical identifier.'],
  },
  C153: {
    [FETCH_EXECUTION]: ["title: 'Fetch Curriculum Resource',"],
  },
  C162: {
    [ASSET_DOWNLOAD_DEF]: [
      'description: `Generate a short-lived, secure download link for a lesson asset.',
    ],
  },
  C075: {
    ['packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search/flat-zod-schema.ts']: [
      'Filter lessons whose `units[]` contains an entry with this unit slug.',
    ],
  },
  C160: {
    ['packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-fetch/flat-zod-schema.ts']: [
      'Canonical identifier in format "type:slug" (e.g., "lesson:add-fractions-with-the-same-denominator"',
    ],
  },
  C164: {
    [ASSET_DOWNLOAD_DEF]: [
      '.describe(\'Lesson slug (e.g. "add-fractions-with-the-same-denominator")\')',
    ],
  },
  C235: {
    ['packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-misconception-graph.ts']: [
      'Lesson anchor: lesson slugs (corpus keys). Each lesson carries at most two misconceptions.',
    ],
  },
  C255: {
    ['packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-thread-progressions.ts']: [
      'Discovery anchor (with keyStage): a subject slug, e.g. "maths". Returns bounded thread descriptors',
    ],
  },
  C256: {
    ['packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-thread-progressions.ts']: [
      'Discovery anchor (with subject): a key-stage slug, e.g. "ks2". Returns bounded thread descriptors',
    ],
  },
  C166: {
    [ASSET_DOWNLOAD_DEF]: ["title: 'Download Asset',"],
  },
  C173: {
    [CURRICULUM_MODEL_DEF]: [
      "description: `Returns a complete orientation to Oak National Academy's",
    ],
  },
  C174: {
    [CURRICULUM_MODEL_DEF]: ["title: 'Oak Curriculum Overview',"],
  },
  C177: {
    [ASSET_DOWNLOAD_DEF]: [
      "securitySchemes: [{ type: 'oauth2', scopes: [...SCOPES_SUPPORTED] }] as const,",
    ],
  },
  // MCP-462: the description's get-keywords references dropped "full" —
  // the keywords endpoint is now server-paginated, so "full keyword set"
  // was no longer accurate; this item re-pins on its unchanged opening line.
  C222: {
    [KEYWORD_GRAPH]: [
      'Returns the key vocabulary for one teaching context: a bounded, frequency-ranked page of curriculum keywords, each decorated with its in-scope placing lessons.',
    ],
  },
  C223: {
    [KEYWORD_GRAPH]: [
      '.describe(\'Anchor subject slug (corpus key), e.g. "maths". Required, with keyStage.\')',
    ],
  },
  C224: {
    [KEYWORD_GRAPH]: [
      '.describe(\'Anchor key-stage slug (corpus key), e.g. "ks2". Required, with subject.\')',
    ],
  },
  C231: {
    [KEYWORD_GRAPH]: ['title: KEYWORD_GRAPH_TOOL_TITLE,'],
  },
  C463: {
    [TOOL_DESCRIPTION_PARTS]: [
      'export const TOOL_DESCRIPTION_ADDITIONS: ReadonlyMap<string, string> = new Map([',
    ],
  },
  /**
   * Two error-message items whose baseline fragments spanned a `catch` clause.
   * The 2026-11-01 lint pass renamed every catch parameter to `error`, so the
   * baseline fragment no longer occurs in the source while the served wording
   * is unchanged; these anchors are the content-bearing lines themselves.
   */
  C111: {
    [EXPLORE_EXECUTION]: [
      "error: `${scopeName} search failed: ${result.error?.message ?? 'unknown error'}`,",
      'return { ok: false, error: `${scopeName} search error: ${message}` };',
    ],
  },
  C426: {
    [GENERATE_MARKDOWN_DOCS]: [
      'function formatZodIssues(issues: ZodIssueType[]): string {',
      String.raw`throw new Error('TypeDoc JSON validation failed:\n' + formatZodIssues(error.issues), {`,
    ],
  },
} as const;

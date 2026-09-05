/**
 * Static tool usage guidance data for MCP server documentation.
 *
 * This module provides server-level "how to use these tools" documentation,
 * separate from the curriculum ontology (domain model in ontology-data.ts).
 *
 * Content is used by:
 * - Documentation resources (markdown docs exposed via resources/list)
 * - get-curriculum-model (returning structured guidance including tool help)
 * - Prompts (workflow templates)
 *
 * @remarks All content is static and added at SDK compile time,
 * complying with schema-first principles.
 *
 * Workflows are in a separate module to keep file sizes within
 * ESLint max-lines limits. See `./tool-guidance-workflows.ts`.
 *
 * @see `./tool-guidance-types.ts` for type definitions
 */

import { threadProgressionStats } from '@oaknational/graph-corpus-sdk/curriculum';
import { toolGuidanceWorkflows } from './tool-guidance-workflows.js';
import type { IdFormat, ToolCategory } from './tool-guidance-types.js';

/**
 * Tool usage guidance providing server-level documentation.
 *
 * This data structure is separate from ontologyData (curriculum domain model)
 * because it focuses on HOW to use the tools, not WHAT the curriculum contains.
 */
export const toolGuidanceData = {
  /**
   * Server overview providing high-level information about the MCP server.
   */
  serverOverview: {
    name: 'Oak Curriculum MCP Server',
    version: '1.0.0',
    aboutOak:
      "Oak National Academy is the UK's national curriculum body, providing free, high-quality, fully-resourced curriculum resources for teachers and students.",
    oakWebsite: 'https://www.thenational.academy',
    description:
      'Access Oak National Academy curriculum resources including lessons, units, quizzes, transcripts, and teaching materials. Covers Key Stages 1-4 across all National Curriculum subjects.',
    authentication: 'OAuth2 with Clerk - sign in with your email to access curriculum resources.',
    documentation: 'https://open-api.thenational.academy/docs',
  },

  /**
   * Tool categories grouping related tools by purpose.
   */
  toolCategories: {
    discovery: {
      tools: [
        'search',
        'user-search',
        'user-search-query',
        'explore-topic',
        'browse-curriculum',
        'get-subjects',
        'get-key-stages',
      ],
      description:
        'Find curriculum content using semantic search, topic exploration, or structured listing. ' +
        'search provides semantic search across lessons, units, threads, and sequences via a scope parameter. ' +
        'explore-topic searches all scopes in parallel for broad discovery. ' +
        'browse-curriculum returns structured facets without a search query.',
      whenToUse:
        'When you need to find content on a topic, explore what is available, or browse the curriculum structure. ' +
        'Use search with a specific scope for targeted results, explore-topic for broad discovery, ' +
        'or browse-curriculum to see what subjects and key stages exist.',
    } satisfies ToolCategory,

    browsing: {
      tools: [
        'get-key-stages-subject-units',
        'get-key-stages-subject-lessons',
        'get-sequences',
        'get-subjects-years',
      ],
      description:
        'Explore curriculum structure systematically by navigating through subjects, units, and lessons via the REST API.',
      whenToUse:
        'When you want to navigate the curriculum hierarchy step by step (subject then units then lessons). ' +
        'For a quicker overview, use browse-curriculum or explore-topic instead.',
    } satisfies ToolCategory,

    fetching: {
      tools: [
        'fetch',
        'get-lessons-summary',
        'get-lessons-transcript',
        'get-lessons-quiz',
        'get-lessons-assets',
        'get-units-summary',
        'download-asset',
      ],
      description:
        'Get detailed content for specific lessons, units, or resources you have already identified. ' +
        'download-asset generates a short-lived, secure download link for lesson assets (HTTP transport only).',
      whenToUse:
        'When you have a lesson or unit slug/ID and need to retrieve its full content, transcript, quiz questions, or downloadable assets. ' +
        'Use download-asset after get-lessons-assets to generate a clickable download link.',
    } satisfies ToolCategory,

    progression: {
      tools: [
        'get-threads',
        'get-threads-units',
        'get-thread-progressions',
        'get-prior-knowledge-graph',
      ],
      description: 'Explore how concepts develop across years through curriculum threads.',
      whenToUse: `When you want to understand how a concept builds from early years to GCSE, or find prerequisite/follow-up content. Use get-thread-progressions anchored by a threadSlug for one thread's curriculum-ordered progression (one run per subject), or by subject + keyStage to discover which of the ${String(threadProgressionStats.threadCount)} threads to anchor. Use get-prior-knowledge-graph with anchor unit slugs for the bounded prior-knowledge (prerequisite) subgraph of those units.`,
    } satisfies ToolCategory,

    programmes: {
      tools: [
        'get-subjects-programmes',
        'get-programmes',
        'get-programmes-units',
        'get-programmes-questions',
        'get-programmes-assets',
      ],
      description:
        'Navigate the curriculum by programme — the contextualised, teacher-facing view of a single ' +
        "subject / key-stage / year-group pathway (what teachers pick on Oak's website). Discover a " +
        "subject's programmes, then fetch one programme's metadata, units, questions, or assets.",
      whenToUse:
        'When the task is framed the way a teacher navigates — one year group of one subject with its ' +
        'tier / exam-board / child-subject context (e.g. Year 10 higher-tier AQA biology). Programme and ' +
        'sequence routes are co-equal, not a replacement for one another: use the programme route for a ' +
        'single user-facing pathway, and the sequence route (get-sequences) for structural, ' +
        'cross-programme traversal — one sequence generates many programme views. See the ' +
        'programmesVsSequences and ks4Complexity sections of get-curriculum-model for the distinction. ' +
        'Programme slugs are full-form (e.g. english-primary-year-1, english-secondary-year-10-edexcel), ' +
        'not year-group labels like y7.',
    } satisfies ToolCategory,

    agentSupport: {
      tools: ['get-curriculum-model'],
      description:
        'Agent orientation tool. get-curriculum-model provides the complete domain model (key stages, subjects, entity hierarchy, property graph) and tool usage guidance in a single call.',
      whenToUse:
        'At conversation start, call get-curriculum-model for complete orientation before using search, fetch, or browsing tools.',
      isAgentSupport: true,
    } satisfies ToolCategory,
  },

  /**
   * Common workflows showing how to combine tools for typical tasks.
   *
   * These workflows are included in agent tool responses (structuredContent)
   * to help agents understand how to use tools together effectively.
   *
   * @see `./tool-guidance-workflows.ts` for the workflow definitions
   */
  workflows: toolGuidanceWorkflows,

  /** Quick tips for effective tool usage. */
  tips: [
    'Use search with a scope for targeted semantic search: scope "lessons" for specific lessons, "units" for topic groups, "threads" for progressions, "sequences" for programme structures, "suggest" for typeahead.',
    'Use explore-topic when you do not know which scope to search — it searches lessons, units, and threads in parallel.',
    'Use browse-curriculum to see what subjects and key stages are available, without needing a search query.',
    'The "fetch" tool uses prefixed IDs: lesson:slug, unit:slug, thread:slug, subject:slug.',
    'Get lesson transcript for detailed content understanding; get quiz for assessment ideas.',
    'Threads show how concepts build across years — great for finding prerequisites or extensions.',
    'Key Stage 4 (GCSE) has additional complexity: tiers (foundation/higher) and exam boards.',
    'Use get-curriculum-model at the start of a conversation for complete orientation — it combines the domain model and tool guidance in one call.',
    'get-curriculum-model includes domain definitions, entity hierarchy, property graph, tool categories, workflows, and tips.',
    'Not all lessons have all components — video, transcript, quizzes, and worksheets are OPTIONAL. Check availability before assuming they exist.',
    'Agent guidance for search: Oak search uses semantic search (ELSER) combined with lexical search (BM25) via Reciprocal Rank Fusion. Search query should be curriculum topic terms (e.g. "trigonometry", "photosynthesis", "the Romans") — the semantic search handles linguistic variation naturally. Assessment terms like "GCSE" or "SATs" map to keyStage filters (ks4, ks2), not the search query. When the user uses an Oak glossary term (e.g. "KS4", "unit", "thread", "tier", "key stage"), treat it as already correct — do not rewrite it. When the user uses a colloquial term (e.g. "GCSE", "SATs", "times tables"), map it to the canonical term using the ukEducationContext and entityHierarchy in get-curriculum-model. Never rewrite a glossary term into a non-glossary term. See: https://open-api.thenational.academy/docs/about-oaks-data/glossary',
  ],

  /**
   * ID format documentation for the fetch tool.
   */
  idFormats: {
    description: 'The fetch tool uses prefixed IDs to route to the correct content type.',
    formats: [
      {
        prefix: 'lesson:',
        example: 'lesson:add-fractions-with-the-same-denominator',
        description: 'Fetches lesson summary with learning objectives, keywords, and metadata.',
      },
      {
        prefix: 'unit:',
        example: 'unit:comparing-fractions',
        description: 'Fetches unit summary with lesson list and unit metadata.',
      },
      {
        prefix: 'thread:',
        example: 'thread:number',
        description: 'Fetches units in a thread ordered by conceptual progression.',
      },
      {
        prefix: 'subject:',
        example: 'subject:maths',
        description: 'Fetches subject details including available key stages and sequences.',
      },
    ] satisfies readonly IdFormat[],
  },
} as const;

/**
 * Type representing the tool guidance data structure.
 */
export type ToolGuidanceData = typeof toolGuidanceData;

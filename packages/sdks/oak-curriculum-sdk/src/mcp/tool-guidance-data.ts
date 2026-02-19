/**
 * Static tool usage guidance data for MCP server documentation.
 *
 * This module provides server-level "how to use these tools" documentation,
 * separate from the curriculum ontology (domain model in ontology-data.ts).
 *
 * Content is used by:
 * - Documentation resources (markdown docs exposed via resources/list)
 * - Help tool (get-help returning structured guidance)
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

import { threadProgressionGraph } from './thread-progression-data.js';
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
        'search-sdk',
        'explore-topic',
        'browse-curriculum',
        'search',
        'get-subjects',
        'get-key-stages',
      ],
      description:
        'Find curriculum content using semantic search, topic exploration, or structured listing. ' +
        'search-sdk provides semantic search across lessons, units, threads, and sequences via a scope parameter. ' +
        'explore-topic searches all scopes in parallel for broad discovery. ' +
        'browse-curriculum returns structured facets without a search query.',
      whenToUse:
        'When you need to find content on a topic, explore what is available, or browse the curriculum structure. ' +
        'Use search-sdk with a specific scope for targeted results, explore-topic for broad discovery, ' +
        'or browse-curriculum to see what subjects and key stages exist.',
    } satisfies ToolCategory,

    browsing: {
      tools: [
        'get-key-stages-subject-units',
        'get-key-stages-subject-lessons',
        'get-subjects-sequences',
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
      ],
      description:
        'Get detailed content for specific lessons, units, or resources you have already identified.',
      whenToUse:
        'When you have a lesson or unit slug/ID and need to retrieve its full content, transcript, quiz questions, or downloadable assets.',
    } satisfies ToolCategory,

    progression: {
      tools: [
        'get-threads',
        'get-threads-units',
        'get-thread-progressions',
        'get-prerequisite-graph',
      ],
      description: 'Explore how concepts develop across years through curriculum threads.',
      whenToUse: `When you want to understand how a concept builds from early years to GCSE, or find prerequisite/follow-up content. Use get-thread-progressions for a complete static graph of all ${String(threadProgressionGraph.stats.threadCount)} threads. Use get-prerequisite-graph for unit dependencies and prior knowledge requirements.`,
    } satisfies ToolCategory,

    agentSupport: {
      tools: ['get-help', 'get-ontology'],
      description:
        'Tools for understanding the Oak Curriculum system and how to use the tools. get-ontology includes the property graph of concept relationships.',
      whenToUse: 'At conversation start, when user asks to "understand Oak", or to get context.',
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
    'Use search-sdk with a scope for targeted semantic search: scope "lessons" for specific lessons, "units" for topic groups, "threads" for progressions, "sequences" for programme structures, "suggest" for typeahead.',
    'Use explore-topic when you do not know which scope to search — it searches lessons, units, and threads in parallel.',
    'Use browse-curriculum to see what subjects and key stages are available, without needing a search query.',
    'The "fetch" tool uses prefixed IDs: lesson:slug, unit:slug, thread:slug, subject:slug.',
    'Get lesson transcript for detailed content understanding; get quiz for assessment ideas.',
    'Threads show how concepts build across years — great for finding prerequisites or extensions.',
    'Key Stage 4 (GCSE) has additional complexity: tiers (foundation/higher) and exam boards.',
    'Use get-help or get-ontology to understand Oak — great at the start of a conversation.',
    'get-ontology includes both domain definitions (what things mean) and a property graph (how concept types connect structurally).',
    'Not all lessons have all components — video, transcript, quizzes, and worksheets are OPTIONAL. Check availability before assuming they exist.',
  ],

  /**
   * ID format documentation for the fetch tool.
   */
  idFormats: {
    description: 'The fetch tool uses prefixed IDs to route to the correct content type.',
    formats: [
      {
        prefix: 'lesson:',
        example: 'lesson:adding-fractions-with-same-denominator',
        description: 'Fetches lesson summary with learning objectives, keywords, and metadata.',
      },
      {
        prefix: 'unit:',
        example: 'unit:fractions-year-4',
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

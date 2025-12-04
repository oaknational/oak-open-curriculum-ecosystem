/* eslint-disable max-lines -- this is a static tool guidance data file, disabling to maintain readability */

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
 * @see {@link ./tool-guidance-types.ts} for type definitions
 */

import type { IdFormat, ToolCategory, Workflow } from './tool-guidance-types.js';

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
      tools: ['search', 'get-subjects', 'get-key-stages'],
      description:
        'Find curriculum content by searching or listing available subjects and key stages.',
      whenToUse:
        'When you know what topic or subject you want and need to find matching lessons or units.',
    } satisfies ToolCategory,

    browsing: {
      tools: [
        'get-key-stages-subject-units',
        'get-key-stages-subject-lessons',
        'get-subjects-sequences',
        'get-subjects-years',
      ],
      description:
        'Explore curriculum structure systematically by navigating through subjects, units, and lessons.',
      whenToUse:
        'When you want to see what content is available for a particular subject and key stage, or explore the curriculum hierarchy.',
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
      tools: ['get-threads', 'get-threads-units'],
      description: 'Explore how concepts develop across years through curriculum threads.',
      whenToUse:
        'When you want to understand how a concept builds from early years to GCSE, or find prerequisite/follow-up content.',
    } satisfies ToolCategory,

    agentSupport: {
      tools: ['get-help', 'get-ontology', 'get-knowledge-graph'],
      description: 'Tools for understanding Oak Curriculum system and how to use the tools.',
      whenToUse: 'At conversation start, when user asks to "understand Oak", or to get context.',
      isAgentSupport: true,
    } satisfies ToolCategory,
  },

  /**
   * Common workflows showing how to combine tools for typical tasks.
   *
   * These workflows are included in agent tool responses (structuredContent)
   * to help agents understand how to use tools together effectively.
   */
  workflows: {
    userInteractions: {
      title: 'When finding or presenting Oak content for the user',
      description:
        'When finding or presenting Oak content for the user, you should follow these steps.',
      steps: [
        {
          step: 1,
          action: 'Use the get-help tool to understand the Oak context',
          tool: 'get-help',
          example: 'get-help()',
          returns: 'An introduction to the Oak curriculum and how to use the tools.',
        },
        {
          step: 2,
          action: 'Use the get-ontology tool to understand the Oak curriculum',
          tool: 'get-ontology',
          example: 'get-ontology()',
          returns:
            'A detailed overview of the Oak curriculum including key stages, subjects, units, and lessons.',
        },
        {
          step: 3,
          action: 'Use the discovery and browsing tools to explore the Oak curriculum',
        },
        {
          step: 4,
          action: 'Use the fetching tools to find curriculum content and resources',
        },
      ],
    } satisfies Workflow,
    findLessons: {
      title: 'Find lessons on a topic',
      description: 'Search for lessons matching a topic and retrieve detailed content.',
      steps: [
        {
          step: 1,
          action: 'Search for lessons matching your topic',
          tool: 'search',
          example: 'search({ query: "photosynthesis", keyStage: "ks3" })',
          returns: 'List of matching lessons with slugs and titles',
        },
        {
          step: 2,
          action: 'Review search results and select relevant lessons',
          note: 'Results include lesson slugs you can use with fetch',
        },
        {
          step: 3,
          action: 'Fetch full details for selected lessons',
          tool: 'fetch',
          example: 'fetch({ id: "lesson:photosynthesis-in-plants" })',
          returns: 'Full lesson details including transcript, quiz, assets',
        },
      ],
    } satisfies Workflow,

    lessonPlanning: {
      title: 'Plan a lesson',
      description: 'Gather all materials needed for lesson planning.',
      steps: [
        {
          step: 1,
          action: 'Find a relevant lesson using search or browsing',
          tool: 'search',
          returns: 'Lessons matching your criteria',
        },
        {
          step: 2,
          action: 'Get lesson summary for learning objectives and keywords',
          tool: 'get-lessons-summary',
          example: 'get-lessons-summary({ lesson: "adding-fractions" })',
          returns: 'Learning objectives, keywords, misconceptions',
        },
        {
          step: 3,
          action: 'Get lesson transcript to understand content delivery',
          tool: 'get-lessons-transcript',
          example: 'get-lessons-transcript({ lesson: "adding-fractions" })',
          returns: 'Full video transcript text',
        },
        {
          step: 4,
          action: 'Get quiz questions for assessment ideas',
          tool: 'get-lessons-quiz',
          example: 'get-lessons-quiz({ lesson: "adding-fractions" })',
          returns: 'Starter and exit quiz questions with answers',
        },
        {
          step: 5,
          action: 'Get downloadable assets (slides, worksheets)',
          tool: 'get-lessons-assets',
          example: 'get-lessons-assets({ lesson: "adding-fractions" })',
          returns: 'Download URLs for slides, worksheets, and other resources',
        },
      ],
    } satisfies Workflow,

    browseSubject: {
      title: 'Browse a subject curriculum',
      description: 'Explore what units and lessons are available for a subject.',
      steps: [
        {
          step: 1,
          action: 'List all subjects to find the one you want',
          tool: 'get-subjects',
          returns: 'List of subjects with key stage coverage',
        },
        {
          step: 2,
          action: 'Get units for a specific subject and key stage',
          tool: 'get-key-stages-subject-units',
          example: 'get-key-stages-subject-units({ keyStage: "ks2", subject: "maths" })',
          returns: 'Units organised by year',
        },
        {
          step: 3,
          action: 'Get lessons within a specific unit',
          tool: 'get-key-stages-subject-lessons',
          example:
            'get-key-stages-subject-lessons({ keyStage: "ks2", subject: "maths", unit: "fractions-year-4" })',
          returns: 'Lessons with summaries',
        },
      ],
    } satisfies Workflow,

    trackProgression: {
      title: 'Track concept progression across years',
      description: 'See how a concept develops from early years to GCSE.',
      steps: [
        {
          step: 1,
          action: 'List available threads for a subject',
          tool: 'get-threads',
          example: 'get-threads({ subject: "maths" })',
          returns: 'Available conceptual threads for the subject',
        },
        {
          step: 2,
          action: 'Get units in a thread ordered by progression',
          tool: 'get-threads-units',
          example: 'get-threads-units({ threadSlug: "number" })',
          returns: 'Units ordered by conceptual development across years',
          note: 'Lower unitOrder = earlier in progression',
        },
        {
          step: 3,
          action: 'Identify prerequisite units (earlier in order) and extensions (later in order)',
        },
      ],
    } satisfies Workflow,
  },

  /** Quick tips for effective tool usage. */
  tips: [
    'Use "search" for free-text queries; use browsing tools for structured exploration.',
    'The "fetch" tool uses prefixed IDs: lesson:slug, unit:slug, thread:slug, subject:slug.',
    'Get lesson transcript for detailed content understanding; get quiz for assessment ideas.',
    'Threads show how concepts build across years - great for finding prerequisites or extensions.',
    'Key Stage 4 (GCSE) has additional complexity: tiers (foundation/higher) and exam boards.',
    'Use get-help or get-ontology to understand Oak - great at the start of a conversation.',
    'Use get-ontology for domain understanding (what things mean), get-knowledge-graph for structure (how things connect).',
    'Not all lessons have all components - video, transcript, quizzes, and worksheets are OPTIONAL. Check availability before assuming they exist.',
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

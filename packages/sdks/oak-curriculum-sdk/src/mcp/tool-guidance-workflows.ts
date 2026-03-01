/**
 * Workflow definitions for tool usage guidance.
 *
 * Common multi-step workflows showing how to combine tools for
 * typical teacher tasks. These workflows are included in agent tool
 * responses (structuredContent) and in the get-help tool output.
 *
 * @remarks Extracted from tool-guidance-data.ts to keep file sizes
 * within ESLint max-lines limits. All content is static and added
 * at SDK compile time, complying with schema-first principles.
 *
 * @see `./tool-guidance-types.ts` for type definitions
 */

import { threadProgressionGraph } from '@oaknational/sdk-codegen/vocab';
import type { Workflow } from './tool-guidance-types.js';

/**
 * Workflow definitions describing common multi-step teacher tasks.
 *
 * Each workflow documents a sequence of tool calls that together
 * accomplish a specific goal. Agents use these to plan tool usage.
 */
export const toolGuidanceWorkflows = {
  userInteractions: {
    title: 'When finding or presenting Oak content for the user',
    description:
      'When finding or presenting Oak content for the user, you should follow these steps.',
    steps: [
      {
        step: 1,
        action:
          'Call get-curriculum-model for complete orientation: domain model, tool guidance, and workflows',
        tool: 'get-curriculum-model',
        example: 'get-curriculum-model()',
        returns:
          'Complete curriculum orientation including key stages, subjects, entity hierarchy, tool categories, workflows, and tips.',
      },
      {
        step: 2,
        action: 'Use the discovery and browsing tools to explore the Oak curriculum',
      },
      {
        step: 3,
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
        action: 'Search for lessons matching your topic using semantic search',
        tool: 'search',
        example:
          'search({ text: "photosynthesis", scope: "lessons", subject: "science", keyStage: "ks3" })',
        returns: 'Ranked list of matching lessons with titles, subjects, and relevance scores',
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
        action: 'Find a relevant lesson using semantic search',
        tool: 'search',
        example:
          'search({ text: "adding fractions", scope: "lessons", subject: "maths", keyStage: "ks2" })',
        returns: 'Lessons matching your criteria with relevance ranking',
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
        action: 'Search for learning progression threads on the concept',
        tool: 'search',
        example: 'search({ text: "algebra", scope: "threads", subject: "maths" })',
        returns: 'Matching threads with relevance ranking',
      },
      {
        step: 2,
        action: 'Get the full progression graph for all threads',
        tool: 'get-thread-progressions',
        returns: `Complete static graph of all ${String(threadProgressionGraph.stats.threadCount)} threads with units ordered by progression`,
        note: 'Lower unitOrder = earlier in progression',
      },
      {
        step: 3,
        action: 'Get prerequisite graph for specific units to understand dependencies',
        tool: 'get-prerequisite-graph',
        returns: 'Unit dependencies and prior knowledge requirements',
      },
    ],
  } satisfies Workflow,

  exploreTopic: {
    title: 'Explore a topic across the curriculum',
    description:
      'Discover what lessons, units, and threads exist for a topic before drilling down.',
    steps: [
      {
        step: 1,
        action: 'Explore the topic across all content types in parallel',
        tool: 'explore-topic',
        example: 'explore-topic({ text: "volcanos", subject: "geography" })',
        returns: 'Unified topic map: top lessons, units, and threads found across the curriculum',
      },
      {
        step: 2,
        action: 'Drill down into the most relevant scope',
        tool: 'search',
        example: 'search({ text: "volcanos", scope: "lessons", subject: "geography" })',
        returns: 'Full ranked results for the chosen scope',
      },
      {
        step: 3,
        action: 'Fetch full details for the best results',
        tool: 'fetch',
        example: 'fetch({ id: "lesson:volcanic-eruptions" })',
        returns: 'Full lesson content including objectives, transcript, quiz',
      },
    ],
  } satisfies Workflow,

  discoverCurriculum: {
    title: 'Discover what is available in the curriculum',
    description:
      'Browse curriculum structure to see subjects, key stages, programmes, and lesson counts.',
    steps: [
      {
        step: 1,
        action: 'Browse available programmes and facets',
        tool: 'browse-curriculum',
        example: 'browse-curriculum({ subject: "science", keyStage: "ks3" })',
        returns: 'Structured facet data: subjects, key stages, sequences, units, lesson counts',
      },
      {
        step: 2,
        action: 'Explore a specific topic within the subject to find relevant content',
        tool: 'explore-topic',
        example: 'explore-topic({ text: "cells", subject: "science", keyStage: "ks3" })',
        returns: 'Topic map with lessons, units, and threads',
      },
    ],
  } satisfies Workflow,
} as const;

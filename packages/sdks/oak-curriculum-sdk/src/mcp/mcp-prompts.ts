/**
 * MCP prompts for Oak Curriculum server.
 *
 * Prompts are user-initiated workflow templates that guide interactions
 * with the MCP server. They appear as slash commands or suggested actions
 * in MCP clients.
 *
 * @remarks Static content per schema-first principles.
 * Message generators are in `./mcp-prompt-messages.ts` to keep this
 * file within ESLint max-lines limits.
 */

import type { PromptMessage } from './mcp-prompt-types.js';
import {
  getFindLessonsMessages,
  getLessonPlanningMessages,
  getExploreCurriculumMessages,
  getLearningProgressionMessages,
  getCurriculumMappingMessages,
  getAdaptLessonMessages,
  getContinueProgressionMessages,
} from './mcp-prompt-messages.js';

/**
 * Prompt argument definition for MCP registration.
 */
interface PromptArgument {
  /** Argument name (used in template) */
  readonly name: string;
  /** Description of what this argument is for */
  readonly description: string;
  /** Whether this argument is required */
  readonly required: boolean;
}

/**
 * Prompt definition for MCP registration.
 */
export interface McpPrompt {
  /** Unique prompt name (used for prompts/get) */
  readonly name: string;
  /** Human-readable description */
  readonly description: string;
  /** Arguments that can be provided when invoking the prompt */
  readonly arguments?: readonly PromptArgument[];
}

function requiredArgument(name: string, description: string): PromptArgument {
  return { name, description, required: true };
}

function optionalArgument(name: string, description: string): PromptArgument {
  return { name, description, required: false };
}

/**
 * MCP prompts for common curriculum workflows.
 *
 * These prompts provide guided interactions for teachers using
 * the Oak Curriculum MCP server.
 */
export const MCP_PROMPTS: readonly McpPrompt[] = [
  {
    name: 'find-lessons',
    description:
      'Find curriculum lessons on a specific topic using semantic search. Searches across all subjects and key stages to find relevant lessons.',
    arguments: [
      requiredArgument(
        'topic',
        'The topic or concept to search for (e.g., "photosynthesis", "fractions", "World War 2")',
      ),
      optionalArgument(
        'keyStage',
        'Optional: Filter by key stage (e.g., "ks1", "ks2", "ks3", "ks4")',
      ),
    ],
  },
  {
    name: 'lesson-planning',
    description:
      "Build a complete, teachable lesson on a topic the way Oak does — planning grounded in Oak's live curriculum data and six curriculum principles: pupil outcome, key learning points, keywords, misconceptions, quizzes, and resources, with attribution carried.",
    arguments: [
      requiredArgument(
        'topic',
        'The topic for the lesson (e.g., "adding fractions", "the water cycle")',
      ),
      requiredArgument('yearGroup', 'The year group (e.g., "Year 4", "Year 9")'),
    ],
  },
  {
    name: 'explore-curriculum',
    description:
      'Explore what Oak has on a topic across the whole curriculum. Searches lessons, units, and learning threads in parallel to give a broad overview before drilling down.',
    arguments: [
      requiredArgument(
        'topic',
        'The topic to explore (e.g., "volcanos", "electricity", "the Romans")',
      ),
      optionalArgument(
        'subject',
        'Optional: Narrow to a specific subject (e.g., "science", "history")',
      ),
    ],
  },
  {
    name: 'learning-progression',
    description:
      'Understand how a concept builds across year groups by searching learning progression threads and mapping unit dependencies.',
    arguments: [
      requiredArgument(
        'concept',
        'The concept to trace (e.g., "algebra", "cells", "narrative writing")',
      ),
      requiredArgument('subject', 'The subject area (e.g., "maths", "science", "english")'),
    ],
  },
  {
    name: 'curriculum-mapping',
    description:
      "Build or audit a curriculum map — what is taught and in what order across a year or key stage — grounded in Oak's threads, prior-knowledge graph, and national-curriculum coverage.",
    arguments: [
      requiredArgument('subject', 'The subject area (e.g., "maths", "science", "english")'),
      requiredArgument('keyStage', 'The key stage to map (e.g., "ks1", "ks2", "ks3", "ks4")'),
      optionalArgument(
        'yearGroup',
        'Optional: Narrow the map to a specific year group (e.g., "Year 4")',
      ),
    ],
  },
  {
    name: 'adapt-lesson',
    description:
      'Adapt an Oak lesson grounded in EEF Teaching and Learning Toolkit evidence: surface the pedagogical signals, retrieve the relevant EEF evidence, and present evidence-calibrated options with caveats and attribution intact.',
    arguments: [
      requiredArgument(
        'topic',
        'The topic for the lesson (e.g., "adding fractions", "the water cycle")',
      ),
      requiredArgument('yearGroup', 'The year group (e.g., "Year 4", "Year 9")'),
    ],
  },
  {
    name: 'continue-progression',
    description:
      "State where your class is — what they just covered — and plan the next step from Oak's curriculum sequence: assumed prior knowledge surfaced as a checkable readiness list, upcoming misconceptions anticipated, then a full lesson plan through lesson-planning.",
    arguments: [
      requiredArgument('subject', 'The subject area (e.g., "maths", "science", "english")'),
      requiredArgument('yearGroup', 'The year group (e.g., "Year 4", "Year 9")'),
      requiredArgument(
        'justCovered',
        'What the class just completed — a topic, unit, or lesson (e.g., "equivalent fractions", "the circulatory system")',
      ),
      optionalArgument(
        'classNotes',
        'Optional: Notes on how the class did (e.g., "they struggled with equivalent fractions")',
      ),
    ],
  },
] as const;

/**
 * Generates prompt messages for a given prompt name and arguments.
 *
 * Returns an array of messages that guide the model to use the appropriate
 * tools in the correct order for the workflow.
 *
 * @param promptName - Name of the prompt to get messages for
 * @param args - Arguments provided by the user (may be partially filled)
 * @returns Array of prompt messages, or empty array if prompt not found
 */
export function getPromptMessages(
  promptName: string,
  args: Readonly<Record<string, string | undefined>>,
): PromptMessage[] {
  switch (promptName) {
    case 'find-lessons':
      return getFindLessonsMessages(args);
    case 'lesson-planning':
      return getLessonPlanningMessages(args);
    case 'explore-curriculum':
      return getExploreCurriculumMessages(args);
    case 'learning-progression':
      return getLearningProgressionMessages(args);
    case 'curriculum-mapping':
      return getCurriculumMappingMessages(args);
    case 'adapt-lesson':
      return getAdaptLessonMessages(args);
    case 'continue-progression':
      return getContinueProgressionMessages(args);
    default:
      return [];
  }
}

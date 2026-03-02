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

import type { PromptMessage } from './mcp-prompt-messages.js';
import {
  getFindLessonsMessages,
  getLessonPlanningMessages,
  getExploreCurriculumMessages,
  getLearningProgressionMessages,
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
      {
        name: 'topic',
        description:
          'The topic or concept to search for (e.g., "photosynthesis", "fractions", "World War 2")',
        required: true,
      },
      {
        name: 'keyStage',
        description: 'Optional: Filter by key stage (e.g., "ks1", "ks2", "ks3", "ks4")',
        required: false,
      },
    ],
  },
  {
    name: 'lesson-planning',
    description:
      'Gather materials for planning a lesson on a topic, including objectives, transcript, quiz questions, and resources.',
    arguments: [
      {
        name: 'topic',
        description: 'The topic for the lesson (e.g., "adding fractions", "the water cycle")',
        required: true,
      },
      {
        name: 'yearGroup',
        description: 'The year group (e.g., "Year 4", "Year 9")',
        required: true,
      },
    ],
  },
  {
    name: 'explore-curriculum',
    description:
      'Explore what Oak has on a topic across the whole curriculum. Searches lessons, units, and learning threads in parallel to give a broad overview before drilling down.',
    arguments: [
      {
        name: 'topic',
        description: 'The topic to explore (e.g., "volcanos", "electricity", "the Romans")',
        required: true,
      },
      {
        name: 'subject',
        description: 'Optional: Narrow to a specific subject (e.g., "science", "history")',
        required: false,
      },
    ],
  },
  {
    name: 'learning-progression',
    description:
      'Understand how a concept builds across year groups by searching learning progression threads and mapping unit dependencies.',
    arguments: [
      {
        name: 'concept',
        description: 'The concept to trace (e.g., "algebra", "cells", "narrative writing")',
        required: true,
      },
      {
        name: 'subject',
        description: 'The subject area (e.g., "maths", "science", "english")',
        required: true,
      },
    ],
  },
] as const;

/**
 * Prompt arguments are string values that may or may not be provided.
 *
 * This type accurately reflects that accessing a key may return undefined.
 */
export type PromptArgs = Readonly<Record<string, string | undefined>>;

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
export function getPromptMessages(promptName: string, args: PromptArgs): PromptMessage[] {
  switch (promptName) {
    case 'find-lessons':
      return getFindLessonsMessages(args);
    case 'lesson-planning':
      return getLessonPlanningMessages(args);
    case 'explore-curriculum':
      return getExploreCurriculumMessages(args);
    case 'learning-progression':
      return getLearningProgressionMessages(args);
    default:
      return [];
  }
}

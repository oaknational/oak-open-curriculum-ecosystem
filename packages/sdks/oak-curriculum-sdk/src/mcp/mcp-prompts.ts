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
} from './mcp-prompt-messages.js';
import { getEefEvidenceGroundedLessonPlanMessages } from './evidence-corpus/eef-evidence-grounded-lesson-plan-messages.js';

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
      'Gather materials for planning a lesson on a topic, including objectives, transcript, quiz questions, and resources.',
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
  // Co-gated delivery unit. This prompt drives the `eef-explore-evidence-for-context`
  // tool; the two form ONE unit and must surface together or not at all (Definition
  // of Delivery, criterion 4 — whole for its unit). The HTTP app registers this
  // prompt only when `OAK_CURRICULUM_MCP_EEF_ENABLED` is set (see the consuming
  // app's register-prompts wiring); registering it while the tool is gated OFF would
  // create an orphaned surface (a prompt whose tool is absent). Defining it here in
  // the SDK is substrate, not delivery — the prompt is latent until the flag co-gates
  // it with the tool.
  {
    name: 'eef-evidence-grounded-lesson-plan',
    description:
      'Design a lesson plan grounded in EEF Toolkit evidence: combines 2-3 evidence-backed approaches drawn from a typed subgraph of EEF strands, with caveats and implementation guidance, into a structured pedagogical sequence (starter → main → practice → plenary with metacognitive reflection).',
    arguments: [
      requiredArgument('subject', 'The subject (e.g., "mathematics", "science", "english")'),
      requiredArgument(
        'keyStage',
        'The key stage (e.g., "EYFS", "KS1", "KS2", "KS3", "KS4", "KS5")',
      ),
      requiredArgument(
        'topic',
        'The specific topic for the lesson (e.g., "fractions", "the water cycle", "narrative writing")',
      ),
      optionalArgument(
        'focus',
        'Optional pedagogical focus, one of: closing_disadvantage_gap, metacognition, literacy, numeracy, behaviour, feedback',
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
    case 'eef-evidence-grounded-lesson-plan':
      return getEefEvidenceGroundedLessonPlanMessages(args);
    default:
      return [];
  }
}

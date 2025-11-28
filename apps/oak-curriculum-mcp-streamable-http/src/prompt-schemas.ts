/**
 * Zod schemas for MCP prompt arguments.
 *
 * These schemas define the expected arguments for each prompt registered
 * with the MCP server. They are used with the MCP SDK's `registerPrompt()`
 * method to provide type-safe argument validation.
 *
 * The schemas match the argument structure defined in `MCP_PROMPTS` from
 * the SDK, ensuring consistency between the metadata and runtime validation.
 *
 * @see {@link MCP_PROMPTS} - Prompt definitions in SDK
 * @see https://modelcontextprotocol.io/specification/draft/server/prompts
 *
 * @module prompt-schemas
 */

import { z } from 'zod';

/**
 * Schema for find-lessons prompt arguments.
 *
 * Used when searching for curriculum lessons on a specific topic.
 */
export const findLessonsArgsSchema = {
  topic: z
    .string()
    .describe(
      'The topic or concept to search for (e.g., "photosynthesis", "fractions", "World War 2")',
    ),
  keyStage: z
    .string()
    .optional()
    .describe('Optional: Filter by key stage (e.g., "ks1", "ks2", "ks3", "ks4")'),
};

/**
 * Schema for lesson-planning prompt arguments.
 *
 * Used when gathering materials for planning a lesson on a topic.
 */
export const lessonPlanningArgsSchema = {
  topic: z
    .string()
    .describe('The topic for the lesson (e.g., "adding fractions", "the water cycle")'),
  year: z.string().describe('The year group (e.g., "Year 4", "Year 9")'),
};

/**
 * Schema for progression-map prompt arguments.
 *
 * Used when mapping how a concept develops across years in a subject.
 */
export const progressionMapArgsSchema = {
  concept: z
    .string()
    .describe('The concept thread to explore (e.g., "number", "forces", "grammar")'),
  subject: z.string().describe('The subject area (e.g., "maths", "science", "english")'),
};

/**
 * Map of prompt names to their argument schemas.
 *
 * Used by `registerPrompts()` to look up the appropriate schema
 * for each prompt during registration.
 */
export const PROMPT_SCHEMAS = {
  'find-lessons': findLessonsArgsSchema,
  'lesson-planning': lessonPlanningArgsSchema,
  'progression-map': progressionMapArgsSchema,
} as const;

/**
 * Type representing the prompt name to schema mapping.
 */
export type PromptSchemas = typeof PROMPT_SCHEMAS;

/**
 * Type representing valid prompt names that have schemas.
 */
export type PromptName = keyof PromptSchemas;

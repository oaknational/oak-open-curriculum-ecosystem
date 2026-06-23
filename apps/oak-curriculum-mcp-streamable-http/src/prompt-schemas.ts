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
  yearGroup: z.string().describe('The year group (e.g., "Year 4", "Year 9")'),
};

/**
 * Schema for adapt-lesson prompt arguments.
 *
 * Used when adapting an Oak lesson grounded in EEF Toolkit evidence. Free-form
 * values are legitimate here — the prompt instructs the agent to convert them
 * into Oak retrieval inputs and finite EEF tool inputs before any tool call.
 */
export const adaptLessonArgsSchema = {
  topic: z
    .string()
    .describe('The topic for the lesson (e.g., "adding fractions", "the water cycle")'),
  yearGroup: z.string().describe('The year group (e.g., "Year 4", "Year 9")'),
};

/**
 * Schema for explore-curriculum prompt arguments.
 *
 * Used when exploring what Oak has on a topic across the whole curriculum.
 */
export const exploreCurriculumArgsSchema = {
  topic: z
    .string()
    .describe('The topic to explore (e.g., "volcanos", "electricity", "the Romans")'),
  subject: z
    .string()
    .optional()
    .describe('Optional: Narrow to a specific subject (e.g., "science", "history")'),
};

/**
 * Schema for learning-progression prompt arguments.
 *
 * Used when tracing how a concept builds across year groups.
 */
export const learningProgressionArgsSchema = {
  concept: z
    .string()
    .describe('The concept to trace (e.g., "algebra", "cells", "narrative writing")'),
  subject: z.string().describe('The subject area (e.g., "maths", "science", "english")'),
};

/**
 * Schema for continue-progression prompt arguments.
 *
 * Used when planning the next step from the class's stated position. The
 * free-text `justCovered` is legitimate here — the prompt instructs the
 * agent to resolve it to Oak unit/lesson slugs (with teacher confirmation
 * on ambiguity) before any anchored tool call.
 */
export const continueProgressionArgsSchema = {
  subject: z.string().describe('The subject area (e.g., "maths", "science", "english")'),
  yearGroup: z.string().describe('The year group (e.g., "Year 4", "Year 9")'),
  justCovered: z
    .string()
    .describe(
      'What the class just completed — a topic, unit, or lesson (e.g., "equivalent fractions", "the circulatory system")',
    ),
  classNotes: z
    .string()
    .optional()
    .describe(
      'Optional: Notes on how the class did (e.g., "they struggled with equivalent fractions")',
    ),
};

/**
 * Schema for curriculum-mapping prompt arguments.
 *
 * Used when building or auditing a curriculum map grounded in Oak's
 * threads, prior-knowledge graph, and national-curriculum coverage.
 */
export const curriculumMappingArgsSchema = {
  subject: z.string().describe('The subject area (e.g., "maths", "science", "english")'),
  keyStage: z.string().describe('The key stage to map (e.g., "ks1", "ks2", "ks3", "ks4")'),
  yearGroup: z
    .string()
    .optional()
    .describe('Optional: Narrow the map to a specific year group (e.g., "Year 4")'),
};

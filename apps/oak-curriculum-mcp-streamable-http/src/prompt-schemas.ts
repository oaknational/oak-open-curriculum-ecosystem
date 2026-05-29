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
 * Schema for eef-evidence-grounded-lesson-plan prompt arguments.
 *
 * Co-gated with the `eef-explore-evidence-for-context` tool behind
 * `OAK_CURRICULUM_MCP_EEF_ENABLED` (see register-prompts). `focus` is an
 * optional pedagogical priority passed as free text — MCP prompt arguments are
 * string-typed, so this schema does not constrain the value. The
 * `eef-explore-evidence-for-context` tool validates `focus` against its
 * EEF_PRIORITIES vocabulary (derived schema-first from the EEF data).
 */
export const eefEvidenceGroundedLessonPlanArgsSchema = {
  subject: z.string().describe('The subject (e.g., "mathematics", "science", "english")'),
  keyStage: z.string().describe('The key stage (e.g., "EYFS", "KS1", "KS2", "KS3", "KS4", "KS5")'),
  topic: z
    .string()
    .describe('The specific topic for the lesson (e.g., "fractions", "the water cycle")'),
  focus: z.string().optional().describe('Optional pedagogical focus (an EEF priority slug)'),
};

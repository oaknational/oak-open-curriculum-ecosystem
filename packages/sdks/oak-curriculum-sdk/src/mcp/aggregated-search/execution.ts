/**
 * Execution logic for the aggregated search tool.
 *
 * This module provides the runSearchTool function which executes
 * parallel searches across lessons and transcripts endpoints.
 *
 * @module aggregated-search/execution
 */

import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import {
  formatError,
  formatOptimizedResult,
  toErrorMessage,
  extractExecutionData,
} from '../universal-tool-shared.js';
import type { UniversalToolExecutorDependencies } from '../universal-tool-shared.js';
import type { SearchArgs } from './types.js';

/**
 * Builds search arguments for the lessons endpoint.
 */
function buildLessonsArgs(args: SearchArgs) {
  return {
    q: args.q,
    ...(args.keyStage !== undefined ? { keyStage: args.keyStage } : {}),
    ...(args.subject !== undefined ? { subject: args.subject } : {}),
    ...(args.unit !== undefined ? { unit: args.unit } : {}),
  };
}

/**
 * Formats successful search results into an optimized CallToolResult.
 */
function formatSearchSuccess(
  args: SearchArgs,
  lessons: readonly unknown[],
  transcripts: readonly unknown[],
  lessonsStatus: number | string,
  transcriptsStatus: number | string,
): CallToolResult {
  const summary = buildSearchSummary(lessons.length, transcripts.length, args.q);
  const lessonPreviews = lessons.map(extractLessonPreview);

  return formatOptimizedResult({
    summary,
    fullData: {
      q: args.q,
      keyStage: args.keyStage,
      subject: args.subject,
      unit: args.unit,
      lessonsStatus,
      lessons,
      transcriptsStatus,
      transcripts,
    },
    previewItems: lessonPreviews,
    query: args.q,
    timestamp: Date.now(),
    status: 'success',
  });
}

/**
 * Executes the search aggregated tool.
 *
 * Runs get-search-lessons and get-search-transcripts in parallel,
 * combining results into a single response.
 *
 * @param args - Validated search arguments
 * @param deps - Dependencies including the MCP tool executor
 * @returns CallToolResult with combined search results or error
 */
export async function runSearchTool(
  args: SearchArgs,
  deps: UniversalToolExecutorDependencies,
): Promise<CallToolResult> {
  const lessonsArgs = buildLessonsArgs(args);
  const transcriptsArgs = { q: args.q };

  // Execute both searches
  const lessonsResult = await deps.executeMcpTool('get-search-lessons', lessonsArgs);
  const transcriptsResult = await deps.executeMcpTool('get-search-transcripts', transcriptsArgs);

  // Extract and validate results
  const lessonsData = extractExecutionData(lessonsResult);
  if (!lessonsData.ok) {
    return formatError(toErrorMessage(lessonsData.error));
  }

  const transcriptsData = extractExecutionData(transcriptsResult);
  if (!transcriptsData.ok) {
    return formatError(toErrorMessage(transcriptsData.error));
  }

  // Extract arrays and format response
  const lessons = Array.isArray(lessonsData.data) ? lessonsData.data : [];
  const transcripts = Array.isArray(transcriptsData.data) ? transcriptsData.data : [];

  return formatSearchSuccess(
    args,
    lessons,
    transcripts,
    lessonsData.status,
    transcriptsData.status,
  );
}

/**
 * Builds a human-readable summary of search results.
 *
 * @param lessonCount - Number of lessons found
 * @param transcriptCount - Number of transcripts found
 * @param query - The search query
 * @returns Human-readable summary string
 */
function buildSearchSummary(lessonCount: number, transcriptCount: number, query: string): string {
  const lessonWord = lessonCount === 1 ? 'lesson' : 'lessons';
  const transcriptWord = transcriptCount === 1 ? 'transcript' : 'transcripts';

  if (lessonCount === 0 && transcriptCount === 0) {
    return `No results found for "${query}"`;
  }

  const parts: string[] = [];
  if (lessonCount > 0) {
    parts.push(`${String(lessonCount)} ${lessonWord}`);
  }
  if (transcriptCount > 0) {
    parts.push(`${String(transcriptCount)} ${transcriptWord}`);
  }

  return `Found ${parts.join(' and ')} matching "${query}"`;
}

/**
 * Type guard to check if value is a non-null object.
 */
function isNonNullObject(value: unknown): value is object {
  return typeof value === 'object' && value !== null;
}

/**
 * Type guard to check if object has lessonTitle string property.
 */
function hasLessonTitle(value: object): value is { lessonTitle: string } {
  if (!('lessonTitle' in value)) {
    return false;
  }
  const candidate = value.lessonTitle;
  return typeof candidate === 'string';
}

/**
 * Extracts preview data from a lesson for the model.
 * Only includes essential identifying information.
 *
 * @param lesson - The lesson data (unknown type from API)
 * @returns Preview object with title
 */
function extractLessonPreview(lesson: unknown): { title: string } {
  if (isNonNullObject(lesson) && hasLessonTitle(lesson)) {
    return { title: lesson.lessonTitle };
  }
  return { title: 'Unknown lesson' };
}

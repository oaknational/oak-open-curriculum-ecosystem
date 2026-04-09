/**
 * Result formatting for the explore-topic compound tool.
 *
 * Merges multi-index search results into a unified topic map with
 * human-readable summary and structured content for model reasoning.
 */

import type { CallToolResult } from '@modelcontextprotocol/sdk/types';
import { formatToolResponse } from '../universal-tool-shared.js';

/** Shape of each scope's outcome from the parallel search. */
interface ScopeOutcome {
  readonly ok: boolean;
  readonly data?: unknown;
  readonly error?: string;
}

/**
 * Builds a human-readable summary for the topic map.
 */
function buildTopicMapSummary(
  topic: string,
  totals: { lessonTotal: number; unitTotal: number; threadTotal: number },
): string {
  const parts: string[] = [];

  if (totals.lessonTotal > 0) {
    const word = totals.lessonTotal === 1 ? 'lesson' : 'lessons';
    parts.push(`${String(totals.lessonTotal)} ${word}`);
  }

  if (totals.unitTotal > 0) {
    const word = totals.unitTotal === 1 ? 'unit' : 'units';
    parts.push(`${String(totals.unitTotal)} ${word}`);
  }

  if (totals.threadTotal > 0) {
    const word = totals.threadTotal === 1 ? 'learning thread' : 'learning threads';
    parts.push(`${String(totals.threadTotal)} ${word}`);
  }

  if (parts.length === 0) {
    return `No content found for "${topic}". Try different terms or check available subjects with browse-curriculum.`;
  }

  return `Found ${parts.join(', ')} about "${topic}"`;
}

/**
 * Builds the next-steps guidance text.
 */
function buildNextSteps(totals: {
  lessonTotal: number;
  unitTotal: number;
  threadTotal: number;
}): string {
  const steps: string[] = [];

  if (totals.lessonTotal > 5) {
    steps.push("Use search(scope: 'lessons') for more lesson results");
  }
  if (totals.unitTotal > 0) {
    steps.push('Use fetch(unit:slug) for full unit details');
  }
  if (totals.threadTotal > 0) {
    steps.push('Use get-thread-progressions for ordered unit sequences');
  }
  if (steps.length === 0) {
    steps.push('Try browse-curriculum to see what subjects are available');
  }

  return steps.join('. ') + '.';
}

/**
 * Formats multi-index search results into a unified topic map.
 *
 * @param topic - The original search topic text
 * @param results - Object with outcomes from each scope
 * @param totals - Pre-computed totals from each scope
 * @returns Formatted CallToolResult for MCP response
 */
export function formatTopicMap(
  topic: string,
  results: {
    readonly lessons: ScopeOutcome;
    readonly units: ScopeOutcome;
    readonly threads: ScopeOutcome;
  },
  totals: { lessonTotal: number; unitTotal: number; threadTotal: number },
): CallToolResult {
  const summary = buildTopicMapSummary(topic, totals);
  const nextSteps = buildNextSteps(totals);

  return formatToolResponse({
    summary: `${summary}. ${nextSteps}`,
    data: {
      topic,
      lessons: results.lessons.ok
        ? { ok: true, data: results.lessons.data }
        : { ok: false, error: results.lessons.error },
      units: results.units.ok
        ? { ok: true, data: results.units.data }
        : { ok: false, error: results.units.error },
      threads: results.threads.ok
        ? { ok: true, data: results.threads.data }
        : { ok: false, error: results.threads.error },
      totals,
    },
    query: topic,
    timestamp: Date.now(),
    status: 'success',
    toolName: 'explore-topic',
    annotationsTitle: 'Explore Topic',
  });
}

/**
 * Pure parser for a session's current context occupancy from a vendor
 * transcript (Claude Code JSONL).
 *
 * @remarks
 * Claude Code records one JSON object per line. Assistant turns carry a usage
 * object; the sum of its input, cache-creation, and cache-read token counts is
 * the turn's context occupancy (output tokens and cumulative totals are
 * excluded). Current occupancy is the LATEST such turn's sum, so this scans from
 * the end and returns the first valid usage it finds. Each line is parsed as
 * JSON and validated with a closed schema; malformed lines are skipped, never
 * thrown (ADR-088).
 *
 * @packageDocumentation
 */

import { z } from 'zod';

import { parseJsonLine } from '../core/parse-json-line.js';

/** A session's current context occupancy. */
export interface SessionUsage {
  /** input + cache_creation + cache_read tokens of the latest assistant turn. */
  readonly usedTokens: number;
}

const usageLineSchema = z.object({
  message: z.object({
    usage: z.object({
      input_tokens: z.number().int().nonnegative(),
      cache_creation_input_tokens: z.number().int().nonnegative().default(0),
      cache_read_input_tokens: z.number().int().nonnegative().default(0),
    }),
  }),
});

/**
 * Extract the latest context occupancy from a Claude Code transcript.
 *
 * @param transcript - The full JSONL transcript text.
 * @returns The latest turn's occupancy, or `undefined` when no line carries a
 *   valid `message.usage`.
 */
export function parseLatestUsage(transcript: string): SessionUsage | undefined {
  const lines = transcript.split('\n');
  for (let index = lines.length - 1; index >= 0; index -= 1) {
    const line = lines[index]?.trim();
    if (line === undefined || line.length === 0) {
      continue;
    }

    const parsed = parseJsonLine(line);
    if (parsed === undefined) {
      continue;
    }

    const result = usageLineSchema.safeParse(parsed);
    if (result.success) {
      const usage = result.data.message.usage;
      return {
        usedTokens:
          usage.input_tokens + usage.cache_creation_input_tokens + usage.cache_read_input_tokens,
      };
    }
  }

  return undefined;
}

/**
 * Transcript entry shape and line parsing for the `arc-metrics` topic.
 *
 * @remarks
 * A vendor transcript carries one JSON object per line, of several kinds, and
 * this module validates only the fields the measures read — a closed schema over
 * an open record, so an unknown entry kind parses to the fields we asked for
 * rather than failing the session. An unparseable line yields `undefined`: a
 * transcript being written has a partial tail line, which is ordinary.
 *
 * @packageDocumentation
 */

import { z } from 'zod';

import { parseJsonLine } from '../core/parse-json-line.js';

const usageSchema = z.object({
  input_tokens: z.number().int().nonnegative().default(0),
  output_tokens: z.number().int().nonnegative().default(0),
  cache_creation_input_tokens: z.number().int().nonnegative().default(0),
  cache_read_input_tokens: z.number().int().nonnegative().default(0),
});

/** Who the transcript says sent a prompt: `human`, `peer`, `task-notification`, and others. */
const originSchema = z.object({
  kind: z.string().optional(),
});

const entrySchema = z.object({
  type: z.string().optional(),
  subtype: z.string().optional(),
  timestamp: z.string().optional(),
  isCompactSummary: z.boolean().optional(),
  content: z.unknown().optional(),
  /** On a user turn: how the prompt was submitted (`typed`, `queued`, `system`, …). */
  promptSource: z.string().optional(),
  origin: originSchema.optional(),
  message: z
    .object({
      id: z.string().optional(),
      usage: usageSchema.optional(),
      content: z.unknown().optional(),
    })
    .optional(),
  attachment: z
    .object({
      type: z.string().optional(),
      /** On a queued command: how it was entered (`prompt`, `task-notification`, …). */
      commandMode: z.string().optional(),
      prompt: z.unknown().optional(),
      origin: originSchema.optional(),
    })
    .optional(),
});

/** One transcript entry, narrowed to the fields the measures read. */
export type Entry = z.infer<typeof entrySchema>;

/**
 * Parse one transcript line into an entry.
 *
 * @param line - One line of the transcript.
 * @returns The entry, or `undefined` for a blank, unparseable, or
 *   non-conforming line.
 */
export function parseEntry(line: string): Entry | undefined {
  const trimmed = line.trim();
  if (trimmed.length === 0) {
    return undefined;
  }
  const parsed = parseJsonLine(trimmed);
  if (parsed === undefined) {
    return undefined;
  }
  const result = entrySchema.safeParse(parsed);
  return result.success ? result.data : undefined;
}

/**
 * The `system` subtype the harness writes on an idle timer — about three
 * minutes after the last event — to recap the session for an owner who has
 * stepped away. It records absence, so it is not an event.
 */
const IDLE_RECAP_SUBTYPE = 'away_summary';

/**
 * Read the time at which an entry records something happening in the session.
 *
 * @remarks
 * Every timestamped entry is an event, whatever its class — turns, harness
 * `system` entries, queue operations, attachments — except the idle recap,
 * which the harness writes because nothing happened.
 *
 * @param entry - The entry.
 * @returns Epoch milliseconds, or `null` when the entry carries no parseable
 *   timestamp or is the idle recap.
 */
export function eventTimeOf(entry: Entry): number | null {
  if (entry.timestamp === undefined) {
    return null;
  }
  if (entry.type === 'system' && entry.subtype === IDLE_RECAP_SUBTYPE) {
    return null;
  }
  const at = Date.parse(entry.timestamp);
  return Number.isFinite(at) ? at : null;
}

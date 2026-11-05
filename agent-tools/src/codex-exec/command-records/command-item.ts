import { err, ok, type Result } from '@oaknational/result';
import { z } from 'zod';

import { flagCommand, renderSegment } from './flag-command.js';
import { commandsOf, commandsOfText, type Command } from './shell-commands.js';
import type { CommandRecord, FlaggedCommand, Malformed } from './summary.js';

/**
 * A `CommandExecution` item read at the boundary, and the forbidden shapes
 * its command carries.
 */

const COMMAND_REASON = 'CommandExecution.command is not a non-empty list of strings';

/**
 * A `CommandExecution` item's fields as codex-cli 0.157.1 writes them: the
 * closed status and source sets, the argv, and the two optional fields. Other
 * fields of the item (its id, cwd, outputs, duration) are not read. Each check
 * carries the reason it fails, named by field so no reason echoes a value.
 */
const commandItemSchema = z.object({
  command: z
    .array(z.string({ error: COMMAND_REASON }), { error: COMMAND_REASON })
    .min(1, { error: COMMAND_REASON }),
  status: z.enum(['in_progress', 'completed', 'failed', 'declined'], {
    error: 'CommandExecution.status is outside its closed set',
  }),
  source: z.enum(['agent', 'user_shell', 'unified_exec_startup', 'unified_exec_interaction'], {
    error: 'CommandExecution.source is outside its closed set',
  }),
  exit_code: z.number({ error: 'CommandExecution.exit_code is not a number' }).optional(),
  interaction_input: z
    .string({ error: 'CommandExecution.interaction_input is not a string' })
    .optional(),
});

/** A `CommandExecution` item as a record, or the first failing field's reason. */
export function readCommandItem(
  item: unknown,
  turnId: string,
  line: number,
): Result<CommandRecord, Malformed> {
  const parsed = commandItemSchema.safeParse(item);
  if (!parsed.success) {
    const reason =
      parsed.error.issues[0]?.message ?? 'CommandExecution has a field the reader cannot read';
    return err({ line, reason });
  }
  return ok({
    line,
    turnId,
    command: parsed.data.command,
    status: parsed.data.status,
    source: parsed.data.source,
    exitCode: parsed.data.exit_code,
    interactionInput: parsed.data.interaction_input,
  });
}

/** A command the harness ran to completion or failure itself, not a refusal or a keystroke. */
export function isExecuted(record: CommandRecord): boolean {
  return record.status !== 'declined' && record.source !== 'unified_exec_interaction';
}

/**
 * The commands a record means, for the shapes: a keystroke into a running
 * process is a command line of its own (its startup argv was recorded, and
 * scanned, by the startup item).
 */
function segmentsOf(record: CommandRecord): readonly Command[] {
  if (record.source === 'unified_exec_interaction') {
    return record.interactionInput === undefined ? [] : commandsOfText(record.interactionInput);
  }
  return commandsOf(record.command);
}

/** What the record is evidence of: a refusal (declined), a keystroke, or a command that ran. */
function kindOf(record: CommandRecord): FlaggedCommand['kind'] {
  if (record.status === 'declined') {
    return 'refused';
  }
  return record.source === 'unified_exec_interaction' ? 'interaction' : 'executed';
}

/**
 * The segments carrying a forbidden shape as a flagged entry, or none. Only a
 * segment carrying a shape renders; the others are elided, so a script's
 * unrelated commands and data never reach the summary.
 */
export function flagSegments(
  segments: readonly Command[],
  entry: Omit<FlaggedCommand, 'rendered' | 'hits'>,
): FlaggedCommand | undefined {
  const scanned = segments.map((segment) => ({ segment, hits: flagCommand(segment) }));
  const hits = scanned.flatMap((candidate) => candidate.hits);
  if (hits.length === 0) {
    return undefined;
  }
  return {
    ...entry,
    rendered: scanned.map((candidate) =>
      candidate.hits.length > 0 ? renderSegment(candidate.segment) : '…',
    ),
    hits,
  };
}

/** The record as a flagged entry when any of its segments carries a forbidden shape. */
export function flagRecord(record: CommandRecord): FlaggedCommand | undefined {
  return flagSegments(segmentsOf(record), {
    kind: kindOf(record),
    line: record.line,
    turnId: record.turnId,
  });
}

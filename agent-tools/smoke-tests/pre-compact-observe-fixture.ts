/**
 * Shared fixtures for the `PreCompact` observer smoke: the payload and the
 * assertions every run must pass. The registered command, the throwaway
 * project and the harness-shaped run come from
 * `registered-hook-command-fixture.ts`.
 */
import assert from 'node:assert/strict';
import type { SpawnSyncReturns } from 'node:child_process';
import { closeSync, constants, fstatSync, openSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { z } from 'zod';

/** The prefix on every answer's `systemMessage`. */
const ANSWER_PREFIX = '[pre-compact-observe] ';

/** The observer's log directory, under the project directory. */
export const OBSERVATION_DIRECTORY = '.claude/logs/pre-compact-observe';

/** The observer's log file, under the project directory. */
export const OBSERVATION_LOG = `${OBSERVATION_DIRECTORY}/observations.jsonl`;

/** The answer: exactly `continue: true` and a prefixed message; any other key fails. */
const answerSchema = z.strictObject({
  continue: z.literal(true),
  systemMessage: z.string().startsWith(ANSWER_PREFIX),
});

/** The fields of the log line the smoke asserts; the full record is the unit tests'. */
const observationSchema = z.object({
  marker: z.string(),
  payload: z.object({ status: z.string() }),
  stdin: z.object({ readError: z.string().optional() }),
  transcriptBytes: z.number().optional(),
  siblings: z.object({
    entries: z.array(z.object({ name: z.string(), kind: z.string(), size: z.number().optional() })),
    count: z.number().optional(),
  }),
});

/** The fields of one log line the smoke asserts. */
export type LoggedObservation = z.output<typeof observationSchema>;

/**
 * A `PreCompact` payload in the shape the harness sends, `scratchpad_dir`
 * and `prompt_id` included.
 *
 * @param project - The throwaway project, as `cwd`.
 * @param transcriptPath - The `transcript_path` to send.
 * @param customInstructions - The text after `/compact`; `null` for a bare one.
 * @returns The payload's JSON text.
 */
export function compactPayload(
  project: string,
  transcriptPath: string,
  customInstructions: string | null,
): string {
  return JSON.stringify({
    session_id: 'pre-compact-observe-smoke',
    transcript_path: transcriptPath,
    cwd: project,
    prompt_id: 'pre-compact-observe-smoke-prompt',
    hook_event_name: 'PreCompact',
    trigger: 'manual',
    custom_instructions: customInstructions,
    scratchpad_dir: join(project, 'scratchpad'),
  });
}

/** The text's only line, without its newline; fails unless the text is exactly one line. */
function onlyLine(text: string, source: string): string {
  assert.match(
    text,
    /^[^\n]+\n$/u,
    `expected exactly one line on ${source}: ${JSON.stringify(text)}`,
  );
  return text.slice(0, -1);
}

/**
 * Assert what every run must show, and read its log line.
 *
 * @remarks
 * Exit 0 and no stderr; one stdout line whose message is the prefix and the
 * log line's marker, so the probe answer, not the fail-open one; and one log
 * line, in a regular file at 0o600.
 *
 * @param result - The finished run.
 * @param project - The throwaway project the run observed into.
 * @returns The asserted fields of the one log line.
 */
export function assertObservedRun(
  result: SpawnSyncReturns<string>,
  project: string,
): LoggedObservation {
  assert.equal(
    result.error,
    undefined,
    `the run failed (EPIPE means the hook stopped reading stdin early): ${String(result.error)}`,
  );
  assert.equal(
    result.status,
    0,
    `exit ${String(result.status)} (${String(result.signal)}): ${result.stderr}`,
  );
  assert.equal(result.stderr, '', 'expected nothing on stderr');
  const answerLine: unknown = JSON.parse(onlyLine(result.stdout, 'stdout'));
  const answer = answerSchema.parse(answerLine);
  const observation = readObservation(join(project, OBSERVATION_LOG), answer.systemMessage);
  assert.equal(answer.systemMessage, `${ANSWER_PREFIX}${observation.marker}`);
  return observation;
}

/**
 * Open the observation log once, never through a symlink at its name, then
 * check and parse through that one descriptor, closed on every path.
 *
 * @param logPath - The observation log under the throwaway project.
 * @param systemMessage - The hook's answer, shown when there is no log.
 * @returns The asserted fields of the one log line.
 */
function readObservation(logPath: string, systemMessage: string): LoggedObservation {
  let log: number;
  try {
    log = openSync(logPath, constants.O_RDONLY | constants.O_NOFOLLOW);
  } catch (error) {
    return assert.fail(`no observation log (${String(error)}); the answer was: ${systemMessage}`);
  }
  try {
    const logEntry = fstatSync(log);
    assert.ok(logEntry.isFile(), 'the observation log is not a regular file');
    assert.equal(logEntry.mode & 0o777, 0o600, 'the observation log is not at 0o600');
    const logLine: unknown = JSON.parse(onlyLine(readFileSync(log, 'utf8'), 'the log'));
    return observationSchema.parse(logLine);
  } finally {
    closeSync(log);
  }
}

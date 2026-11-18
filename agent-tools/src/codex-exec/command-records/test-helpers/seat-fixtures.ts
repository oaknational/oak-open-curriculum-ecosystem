import assert from 'node:assert/strict';

import {
  commandEvents,
  object,
  recordsOf,
  selectAll,
  type FixtureObject,
  type TestRecord,
} from '../../rollout/test-helpers/rollout-records.js';
import observedExec from '../fixtures/observed-seat-exec-0-157-1.json';
import observedRefusal from '../fixtures/observed-seat-refusal-0-157-1.json';

/**
 * A seat-shaped rollout recorded on codex-cli 0.157.1 on 2026-09-26 by one
 * sandboxed `codex exec` run (workspace-write, stdin closed, no full-access
 * flag) in Paginated history mode, then projected for the reader's tests:
 * every record kept in order with its type, payload type and item type; for
 * `CommandExecution` items the harness argv, `status`, `source`, `exit_code`
 * and the event's `turn_id` and `thread_id`; tool calls keep their `name`
 * and `call_id`, tool outputs their harness text with the machine path
 * replaced. Ids are fixed UUIDs; `cwd`, program text, stdout and every other
 * field were dropped.
 *
 * The run: a throwaway repository, four plain commands through code mode.
 * Three ran and left items; the fourth (a write under the read-only `.git`)
 * was denied at startup and returned into the program, leaving none.
 *
 * The run carries no interaction (`source: unified_exec_interaction`,
 * `interaction_input`) and no declined item: those shapes are source-read and
 * exercised by edited copies only.
 */

/** A user-home path as a seat might type one; the placeholder form, never a real home. */
export const HOME_PATH = '/Users/<user>/repo';

/** The physical line a record occupies once the records are serialised. */
export function lineOf(recordsToRead: readonly TestRecord[], record: TestRecord): number {
  return recordsToRead.indexOf(record) + 1;
}

/** A fresh copy of the four-command seat rollout. */
export function execRecords(): TestRecord[] {
  return recordsOf(observedExec);
}

/**
 * A fresh copy of the one-command seat rollout whose command the exec policy
 * refused: the same run shape on 2026-09-26 in the trusted primary checkout,
 * one code-mode call asking for `git push origin HEAD`, no `CommandExecution`
 * item, the harness's `Rejected(…)` message in the tool output's string
 * carrier after `Script error:`. Projected as the exec fixture is.
 */
export function refusalRecords(): TestRecord[] {
  return recordsOf(observedRefusal);
}

const EXEC_REQUEST_NAMES: ReadonlyMap<string, readonly string[]> = new Map([
  ['custom_tool_call', ['exec']],
  ['function_call', ['exec_command', 'write_stdin', 'shell_command']],
]);

/** A payload field as text; anything that is not a string reads as empty and matches nothing. */
function text(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

/** Every exec-family request (`custom_tool_call` exec, `function_call` exec family), in order; at least one, or the fixture is wrong. */
export function execCalls(recordsToRead: readonly TestRecord[]): TestRecord[] {
  const calls = selectAll(recordsToRead, 'response_item').filter((record) => {
    const names = EXEC_REQUEST_NAMES.get(text(record.payload['type'])) ?? [];
    return names.includes(text(record.payload['name']));
  });
  assert(calls.length > 0, 'the fixture made no exec call');
  return calls;
}

/** The output records answering the exec-family requests, in order; at least one, or the fixture is wrong. */
export function execOutputs(recordsToRead: readonly TestRecord[]): TestRecord[] {
  const ids = new Set(execCalls(recordsToRead).map((record) => record.payload['call_id']));
  const outputs = selectAll(recordsToRead, 'response_item').filter(
    (record) =>
      text(record.payload['type']).endsWith('_output') && ids.has(record.payload['call_id']),
  );
  assert(outputs.length > 0, 'the fixture answered no exec call');
  return outputs;
}

/** Every `task_started` event, in order; at least one, or the fixture is wrong. */
export function turnStarts(recordsToRead: readonly TestRecord[]): TestRecord[] {
  const starts = selectAll(recordsToRead, 'event_msg', 'task_started');
  assert(starts.length > 0, 'the fixture starts no turn');
  return starts;
}

/** Every `CommandExecution` item-completed event, in order; at least one, or the fixture is wrong. */
export function commandItems(recordsToRead: readonly TestRecord[]): TestRecord[] {
  const items = commandEvents(recordsToRead);
  assert(items.length > 0, 'the fixture recorded no command');
  return items;
}

/** The turn id of the turn `appendCommandTurn` adds; outside the fixture's ids. */
export const APPENDED_TURN_ID = '00000002-1111-4000-8000-000000020001';

/**
 * Append a second turn that runs one command, shaped like the fixture's own
 * command items with the argv replaced and `item` fields overlaid; returns the
 * appended command event so a test can find its line.
 */
export function appendCommandTurn(
  recordsToEdit: TestRecord[],
  command: readonly string[],
  item: FixtureObject = {},
): TestRecord {
  const [start] = turnStarts(recordsToEdit);
  const [first] = commandItems(recordsToEdit);
  assert(start);
  assert(first);
  recordsToEdit.push({
    type: start.type,
    payload: { ...start.payload, turn_id: APPENDED_TURN_ID },
  });
  const event: TestRecord = {
    type: first.type,
    payload: {
      ...first.payload,
      turn_id: APPENDED_TURN_ID,
      item: { ...object(first.payload['item']), command: [...command], ...item },
    },
  };
  recordsToEdit.push(event);
  return event;
}

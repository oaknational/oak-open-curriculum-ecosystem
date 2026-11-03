import assert from 'node:assert/strict';

import { describe, expect, it } from 'vitest';

import {
  lines,
  object,
  selectAll,
  type FixtureObject,
  type TestRecord,
} from '../rollout/test-helpers/rollout-records.js';

import { readCommandRecords } from './read-command-records.js';
import { renderSummary } from './summary.js';
import {
  commandItems,
  HOME_PATH,
  execCalls,
  execRecords,
  lineOf,
  turnStarts,
} from './test-helpers/seat-fixtures.js';

/** Values no reader message may echo back. */
const NONCE = 'nonce-7c1e';
const NUMERIC_NONCE = 424_242;

/** The fixture's first command item and its item object, for a test to edit. */
function firstCommand(records: TestRecord[]): { event: TestRecord; item: FixtureObject } {
  const [event] = commandItems(records);
  assert(event);
  return { event, item: object(event.payload['item']) };
}

describe('readCommandRecords over the recorded seat rollout', () => {
  it('counts the turns started and the commands the harness recorded as run', () => {
    const records = execRecords();
    const summary = readCommandRecords(lines(records));
    expect(summary.turns).toBe(turnStarts(records).length);
    expect(summary.commands).toBe(commandItems(records).length);
    expect(summary.malformed).toStrictEqual([]);
    expect(summary.invalidLines).toStrictEqual([]);
  });

  it('accounts each command to the turn its event names', () => {
    const records = execRecords();
    const [start] = turnStarts(records);
    assert(start);
    const calls = execCalls(records).length;
    const summary = readCommandRecords(lines(records));
    expect(summary.accounts).toStrictEqual([
      {
        turnId: start.payload['turn_id'],
        calls,
        accounted: calls,
        refused: 0,
        unaccounted: 0,
        executed: commandItems(records).length,
        declined: 0,
      },
    ]);
  });

  it('counts every record type it sees, read or not', () => {
    const records = execRecords();
    const summary = readCommandRecords(lines(records));
    expect(summary.recordTypes['response_item.custom_tool_call']).toBe(
      selectAll(records, 'response_item', 'custom_tool_call').length,
    );
    expect(summary.recordTypes['token_usage_record']).toBe(
      selectAll(records, 'token_usage_record').length,
    );
  });

  it('counts a record type outside its vocabulary instead of refusing it', () => {
    const records = execRecords();
    records.push({ type: 'nonce_record', payload: { type: 'later' } });
    const summary = readCommandRecords(lines(records));
    expect(summary.recordTypes['nonce_record.later']).toBe(1);
    expect(summary.malformed).toStrictEqual([]);
  });

  it('counts a record type named like an object property under its own key', () => {
    const records = execRecords();
    const shaped = (type: string): TestRecord => ({ type, payload: {} });
    records.push(shaped('__proto__'), shaped('__proto__'), shaped('constructor'));
    const { recordTypes } = readCommandRecords(lines(records));
    expect(Object.hasOwn(recordTypes, '__proto__')).toBe(true);
    expect(recordTypes['__proto__']).toBe(2);
    expect(recordTypes['constructor']).toBe(1);
  });

  it('counts a record type that is not an identifier as other, so no typed text reaches the summary', () => {
    const records = execRecords();
    records.push({ type: `${HOME_PATH}\nnonce`, payload: { type: 'not an identifier' } });
    const summary = readCommandRecords(lines(records));
    expect(summary.recordTypes['other.other']).toBe(1);
    for (const format of ['text', 'json'] as const) {
      expect(renderSummary(summary, format)).not.toContain(HOME_PATH);
    }
  });

  it('reads an empty rollout as zero of everything, not as an error', () => {
    expect(readCommandRecords([])).toStrictEqual({
      turns: 0,
      commands: 0,
      unaccounted: 0,
      flagged: [],
      accounts: [],
      recordTypes: {},
      malformed: [],
      invalidLines: [],
    });
  });
});

describe('readCommandRecords counts as executed only what the harness ran itself', () => {
  it.each([
    { name: 'a declined item', edit: (item: FixtureObject) => (item['status'] = 'declined') },
    {
      name: 'an interaction with a running process',
      edit: (item: FixtureObject) => {
        item['source'] = 'unified_exec_interaction';
        item['interaction_input'] = 'git status\n';
      },
    },
  ])('does not count $name as executed, and does not read it as malformed', ({ edit }) => {
    const records = execRecords();
    const expected = commandItems(records).length - 1;
    edit(firstCommand(records).item);
    const summary = readCommandRecords(lines(records));
    expect(summary.commands).toBe(expected);
    expect(summary.accounts[0]?.executed).toBe(expected);
    expect(summary.malformed).toStrictEqual([]);
  });
});

describe('readCommandRecords fails closed on the evidence records', () => {
  it.each([
    { name: 'no command', edit: (item: FixtureObject) => Reflect.deleteProperty(item, 'command') },
    { name: 'an empty command', edit: (item: FixtureObject) => (item['command'] = []) },
    {
      name: 'a command that is a string',
      edit: (item: FixtureObject) => (item['command'] = NONCE),
    },
    {
      name: 'a command with a non-string element',
      edit: (item: FixtureObject) => (item['command'] = ['git', NUMERIC_NONCE]),
    },
    { name: 'a status outside its set', edit: (item: FixtureObject) => (item['status'] = NONCE) },
    { name: 'a source outside its set', edit: (item: FixtureObject) => (item['source'] = NONCE) },
    {
      name: 'an exit code that is a string',
      edit: (item: FixtureObject) => (item['exit_code'] = NONCE),
    },
    {
      name: 'an interaction input that is a number',
      edit: (item: FixtureObject) => (item['interaction_input'] = NUMERIC_NONCE),
    },
  ])('reads a CommandExecution item with $name as malformed, not as a command', ({ edit }) => {
    const records = execRecords();
    const expected = commandItems(records).length - 1;
    const { event, item } = firstCommand(records);
    edit(item);
    const summary = readCommandRecords(lines(records));
    expect(summary.commands).toBe(expected);
    expect(summary.malformed).toHaveLength(1);
    const [entry] = summary.malformed;
    assert(entry);
    expect(entry.line).toBe(lineOf(records, event));
    expect(entry.reason).not.toContain(NONCE);
    expect(entry.reason).not.toContain(String(NUMERIC_NONCE));
  });

  it('reads a CommandExecution event without a turn id as malformed', () => {
    const records = execRecords();
    const expected = commandItems(records).length - 1;
    const { event } = firstCommand(records);
    Reflect.deleteProperty(event.payload, 'turn_id');
    const summary = readCommandRecords(lines(records));
    expect(summary.commands).toBe(expected);
    expect(summary.malformed).toStrictEqual([
      { line: lineOf(records, event), reason: 'CommandExecution event has no turn id' },
    ]);
  });

  it('reads a CommandExecution that precedes its turn as malformed', () => {
    const records = execRecords();
    const [start] = turnStarts(records);
    assert(start);
    const { event } = firstCommand(records);
    records.splice(records.indexOf(event), 1);
    records.splice(records.indexOf(start), 0, event);
    const summary = readCommandRecords(lines(records));
    expect(summary.malformed).toStrictEqual([
      { line: lineOf(records, event), reason: 'CommandExecution precedes its turn' },
    ]);
  });

  it.each([
    { name: 'text with a newline', turnId: `${HOME_PATH}\n${NONCE}` },
    { name: 'a blank', turnId: '' },
    { name: 'sixty-five characters', turnId: 'a'.repeat(65) },
  ])('reads a task_started whose turn id is $name as malformed and opens no turn', ({ turnId }) => {
    const records = execRecords();
    const turns = turnStarts(records).length;
    const start: TestRecord = {
      type: 'event_msg',
      payload: { type: 'task_started', turn_id: turnId },
    };
    records.push(start);
    const summary = readCommandRecords(lines(records));
    expect(summary.turns).toBe(turns);
    expect(summary.malformed).toStrictEqual([
      { line: lineOf(records, start), reason: 'task_started has no well-formed turn id' },
    ]);
    for (const format of ['text', 'json'] as const) {
      expect(renderSummary(summary, format)).not.toContain(HOME_PATH);
    }
  });

  it('reads a repeated task_started id as malformed and counts the first turn once', () => {
    const records = execRecords();
    const [start] = turnStarts(records);
    assert(start);
    const repeat: TestRecord = { type: start.type, payload: { ...start.payload } };
    records.push(repeat);
    const summary = readCommandRecords(lines(records));
    expect(summary.turns).toBe(turnStarts(execRecords()).length);
    expect(summary.malformed).toStrictEqual([
      { line: lineOf(records, repeat), reason: 'task_started repeats a turn id' },
    ]);
  });
});

describe('readCommandRecords reads an exec call after its turn completed as malformed', () => {
  /** The fixture's last turn completion, which every appended record follows. */
  function lastCompletion(records: readonly TestRecord[]): TestRecord {
    const completion = records.findLast((record) => record.payload['type'] === 'task_complete');
    assert(completion);
    return completion;
  }

  it('reads an exec request and its output after the turn completed as malformed', () => {
    const records = execRecords();
    const request: TestRecord = {
      type: 'response_item',
      payload: { type: 'custom_tool_call', name: 'exec', call_id: 'late-1', input: '' },
    };
    const output: TestRecord = {
      type: 'response_item',
      payload: {
        type: 'custom_tool_call_output',
        call_id: 'late-1',
        output: 'Script completed\nWall time 0.1 seconds\nOutput:\n',
      },
    };
    records.push(request, output);
    const summary = readCommandRecords(lines(records));
    expect(summary.malformed).toStrictEqual([
      { line: lineOf(records, request), reason: 'exec request follows its turn completing' },
      { line: lineOf(records, output), reason: 'exec output follows its turn completing' },
    ]);
  });

  it('reads a CommandExecution after its turn completed as evidence of its turn, still flagged', () => {
    const records = execRecords();
    const { event, item } = firstCommand(records);
    const late: TestRecord = {
      type: event.type,
      payload: { ...event.payload, item: { ...item, command: ['git', 'push', 'origin', 'HEAD'] } },
    };
    records.push(late);
    const summary = readCommandRecords(lines(records));
    expect(summary.malformed).toStrictEqual([]);
    expect(summary.flagged.map((entry) => entry.line)).toStrictEqual([lineOf(records, late)]);
  });

  it('reads a second task_complete for a turn already completed as malformed', () => {
    const records = execRecords();
    const completion = lastCompletion(records);
    const repeat: TestRecord = { type: completion.type, payload: { ...completion.payload } };
    records.push(repeat);
    const summary = readCommandRecords(lines(records));
    expect(summary.malformed).toStrictEqual([
      { line: lineOf(records, repeat), reason: 'task_complete names no open turn' },
    ]);
  });

  it.each([
    { name: 'a turn id no turn opened', turnId: 'unknown-turn' },
    { name: 'no turn id', turnId: undefined },
  ])('reads a task_complete naming $name as malformed', ({ turnId }) => {
    const records = execRecords();
    const completion: TestRecord = {
      type: 'event_msg',
      payload:
        turnId === undefined
          ? { type: 'task_complete' }
          : { type: 'task_complete', turn_id: turnId },
    };
    records.push(completion);
    const summary = readCommandRecords(lines(records));
    expect(summary.malformed).toStrictEqual([
      { line: lineOf(records, completion), reason: 'task_complete names no open turn' },
    ]);
  });
});

describe('readCommandRecords over the lines themselves', () => {
  it('keeps the physical line number past a blank and an invalid line', () => {
    const records = execRecords();
    const expected = commandItems(records).length - 1;
    const { event, item } = firstCommand(records);
    item['status'] = NONCE;
    const serialised = lines(records);
    const at = records.indexOf(event);
    serialised.splice(at, 0, '', '{bad json');
    const summary = readCommandRecords(serialised);
    expect(summary.invalidLines).toStrictEqual([at + 2]);
    expect(summary.malformed.map((entry) => entry.line)).toStrictEqual([at + 3]);
    expect(summary.commands).toBe(expected);
  });

  it('reads a line that is JSON but not an object as invalid', () => {
    const summary = readCommandRecords(['[1, 2]', '"text"']);
    expect(summary.invalidLines).toStrictEqual([1, 2]);
  });

  it('reads a record without a type as malformed', () => {
    const summary = readCommandRecords([JSON.stringify({ payload: {} })]);
    expect(summary.malformed).toStrictEqual([{ line: 1, reason: 'record has no type' }]);
  });
});

import assert from 'node:assert/strict';

import { describe, expect, it } from 'vitest';

import { lines, object, type TestRecord } from '../rollout/test-helpers/rollout-records.js';

import { justificationOf } from './forbidden-shapes.js';
import { readCommandRecords } from './read-command-records.js';
import { renderSummary, type CommandRecordsSummary, type TurnAccount } from './summary.js';
import {
  appendCommandTurn,
  commandItems,
  execCalls,
  execOutputs,
  execRecords,
  lineOf,
  refusalRecords,
  turnStarts,
} from './test-helpers/seat-fixtures.js';

const NONCE = 'nonce-7a3d';
const FAILED = 'Script failed\nWall time 0.0 seconds\nOutput:\n';

/** The one turn's account of a one-turn rollout. */
function onlyAccount(summary: CommandRecordsSummary): TurnAccount {
  const [account, ...rest] = summary.accounts;
  assert(account);
  assert(rest.length === 0, 'one turn');
  return account;
}

/** The first exec output of a rollout, for a test to edit. */
function firstOutput(records: TestRecord[]): TestRecord {
  const [output] = execOutputs(records);
  assert(output);
  return output;
}

/** Every account of a summary satisfies the call invariant. */
function expectInvariant(summary: CommandRecordsSummary): void {
  expect(summary.accounts.length).toBeGreaterThan(0);
  for (const account of summary.accounts) {
    expect(account.calls).toBe(account.accounted + account.refused + account.unaccounted);
  }
}

describe('readCommandRecords accounts for every exec call of a turn', () => {
  it('reads the recorded seat rollout as every call accounted and none refused', () => {
    const records = execRecords();
    const calls = execCalls(records).length;
    const account = onlyAccount(readCommandRecords(lines(records)));
    expect(account).toMatchObject({
      calls,
      accounted: calls,
      refused: 0,
      unaccounted: 0,
      executed: commandItems(records).length,
    });
  });

  it('reads the refused seat rollout as one call refused, nothing run, the shape flagged as refused', () => {
    const records = refusalRecords();
    const [output] = execOutputs(records);
    const [start] = turnStarts(records);
    assert(output);
    assert(start);
    const summary = readCommandRecords(lines(records));
    expect(onlyAccount(summary)).toStrictEqual({
      turnId: start.payload['turn_id'],
      calls: execCalls(records).length,
      accounted: 0,
      refused: 1,
      unaccounted: 0,
      executed: 0,
      declined: 0,
    });
    expect(summary.commands).toBe(0);
    const [entry] = summary.flagged;
    assert(entry);
    expect(entry).toMatchObject({
      kind: 'refused',
      line: lineOf(records, output),
      turnId: start.payload['turn_id'],
      rendered: ['…', 'git push <arg> <arg>'],
      hits: [{ kind: 'push-outside-the-bot', token: 'push' }],
    });
    const text = renderSummary(summary, 'text');
    const flaggedLine = text
      .split('\n')
      .find((line) => line.startsWith(`flagged: line ${lineOf(records, output)}`));
    assert(flaggedLine);
    expect(flaggedLine.split(justificationOf('push-outside-the-bot'))).toHaveLength(2);
    const typed = 'origin HEAD';
    expect(lines(records).join('\n')).toContain(typed);
    for (const rendered of [text, renderSummary(summary, 'json')]) {
      expect(rendered).not.toContain(typed);
    }
    expect(summary.malformed).toStrictEqual([]);
  });

  it.each([
    {
      name: 'a failed script with no refusal',
      text: `${FAILED}Script error:\nTypeError: ${NONCE}`,
    },
    { name: 'a terminated script', text: 'Script terminated\nWall time 9.0 seconds\nOutput:\n' },
    {
      name: 'a script still running',
      text: 'Script running with cell ID 3\nWall time 1.0 seconds\nOutput:\n',
    },
    { name: 'a truncated error', text: `${FAILED}Script error:\n…12 tokens truncated…` },
    {
      name: 'a truncated refusal',
      text: `${FAILED}Script error:\n\`git push\` rejected: x\nWarning: truncated output`,
    },
    { name: 'a preamble the harness does not write', text: `${NONCE}\nOutput:\n` },
    {
      name: 'a refusal whose judged command line carries a backtick',
      text: `${FAILED}Script error:\n\`echo \`${NONCE}\`\` rejected: ${NONCE}`,
    },
  ])('reads $name as one unaccounted call', ({ text }) => {
    const records = execRecords();
    const calls = execCalls(records).length;
    object(firstOutput(records).payload)['output'] = text;
    const summary = readCommandRecords(lines(records));
    expect(onlyAccount(summary)).toMatchObject({
      calls,
      accounted: calls - 1,
      unaccounted: 1,
      refused: 0,
    });
    expect(summary.flagged).toStrictEqual([]);
    expectInvariant(summary);
  });

  it('reads an exec call whose output never came as unaccounted', () => {
    const records = execRecords();
    const calls = execCalls(records).length;
    const output = firstOutput(records);
    records.splice(records.indexOf(output), 1);
    const summary = readCommandRecords(lines(records));
    expect(onlyAccount(summary)).toMatchObject({ calls, accounted: calls - 1, unaccounted: 1 });
    expectInvariant(summary);
  });

  it('reads an exec output that is neither text nor parts as malformed and unaccounted', () => {
    const records = execRecords();
    const output = firstOutput(records);
    object(output.payload)['output'] = 424_242;
    const summary = readCommandRecords(lines(records));
    expect(onlyAccount(summary).unaccounted).toBe(1);
    expect(summary.malformed).toStrictEqual([
      {
        line: lineOf(records, output),
        reason: "exec output is neither text nor the harness's parts",
      },
    ]);
    expectInvariant(summary);
  });

  it('reads a function-tool exec refusal and a refused write_stdin as refused', () => {
    const records = execRecords();
    const calls = execCalls(records).length;
    const [start] = records.filter(
      (record) => record.type === 'event_msg' && record.payload['type'] === 'task_started',
    );
    assert(start);
    const at = records.indexOf(start) + 1;
    records.splice(
      at,
      0,
      {
        type: 'response_item',
        payload: { type: 'function_call', name: 'exec_command', call_id: 'fc-1' },
      },
      {
        type: 'response_item',
        payload: {
          type: 'function_call_output',
          call_id: 'fc-1',
          output: `\`git push ${NONCE}\` rejected: ${NONCE}`,
        },
      },
      {
        type: 'response_item',
        payload: { type: 'function_call', name: 'write_stdin', call_id: 'fc-2' },
      },
      {
        type: 'response_item',
        payload: {
          type: 'function_call_output',
          call_id: 'fc-2',
          output: `write_stdin rejected: ${NONCE}`,
        },
      },
    );
    const summary = readCommandRecords(lines(records));
    expect(onlyAccount(summary)).toMatchObject({ calls: calls + 2, refused: 2, accounted: calls });
    expect(summary.flagged.map((entry) => entry.kind)).toStrictEqual(['refused']);
    for (const format of ['text', 'json'] as const) {
      expect(renderSummary(summary, format)).not.toContain(NONCE);
    }
    expectInvariant(summary);
  });

  it.each([
    {
      name: 'a function-tool output that opens with a completed code-mode preamble',
      request: { type: 'function_call', name: 'exec_command', call_id: 'fc-1' },
      output: {
        type: 'function_call_output',
        call_id: 'fc-1',
        output: `Script completed\nWall time 0.1 seconds\nOutput:\n${NONCE}`,
      },
    },
    {
      name: 'a function-tool output that opens with a failed code-mode preamble and a refusal',
      request: { type: 'function_call', name: 'exec_command', call_id: 'fc-1' },
      output: {
        type: 'function_call_output',
        call_id: 'fc-1',
        output: `${FAILED}Script error:\n\`git push ${NONCE}\` rejected: ${NONCE}`,
      },
    },
    {
      name: 'a code-mode request answered by a function-tool refusal',
      request: { type: 'custom_tool_call', name: 'exec', call_id: 'x-1' },
      output: {
        type: 'function_call_output',
        call_id: 'x-1',
        output: `\`git push ${NONCE}\` rejected: ${NONCE}`,
      },
    },
    {
      name: 'a function-tool request answered by a completed code-mode wrapper',
      request: { type: 'function_call', name: 'exec_command', call_id: 'x-1' },
      output: {
        type: 'custom_tool_call_output',
        call_id: 'x-1',
        output: 'Script completed\nWall time 0.1 seconds\nOutput:\n',
      },
    },
  ])('reads $name as unaccounted, never accounted or refused', ({ request, output }) => {
    const records = execRecords();
    const calls = execCalls(records).length;
    const [start] = turnStarts(records);
    assert(start);
    records.splice(
      records.indexOf(start) + 1,
      0,
      { type: 'response_item', payload: request },
      { type: 'response_item', payload: output },
    );
    const summary = readCommandRecords(lines(records));
    expect(onlyAccount(summary)).toMatchObject({
      calls: calls + 1,
      accounted: calls,
      refused: 0,
      unaccounted: 1,
    });
    expect(summary.flagged).toStrictEqual([]);
    expectInvariant(summary);
  });

  it('ignores a tool call that is not of the exec family, and its output', () => {
    const records = execRecords();
    const calls = execCalls(records).length;
    records.push(
      {
        type: 'response_item',
        payload: { type: 'function_call', name: NONCE, call_id: 'other-1' },
      },
      {
        type: 'response_item',
        payload: { type: 'function_call_output', call_id: 'other-1', output: 424_242 },
      },
    );
    const summary = readCommandRecords(lines(records));
    expect(onlyAccount(summary).calls).toBe(calls);
    expect(summary.malformed).toStrictEqual([]);
    expectInvariant(summary);
  });

  it('ignores an output whose call id matches no pending exec call', () => {
    const records = execRecords();
    records.push({
      type: 'response_item',
      payload: { type: 'custom_tool_call_output', call_id: NONCE, output: 424_242 },
    });
    const summary = readCommandRecords(lines(records));
    expect(summary.malformed).toStrictEqual([]);
    expectInvariant(summary);
  });

  it('reads an exec request before any turn as malformed', () => {
    const summary = readCommandRecords([
      JSON.stringify({
        type: 'response_item',
        payload: { type: 'custom_tool_call', name: 'exec', call_id: 'x' },
      }),
    ]);
    expect(summary.malformed).toStrictEqual([
      { line: 1, reason: 'exec request precedes its turn' },
    ]);
  });

  it('reads an exec request with no call id as malformed and unaccounted, never as a stray record', () => {
    const records = execRecords();
    const calls = execCalls(records).length;
    const [start] = turnStarts(records);
    assert(start);
    const request: TestRecord = {
      type: 'response_item',
      payload: { type: 'custom_tool_call', name: 'exec' },
    };
    records.splice(records.indexOf(start) + 1, 0, request);
    const summary = readCommandRecords(lines(records));
    expect(onlyAccount(summary)).toMatchObject({
      calls: calls + 1,
      accounted: calls,
      unaccounted: 1,
    });
    expect(summary.malformed).toStrictEqual([
      { line: lineOf(records, request), reason: 'exec request has no call id' },
    ]);
    expectInvariant(summary);
  });

  it('reads an exec request repeating a pending call id as malformed and unaccounted', () => {
    const records = execRecords();
    const calls = execCalls(records).length;
    const [request] = execCalls(records);
    assert(request);
    const repeat: TestRecord = { type: request.type, payload: { ...request.payload } };
    records.splice(records.indexOf(request) + 1, 0, repeat);
    const summary = readCommandRecords(lines(records));
    expect(onlyAccount(summary)).toMatchObject({
      calls: calls + 1,
      accounted: calls,
      unaccounted: 1,
    });
    expect(summary.malformed).toStrictEqual([
      { line: lineOf(records, repeat), reason: 'exec request repeats a pending call id' },
    ]);
    expectInvariant(summary);
  });

  it('leaves a call unaccounted when its output arrives in a later turn', () => {
    const records = execRecords();
    const calls = execCalls(records).length;
    const output = firstOutput(records);
    records.splice(records.indexOf(output), 1);
    appendCommandTurn(records, ['git', 'status']);
    records.push(output);
    const summary = readCommandRecords(lines(records));
    const [first, second] = summary.accounts;
    expect(first).toMatchObject({ calls, accounted: calls - 1, unaccounted: 1 });
    expect(second).toMatchObject({ calls: 0, accounted: 0, unaccounted: 0 });
    expect(summary.malformed).toStrictEqual([]);
    expectInvariant(summary);
  });

  it('holds the call invariant over both recorded rollouts', () => {
    expectInvariant(readCommandRecords(lines(execRecords())));
    expectInvariant(readCommandRecords(lines(refusalRecords())));
  });
});

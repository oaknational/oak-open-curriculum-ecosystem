import assert from 'node:assert/strict';

import { describe, expect, it } from 'vitest';

import { readRollout } from './index.js';
import {
  expectRead,
  lines,
  records,
  resumedCommandOutputsIn,
  RESUMED_TURN_ID,
  select,
  selectAll,
  textParts,
  type TestRecord,
} from './test-helpers/rollout-records.js';

/**
 * The code-mode calls and their outputs. A code-mode output holds the
 * harness's completed-script preamble and then whatever the model's own
 * program printed, so the reader validates the preamble item and pairs the
 * output with its call, but never takes the printed output as evidence: the
 * evidence is `RolloutEvidence.resumedCommandOutputs`, the harness's command
 * records.
 */

/** The resumed turn's code-mode outputs, in order. */
function resumedOutputs(recordsToRead: readonly TestRecord[]): TestRecord[] {
  const started = selectAll(recordsToRead, 'event_msg', 'task_started').find(
    (record) => record.payload['turn_id'] === RESUMED_TURN_ID,
  );
  assert(started);
  return selectAll(
    recordsToRead.slice(recordsToRead.indexOf(started)),
    'response_item',
    'custom_tool_call_output',
  );
}

function firstResumedOutput(recordsToRead: readonly TestRecord[]): TestRecord {
  const [output] = resumedOutputs(recordsToRead);
  assert(output);
  return output;
}

describe('code-mode output: never evidence', () => {
  it('a nonce the program printed without running a command is not evidence', () => {
    const sentinel = 'printed-by-the-program-only';
    const candidate = records();
    const [, printed] = textParts(firstResumedOutput(candidate).payload['output']);
    assert(printed);
    printed.text = sentinel;

    const evidence = expectRead(candidate);
    expect(evidence.resumedCommandOutputs).toEqual(resumedCommandOutputsIn(candidate));
    expect(evidence.resumedCommandOutputs.join('\n')).not.toContain(sentinel);
  });

  it.each([
    {
      name: 'the exec result object the program returned',
      text: '{"chunk_id":"a1b2c3","wall_time_seconds":0.1,"exit_code":0,"original_token_count":1,"output":"x"}',
    },
    { name: 'a truncation marker the program printed', text: '…153 tokens truncated…' },
  ])('accepts $name as printed output, still not evidence', ({ text }) => {
    const candidate = records();
    const [, printed] = textParts(firstResumedOutput(candidate).payload['output']);
    assert(printed);
    printed.text = text;

    expect(expectRead(candidate).resumedCommandOutputs).toEqual(resumedCommandOutputsIn(candidate));
  });

  it('keeps a command output in the evidence when the program printed none of it', () => {
    const candidate = records();
    const output = firstResumedOutput(candidate);
    output.payload['output'] = textParts(output.payload['output']).slice(0, 1);

    expect(expectRead(candidate).resumedCommandOutputs).toEqual(resumedCommandOutputsIn(candidate));
  });

  it('accepts an item the program emitted that is not text', () => {
    const candidate = records();
    const output = firstResumedOutput(candidate);
    const [preamble] = textParts(output.payload['output']);
    assert(preamble);
    output.payload['output'] = [
      preamble,
      { type: 'input_image', image_url: 'data:image/png;base64,AA==' },
    ];

    expect(expectRead(candidate).resumedCommandOutputs).toEqual(resumedCommandOutputsIn(candidate));
  });
});

describe('code-mode output: the wrapper', () => {
  it('rejects an output whose first item is not input text', () => {
    const candidate = records();
    const [preamble] = textParts(firstResumedOutput(candidate).payload['output']);
    assert(preamble);
    preamble.type = 'future_text';

    expect(readRollout(lines(candidate))).toMatchObject({
      ok: false,
      error: {
        kind: 'invalid-record',
        reason: "custom_tool_call_output.output does not open with the harness's input_text item",
      },
    });
  });

  it('rejects a preamble item carrying a field the harness does not write', () => {
    const candidate = records();
    const output = firstResumedOutput(candidate);
    const [preamble] = textParts(output.payload['output']);
    assert(preamble);
    output.payload['output'] = [{ ...preamble, future_field: true }];

    expect(readRollout(lines(candidate))).toMatchObject({
      ok: false,
      error: {
        kind: 'invalid-record',
        reason: "custom_tool_call_output.output does not open with the harness's input_text item",
      },
    });
  });

  it('rejects an output with no items at all', () => {
    const candidate = records();
    firstResumedOutput(candidate).payload['output'] = [];

    expect(readRollout(lines(candidate))).toMatchObject({
      ok: false,
      error: {
        kind: 'invalid-record',
        reason: "custom_tool_call_output.output does not open with the harness's input_text item",
      },
    });
  });

  it.each([
    { name: 'a script that failed', text: 'Script failed\nWall time 0.1 seconds\nOutput:\n' },
    {
      name: 'a script that was terminated',
      text: 'Script terminated\nWall time 0.1 seconds\nOutput:\n',
    },
    {
      name: 'a script still running',
      text: 'Script running with cell ID 1\nWall time 0.1 seconds\nOutput:\n',
    },
    {
      name: 'the cell-overhead variant',
      text: 'Script completed\nWall time 0.123 seconds (code-mode 0.100 seconds; overhead 0.023 seconds)\nOutput:\n',
    },
  ])('rejects the preamble of $name', ({ text }) => {
    const candidate = records();
    const [preamble] = textParts(firstResumedOutput(candidate).payload['output']);
    assert(preamble);
    preamble.text = text;

    expect(readRollout(lines(candidate))).toMatchObject({
      ok: false,
      error: {
        kind: 'invalid-record',
        reason: 'custom_tool_call_output.output has no completed-script preamble',
      },
    });
  });
});

describe('code-mode calls: each answered exactly once', () => {
  it('rejects an output with no matching call', () => {
    const candidate = records();
    select(candidate, 'response_item', 'custom_tool_call_output').payload['call_id'] = 'call_other';

    expect(readRollout(lines(candidate))).toMatchObject({
      ok: false,
      error: { kind: 'invalid-turn-order', reason: 'tool output has no matching custom tool call' },
    });
  });

  it('rejects a call left unanswered when its turn completes', () => {
    const candidate = records();
    candidate.splice(
      candidate.indexOf(select(candidate, 'response_item', 'custom_tool_call_output')),
      1,
    );

    expect(readRollout(lines(candidate))).toMatchObject({
      ok: false,
      error: {
        kind: 'invalid-turn-order',
        reason: 'task_complete has unanswered custom tool calls',
      },
    });
  });

  it('rejects a call answered twice', () => {
    const candidate = records();
    const output = select(candidate, 'response_item', 'custom_tool_call_output');
    candidate.splice(candidate.indexOf(output), 0, structuredClone(output));

    expect(readRollout(lines(candidate))).toMatchObject({
      ok: false,
      error: { kind: 'invalid-turn-order', reason: 'tool output has no matching custom tool call' },
    });
  });

  it('rejects a repeated pending call id', () => {
    const candidate = records();
    const call = select(candidate, 'response_item', 'custom_tool_call');
    candidate.splice(candidate.indexOf(call) + 1, 0, structuredClone(call));

    expect(readRollout(lines(candidate))).toMatchObject({
      ok: false,
      error: { kind: 'invalid-turn-order', reason: 'custom tool call repeats a pending call id' },
    });
  });

  it.each([
    { name: 'another tool', field: 'name', value: 'future_exec' },
    { name: 'an unfinished call', field: 'status', value: 'in_progress' },
  ])('rejects $name', ({ field, value }) => {
    const candidate = records();
    select(candidate, 'response_item', 'custom_tool_call').payload[field] = value;

    expect(readRollout(lines(candidate))).toMatchObject({
      ok: false,
      error: { kind: 'invalid-record', reason: 'custom_tool_call is not a completed exec call' },
    });
  });
});

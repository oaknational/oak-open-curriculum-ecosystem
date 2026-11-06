import { describe, expect, it } from 'vitest';

import { parseCodexExecEvent } from './parse-events.js';
import { extractLastAgentMessage, readTurnEvents } from './turn-events.js';

describe('parseCodexExecEvent', () => {
  it('reads thread.started as the thread id', () => {
    const line = JSON.stringify({ type: 'thread.started', thread_id: 'thread-a' });
    expect(parseCodexExecEvent(line)).toStrictEqual({
      kind: 'thread-started',
      threadId: 'thread-a',
    });
  });

  it('reads a completed agent_message item as its text', () => {
    const line = JSON.stringify({
      type: 'item.completed',
      item: { id: 'item_0', type: 'agent_message', text: 'Hello world' },
    });
    expect(parseCodexExecEvent(line)).toStrictEqual({ kind: 'agent-message', text: 'Hello world' });
  });

  it('reads a completed command_execution item as its command, output and exit code', () => {
    const line = JSON.stringify({
      type: 'item.completed',
      item: {
        id: 'item_1',
        type: 'command_execution',
        command: '/bin/zsh -c "printf SIF > s"',
        aggregated_output: 'zsh:1: operation not permitted: s\n',
        exit_code: 1,
        status: 'completed',
      },
    });
    expect(parseCodexExecEvent(line)).toStrictEqual({
      kind: 'command-execution',
      command: '/bin/zsh -c "printf SIF > s"',
      output: 'zsh:1: operation not permitted: s\n',
      exitCode: 1,
    });
  });

  it('reads turn.failed as a turn failure with its message', () => {
    const line = JSON.stringify({ type: 'turn.failed', error: { message: 'quota' } });
    expect(parseCodexExecEvent(line)).toStrictEqual({ kind: 'turn-failed', message: 'quota' });
  });

  it('reads a top-level error event as a stream error', () => {
    const line = JSON.stringify({ type: 'error', message: 'stream broke' });
    expect(parseCodexExecEvent(line)).toStrictEqual({
      kind: 'stream-error',
      message: 'stream broke',
    });
  });

  it.each([
    ['turn.started', { kind: 'turn-started' }],
    ['turn.completed', { kind: 'turn-completed' }],
  ])('reads %s as a turn boundary', (type, event) => {
    expect(parseCodexExecEvent(JSON.stringify({ type, usage: {} }))).toStrictEqual(event);
  });

  it.each(['item.started', 'item.updated'])('reads %s of a known item as item progress', (type) => {
    const line = JSON.stringify({
      type,
      item: { type: 'command_execution', status: 'in_progress' },
    });
    expect(parseCodexExecEvent(line)).toStrictEqual({ kind: 'item-progress' });
  });

  it.each([
    ['item.started', 'mcp_tool_call'],
    ['item.updated', 'web_search'],
    ['item.started', 'file_change'],
    ['item.started', 'a_future_item'],
  ])(
    'reads %s of a %s item as unexpected, so an unfinished call still counts',
    (type, itemType) => {
      const line = JSON.stringify({ type, item: { type: itemType, status: 'in_progress' } });
      expect(parseCodexExecEvent(line)).toStrictEqual({ kind: 'unexpected-item', itemType });
    },
  );

  it.each(['reasoning', 'todo_list', 'error'])(
    'reads a completed %s item as a known item the verdict does not use',
    (itemType) => {
      const line = JSON.stringify({ type: 'item.completed', item: { type: itemType } });
      expect(parseCodexExecEvent(line)).toStrictEqual({ kind: 'unused-item', itemType });
    },
  );

  it.each(['file_change', 'mcp_tool_call', 'web_search', 'a_future_item'])(
    'reads a completed %s item as unexpected under the envelope',
    (itemType) => {
      const line = JSON.stringify({ type: 'item.completed', item: { type: itemType } });
      expect(parseCodexExecEvent(line)).toStrictEqual({ kind: 'unexpected-item', itemType });
    },
  );

  it('returns undefined for a top-level event type outside the documented set', () => {
    expect(parseCodexExecEvent('{"type":"turn.interrupted"}')).toBeUndefined();
  });

  it('returns undefined when a recognised event lacks its required field', () => {
    expect(parseCodexExecEvent('{"type":"thread.started"}')).toBeUndefined();
    expect(
      parseCodexExecEvent('{"type":"item.completed","item":{"type":"agent_message"}}'),
    ).toBeUndefined();
    expect(parseCodexExecEvent('{"type":"turn.failed"}')).toBeUndefined();
    expect(parseCodexExecEvent('{"type":"item.started"}')).toBeUndefined();
    expect(parseCodexExecEvent('{"type":"item.started","item":{}}')).toBeUndefined();
    expect(parseCodexExecEvent('{"type":"item.completed","item":{}}')).toBeUndefined();
  });

  it('returns undefined for a malformed JSON line', () => {
    expect(parseCodexExecEvent('{not json')).toBeUndefined();
  });

  it('returns undefined for an empty line', () => {
    expect(parseCodexExecEvent('')).toBeUndefined();
  });

  it('returns undefined when type is missing', () => {
    expect(parseCodexExecEvent('{"item":{}}')).toBeUndefined();
  });
});

describe('readTurnEvents', () => {
  it('folds a resumed turn into its thread ids, agent messages and command runs', () => {
    const lines = [
      JSON.stringify({ type: 'thread.started', thread_id: 'thread-a' }),
      JSON.stringify({ type: 'turn.started' }),
      JSON.stringify({ type: 'item.completed', item: { type: 'agent_message', text: 'Preamble' } }),
      JSON.stringify({
        type: 'item.completed',
        item: { type: 'command_execution', command: 'c', aggregated_output: 'o', exit_code: 0 },
      }),
      JSON.stringify({ type: 'item.completed', item: { type: 'agent_message', text: 'Final' } }),
      JSON.stringify({ type: 'turn.completed', usage: {} }),
    ];
    expect(readTurnEvents(lines)).toStrictEqual({
      threadIds: ['thread-a'],
      agentMessages: ['Preamble', 'Final'],
      commandExecutions: [{ command: 'c', output: 'o', exitCode: 0 }],
      failures: [],
      unexpectedItems: [],
      turnStarts: 1,
      turnCompletions: 1,
      endsWithCompletion: true,
      unrecognisedLines: 0,
    });
  });

  it('records each unexpected item type once, in the order first seen', () => {
    const lines = [
      JSON.stringify({ type: 'item.started', item: { type: 'web_search' } }),
      JSON.stringify({ type: 'item.completed', item: { type: 'web_search' } }),
      JSON.stringify({ type: 'item.completed', item: { type: 'file_change' } }),
    ];
    expect(readTurnEvents(lines).unexpectedItems).toStrictEqual(['web_search', 'file_change']);
  });

  it('counts turn boundaries, and records whether the stream ends on a completion', () => {
    const lines = [
      JSON.stringify({ type: 'turn.started' }),
      JSON.stringify({ type: 'turn.completed' }),
      JSON.stringify({ type: 'turn.started' }),
      JSON.stringify({ type: 'turn.completed' }),
      JSON.stringify({ type: 'item.completed', item: { type: 'agent_message', text: 'late' } }),
    ];
    const events = readTurnEvents(lines);
    expect([events.turnStarts, events.turnCompletions, events.endsWithCompletion]).toStrictEqual([
      2,
      2,
      false,
    ]);
  });

  it('collects turn failures and stream errors as failures', () => {
    const lines = [
      JSON.stringify({ type: 'turn.failed', error: { message: 'quota' } }),
      JSON.stringify({ type: 'error', message: 'stream broke' }),
    ];
    expect(readTurnEvents(lines).failures).toStrictEqual(['quota', 'stream broke']);
  });

  it('counts non-blank lines it does not recognise, and ignores blank ones', () => {
    const lines = ['', '   ', '{bad json', '{"type":"thread.started"}', '{"type":"turn.aborted"}'];
    expect(readTurnEvents(lines).unrecognisedLines).toBe(3);
  });
});

describe('extractLastAgentMessage', () => {
  it('returns the text of the last agent_message item.completed event', () => {
    const lines = [
      JSON.stringify({ type: 'thread.started' }),
      JSON.stringify({ type: 'item.completed', item: { type: 'agent_message', text: 'First' } }),
      JSON.stringify({ type: 'item.completed', item: { type: 'command_execution' } }),
      JSON.stringify({ type: 'item.completed', item: { type: 'agent_message', text: 'Final' } }),
      JSON.stringify({ type: 'turn.completed' }),
    ];
    expect(extractLastAgentMessage(lines)).toStrictEqual({ found: true, text: 'Final' });
  });

  it('returns not-found when no agent_message events are present', () => {
    const lines = [
      JSON.stringify({ type: 'thread.started' }),
      JSON.stringify({ type: 'turn.completed' }),
    ];
    expect(extractLastAgentMessage(lines)).toStrictEqual({ found: false });
  });

  it('skips non-item.completed events that have agent_message in item', () => {
    const lines = [
      JSON.stringify({ type: 'item.started', item: { type: 'agent_message', text: 'nope' } }),
    ];
    expect(extractLastAgentMessage(lines)).toStrictEqual({ found: false });
  });

  it('ignores blank lines and malformed JSON', () => {
    const lines = [
      '',
      '{bad json',
      JSON.stringify({ type: 'item.completed', item: { type: 'agent_message', text: 'ok' } }),
    ];
    expect(extractLastAgentMessage(lines)).toStrictEqual({ found: true, text: 'ok' });
  });
});

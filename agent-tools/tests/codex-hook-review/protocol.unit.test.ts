import { describe, expect, it } from 'vitest';

import { parseCodexJsonl } from '../../src/codex-hook-review/protocol.js';

const THREAD = '{"type":"thread.started","thread_id":"thread-1"}';
const TURN = '{"type":"turn.started"}';
const REASONING =
  '{"type":"item.completed","item":{"id":"item-1","type":"reasoning","text":"brief"}}';
const PASS_DECISION = JSON.stringify({ verdict: 'pass', kind: 'none', change_index: 0 });
const MESSAGE = JSON.stringify({
  type: 'item.completed',
  item: { id: 'item-2', type: 'agent_message', text: PASS_DECISION },
});
const COMPLETED =
  '{"type":"turn.completed","usage":{"input_tokens":20,"cached_input_tokens":8,"output_tokens":5,"reasoning_output_tokens":2}}';

describe('parseCodexJsonl', () => {
  it('accepts only the lifecycle, reasoning, final message, and usage sequence', () => {
    expect(
      parseCodexJsonl([THREAD, TURN, REASONING, MESSAGE, COMPLETED, ''].join('\n')),
    ).toStrictEqual({
      ok: true,
      value: {
        agentMessage: '{"verdict":"pass","kind":"none","change_index":0}',
        usage: {
          inputTokens: 20,
          cachedInputTokens: 8,
          outputTokens: 5,
          reasoningOutputTokens: 2,
        },
        reasoningItemCount: 1,
      },
    });
  });

  it('tolerates vendor-added fields on known objects without relaxing known fields', () => {
    const lines = [
      '{"type":"thread.started","thread_id":"thread-1","future":true}',
      TURN,
      '{"type":"item.completed","item":{"id":"item-1","type":"agent_message","text":"{}","future":true}}',
      '{"type":"turn.completed","usage":{"input_tokens":1,"cached_input_tokens":0,"output_tokens":1,"future":9},"future":true}',
    ];

    expect(parseCodexJsonl(lines.join('\n'))).toStrictEqual({
      ok: true,
      value: {
        agentMessage: '{}',
        usage: { inputTokens: 1, cachedInputTokens: 0, outputTokens: 1 },
        reasoningItemCount: 0,
      },
    });
  });

  it('ignores framing whitespace between valid JSONL events', () => {
    const stdout = [' ', THREAD, '', TURN, MESSAGE, '\t', COMPLETED, ''].join('\n');
    expect(parseCodexJsonl(stdout).ok).toBe(true);
  });

  it.each([
    'command_execution',
    'file_change',
    'mcp_tool_call',
    'web_search',
    'plan',
    'todo_list',
    'context',
    'context_compaction',
    'dynamic_tool_call',
  ])('invalidates a %s capability event', (itemType) => {
    const dynamic = JSON.stringify({
      type: 'item.completed',
      item: { id: 'item-1', type: itemType },
    });
    expect(parseCodexJsonl([THREAD, TURN, dynamic].join('\n'))).toStrictEqual({
      ok: false,
      error: { kind: 'dynamic-tool-event' },
    });
  });

  it('distinguishes unknown vendor events from dynamic capability use', () => {
    const unknownItem = '{"type":"item.completed","item":{"id":"item-1","type":"new_item"}}';
    expect(parseCodexJsonl([THREAD, TURN, unknownItem].join('\n'))).toStrictEqual({
      ok: false,
      error: { kind: 'unknown-event' },
    });
    expect(parseCodexJsonl([THREAD, TURN, '{"type":"new.event"}'].join('\n'))).toStrictEqual({
      ok: false,
      error: { kind: 'unknown-event' },
    });
  });

  it.each([
    { lines: [TURN, THREAD, MESSAGE, COMPLETED] },
    { lines: [THREAD, MESSAGE, TURN, COMPLETED] },
    { lines: [THREAD, TURN, MESSAGE, MESSAGE, COMPLETED] },
    { lines: [THREAD, TURN, MESSAGE] },
    { lines: [THREAD, TURN, '{"type":"item.started","item":{"id":"item-1"}}'] },
    { lines: [THREAD, TURN, '{"type":"turn.failed","error":{"message":"no"}}'] },
    { lines: [THREAD, TURN, '{"type":"error","message":"no"}'] },
  ])('rejects orphaned, duplicate, failed, or incomplete lifecycle events', ({ lines }) => {
    expect(parseCodexJsonl(lines.join('\n'))).toStrictEqual({
      ok: false,
      error: { kind: 'orphan-event' },
    });
  });

  it.each([
    '',
    '{',
    [THREAD, TURN, '{"type":"item.completed","item":{"id":"item-1","type":"reasoning"}}'].join(
      '\n',
    ),
    [
      THREAD,
      TURN,
      MESSAGE,
      '{"type":"turn.completed","usage":{"input_tokens":-1,"cached_input_tokens":0,"output_tokens":1}}',
    ].join('\n'),
  ])('rejects malformed JSONL or known event schemas', (stdout) => {
    expect(parseCodexJsonl(stdout)).toStrictEqual({
      ok: false,
      error: { kind: 'schema-failure' },
    });
  });
});

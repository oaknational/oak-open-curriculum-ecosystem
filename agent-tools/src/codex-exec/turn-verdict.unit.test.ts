import { describe, expect, it } from 'vitest';

import { parseThreadId, type ThreadId } from '../core/codex-thread-id.js';
import { judgeTurn, type CodexRun, type TurnFailure } from './turn-verdict.js';

const THREAD = '01a0cfaf-7914-72e2-afe7-fb2d0938eb94';
const OTHER_THREAD = '01a0cfc3-0f0d-7980-bded-63fabd607a2f';

function threadId(raw: string): ThreadId {
  const parsed = parseThreadId(raw);
  if (!parsed.ok) {
    return expect.unreachable('fixture thread id must parse');
  }
  return parsed.value;
}

function jsonl(...events: readonly object[]): string {
  return `${events.map((event) => JSON.stringify(event)).join('\n')}\n`;
}

function exited(stdout: string, code = 0): CodexRun {
  return { kind: 'exited', code, stdout, stderr: 'Reading additional input from stdin...\n' };
}

const started = (id: string) => ({ type: 'thread.started', thread_id: id });
const turnStarted = { type: 'turn.started' };
const message = (text: string) => ({
  type: 'item.completed',
  item: { type: 'agent_message', text },
});
const completed = { type: 'turn.completed', usage: {} };
const failed = { type: 'turn.failed', error: { message: 'quota' } };

/**
 * One whole turn as `codex exec --json` emits it: the thread, the turn's
 * start, its items, and its completion last.
 */
function turn(id: string, ...items: readonly object[]): string {
  return jsonl(started(id), turnStarted, ...items, completed);
}

describe('judgeTurn', () => {
  it('reads an opening turn as its thread id and its last agent message', () => {
    expect(judgeTurn(exited(turn(THREAD, message('ACK'))), undefined)).toStrictEqual({
      ok: true,
      value: { threadId: THREAD, message: 'ACK', messages: ['ACK'], commandExecutions: [] },
    });
  });

  it('accepts a resumed turn that re-emits the requested thread id, and keeps every message', () => {
    const run = exited(
      turn(
        THREAD,
        message('Preamble'),
        { type: 'item.started', item: { type: 'command_execution', command: 'c' } },
        {
          type: 'item.completed',
          item: { type: 'command_execution', command: 'c', aggregated_output: 'o', exit_code: 0 },
        },
        { type: 'item.completed', item: { type: 'reasoning', text: 'thinking' } },
        message('Final'),
      ),
    );
    expect(judgeTurn(run, threadId(THREAD))).toStrictEqual({
      ok: true,
      value: {
        threadId: THREAD,
        message: 'Final',
        messages: ['Preamble', 'Final'],
        commandExecutions: [{ command: 'c', output: 'o', exitCode: 0 }],
      },
    });
  });

  it.each<[string, CodexRun, ThreadId | undefined, TurnFailure]>([
    [
      'a Codex that could not be launched',
      { kind: 'unlaunchable', message: 'ENOENT' },
      undefined,
      { kind: 'unlaunchable', message: 'ENOENT' },
    ],
    [
      'a run killed for overflowing its output buffer',
      { kind: 'killed', reason: 'overflow', stdout: '', stderr: 'partial' },
      undefined,
      { kind: 'killed', reason: 'overflow', stderrTail: 'partial' },
    ],
    [
      'a killed run whose partial stream reads as a whole reply',
      { kind: 'killed', reason: 'signal', stdout: turn(THREAD, message('ACK')), stderr: '' },
      undefined,
      { kind: 'killed', reason: 'signal', stderrTail: '' },
    ],
    [
      'a non-zero exit',
      { kind: 'exited', code: 1, stdout: '', stderr: 'boom' },
      undefined,
      { kind: 'nonzero-exit', code: 1, stderrTail: 'boom' },
    ],
    [
      'a non-zero exit whose stream looks like a whole reply',
      { kind: 'exited', code: 1, stdout: turn(THREAD, message('ACK')), stderr: 'boom' },
      undefined,
      { kind: 'nonzero-exit', code: 1, stderrTail: 'boom' },
    ],
    [
      'a failed turn',
      exited(jsonl(started(THREAD), turnStarted, failed)),
      undefined,
      { kind: 'turn-failed', code: 0, messages: ['quota'] },
    ],
    [
      'a failed turn that also exits non-zero, keeping the reason from its event stream',
      exited(jsonl(started(THREAD), turnStarted, failed), 1),
      undefined,
      { kind: 'turn-failed', code: 1, messages: ['quota'] },
    ],
    [
      'a failed turn whose stream also holds a line it cannot read, keeping the failure reason',
      exited(`${jsonl(started(THREAD), turnStarted, failed)}not json\n`),
      undefined,
      { kind: 'turn-failed', code: 0, messages: ['quota'] },
    ],
    [
      'output lines it does not recognise, counting each one',
      exited(`${turn(THREAD, message('ACK'))}not json\n{"type":"turn.aborted"}\n`),
      undefined,
      { kind: 'unrecognised-output', lines: 2 },
    ],
    [
      'an item the envelope should make impossible',
      exited(
        turn(THREAD, { type: 'item.completed', item: { type: 'mcp_tool_call' } }, message('ACK')),
      ),
      undefined,
      { kind: 'unexpected-item', itemTypes: ['mcp_tool_call'] },
    ],
    [
      'a prohibited call that starts and never completes',
      exited(
        turn(
          THREAD,
          { type: 'item.started', item: { type: 'mcp_tool_call', status: 'in_progress' } },
          message('ACK'),
        ),
      ),
      undefined,
      { kind: 'unexpected-item', itemTypes: ['mcp_tool_call'] },
    ],
    [
      'a stream that ends before its turn completes',
      exited(jsonl(started(THREAD), turnStarted, message('I will read the file first'))),
      undefined,
      { kind: 'malformed-turn', turnStarts: 1, turnCompletions: 0, endsWithCompletion: false },
    ],
    [
      'two turns in one stream',
      exited(
        `${turn(THREAD, message('queued reply'))}${jsonl(turnStarted, message('ACK'), completed)}`,
      ),
      undefined,
      { kind: 'malformed-turn', turnStarts: 2, turnCompletions: 2, endsWithCompletion: true },
    ],
    [
      'an event after the turn completes',
      exited(`${turn(THREAD, message('ACK'))}${jsonl(message('late'))}`),
      undefined,
      { kind: 'malformed-turn', turnStarts: 1, turnCompletions: 1, endsWithCompletion: false },
    ],
    [
      'no thread id',
      exited(jsonl(turnStarted, message('ACK'), completed)),
      undefined,
      { kind: 'no-thread-id' },
    ],
    [
      'a thread id that is not a UUID',
      exited(turn('--dangerously-bypass-approvals-and-sandbox', message('ACK'))),
      undefined,
      { kind: 'invalid-thread-id' },
    ],
    [
      'a resumed turn on another thread',
      exited(turn(OTHER_THREAD, message('ACK'))),
      threadId(THREAD),
      { kind: 'thread-mismatch', expected: threadId(THREAD), actual: threadId(OTHER_THREAD) },
    ],
    [
      'a resumed turn whose thread id is not a UUID, judged before any comparison',
      exited(turn('--x', message('ACK'))),
      threadId(THREAD),
      { kind: 'invalid-thread-id' },
    ],
    [
      'two thread ids in one turn',
      exited(jsonl(started(THREAD), started(OTHER_THREAD), turnStarted, message('ACK'), completed)),
      undefined,
      { kind: 'multiple-thread-ids', count: 2 },
    ],
    [
      'the same thread id started twice in one turn',
      exited(jsonl(started(THREAD), started(THREAD), turnStarted, message('ACK'), completed)),
      undefined,
      { kind: 'multiple-thread-ids', count: 2 },
    ],
    ['no agent message', exited(turn(THREAD)), undefined, { kind: 'no-agent-message' }],
    [
      'a blank last agent message',
      exited(turn(THREAD, message('Preamble'), message('  \n'))),
      undefined,
      { kind: 'no-agent-message' },
    ],
  ])('fails on %s', (_label, run, requested, failure) => {
    expect(judgeTurn(run, requested)).toStrictEqual({ ok: false, error: failure });
  });

  it.each<[string, (stderr: string) => CodexRun]>([
    ['a non-zero exit', (stderr) => ({ kind: 'exited', code: 2, stdout: '', stderr })],
    ['a killed run', (stderr) => ({ kind: 'killed', reason: 'timeout', stdout: '', stderr })],
  ])('keeps the end of a long stderr and drops its start, on %s', (_label, runWith) => {
    const stderr = `HEAD${'x'.repeat(10_000)}END`;
    const stderrTail = stderrTailOf(judgeTurn(runWith(stderr), undefined));
    expect(stderrTail.endsWith('END')).toBe(true);
    expect(stderrTail).not.toContain('HEAD');
    expect(stderrTail.length).toBeLessThan(stderr.length);
  });
});

function stderrTailOf(verdict: ReturnType<typeof judgeTurn>): string {
  if (verdict.ok || !('stderrTail' in verdict.error)) {
    return expect.unreachable('the run must fail with a stderr tail');
  }
  return verdict.error.stderrTail;
}

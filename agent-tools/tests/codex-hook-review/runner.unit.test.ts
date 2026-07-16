import { describe, expect, it } from 'vitest';

import { MODEL_CONFIGURATIONS } from '../../src/codex-hook-review/tournament-types.js';
import { runCodexHookReview, type CodexReviewOutcome } from '../../src/codex-hook-review/runner.js';
import { type CodexProcessOutcome } from '../../src/codex-hook-review/process-runner.js';

const CONCERN_DECISION = JSON.stringify({
  verdict: 'concern',
  kind: 'logic',
  change_index: 1,
});
const MESSAGE = JSON.stringify({
  type: 'item.completed',
  item: { id: 'item-1', type: 'agent_message', text: CONCERN_DECISION },
});
const SUCCESS_JSONL = [
  '{"type":"thread.started","thread_id":"thread-1"}',
  '{"type":"turn.started"}',
  MESSAGE,
  '{"type":"turn.completed","usage":{"input_tokens":20,"cached_input_tokens":8,"output_tokens":5}}',
].join('\n');

const COMMON_INPUT = {
  payload: '{"version":1,"changes":[{"operation":"write","path":"src/a.ts","content":"x"}]}',
  changeCount: 1,
  modelConfiguration: MODEL_CONFIGURATIONS[0],
  mechanism: 'inline' as const,
  layout: {
    baseDirectory: '/review',
    codexHome: '/review/codex-home',
    homeDirectory: '/review/home',
    workingDirectory: '/review/work',
    outputSchemaPath: '/review/output.json',
    instructionsPath: '/review/instructions.md',
    skillPath: undefined,
  },
  sourceEnvironment: {},
  codexExecutable: '/opt/codex',
};

describe('runCodexHookReview', () => {
  it('returns the validated decision, usage, and adapter duration', async () => {
    const outcome = await runCodexHookReview({
      ...COMMON_INPUT,
      processRunner: {
        run: async () => ({ kind: 'completed', stdout: SUCCESS_JSONL, durationMs: 321 }),
      },
    });

    expect(outcome).toStrictEqual({
      kind: 'completed',
      decision: { verdict: 'concern', kind: 'logic', change_index: 1 },
      usage: { inputTokens: 20, cachedInputTokens: 8, outputTokens: 5 },
      reasoningItemCount: 0,
      durationMs: 321,
    });
  });

  it.each([
    'hard-timeout',
    'stdout-limit',
    'stderr-limit',
    'process-error',
    'non-zero-exit',
  ] as const)('preserves the content-free process failure %s', async (reason) => {
    const processOutcome: CodexProcessOutcome = { kind: 'failed', reason, durationMs: 44 };
    const outcome = await runCodexHookReview({
      ...COMMON_INPUT,
      processRunner: { run: async () => processOutcome },
    });

    expect(outcome).toStrictEqual({ kind: 'failed', reason, durationMs: 44 });
  });

  it('fails closed on capability events without returning process output', async () => {
    const stdout = [
      '{"type":"thread.started","thread_id":"thread-1"}',
      '{"type":"turn.started"}',
      '{"type":"item.completed","item":{"id":"item-1","type":"command_execution"}}',
    ].join('\n');
    const outcome = await runCodexHookReview({
      ...COMMON_INPUT,
      processRunner: {
        run: async () => ({ kind: 'completed', stdout, durationMs: 7 }),
      },
    });

    expect(outcome).toStrictEqual({
      kind: 'failed',
      reason: 'dynamic-tool-event',
      durationMs: 7,
    });
  });

  it('defensively rejects oversized stdout from an injected process runner', async () => {
    const outcome = await runCodexHookReview({
      ...COMMON_INPUT,
      processRunner: {
        run: async () => ({ kind: 'completed', stdout: 'x'.repeat(16_385), durationMs: 6 }),
      },
    });

    expect(outcome).toStrictEqual({ kind: 'failed', reason: 'stdout-limit', durationMs: 6 });
  });

  it('maps final-message schema violations to one schema failure', async () => {
    const malformedMessage = JSON.stringify({
      type: 'item.completed',
      item: { id: 'item-1', type: 'agent_message', text: 'model prose' },
    });
    const stdout = SUCCESS_JSONL.replace(MESSAGE, malformedMessage);
    const outcome = await runCodexHookReview({
      ...COMMON_INPUT,
      processRunner: {
        run: async () => ({ kind: 'completed', stdout, durationMs: 8 }),
      },
    });

    expect(outcome).toStrictEqual({
      kind: 'failed',
      reason: 'schema-failure',
      durationMs: 8,
    });
  });

  it.each([
    { payload: '', changeCount: 1 },
    { payload: COMMON_INPUT.payload, changeCount: 0 },
    { payload: COMMON_INPUT.payload, changeCount: 4 },
  ])('rejects invalid bounded input before review', async (invalid) => {
    const outcome: CodexReviewOutcome = await runCodexHookReview({
      ...COMMON_INPUT,
      ...invalid,
      processRunner: {
        run: async () => ({ kind: 'completed', stdout: SUCCESS_JSONL, durationMs: 1 }),
      },
    });

    expect(outcome).toStrictEqual({ kind: 'failed', reason: 'invalid-input', durationMs: 0 });
  });
});

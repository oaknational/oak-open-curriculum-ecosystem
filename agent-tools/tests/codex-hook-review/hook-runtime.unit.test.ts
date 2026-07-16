import { describe, expect, it } from 'vitest';

import { runCodexReviewHook } from '../../src/codex-hook-review/hook-runtime.js';
import { type ReviewDecision } from '../../src/codex-hook-review/types.js';
import {
  createHookRuntimeHarness,
  mainHookInput,
  PROJECT_ROOT,
  unsupportedWriteResponseHookInput,
  writeHookInput,
} from './hook-runtime-test-helpers.js';

function mixedResponseHookInput(): string {
  const editPath = `${PROJECT_ROOT}/src/edit.ts`;
  const writePath = `${PROJECT_ROOT}/src/write.ts`;
  return JSON.stringify({
    hook_event_name: 'PostToolBatch',
    session_id: 'session-123',
    cwd: PROJECT_ROOT,
    tool_calls: [
      {
        tool_name: 'Edit',
        tool_input: {
          file_path: editPath,
          old_string: 'before-private',
          new_string: 'after-private',
        },
        tool_response: `The file ${editPath} has been updated successfully.`,
      },
      {
        tool_name: 'Write',
        tool_input: { file_path: writePath, content: 'private-source' },
        tool_response: [
          { type: 'text', text: `File created successfully at: ${writePath}` },
          { type: 'text', text: 'response-only-private-metadata' },
        ],
      },
    ],
  });
}

describe('runCodexReviewHook', () => {
  it('scans and reviews exact serialised payload before fixed concern context', async () => {
    const decision: ReviewDecision = {
      verdict: 'concern',
      kind: 'data-loss',
      change_index: 2,
    };
    const { dependencies, state } = createHookRuntimeHarness({ decision });

    const output = await runCodexReviewHook({ projectRoot: PROJECT_ROOT }, dependencies);

    const expectedPayload = JSON.stringify({
      version: 1,
      changes: [
        {
          operation: 'edit',
          path: 'src/edit.ts',
          before: 'before-private',
          after: 'after-private',
        },
        { operation: 'write', path: 'src/write.ts', content: 'private-source' },
      ],
    });
    expect(state.scannedPayloads).toStrictEqual([expectedPayload]);
    expect(state.leaseInputs).toStrictEqual([{ invokeReview: true }]);
    expect(state.reviewCalls).toStrictEqual([{ payload: expectedPayload, changeCount: 2 }]);
    expect(output).toStrictEqual({
      hookSpecificOutput: {
        hookEventName: 'PostToolBatch',
        additionalContext: 'Codex advisory review: second change has a data-loss concern.',
      },
    });
    expect(state.releases).toBe(1);
    expect(state.metrics).toHaveLength(1);
    expect(state.metrics[0]).toMatchObject({
      outcome: 'concern',
      model: 'gpt-5.3-codex-spark',
      mechanism: 'inline',
      input_tokens: 90,
      cached_input_tokens: 40,
      output_tokens: 8,
    });
    expect(JSON.stringify(state.metrics)).not.toContain('private');
    expect(JSON.stringify(output)).not.toContain('src/');
  });

  it('reviews a mixed serialized/content-block response batch without forwarding response text', async () => {
    const { dependencies, state } = createHookRuntimeHarness({
      rawInput: mixedResponseHookInput(),
    });

    await expect(
      runCodexReviewHook({ projectRoot: PROJECT_ROOT }, dependencies),
    ).resolves.toStrictEqual({});
    expect(state.scannedPayloads).toHaveLength(1);
    expect(state.reviewCalls).toHaveLength(1);
    expect(state.reviewCalls[0]?.changeCount).toBe(2);
    expect(state.scannedPayloads[0]).not.toContain('response-only-private-metadata');
  });

  it.each([
    { verdict: 'pass', kind: 'none', change_index: 0 },
    { verdict: 'uncertain', kind: 'none', change_index: 0 },
  ] satisfies readonly ReviewDecision[])('emits {} for $verdict', async (decision) => {
    const { dependencies, state } = createHookRuntimeHarness({ decision });

    await expect(
      runCodexReviewHook({ projectRoot: PROJECT_ROOT }, dependencies),
    ).resolves.toStrictEqual({});
    expect(state.metrics[0]).toMatchObject({ outcome: decision.verdict });
    expect(state.releases).toBe(1);
  });

  it('lets agent_id advance generation without loading activation or invoking review', async () => {
    const { dependencies, state } = createHookRuntimeHarness({
      rawInput: mainHookInput(1, 'subagent-123'),
    });

    await expect(
      runCodexReviewHook({ projectRoot: PROJECT_ROOT }, dependencies),
    ).resolves.toStrictEqual({});
    expect(state.leaseInputs).toStrictEqual([{ invokeReview: false }]);
    expect(state.activationLoads).toBe(0);
    expect(state.reviewCalls).toStrictEqual([]);
    expect(state.metrics[0]).toMatchObject({ outcome: 'invalidated', reason: 'agent-generation' });
  });

  it('does not advance generation for a batch without eligible Edit or Write changes', async () => {
    const { dependencies, state } = createHookRuntimeHarness({ rawInput: mainHookInput(0) });

    await expect(
      runCodexReviewHook({ projectRoot: PROJECT_ROOT }, dependencies),
    ).resolves.toStrictEqual({});
    expect(state.leaseInputs).toStrictEqual([]);
    expect(state.metrics[0]).toMatchObject({
      outcome: 'skipped',
      reason: 'no-reviewable-changes',
    });
  });

  it('records content-free response drift without advancing generation', async () => {
    const { dependencies, state } = createHookRuntimeHarness({
      rawInput: unsupportedWriteResponseHookInput(),
    });

    await expect(
      runCodexReviewHook({ projectRoot: PROJECT_ROOT }, dependencies),
    ).resolves.toStrictEqual({});
    expect(state.leaseInputs).toStrictEqual([]);
    expect(state.metrics[0]).toMatchObject({
      outcome: 'skipped',
      reason: 'unsupported-tool-response-shape',
    });
    expect(JSON.stringify(state.metrics)).not.toContain('private');
  });

  it('does not advance generation for a subagent batch rejected by path policy', async () => {
    const { dependencies, state } = createHookRuntimeHarness({
      rawInput: writeHookInput(`${PROJECT_ROOT}/.env`, 'private', 'subagent-123'),
    });

    await expect(
      runCodexReviewHook({ projectRoot: PROJECT_ROOT }, dependencies),
    ).resolves.toStrictEqual({});
    expect(state.leaseInputs).toStrictEqual([]);
    expect(state.activationLoads).toBe(0);
    expect(state.reviewCalls).toStrictEqual([]);
    expect(state.metrics[0]).toMatchObject({ outcome: 'failed', reason: 'payload-invalid' });
  });

  it('does not advance generation for a main-agent batch above the payload bound', async () => {
    const { dependencies, state } = createHookRuntimeHarness({
      rawInput: writeHookInput(`${PROJECT_ROOT}/src/large.ts`, 'x'.repeat(4_096)),
    });

    await expect(
      runCodexReviewHook({ projectRoot: PROJECT_ROOT }, dependencies),
    ).resolves.toStrictEqual({});
    expect(state.leaseInputs).toStrictEqual([]);
    expect(state.activationLoads).toBe(0);
    expect(state.reviewCalls).toStrictEqual([]);
    expect(state.metrics[0]).toMatchObject({ outcome: 'skipped', reason: 'payload-too-large' });
  });

  it('stops before preparation when the current activation decision is disabled', async () => {
    const { dependencies, state } = createHookRuntimeHarness({
      activation: { enabled: false, reason: 'manifest-disabled', mismatches: [] },
    });

    await expect(
      runCodexReviewHook({ projectRoot: PROJECT_ROOT }, dependencies),
    ).resolves.toStrictEqual({});
    expect(state.prepares).toBe(0);
    expect(state.reviewCalls).toStrictEqual([]);
    expect(state.metrics[0]).toMatchObject({
      outcome: 'skipped',
      reason: 'activation-manifest-disabled',
    });
    expect(state.releases).toBe(1);
  });
});

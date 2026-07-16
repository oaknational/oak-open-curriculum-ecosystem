import { describe, expect, it } from 'vitest';

import { runCodexReviewHook } from '../../src/codex-hook-review/hook-runtime.js';
import { type ReviewDecision } from '../../src/codex-hook-review/types.js';
import {
  createHookRuntimeHarness,
  mainHookInput,
  PROJECT_ROOT,
} from './hook-runtime-test-helpers.js';

describe('runCodexReviewHook fail-soft lifecycle', () => {
  it('does not queue when the session lease is busy', async () => {
    const { dependencies, state } = createHookRuntimeHarness({ busy: true });

    await expect(
      runCodexReviewHook({ projectRoot: PROJECT_ROOT }, dependencies),
    ).resolves.toStrictEqual({});
    expect(state.activationLoads).toBe(0);
    expect(state.reviewCalls).toStrictEqual([]);
    expect(state.releases).toBe(0);
    expect(state.metrics[0]).toMatchObject({ outcome: 'busy', reason: 'session-lease' });
  });

  it('suppresses a completed concern when a later generation has invalidated it', async () => {
    const decision: ReviewDecision = {
      verdict: 'concern',
      kind: 'security',
      change_index: 1,
    };
    const { dependencies, state } = createHookRuntimeHarness({ decision, current: false });

    await expect(
      runCodexReviewHook({ projectRoot: PROJECT_ROOT }, dependencies),
    ).resolves.toStrictEqual({});
    expect(state.metrics[0]).toMatchObject({ outcome: 'invalidated', reason: 'newer-generation' });
    expect(state.releases).toBe(1);
  });

  it('stops when the exact outbound payload is not clean', async () => {
    const { dependencies, state } = createHookRuntimeHarness({
      scanOutcome: { kind: 'skipped', reason: 'secret' },
    });

    await expect(
      runCodexReviewHook({ projectRoot: PROJECT_ROOT }, dependencies),
    ).resolves.toStrictEqual({});
    expect(state.scannedPayloads).toHaveLength(1);
    expect(state.reviewCalls).toStrictEqual([]);
    expect(state.metrics[0]).toMatchObject({ outcome: 'skipped', reason: 'gitleaks-secret' });
    expect(state.releases).toBe(1);
  });

  it('stops before Gitleaks when the production invocation fingerprint has drifted', async () => {
    const { dependencies, state } = createHookRuntimeHarness({
      preparationError: { kind: 'runtime-invocation-drift' },
    });

    await expect(
      runCodexReviewHook({ projectRoot: PROJECT_ROOT }, dependencies),
    ).resolves.toStrictEqual({});
    expect(state.scannedPayloads).toStrictEqual([]);
    expect(state.reviewCalls).toStrictEqual([]);
    expect(state.metrics[0]).toMatchObject({
      outcome: 'failed',
      reason: 'prepare-runtime-invocation-drift',
    });
    expect(state.releases).toBe(1);
  });

  it('returns {} and attempts release even when review, metrics, and release throw', async () => {
    const { dependencies, state } = createHookRuntimeHarness({
      reviewThrows: true,
      metricFails: true,
      releaseThrows: true,
    });

    await expect(
      runCodexReviewHook({ projectRoot: PROJECT_ROOT }, dependencies),
    ).resolves.toStrictEqual({});
    expect(state.metrics[0]).toMatchObject({ outcome: 'failed', reason: 'exception' });
    expect(state.releases).toBe(1);
  });

  it('does no lease or review work when bounded input fails', async () => {
    const { dependencies, state } = createHookRuntimeHarness({ inputError: 'input-too-large' });

    await expect(
      runCodexReviewHook({ projectRoot: PROJECT_ROOT }, dependencies),
    ).resolves.toStrictEqual({});
    expect(state.leaseInputs).toStrictEqual([]);
    expect(state.reviewCalls).toStrictEqual([]);
    expect(state.metrics[0]).toMatchObject({ outcome: 'skipped', reason: 'input-too-large' });
  });

  it('rejects a concern index outside the exact payload change count', async () => {
    const decision: ReviewDecision = {
      verdict: 'concern',
      kind: 'logic',
      change_index: 2,
    };
    const { dependencies, state } = createHookRuntimeHarness({
      rawInput: mainHookInput(1),
      decision,
    });

    await expect(
      runCodexReviewHook({ projectRoot: PROJECT_ROOT }, dependencies),
    ).resolves.toStrictEqual({});
    expect(state.metrics[0]).toMatchObject({ outcome: 'failed', reason: 'invalid-decision' });
    expect(state.releases).toBe(1);
  });
});

import { extname } from 'node:path';

import { err, ok } from '@oaknational/result';

import { type ActivationDecision } from '../../src/codex-hook-review/activation.js';
import { type BoundedInputError } from '../../src/codex-hook-review/bounded-input.js';
import { type SecretScanOutcome } from '../../src/codex-hook-review/gitleaks.js';
import {
  type HookPreparationError,
  type HookRuntimeDependencies,
} from '../../src/codex-hook-review/hook-runtime.js';
import { type ReviewLease } from '../../src/codex-hook-review/lease.js';
import { type ReviewMetric } from '../../src/codex-hook-review/metrics.js';
import { type CodexReviewOutcome } from '../../src/codex-hook-review/runner.js';
import { type ReviewDecision } from '../../src/codex-hook-review/types.js';

export const PROJECT_ROOT = '/workspace/oak';
const LEASE: ReviewLease = {
  generation: 'session-generation',
  generationPath: '/state/session.generation',
  leaseDirectory: '/state/lease',
  ownerToken: 'owner',
  stateDirectory: '/state',
};

interface TestReviewContext {
  readonly marker: 'prepared';
}

export interface HookRuntimeHarnessOptions {
  readonly rawInput?: string;
  readonly inputError?: BoundedInputError;
  readonly activation?: ActivationDecision;
  readonly busy?: boolean;
  readonly current?: boolean;
  readonly scanOutcome?: SecretScanOutcome;
  readonly decision?: ReviewDecision;
  readonly reviewThrows?: boolean;
  readonly releaseThrows?: boolean;
  readonly metricFails?: boolean;
  readonly preparationError?: HookPreparationError;
}

export interface HookRuntimeHarnessState {
  readonly leaseInputs: { readonly invokeReview: boolean }[];
  readonly scannedPayloads: string[];
  readonly reviewCalls: { readonly payload: string; readonly changeCount: number }[];
  readonly metrics: ReviewMetric[];
  activationLoads: number;
  prepares: number;
  releases: number;
}

/** Build a fully in-memory hook-runtime fixture with explicit failure switches. */
export function createHookRuntimeHarness(options: HookRuntimeHarnessOptions = {}): {
  readonly dependencies: HookRuntimeDependencies<TestReviewContext>;
  readonly state: HookRuntimeHarnessState;
} {
  const state = createState();
  return { dependencies: createDependencies(options, state), state };
}

function createState(): HookRuntimeHarnessState {
  return {
    leaseInputs: [],
    scannedPayloads: [],
    reviewCalls: [],
    metrics: [],
    activationLoads: 0,
    prepares: 0,
    releases: 0,
  };
}

function createDependencies(
  options: HookRuntimeHarnessOptions,
  state: HookRuntimeHarnessState,
): HookRuntimeDependencies<TestReviewContext> {
  return {
    readInput: async () =>
      options.inputError === undefined
        ? ok(options.rawInput ?? mainHookInput())
        : err(options.inputError),
    pathInspection: {
      lstat: async (absolutePath) => ok(extname(absolutePath).length === 0 ? 'directory' : 'file'),
    },
    lease: createLease(options, state),
    loadActivationDecision: async () => {
      state.activationLoads += 1;
      return options.activation ?? { enabled: true, selectedCellId: 'spark-low:inline' };
    },
    prepareReview: async () => {
      state.prepares += 1;
      if (options.preparationError !== undefined) {
        return err(options.preparationError);
      }
      return ok({
        context: { marker: 'prepared' },
        model: 'gpt-5.3-codex-spark',
        mechanism: 'inline',
      });
    },
    scanPayload: async ({ payload }) => {
      state.scannedPayloads.push(payload);
      return options.scanOutcome ?? { kind: 'clean' };
    },
    review: createReviewer(options, state),
    recordMetric: createMetricRecorder(options, state),
    clock: {
      nowIso: () => '2026-07-16T12:00:00.000Z',
      nowMilliseconds: () => 100,
    },
  };
}

function createLease(
  options: HookRuntimeHarnessOptions,
  state: HookRuntimeHarnessState,
): HookRuntimeDependencies<TestReviewContext>['lease'] {
  return {
    begin: async (input) => {
      state.leaseInputs.push({ invokeReview: input.invokeReview });
      if (!input.invokeReview) {
        return { kind: 'invalidated-only', generation: LEASE.generation };
      }
      return options.busy === true
        ? { kind: 'busy', generation: LEASE.generation }
        : { kind: 'acquired', lease: LEASE };
    },
    isCurrent: async () => options.current ?? true,
    release: () => {
      state.releases += 1;
      return options.releaseThrows === true
        ? Promise.reject(new Error('release failed'))
        : Promise.resolve();
    },
  };
}

function createReviewer(
  options: HookRuntimeHarnessOptions,
  state: HookRuntimeHarnessState,
): HookRuntimeDependencies<TestReviewContext>['review'] {
  return ({ payload, changeCount }): Promise<CodexReviewOutcome> => {
    state.reviewCalls.push({ payload, changeCount });
    if (options.reviewThrows === true) {
      return Promise.reject(new Error('review failed'));
    }
    return Promise.resolve({
      kind: 'completed',
      decision: options.decision ?? {
        verdict: 'pass',
        kind: 'none',
        change_index: 0,
      },
      usage: { inputTokens: 90, cachedInputTokens: 40, outputTokens: 8 },
      reasoningItemCount: 0,
      durationMs: 35,
    });
  };
}

function createMetricRecorder(
  options: HookRuntimeHarnessOptions,
  state: HookRuntimeHarnessState,
): HookRuntimeDependencies<TestReviewContext>['recordMetric'] {
  return (_projectRoot, metric) => {
    state.metrics.push(metric);
    return Promise.resolve(
      options.metricFails === true ? err({ kind: 'log-append-failed' }) : ok(undefined),
    );
  };
}

/** Create a documented PostToolBatch fixture with one or two successful changes. */
export function mainHookInput(changeCount = 2, agentId?: string): string {
  const toolCalls = [
    {
      tool_name: 'Edit',
      tool_input: {
        file_path: `${PROJECT_ROOT}/src/edit.ts`,
        old_string: 'before-private',
        new_string: 'after-private',
      },
      tool_response: `The file ${PROJECT_ROOT}/src/edit.ts has been updated successfully.`,
    },
    {
      tool_name: 'Write',
      tool_input: { file_path: `${PROJECT_ROOT}/src/write.ts`, content: 'private-source' },
      tool_response: `File created successfully at: ${PROJECT_ROOT}/src/write.ts`,
    },
  ];
  return JSON.stringify({
    hook_event_name: 'PostToolBatch',
    session_id: 'session-123',
    cwd: PROJECT_ROOT,
    ...(agentId === undefined ? {} : { agent_id: agentId }),
    tool_calls: toolCalls.slice(0, changeCount),
  });
}

/** Create one successful Write event for path and payload eligibility cases. */
export function writeHookInput(filePath: string, content: string, agentId?: string): string {
  return JSON.stringify({
    hook_event_name: 'PostToolBatch',
    session_id: 'session-123',
    cwd: PROJECT_ROOT,
    ...(agentId === undefined ? {} : { agent_id: agentId }),
    tool_calls: [
      {
        tool_name: 'Write',
        tool_input: { file_path: filePath, content },
        tool_response: `File created successfully at: ${filePath}`,
      },
    ],
  });
}

/** Create a known Write event with an unsupported response shape. */
export function unsupportedWriteResponseHookInput(): string {
  return JSON.stringify({
    hook_event_name: 'PostToolBatch',
    session_id: 'session-123',
    cwd: PROJECT_ROOT,
    tool_calls: [
      {
        tool_name: 'Edit',
        tool_input: {
          file_path: `${PROJECT_ROOT}/src/edit.ts`,
          old_string: 'before',
          new_string: 'after',
        },
        tool_response: `The file ${PROJECT_ROOT}/src/edit.ts has been updated successfully.`,
      },
      {
        tool_name: 'Write',
        tool_input: {
          file_path: `${PROJECT_ROOT}/src/write.ts`,
          content: 'source-private',
        },
        tool_response: [{ type: 'future-block', value: 'response-private' }],
      },
    ],
  });
}

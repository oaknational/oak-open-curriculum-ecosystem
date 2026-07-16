/** Fail-soft orchestration for the bounded Claude-to-Codex review hook. @packageDocumentation */
import { parsePostToolBatchInput } from './hook-input.js';
import { elapsed, recordCompletedHookOutcome, recordHookOutcome } from './hook-metrics.js';
import {
  formatReviewOutput,
  type CodexReviewHookOutput,
  type ReviewChangeCount,
} from './hook-output.js';
import { type HookRuntimeDependencies, type PreparedReview } from './hook-runtime-dependencies.js';
import { type FileReviewLeaseCoordinator, type LeaseStart, type ReviewLease } from './lease.js';
import { type ReviewMetric } from './metrics.js';
import { buildReviewPayload } from './payload.js';
import { type HookChange } from './types.js';
export type { CodexReviewHookOutput, ReviewChangeCount } from './hook-output.js';
export type {
  HookPreparationError,
  HookRuntimeDependencies,
  PreparedReview,
} from './hook-runtime-dependencies.js';
/** Stable input owned by the production adapter rather than ambient globals. */
export interface RunCodexReviewHookInput {
  readonly projectRoot: string;
}
interface Flow<TContext> {
  readonly input: RunCodexReviewHookInput;
  readonly dependencies: HookRuntimeDependencies<TContext>;
  readonly startedAt: number;
}
interface PreparedInvocation<TContext> {
  readonly payload: string;
  readonly count: ReviewChangeCount;
  readonly prepared: PreparedReview<TContext>;
  readonly gitleaksMs: number;
}
interface PreflightInvocation {
  readonly payload: string;
  readonly count: ReviewChangeCount;
}
/** Run one hook event; every failure becomes an empty successful hook response. */
export async function runCodexReviewHook<TContext>(
  input: RunCodexReviewHookInput,
  dependencies: HookRuntimeDependencies<TContext>,
): Promise<CodexReviewHookOutput> {
  let startedAt = 0;
  try {
    startedAt = dependencies.clock.nowMilliseconds();
    return await runFlow({ input, dependencies, startedAt });
  } catch {
    await record({ input, dependencies, startedAt }, 'failed', 'exception');
    return {};
  }
}
async function runFlow<TContext>(flow: Flow<TContext>): Promise<CodexReviewHookOutput> {
  const rawInput = await flow.dependencies.readInput();
  if (!rawInput.ok) {
    return emptyAfterRecord(flow, 'skipped', rawInput.error);
  }
  const parsed = parsePostToolBatchInput({
    rawInput: rawInput.value,
    projectDir: flow.input.projectRoot,
  });
  if (!parsed.ok) {
    return emptyAfterRecord(flow, 'failed', 'invalid-hook-input');
  }
  if (parsed.value.unsupportedToolResponse === true) {
    return emptyAfterRecord(flow, 'skipped', 'unsupported-tool-response-shape');
  }
  if (parsed.value.changes.length === 0) {
    return emptyAfterRecord(flow, 'skipped', 'no-reviewable-changes');
  }
  const preflight = await preflightInvocation(flow, parsed.value.changes);
  if (preflight === undefined) {
    return {};
  }
  const leaseStart = await flow.dependencies.lease.begin({
    projectRoot: flow.input.projectRoot,
    sessionId: parsed.value.sessionId,
    invokeReview: parsed.value.agentId === undefined,
  });
  return handleLease(flow, leaseStart, preflight);
}
async function handleLease<TContext>(
  flow: Flow<TContext>,
  leaseStart: LeaseStart,
  preflight: PreflightInvocation,
): Promise<CodexReviewHookOutput> {
  if (leaseStart.kind === 'unavailable') {
    return emptyAfterRecord(flow, 'failed', 'session-lease-unavailable');
  }
  if (leaseStart.kind === 'invalidated-only') {
    return emptyAfterRecord(flow, 'invalidated', 'agent-generation');
  }
  if (leaseStart.kind === 'busy') {
    return emptyAfterRecord(flow, 'busy', 'session-lease');
  }
  try {
    const invocation = await prepareInvocation(flow, preflight);
    return invocation === undefined ? {} : await invoke(flow, leaseStart.lease, invocation);
  } finally {
    await releaseQuietly(flow.dependencies.lease, leaseStart.lease);
  }
}
async function preflightInvocation<TContext>(
  flow: Flow<TContext>,
  changes: readonly HookChange[],
): Promise<PreflightInvocation | undefined> {
  const result = await buildReviewPayload(
    { projectRoot: flow.input.projectRoot, changes },
    flow.dependencies.pathInspection,
  );
  if (!result.ok) {
    return stop(flow, 'failed', 'payload-invalid');
  }
  if (result.value.kind === 'skip') {
    return stop(flow, 'skipped', result.value.reason);
  }
  const count = toChangeCount(result.value.payload.changes.length);
  if (count === undefined) {
    return stop(flow, 'failed', 'invalid-change-count');
  }
  const payload = JSON.stringify(result.value.payload);
  return { payload, count };
}
async function prepareInvocation<TContext>(
  flow: Flow<TContext>,
  preflight: PreflightInvocation,
): Promise<PreparedInvocation<TContext> | undefined> {
  const activation = await flow.dependencies.loadActivationDecision(flow.input.projectRoot);
  if (!activation.enabled) {
    return stop(flow, 'skipped', `activation-${activation.reason}`);
  }
  const prepared = await flow.dependencies.prepareReview(activation.selectedCellId);
  if (!prepared.ok) {
    return stop(flow, 'failed', `prepare-${prepared.error.kind}`);
  }
  const scanStartedAt = flow.dependencies.clock.nowMilliseconds();
  const scan = await flow.dependencies.scanPayload({
    payload: preflight.payload,
    context: prepared.value.context,
  });
  const gitleaksMs = elapsed(toMetricFlow(flow), scanStartedAt);
  if (scan.kind !== 'clean') {
    return stop(flow, 'skipped', `gitleaks-${scan.reason}`);
  }
  return { ...preflight, prepared: prepared.value, gitleaksMs };
}
async function invoke<TContext>(
  flow: Flow<TContext>,
  lease: ReviewLease,
  invocation: PreparedInvocation<TContext>,
): Promise<CodexReviewHookOutput> {
  if (!(await flow.dependencies.lease.isCurrent(lease))) {
    return emptyAfterRecord(flow, 'invalidated', 'newer-generation');
  }
  const outcome = await flow.dependencies.review({
    payload: invocation.payload,
    changeCount: invocation.count,
    context: invocation.prepared.context,
  });
  if (outcome.kind === 'failed') {
    return emptyAfterRecord(flow, 'failed', `review-${outcome.reason}`);
  }
  if (!(await flow.dependencies.lease.isCurrent(lease))) {
    return emptyAfterRecord(flow, 'invalidated', 'newer-generation');
  }
  if (outcome.decision.verdict === 'concern' && outcome.decision.change_index > invocation.count) {
    return emptyAfterRecord(flow, 'failed', 'invalid-decision');
  }
  await recordCompletedHookOutcome(
    toMetricFlow(flow),
    {
      model: invocation.prepared.model,
      mechanism: invocation.prepared.mechanism,
      gitleaksMs: invocation.gitleaksMs,
    },
    outcome,
  );
  return formatReviewOutput(outcome.decision);
}
function toChangeCount(value: number): ReviewChangeCount | undefined {
  return value === 1 || value === 2 || value === 3 ? value : undefined;
}
async function emptyAfterRecord<TContext>(
  flow: Flow<TContext>,
  outcome: ReviewMetric['outcome'],
  reason: string,
): Promise<CodexReviewHookOutput> {
  await record(flow, outcome, reason);
  return {};
}
async function stop<TContext>(
  flow: Flow<TContext>,
  outcome: ReviewMetric['outcome'],
  reason: string,
): Promise<undefined> {
  await record(flow, outcome, reason);
  return undefined;
}
async function record<TContext>(
  flow: Flow<TContext>,
  outcome: ReviewMetric['outcome'],
  reason: string,
): Promise<void> {
  await recordHookOutcome(toMetricFlow(flow), outcome, reason);
}

async function releaseQuietly(
  lease: Pick<FileReviewLeaseCoordinator, 'release'>,
  value: ReviewLease,
): Promise<void> {
  try {
    await lease.release(value);
  } catch {
    // Lease cleanup is best effort after every acquired review.
  }
}

function toMetricFlow<TContext>(flow: Flow<TContext>) {
  return {
    projectRoot: flow.input.projectRoot,
    startedAt: flow.startedAt,
    recordMetric: flow.dependencies.recordMetric,
    clock: flow.dependencies.clock,
  };
}

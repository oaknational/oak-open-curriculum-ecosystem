import { type Result } from '@oaknational/result';

import { type ReviewMetric, type ReviewMetricError } from './metrics.js';
import { type CodexReviewOutcome } from './runner.js';
import { type InstructionMechanism } from './tournament-types.js';

export interface HookMetricFlow {
  readonly projectRoot: string;
  readonly startedAt: number;
  readonly recordMetric: (
    projectRoot: string,
    metric: ReviewMetric,
  ) => Promise<Result<void, ReviewMetricError>>;
  readonly clock: { readonly nowIso: () => string; readonly nowMilliseconds: () => number };
}

export async function recordHookOutcome(
  flow: HookMetricFlow,
  outcome: ReviewMetric['outcome'],
  reason: string,
): Promise<void> {
  await recordQuietly(flow, {
    recorded_at: flow.clock.nowIso(),
    outcome,
    reason,
    duration_ms: elapsed(flow, flow.startedAt),
  });
}

export async function recordCompletedHookOutcome(
  flow: HookMetricFlow,
  invocation: {
    readonly model: string;
    readonly mechanism: InstructionMechanism;
    readonly gitleaksMs: number;
  },
  outcome: Extract<CodexReviewOutcome, { readonly kind: 'completed' }>,
): Promise<void> {
  await recordQuietly(flow, {
    recorded_at: flow.clock.nowIso(),
    outcome: outcome.decision.verdict,
    model: invocation.model,
    mechanism: invocation.mechanism,
    duration_ms: elapsed(flow, flow.startedAt),
    gitleaks_ms: invocation.gitleaksMs,
    codex_ms: outcome.durationMs,
    input_tokens: outcome.usage.inputTokens,
    cached_input_tokens: outcome.usage.cachedInputTokens,
    output_tokens: outcome.usage.outputTokens,
  });
}

export function elapsed(flow: HookMetricFlow, start: number): number {
  return Math.max(0, flow.clock.nowMilliseconds() - start);
}

async function recordQuietly(flow: HookMetricFlow, metric: ReviewMetric): Promise<void> {
  await flow.recordMetric(flow.projectRoot, metric);
}

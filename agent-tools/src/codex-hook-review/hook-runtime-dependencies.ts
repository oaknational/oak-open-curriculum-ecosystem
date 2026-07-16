import { type Result } from '@oaknational/result';

import { type ActivationDecision } from './activation.js';
import { type BoundedInputError } from './bounded-input.js';
import { type SecretScanOutcome } from './gitleaks.js';
import { type ReviewChangeCount } from './hook-output.js';
import { type FileReviewLeaseCoordinator } from './lease.js';
import { type ReviewMetric, type ReviewMetricError } from './metrics.js';
import { type ReviewPathInspection } from './path.js';
import { type CodexReviewOutcome } from './runner.js';
import { type InstructionMechanism, type TournamentCellId } from './tournament-types.js';

/** Prepared assets and opaque runtime context for one activated cell. */
export interface PreparedReview<TContext> {
  readonly context: TContext;
  readonly model: string;
  readonly mechanism: InstructionMechanism;
}

export interface HookPreparationError {
  readonly kind:
    | 'runtime-unavailable'
    | 'runtime-invocation-drift'
    | 'unknown-cell'
    | 'unknown-model'
    | 'asset-failed';
}

/** Explicit dependencies for deterministic in-process orchestration tests. */
export interface HookRuntimeDependencies<TContext> {
  readonly readInput: () => Promise<Result<string, BoundedInputError>>;
  readonly pathInspection: ReviewPathInspection;
  readonly lease: Pick<FileReviewLeaseCoordinator, 'begin' | 'isCurrent' | 'release'>;
  readonly loadActivationDecision: (projectRoot: string) => Promise<ActivationDecision>;
  readonly prepareReview: (
    cellId: TournamentCellId,
  ) => Promise<Result<PreparedReview<TContext>, HookPreparationError>>;
  readonly scanPayload: (input: {
    readonly payload: string;
    readonly context: TContext;
  }) => Promise<SecretScanOutcome>;
  readonly review: (input: {
    readonly payload: string;
    readonly changeCount: ReviewChangeCount;
    readonly context: TContext;
  }) => Promise<CodexReviewOutcome>;
  readonly recordMetric: (
    projectRoot: string,
    metric: ReviewMetric,
  ) => Promise<Result<void, ReviewMetricError>>;
  readonly clock: { readonly nowIso: () => string; readonly nowMilliseconds: () => number };
}

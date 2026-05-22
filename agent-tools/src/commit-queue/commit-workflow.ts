/**
 * Commit-Queue Workflow Primitive.
 *
 * Composes the post-staging commit primitives (verify-staged → advisory
 * orchestrator → phase pre_commit → verify-staged-again → git commit →
 * complete intent) into a single workflow command. Preserves every
 * invariant the individual primitives protect — authorial-bundle
 * integrity (two verify-staged checks book-end the advisory pass);
 * commitlint conformance pre-`git commit`; audit traceability via
 * phase timestamps and abandon-notes; rollback discipline (any
 * pre-commit failure marks the intent abandoned with stage-named
 * notes).
 *
 * Advisory polarity preserved: the orchestrator's stdout/stderr stream
 * through to the caller; its non-zero exit code does NOT abort or alter
 * the commit attempt. Blocking authority stays in `.husky/pre-commit` +
 * `.husky/commit-msg`. See PDR-053 and ADR-176.
 */

import { completeCommitIntent, updateCommitIntentPhase, verifyStagedBundle } from './core.js';
import { narrowIntentPathspec, type CommitWorkflowPathspec } from './pathspec.js';
import { type CommitIntent, type CommitQueueRegistry, type StagedBundle } from './types.js';

/**
 * Outcome of a single sub-process invoked by the workflow.
 */
export interface CommitWorkflowProcessResult {
  readonly exitCode: number;
  readonly stderr: string;
}

/**
 * Outcome of the `git commit` invocation inside the workflow.
 */
export interface CommitWorkflowGitCommitResult extends CommitWorkflowProcessResult {
  readonly sha?: string;
}

/**
 * Dependencies injected into the pure workflow orchestrator.
 */
export interface CommitWorkflowDependencies {
  readonly readRegistry: () => Promise<CommitQueueRegistry>;
  readonly transformRegistry: (
    transform: (registry: CommitQueueRegistry) => CommitQueueRegistry,
  ) => Promise<void>;
  readonly getStagedBundle: (input: { readonly pathspec: CommitWorkflowPathspec }) => StagedBundle;
  readonly runAdvisoryOrchestrator: () => Promise<CommitWorkflowProcessResult>;
  readonly runGitCommit: (input: {
    readonly pathspec: CommitWorkflowPathspec;
  }) => Promise<CommitWorkflowGitCommitResult>;
  readonly nowIso: () => string;
}

/**
 * Stages at which the workflow may fail. Used as the `stage` field on
 * failure results and as the audit-trail notes prefix when the intent
 * is transitioned to `abandoned`.
 */
type CommitWorkflowFailureStage =
  | 'load-intent'
  | 'verify-staged-before'
  | 'verify-staged-after'
  | 'git-commit';

/**
 * Outcome of `runCommitWorkflow`.
 */
export type CommitWorkflowResult =
  | {
      readonly ok: true;
      readonly intentId: string;
      readonly sha: string;
      readonly advisoryExitCode: number;
    }
  | {
      readonly ok: false;
      readonly stage: CommitWorkflowFailureStage;
      readonly reason: string;
      readonly intentId?: string;
    };

/**
 * Input to the pure workflow orchestrator.
 */
export interface CommitWorkflowInput {
  readonly intentId: string;
  readonly deps: CommitWorkflowDependencies;
}

/**
 * Run the post-staging commit workflow. Sequencing matches the SKILL
 * doctrine: verify-staged → advisory orchestrator → phase pre_commit →
 * verify-staged-again → git commit → complete intent.
 *
 * The loaded intent is narrowed once at entry: `intent.files` must be
 * non-empty for the workflow to proceed. The narrowed pathspec then flows
 * into every dep call that touches scoped git state (both verify-staged
 * reads and the inner `git commit`), so the dep boundary is structurally
 * incapable of being called with an empty pathspec.
 */
export async function runCommitWorkflow(input: CommitWorkflowInput): Promise<CommitWorkflowResult> {
  const loaded = await loadIntent(input);
  if (!loaded.ok) {
    return loaded.failure;
  }

  const narrowed = narrowIntentPathspec(loaded.intent);
  if (!narrowed.ok) {
    await abandonIntent({ input, stage: 'git-commit', reason: narrowed.reason });
    return {
      ok: false,
      stage: 'git-commit',
      reason: narrowed.reason,
      intentId: input.intentId,
    };
  }

  const beforeFailure = await runVerifyStage(
    input,
    loaded.intent,
    narrowed.pathspec,
    'verify-staged-before',
  );
  if (beforeFailure !== undefined) {
    return beforeFailure;
  }

  const advisory = await input.deps.runAdvisoryOrchestrator();
  await transitionPhase(input, 'pre_commit');

  const afterFailure = await runVerifyStage(
    input,
    loaded.intent,
    narrowed.pathspec,
    'verify-staged-after',
  );
  if (afterFailure !== undefined) {
    return afterFailure;
  }

  return runCommitAndComplete({
    input,
    advisoryExitCode: advisory.exitCode,
    pathspec: narrowed.pathspec,
  });
}

async function loadIntent(
  input: CommitWorkflowInput,
): Promise<
  | { readonly ok: true; readonly intent: CommitIntent }
  | { readonly ok: false; readonly failure: CommitWorkflowResult }
> {
  const registry = await input.deps.readRegistry();
  const intent = registry.commit_queue.find((entry) => entry.intent_id === input.intentId);
  if (intent === undefined) {
    return {
      ok: false,
      failure: {
        ok: false,
        stage: 'load-intent',
        reason: `unknown intent_id: ${input.intentId}`,
      },
    };
  }

  return { ok: true, intent };
}

async function runVerifyStage(
  input: CommitWorkflowInput,
  intent: CommitIntent,
  pathspec: CommitWorkflowPathspec,
  stage: 'verify-staged-before' | 'verify-staged-after',
): Promise<CommitWorkflowResult | undefined> {
  const staged = input.deps.getStagedBundle({ pathspec });
  const result = verifyStagedBundle({
    intent,
    stagedNameOnly: staged.stagedNameOnly,
    stagedNameStatus: staged.stagedNameStatus,
    stagedPatch: staged.stagedPatch,
    worktreeShortStatus: staged.worktreeShortStatus,
    commitSubject: intent.commit_subject,
  });
  if (result.ok) {
    return undefined;
  }

  await abandonIntent({ input, stage, reason: result.reason });
  return { ok: false, stage, reason: result.reason, intentId: input.intentId };
}

async function runCommitAndComplete(input: {
  readonly input: CommitWorkflowInput;
  readonly advisoryExitCode: number;
  readonly pathspec: CommitWorkflowPathspec;
}): Promise<CommitWorkflowResult> {
  const commitResult = await input.input.deps.runGitCommit({ pathspec: input.pathspec });
  if (commitResult.exitCode !== 0 || commitResult.sha === undefined) {
    const trimmedStderr = commitResult.stderr.trim();
    const reason =
      trimmedStderr.length === 0
        ? `git commit exited with code ${commitResult.exitCode}`
        : `git commit exited with code ${commitResult.exitCode}: ${trimmedStderr}`;
    await abandonIntent({ input: input.input, stage: 'git-commit', reason });
    return { ok: false, stage: 'git-commit', reason, intentId: input.input.intentId };
  }

  await input.input.deps.transformRegistry((current) =>
    completeCommitIntent({ registry: current, intentId: input.input.intentId }),
  );

  return {
    ok: true,
    intentId: input.input.intentId,
    sha: commitResult.sha,
    advisoryExitCode: input.advisoryExitCode,
  };
}

async function transitionPhase(input: CommitWorkflowInput, phase: 'pre_commit'): Promise<void> {
  await input.deps.transformRegistry((current) =>
    updateCommitIntentPhase({
      registry: current,
      intentId: input.intentId,
      phase,
      nowIso: input.deps.nowIso(),
    }),
  );
}

async function abandonIntent(input: {
  readonly input: CommitWorkflowInput;
  readonly stage: CommitWorkflowFailureStage;
  readonly reason: string;
}): Promise<void> {
  await input.input.deps.transformRegistry((current) =>
    updateCommitIntentPhase({
      registry: current,
      intentId: input.input.intentId,
      phase: 'abandoned',
      nowIso: input.input.deps.nowIso(),
      notes: `commit-workflow ${input.stage} failure: ${input.reason}`,
    }),
  );
}

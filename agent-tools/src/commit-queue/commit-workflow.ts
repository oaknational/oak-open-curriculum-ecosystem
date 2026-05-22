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
  readonly getStagedBundle: (input: { readonly pathspec: readonly string[] }) => StagedBundle;
  readonly runAdvisoryOrchestrator: () => Promise<CommitWorkflowProcessResult>;
  readonly runGitCommit: () => Promise<CommitWorkflowGitCommitResult>;
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
 */
export async function runCommitWorkflow(input: CommitWorkflowInput): Promise<CommitWorkflowResult> {
  const loaded = await loadIntent(input);
  if (!loaded.ok) {
    return loaded.failure;
  }

  const beforeFailure = await runVerifyStage(input, loaded.intent, 'verify-staged-before');
  if (beforeFailure !== undefined) {
    return beforeFailure;
  }

  const advisory = await input.deps.runAdvisoryOrchestrator();
  await transitionPhase(input, 'pre_commit');

  const afterFailure = await runVerifyStage(input, loaded.intent, 'verify-staged-after');
  if (afterFailure !== undefined) {
    return afterFailure;
  }

  return runCommitAndComplete({ input, advisoryExitCode: advisory.exitCode });
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
  stage: 'verify-staged-before' | 'verify-staged-after',
): Promise<CommitWorkflowResult | undefined> {
  const verification = verifyStagedAgainstIntent({
    intent,
    staged: input.deps.getStagedBundle({ pathspec: intent.files }),
  });
  if (verification.ok) {
    return undefined;
  }

  await abandonIntent({ input, stage, reason: verification.reason });
  return {
    ok: false,
    stage,
    reason: verification.reason,
    intentId: input.intentId,
  };
}

async function runCommitAndComplete(input: {
  readonly input: CommitWorkflowInput;
  readonly advisoryExitCode: number;
}): Promise<CommitWorkflowResult> {
  const commitResult = await input.input.deps.runGitCommit();
  if (commitResult.exitCode !== 0 || commitResult.sha === undefined) {
    const reason = describeGitCommitFailure(commitResult);
    await abandonIntent({ input: input.input, stage: 'git-commit', reason });
    return {
      ok: false,
      stage: 'git-commit',
      reason,
      intentId: input.input.intentId,
    };
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

function verifyStagedAgainstIntent(input: {
  readonly intent: CommitIntent;
  readonly staged: StagedBundle;
}): { readonly ok: true } | { readonly ok: false; readonly reason: string } {
  const result = verifyStagedBundle({
    intent: input.intent,
    stagedNameOnly: input.staged.stagedNameOnly,
    stagedNameStatus: input.staged.stagedNameStatus,
    stagedPatch: input.staged.stagedPatch,
    worktreeShortStatus: input.staged.worktreeShortStatus,
    commitSubject: input.intent.commit_subject,
  });

  return result.ok ? { ok: true } : { ok: false, reason: result.reason };
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

function describeGitCommitFailure(result: CommitWorkflowGitCommitResult): string {
  const trimmedStderr = result.stderr.trim();
  if (trimmedStderr.length === 0) {
    return `git commit exited with code ${result.exitCode}`;
  }

  return `git commit exited with code ${result.exitCode}: ${trimmedStderr}`;
}

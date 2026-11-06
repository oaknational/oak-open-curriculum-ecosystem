import type { CasOutcome, PlannedDelete, RetirePlan } from './retire-decision.js';
import {
  ABSENT,
  partialOutcome,
  retireRemote,
  type Context,
  type ExecuteSeams,
  type Proven,
} from './retire-execute-remote.js';
import type { NameReport, NameReports, RetireOutcome } from './retire-report.js';

/**
 * The retire command's writes, fail-secure: the remote first
 * (`retire-execute-remote.ts`), and the local names only once the remote
 * reads back absent, so a failure part-way leaves a state a re-run finishes.
 * Each local name is deleted by compare-and-swap and reported by the ref it
 * left: deleted, absent, kept (it moved), failed or unknown.
 */

interface LocalStep {
  readonly report: NameReport;
  readonly problem: string | undefined;
}

/** Delete one planned local ref by compare-and-swap, and report what it left. */
async function retireLocal(
  target: PlannedDelete | undefined,
  seams: ExecuteSeams,
  label: string,
): Promise<LocalStep> {
  if (target === undefined) {
    return { report: ABSENT, problem: undefined };
  }
  const deleted = await seams.git.deleteRef(target);
  if (!deleted.ok) {
    return { report: { state: 'unknown' }, problem: `${label}: ${deleted.error.message}` };
  }
  return localStepFor(deleted.value, target, label);
}

/** A local compare-and-swap's outcome as its report, and the problem it raises, if any. */
function localStepFor(outcome: CasOutcome, target: PlannedDelete, label: string): LocalStep {
  if (outcome.kind === 'deleted') {
    return { report: { state: 'deleted', sha: target.expectedSha }, problem: undefined };
  }
  if (outcome.kind === 'absent') {
    return { report: ABSENT, problem: undefined };
  }
  return outcome.kind === 'kept'
    ? {
        report: { state: 'kept', sha: outcome.sha },
        problem: `${label} moved to ${outcome.sha} after its proof and was kept`,
      }
    : { report: { state: 'failed' }, problem: `${label} was not deleted: ${outcome.detail}` };
}

/**
 * Why the local names must be kept, or undefined when they are free to go.
 * A worktree may have checked the branch out, or begun a rebase or bisect
 * naming it, since the proof; `update-ref -d` would delete it under that
 * worktree, so the in-use check is read again just before the local deletes,
 * as `git branch -d` checks just before its own. A worktree taking the branch
 * between this read and the delete is a race git itself has.
 */
async function localBranchTaken(
  plan: RetirePlan,
  context: Context,
  seams: ExecuteSeams,
): Promise<string | undefined> {
  if (plan.local === undefined) {
    return undefined;
  }
  const inUse = await seams.git.inUseBy(context.branch);
  if (!inUse.ok) {
    return `the in-use check before the local deletes failed: ${inUse.error.message}; the local names were kept; re-run`;
  }
  return inUse.value.length === 0
    ? undefined
    : `worktree ${inUse.value.join(', ')} began using the branch after its proof; the local names were kept; re-run once it is free`;
}

/**
 * Remove the branch's config section once the branch has no local ref, as
 * `git branch -d` removes it with the branch: `update-ref -d` leaves it, and
 * a later branch of the same name would inherit the old upstream. A section
 * a failed removal left goes on a re-run, which finds no local ref.
 */
async function configStep(
  local: LocalStep,
  context: Context,
  seams: ExecuteSeams,
): Promise<string | undefined> {
  if (local.report.state !== 'deleted' && local.report.state !== 'absent') {
    return undefined;
  }
  const config = await seams.git.removeBranchConfig(context.branch);
  return config.ok
    ? undefined
    : `branch.${context.branch}'s config was left: ${config.error.message}; re-run to remove it`;
}

/** Carry out a plan. */
export async function executePlan(
  plan: RetirePlan,
  proven: Proven,
  seams: ExecuteSeams,
): Promise<RetireOutcome> {
  const context: Context = { ...proven, plan };
  const remote = await retireRemote(plan.remote, context, seams);
  if (remote.kind === 'stop') {
    return remote.outcome;
  }
  const taken = await localBranchTaken(plan, context, seams);
  if (taken !== undefined) {
    return partialOutcome(context, remote.report, taken);
  }
  const tracking = await retireLocal(plan.tracking, seams, 'the tracking ref');
  const local = await retireLocal(plan.local, seams, 'the local branch');
  const problems = [tracking.problem, local.problem, await configStep(local, context, seams)];
  const names: NameReports = {
    remote: remote.report,
    tracking: tracking.report,
    local: local.report,
  };
  const reasons = problems.filter((problem) => problem !== undefined);
  return reasons.length === 0
    ? { kind: 'retired', branch: context.branch, base: context.base, names }
    : {
        kind: 'partial',
        branch: context.branch,
        base: context.base,
        names,
        reason: reasons.join('; '),
      };
}

import { ok, type Result } from '@oaknational/result';

import type { NamedCheck, PrStateReading, PrVerdict } from '../pr-watch/state-types.js';
import { computePrVerdict } from '../pr-watch/states.js';
import { readRequiredContexts, type RulesTarget } from './merge-required-contexts.js';
import type { GithubApiFetch } from './mint-installation-token.js';

/**
 * The verdict the merge acts on. The verdict core settles on the checks the
 * tip has REPORTED, which a tip whose required context has no check run yet
 * also satisfies; a merge sent then meets GitHub's own refusal. So on a
 * settled verdict the merge bot's own pull request proves the base branch's
 * required contexts by name, read from its rules at run time: a required
 * context the tip has not reported is read as pending and the verdict is
 * recomputed, which holds the pull request at CHECKS-RUNNING, a wait state
 * the poll continues on. Every other verdict is returned as the core read
 * it, and nothing is read for it. Every reported check binds every pull
 * request, whatever paths it changes.
 */

/** `gh pr view` spells a GitHub App author `app/<slug>`; only the configured app is the merge bot. */
export function isBotAuthored(author: string, appSlug: string): boolean {
  return author === `app/${appSlug}`;
}

export interface RequiredContextsReading {
  readonly reading: PrStateReading;
  /** The required contexts the tip has not reported, read as pending, by name. */
  readonly notReported: readonly string[];
}

/**
 * The reading with each required context the tip has not reported added as a
 * pending check, each name once (two rulesets may require the same context).
 */
export function withUnreportedRequired(
  reading: PrStateReading,
  required: readonly string[],
): RequiredContextsReading {
  const reported = new Set(reading.namedChecks.map((check) => check.name));
  const notReported = [...new Set(required)].filter((name) => !reported.has(name));
  const namedChecks: readonly NamedCheck[] = [
    ...reading.namedChecks,
    ...notReported.map((name): NamedCheck => ({ name, bucket: 'pending' })),
  ];
  const count = (bucket: NamedCheck['bucket']): number =>
    namedChecks.filter((check) => check.bucket === bucket).length;
  return {
    notReported,
    reading: {
      ...reading,
      namedChecks,
      checks: {
        total: namedChecks.length,
        passed: count('passed'),
        failed: count('failed'),
        pending: count('pending'),
      },
    },
  };
}

interface ResolveInput {
  readonly reading: PrStateReading;
  readonly appSlug: string;
  readonly nowIso: string;
  /**
   * The caller gave a reason for a merge with no review AND the reading
   * shows a pull request nobody has reviewed or is reviewing
   * (`merge-no-review.ts`), so the unreviewed verdict may merge too.
   */
  readonly mayMergeUnreviewed: boolean;
  readonly fetchImpl: GithubApiFetch;
  readonly token: string;
  readonly target: RulesTarget;
}

/**
 * Whether the verdict is one the command may merge on, so that the required
 * contexts must be proved first: a settled verdict always, and the
 * unreviewed one when the caller has given its reason for no review.
 */
function mayMerge(state: PrVerdict['state'], mayMergeUnreviewed: boolean): boolean {
  return state === 'SETTLE-READY' || (mayMergeUnreviewed && state === 'SILENT-WAIT-NO-REVIEWER');
}

/**
 * The verdict as the core reads it; on a verdict of the merge bot's own
 * pull request that the command may merge on, the verdict recomputed with
 * every unreported required context pending. A failed rules read is
 * returned as the failure, which `merge.ts` types as a retryable reading
 * failure.
 */
export async function resolveVerdict(input: ResolveInput): Promise<Result<PrVerdict, Error>> {
  const verdict = computePrVerdict(input.reading, input.nowIso);
  if (
    !mayMerge(verdict.state, input.mayMergeUnreviewed) ||
    !isBotAuthored(input.reading.author, input.appSlug)
  ) {
    return ok(verdict);
  }
  const required = await readRequiredContexts(input.fetchImpl, input.token, input.target);
  if (!required.ok) {
    return required;
  }
  const proved = withUnreportedRequired(input.reading, required.value);
  if (proved.notReported.length === 0) {
    return ok(verdict);
  }
  const recomputed = computePrVerdict(proved.reading, input.nowIso);
  const note =
    `${proved.notReported.length} required context(s) the tip has not reported, pending by ` +
    `construction (${proved.notReported.join(', ')}); required contexts ${required.value.join(', ')}`;
  return ok({ state: recomputed.state, evidence: [...recomputed.evidence, note] });
}

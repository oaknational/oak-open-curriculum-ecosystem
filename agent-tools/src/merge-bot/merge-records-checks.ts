import { err, ok, type Result } from '@oaknational/result';

import type { NamedCheck, PrStateReading, PrVerdict } from '../pr-watch/state-types.js';
import { computePrVerdict } from '../pr-watch/states.js';
import { classifyChangedPaths, type ChangeClass } from './change-class.js';
import { listChangedPaths } from './merge-changed-files.js';
import { verdictMergesRecordsClass } from './merge-decision.js';
import { readRequiredContexts, type RulesTarget } from './merge-required-contexts.js';
import type { GithubApiFetch } from './mint-installation-token.js';

/**
 * "Checks green by name" for the records class. The verdict core reads the
 * checks the tip has REPORTED: it holds CHECKS-RUNNING on any pending check
 * run — and a vendor's review runs as a check run on the tip for the whole
 * round (`copilot-pull-request-reviewer` on 326's tip, 2026-10-10), so a
 * records-class pull request with the review requested at its ready-mark
 * would wait the whole round under the unqualified verdict, the cost the
 * owner's ruling of 2026-09-03 removes — and it reaches the reviewer-leg
 * states once every reported check is green, which a tip whose required
 * context has no check run yet also satisfies. The fold skill's full
 * condition is exactly the contexts the base branch's rules require, read
 * at run time, and no other name: on every verdict the records door opens
 * on, this module reads those contexts, sets aside every PENDING check the
 * rules do not require, reads every required context the tip has not
 * reported as pending, and recomputes the verdict over that reading before
 * the diff is classified. A FAILED check of any name still holds (a secret
 * scan or a dependency review is information the merge must not outrun),
 * and an unreported required context holds the pull request at
 * CHECKS-RUNNING — a wait state the poll continues on — whatever its class,
 * since the class is not read there. At SETTLE-READY the verdict alone
 * merges and the class is never read, but a GitHub App's pull request
 * proves its required contexts there too: the ladder settles on the checks
 * as reported, so a required context with no check run yet would otherwise
 * send the PUT into GitHub's own refusal (raised twice on pull request 358,
 * 2026-10-27). On every verdict a GitHub App's pull request could merge on,
 * then, the merge PUT is never sent before the contexts GitHub will demand
 * are green by name; a person's pull request is never merged by the bot and
 * reads none of this. The code class is never loosened: every live check
 * binds it as before. The reads here (the pull request's base, the branch's
 * rules, then the files only when the recomputed verdict leaves
 * CHECKS-RUNNING on a verdict the class decides) run once per poll at the
 * door.
 */

/**
 * The ruling of 2026-09-03 names the merge bot's OWN pull requests: a
 * colleague's is reviewed and never merged by the bot (pr-lifecycle, the
 * owner's word of 2026-08-03/04), and another GitHub App's is not the bot's
 * (pull request 358, 2026-10-27). `gh pr view` spells an App author `app/<slug>`.
 */
export function isBotAuthored(author: string, appSlug: string): boolean {
  return author === `app/${appSlug}`;
}

export interface NarrowedReading {
  readonly reading: PrStateReading;
  /** The pending, non-required checks set aside, by name. */
  readonly setAside: readonly string[];
  /** The required contexts the tip has not reported, read as pending, by name. */
  readonly notReported: readonly string[];
}

/**
 * The reading with pending non-required checks set aside and unreported
 * required contexts pending, each name once (two rulesets may require the
 * same context).
 */
export function narrowToRequired(
  reading: PrStateReading,
  required: readonly string[],
): NarrowedReading {
  const requiredSet = new Set(required);
  const kept = reading.namedChecks.filter(
    (check) => check.bucket !== 'pending' || requiredSet.has(check.name),
  );
  const reported = new Set(reading.namedChecks.map((check) => check.name));
  const notReported = [...requiredSet].filter((name) => !reported.has(name));
  const namedChecks: readonly NamedCheck[] = [
    ...kept,
    ...notReported.map((name): NamedCheck => ({ name, bucket: 'pending' })),
  ];
  const setAside = reading.namedChecks
    .filter((check) => check.bucket === 'pending' && !requiredSet.has(check.name))
    .map((check) => check.name);
  const count = (bucket: NamedCheck['bucket']): number =>
    namedChecks.filter((check) => check.bucket === bucket).length;
  return {
    setAside,
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

export interface ResolvedVerdict {
  readonly verdict: PrVerdict;
  readonly changeClass: ChangeClass | undefined;
}

interface ResolveInput {
  readonly reading: PrStateReading;
  readonly appSlug: string;
  readonly nowIso: string;
  readonly fetchImpl: GithubApiFetch;
  readonly token: string;
  readonly target: RulesTarget;
}

function withNote(verdict: PrVerdict, note: string): PrVerdict {
  return { state: verdict.state, evidence: [...verdict.evidence, note] };
}

/**
 * The verdicts on which a GitHub App's pull request proves its required
 * contexts before anything else: CHECKS-RUNNING (a pending check the rules
 * do not require may be set aside) and every verdict the records class
 * merges on, SETTLE-READY among them (the verdict alone merges there, on
 * the checks as reported).
 */
function doorProvesOn(state: PrVerdict['state']): boolean {
  return state === 'CHECKS-RUNNING' || verdictMergesRecordsClass(state);
}

/** The evidence line naming what the narrowing did, and the contexts the rules require. */
function narrowingNote(narrowed: NarrowedReading, required: readonly string[]): string {
  const setAside =
    narrowed.setAside.length === 0
      ? []
      : [
          `${narrowed.setAside.length} pending check(s) the base branch's rules do not require ` +
            `set aside (${narrowed.setAside.join(', ')})`,
        ];
  const notReported =
    narrowed.notReported.length === 0
      ? []
      : [
          `${narrowed.notReported.length} required context(s) the tip has not reported, ` +
            `pending by construction (${narrowed.notReported.join(', ')})`,
        ];
  return `records-class: ${[...setAside, ...notReported].join('; ')}; required contexts ${required.join(', ')}`;
}

/**
 * The verdict recomputed over the required contexts when the rules name at
 * least one and the narrowing changes the reading; otherwise the verdict as
 * read. Zero required contexts narrow nothing: an unprotected base never
 * reads as "nothing binds" (every pending check would be set aside).
 */
async function narrowedVerdict(
  input: ResolveInput,
  verdict: PrVerdict,
): Promise<Result<PrVerdict, Error>> {
  const required = await readRequiredContexts(input.fetchImpl, input.token, input.target);
  if (!required.ok) {
    return required;
  }
  const narrowed = narrowToRequired(input.reading, required.value);
  const unchanged = narrowed.setAside.length === 0 && narrowed.notReported.length === 0;
  if (required.value.length === 0 || unchanged) {
    return ok(verdict);
  }
  const recomputed = computePrVerdict(narrowed.reading, input.nowIso);
  return ok(withNote(recomputed, narrowingNote(narrowed, required.value)));
}

/**
 * A read the door needs failed. At CHECKS-RUNNING the verdict as read keeps
 * the poll going — a wait state, read again next poll — with the reason in
 * its evidence so a persistent failure stays visible; on any other verdict
 * the verdict as read would end the poll with a refusal naming the wrong
 * cause, so the failure itself is returned and `merge.ts` types it as a
 * retryable reading failure, the same class as a failed PR-state read.
 */
function doorReadFailed(verdict: PrVerdict, error: Error): Result<ResolvedVerdict, Error> {
  if (verdict.state !== 'CHECKS-RUNNING') {
    return err(error);
  }
  return ok({
    verdict: withNote(verdict, `records-class narrowing unavailable this poll: ${error.message}`),
    changeClass: undefined,
  });
}

/**
 * At the door: the rules first (two cheap reads) and the verdict recomputed
 * over them. A recomputed CHECKS-RUNNING is returned for any class, the
 * files unread — a code-class pull request waiting on its own required
 * checks pays no files read per poll, and a pull request whose required
 * context has not reported waits there whatever its diff. A SETTLE-READY
 * reading that proved its contexts is returned as read, the files unread:
 * the verdict alone merges there. Otherwise the files are read and
 * classified: a records diff takes the recomputed verdict; a code diff
 * keeps the verdict as read, every live check binding it.
 */
async function resolveAtTheDoor(
  input: ResolveInput,
  verdict: PrVerdict,
): Promise<Result<ResolvedVerdict, Error>> {
  const narrowed = await narrowedVerdict(input, verdict);
  if (!narrowed.ok) {
    return doorReadFailed(verdict, narrowed.error);
  }
  if (narrowed.value.state === 'CHECKS-RUNNING' || verdict.state === 'SETTLE-READY') {
    return ok({ verdict: narrowed.value, changeClass: undefined });
  }
  const paths = await listChangedPaths(input.fetchImpl, input.token, input.target);
  if (!paths.ok) {
    return doorReadFailed(verdict, paths.error);
  }
  const changeClass = classifyChangedPaths(paths.value);
  return ok(
    changeClass.kind === 'records'
      ? { verdict: narrowed.value, changeClass }
      : { verdict, changeClass },
  );
}

/**
 * The verdict and the class together: the verdict as the core reads it on
 * every verdict the door does not touch; at the door, for a GitHub App's
 * pull request, the verdict recomputed over the required contexts and the
 * class read from the diff where it decides; for a person's pull request
 * nothing is read, and where the class would have decided the verdict says
 * why the door stayed closed.
 */
export async function resolveVerdict(input: ResolveInput): Promise<Result<ResolvedVerdict, Error>> {
  const verdict = computePrVerdict(input.reading, input.nowIso);
  if (!doorProvesOn(verdict.state)) {
    return ok({ verdict, changeClass: undefined });
  }
  if (!isBotAuthored(input.reading.author, input.appSlug)) {
    const note =
      `records-class door closed: the author ${input.reading.author} is not the merge bot app/${input.appSlug} ` +
      "(the ruling of 2026-09-03 names the bot's own pull requests; any other author's is reviewed, never merged by the bot)";
    return ok({
      verdict: verdict.state === 'SETTLE-READY' ? verdict : withNote(verdict, note),
      changeClass: undefined,
    });
  }
  return resolveAtTheDoor(input, verdict);
}

import { existsSync, readFileSync } from 'node:fs';

import { countRebudgets } from './budget.js';
import type { CostReport } from './cost.js';
import { currentBranch, isSyncPush } from './git.js';
import { currentRepo, openPullRequestFor } from './harvest.js';
import { priceForGate } from './price.js';
import { runSurvey } from './survey.js';
import { parseArgs, selectors, USAGE, type ParsedArgs } from './args.js';

/**
 * `review-cost gate` — the pre-push guard: the review loop's cost against the
 * budget the pull request declares. Exit 0 within budget, warning or
 * converging. Exhausted, the push is HELD (exit 3) until the seat has recorded
 * its decision as one line in the local rebudget note, one line per push past
 * the budget; with the line present the same push passes. The hold runs before
 * the long check, costs seconds, and is lifted by the seat alone: never the
 * owner, never a comment, never another push (the owner, 2026-10-24; PDR-140's
 * amendment of that date). Exit 1 on an operational failure; exit 2 on usage. `--branch` resolves the open
 * pull request of the current branch and passes silently when there is none
 * (the first push opens it).
 */

export interface ReviewCostCliInput {
  readonly args: readonly string[];
  readonly stdout?: Pick<NodeJS.WriteStream, 'write'>;
  readonly stderr?: Pick<NodeJS.WriteStream, 'write'>;
}

function resolveTarget(parsed: ParsedArgs): { number: number; repo: string } | null {
  const repo = parsed.repo ?? currentRepo(parsed.ghPath);
  if (parsed.pr !== undefined) {
    return { number: parsed.pr, repo };
  }
  const number = openPullRequestFor(currentBranch(), repo, parsed.ghPath);
  return number === null ? null : { number, repo };
}

export interface PushedRef {
  readonly branch: string;
  readonly localSha: string;
  /** The head the remote holds; undefined when the push creates the branch. */
  readonly remoteSha: string | undefined;
}

const ALL_ZERO = /^0+$/u;

// The hook's ref lines: `<local_ref> <local_sha> <remote_ref> <remote_sha>`; the remote
// ref names the branch that receives the push; a delete has an all-zero local sha and a
// branch creation an all-zero remote sha.
export function parsePushedRefs(content: string): PushedRef[] {
  return content
    .split('\n')
    .map((line) => line.trim().split(/\s+/u))
    .filter((fields) => fields.length === 4 && !ALL_ZERO.test(fields[1] ?? ''))
    .filter((fields) => (fields[2] ?? '').startsWith('refs/heads/'))
    .map((fields) => ({
      branch: (fields[2] ?? '').slice('refs/heads/'.length),
      localSha: fields[1] ?? '',
      remoteSha: ALL_ZERO.test(fields[3] ?? '') ? undefined : fields[3],
    }));
}

const SYNC_PUSH_EVIDENCE =
  "sync push: one merge of the pull request's base over the remote head, its tree exactly git's automatic merge — outside the settlement budget (PDR-140 clause 4), passes whatever the verdict";

/** The local, untracked note of rebudget decisions: `<pull request> — <date> — <reason>` per line. */
const REBUDGET_NOTE = '.agent/state/collaboration/review-rebudgets.md';

function heldEvidence(needed: number, recorded: number): string {
  return (
    `HELD: this push is number ${String(needed)} past the budget and ${REBUDGET_NOTE} records ` +
    `${String(recorded)} decision line(s) for this pull request. Decide whether another review round ` +
    'is worth its cost; if it is, write the decision as one line, `<pull request> — <date> — <reason>`, ' +
    'and run the same push again (this hold runs before the check; seconds). The decision is the ' +
    "seat's: never the owner's, never a comment, never another push."
  );
}

/**
 * The gate's exit for one priced pull request: within budget passes; a sync push
 * passes an exhausted loop; otherwise an exhausted loop passes only when the note
 * records one decision for every push past the budget, this one included.
 */
export function gateExit(
  result: CostReport,
  syncPush: boolean,
  rebudgets: number,
): { code: number; evidence: readonly string[] } {
  if (result.verdict !== 'exhausted') {
    return { code: 0, evidence: result.evidence };
  }
  if (syncPush) {
    return { code: 0, evidence: [...result.evidence, SYNC_PUSH_EVIDENCE] };
  }
  const needed = result.pushesPastBudget + 1;
  if (rebudgets >= needed) {
    return {
      code: 0,
      evidence: [
        ...result.evidence,
        `rebudget decision recorded: ${String(rebudgets)} line(s) in ${REBUDGET_NOTE} for ${String(needed)} push(es) past the budget`,
      ],
    };
  }
  return { code: 3, evidence: [...result.evidence, heldEvidence(needed, rebudgets)] };
}

// The note is instance-tier state: absent until the first decision, never tracked.
function recordedRebudgets(pullRequest: number): number {
  return existsSync(REBUDGET_NOTE)
    ? countRebudgets(readFileSync(REBUDGET_NOTE, 'utf8'), pullRequest)
    : 0;
}

function render(
  target: { number: number },
  result: CostReport,
  evidence: readonly string[],
  json: boolean,
): string {
  if (json) {
    return `${JSON.stringify({ pr: target.number, ...result, evidence })}\n`;
  }
  const lines = evidence.map((line) => `  ${line}`).join('\n');
  return `review-cost gate: PR #${String(target.number)} ${result.verdict}\n${lines}\n`;
}

// A push that creates the branch is never a sync; one that moves it is a sync when the
// pushed head is one merge of the pull request's base over the head the remote holds.
function pushIsSync(ref: PushedRef | undefined, baseRefOid: string | undefined): boolean {
  return (
    ref !== undefined &&
    ref.remoteSha !== undefined &&
    baseRefOid !== undefined &&
    isSyncPush(ref.remoteSha, ref.localSha, baseRefOid)
  );
}

function gateOne(
  target: { number: number; repo: string },
  parsed: ParsedArgs,
  stdout: Pick<NodeJS.WriteStream, 'write'>,
  pushed?: PushedRef,
): number {
  const priced = priceForGate({
    number: target.number,
    repo: target.repo,
    expectedReviewers: parsed.expect,
    ghPath: parsed.ghPath,
  });
  const exit = gateExit(
    priced.report,
    pushIsSync(pushed, priced.baseRefOid),
    recordedRebudgets(target.number),
  );
  stdout.write(render(target, priced.report, exit.evidence, parsed.json));
  return exit.code;
}

function gate(parsed: ParsedArgs, stdout: Pick<NodeJS.WriteStream, 'write'>): number {
  if (parsed.refsFile !== undefined) {
    const repo = parsed.repo ?? currentRepo(parsed.ghPath);
    const codes = parsePushedRefs(readFileSync(parsed.refsFile, 'utf8')).map((ref) => {
      const number = openPullRequestFor(ref.branch, repo, parsed.ghPath);
      if (number === null) {
        stdout.write(
          `review-cost gate: ${ref.branch} has no open pull request — nothing to price\n`,
        );
        return 0;
      }
      return gateOne({ number, repo }, parsed, stdout, ref);
    });
    return codes.includes(3) ? 3 : 0;
  }
  const target = resolveTarget(parsed);
  if (target === null) {
    stdout.write('review-cost gate: no open pull request for this branch — nothing to price\n');
    return 0;
  }
  return gateOne(target, parsed, stdout);
}

function usageError(parsed: ParsedArgs): string | undefined {
  if (parsed.error !== undefined) {
    return parsed.error;
  }
  if (parsed.command === 'survey') {
    return parsed.since === undefined || selectors(parsed) > 0
      ? 'survey takes --since <YYYY-MM-DD> and no selector'
      : undefined;
  }
  if (parsed.since !== undefined) {
    return '--since is a survey flag; the gate takes exactly one selector';
  }
  return selectors(parsed) === 1 ? undefined : 'pass exactly one of --pr, --branch, --refs-file';
}

function guarded(
  parsed: ParsedArgs,
  stdout: Pick<NodeJS.WriteStream, 'write'>,
  stderr: Pick<NodeJS.WriteStream, 'write'>,
): number {
  try {
    return parsed.command === 'survey'
      ? runSurvey({
          since: parsed.since ?? '',
          repo: parsed.repo,
          expectedReviewers: parsed.expect,
          ghPath: parsed.ghPath,
          json: parsed.json,
          stdout,
        })
      : gate(parsed, stdout);
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : String(cause);
    stderr.write(`review-cost ${parsed.command}: operational failure — ${message}\n`);
    return 1;
  }
}

export function runReviewCostCli(input: ReviewCostCliInput): number {
  const stdout = input.stdout ?? process.stdout;
  const stderr = input.stderr ?? process.stderr;
  const parsed = parseArgs(input.args);
  if (parsed.help) {
    stdout.write(`${USAGE}\n`);
    return 0;
  }
  const error = usageError(parsed);
  if (error !== undefined) {
    stderr.write(`review-cost: ${error}\n${USAGE}\n`);
    return 2;
  }
  return guarded(parsed, stdout, stderr);
}

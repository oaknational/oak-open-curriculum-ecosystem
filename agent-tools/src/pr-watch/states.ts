import { reviewerLegVerdict } from './settlement.js';
import type { PrStateReading, PrVerdict } from './state-types.js';

/**
 * The D1 verdict core for `agent-tools pr state`: resolve one compound
 * {@link PrStateReading} to exactly one verdict from the CLOSED verdict set
 * (`state-types.ts`). Pure and total — no IO; the gh seam lives in
 * `state-gh.ts`, the per-reviewer leg machine in `reviewer-legs.ts`, the
 * settlement half in `settlement.ts`. The set and precedence execute the
 * pr-lifecycle SKILL's review-round state machine (the SKILL stays
 * canonical); per-check verdicts travel BY NAME, never positionally (the
 * #437 cure — fixtures in `states.unit.test.ts`).
 *
 * Four states extend the plan's 11-state enumeration, each typed honesty
 * over a lie: `CLOSED` (a closed-unmerged PR gets a refusal, never a
 * mis-mapped healthy verdict), `SETTLING-QUIET-WINDOW` (all legs settled but
 * the more-than-10-minute async-lag window since the latest tip-bound review
 * has not elapsed — SKILL item 4; declaring SETTLE-READY inside the window
 * recreates the bot-round-still-composing hole),
 * `SILENT-WAIT-RUNS-UNREADABLE` (an unreadable or truncated run surface
 * never asserts deadness), and `BEHIND-BASE` (a stale base never reads
 * settled — the founding BEHIND-stall class).
 */

function failedCheckNames(reading: PrStateReading): string[] {
  return reading.namedChecks
    .filter((check) => check.bucket === 'failed')
    .map((check) => check.name);
}

type VerdictRule = (reading: PrStateReading) => PrVerdict | undefined;

const terminalRules: readonly VerdictRule[] = [
  (r) => (r.state === 'MERGED' ? { state: 'MERGED', evidence: [] } : undefined),
  (r) =>
    r.state === 'CLOSED'
      ? { state: 'CLOSED', evidence: ['closed without merging — no healthy verdict exists'] }
      : undefined,
  (r) =>
    r.mergeable === 'CONFLICTING' || r.mergeStateStatus === 'DIRTY'
      ? {
          state: 'CONFLICT-DIRTY',
          evidence: [`mergeable=${r.mergeable} mergeStateStatus=${r.mergeStateStatus}`],
        }
      : undefined,
];

const checksAndThreadsRules: readonly VerdictRule[] = [
  // A draft cannot merge via the sanctioned landing path whatever the legs
  // say (the pr-throughput invariant) — typed refusal before any settlement
  // read; unlike review-gate BLOCKED (ratified landable), draftness is a
  // REAL merge blocker at the REST endpoint.
  (r) =>
    r.isDraft
      ? {
          state: 'DRAFT',
          evidence: [
            'draft PR — the sanctioned landing path cannot merge a draft; mark ready for review first',
          ],
        }
      : undefined,
  (r) =>
    r.autoMergeArmed && r.checks.failed > 0
      ? {
          state: 'ARMED-BEHIND-RED',
          evidence: [
            'auto-merge is ARMED behind red — progresses nothing, alerts nobody',
            ...failedCheckNames(r).map((name) => `failed check: ${name}`),
          ],
        }
      : undefined,
  (r) =>
    r.checks.failed > 0
      ? {
          state: 'CHECKS-RED',
          evidence: failedCheckNames(r).map((name) => `failed check: ${name}`),
        }
      : undefined,
  // Zero checks are never vacuously green: absence of evidence is not a pass.
  (r) =>
    r.checks.pending > 0 || r.checks.passed === 0
      ? {
          state: 'CHECKS-RUNNING',
          evidence: [
            `checks ${r.checks.passed}/${r.checks.total} passed, none failed`,
            ...(r.checks.total === 0
              ? ['no checks configured or reported yet — nothing will transition without one']
              : []),
          ],
        }
      : undefined,
  (r) =>
    r.reviewThreads.unresolved > 0
      ? {
          state: 'THREADS-OPEN',
          evidence: [
            `${r.reviewThreads.unresolved}/${r.reviewThreads.total} review threads unresolved`,
          ],
        }
      : undefined,
  // The founding BEHIND-stall class: a BEHIND base blocks the merge whatever
  // the legs say, and an armed intent behind it stalls silently. Never a
  // settled verdict here — fold/update the branch first.
  (r) =>
    r.mergeStateStatus === 'BEHIND'
      ? {
          state: 'BEHIND-BASE',
          evidence: [
            'base branch has moved (mergeStateStatus=BEHIND) — update/fold before arming; an armed intent behind a moved base stalls silently',
          ],
        }
      : undefined,
];

/**
 * Resolve the compound reading to its single verdict, most-blocking first:
 * terminal states, then conflict, then the armed/checks/threads ladder, then
 * the per-reviewer legs, the quiet window, and settlement.
 *
 * @param reading - the compound reading from the gh seam
 * @param nowIso - injected clock; the timeout and quiet-window legs are
 *   time-bound (SKILL items 3–4)
 */
export function computePrVerdict(reading: PrStateReading, nowIso: string): PrVerdict {
  for (const rule of [...terminalRules, ...checksAndThreadsRules]) {
    const verdict = rule(reading);
    if (verdict !== undefined) {
      return verdict;
    }
  }
  return reviewerLegVerdict(reading, nowIso);
}

---
pdr_kind: governance
---

# PDR-131: Merge concurrency is free — quality binds at settled-READY

**Status**: Accepted (owner-ratified 2026-07-20; proposal framing the owner's
own: "2.5–3 hours was not a measure of how long it should take, it was a
measure of the broken merge approach we currently use").
**Date**: 2026-07-20

## Context

The 2026-07-20 net-to-zero drive ran two merge mechanisms over the same PR
population at the same quality bar (settled review round + all required checks
green):

- **Serial slot mechanics**: Director-granted one-at-a-time slots, per-slot
  update-branch for strict currency, post-update review round, bare merge,
  ~5-minute release-bump gaps. Real landings cost ~15–25 minutes each; an
  11-PR tail priced at 2.5–3 hours.
- **Concurrent auto-merge** (a natural experiment: queue-era armed intents
  fired on merge-queue-rule removal): the same eleven settled+green PRs landed
  in ~6 minutes. Outcome: main green, Sonar quality gate green on all four
  conditions, releases shipping, every Phase-8 post-merge harvest clean, zero
  breakage.

Decomposing what serialisation defended: (1) the strict-currency re-BEHIND
treadmill — a coping strategy for a ruleset policy, not a quality mechanism;
(2) the composing-review-round race — actually defended by the settled-round
predicate before merge-eligibility and the Phase-8 harvest after; (3)
cross-PR semantic drift — the honest residual, defended by the recovery stack
(test-merge CI, main's own CI, Phase-8, fix-forward, tripwire tests), whose
worked instance that day was a catch, not a miss.

## Decision

1. **Quality binds at settled-READY, not at the merge moment.** A PR is
   merge-eligible when its review round is SETTLED per the pr-lifecycle
   state machine — a finding count of ZERO on both the thread surface and
   the review-body (suppressed) surface, where a disposition-with-resolution
   is how a finding reaches zero, never a substitute for reaching it — and
   every required check is green. Merge concurrency between eligible PRs is free.
2. **The no-auto-merge ruling narrows** (it was born when arming happened at
   PR-open, pre-settlement): arming auto-merge is permitted exactly and only
   **at settled-READY under a Director grant**. Arming before settlement
   remains forbidden.
3. **Serial slot machinery retires as default mechanics** (one-at-a-time
   grants, bump-gap waits). The Director grants merge-eligibility (the
   predicate verdict), never queue position. Concurrent landings are normal.
4. **Phase-8 post-merge harvests stay mandatory** per landing; the
   cross-PR-drift recovery stack is the named residual-risk defence.
5. **The strict-currency ruleset policy is a named cost-driver owned by the
   owner** — keep (auto-merge waits for currency at arm time) or drop (the
   treadmill class disappears; the §Context residual is the accepted trade)
   is a deliberate owner setting, never an agent workaround surface.
6. **Rule-removal disarms first**: armed merge intents survive queue/rule
   removal and fire silently — captured as a failure-mode on the comms stream
   and in the source proposal the day the class was discovered. Before
   removing any queue or protection rule, disarm every armed intent.

## Consequences

- The `pr-lifecycle` SKILL's state-machine items 4–5 and Phase 7's merge
  boundary take the arming clause amendment (arm-at-settled-READY-under-grant
  replaces the flat auto-merge prohibition); the drive-rulings register
  updates at the next doctrine writer's touch. Source evidence: the host
  estate's merge-concurrency doctrine proposal report (2026-07-20, the
  natural-experiment write-up with vendor citations); the host-side changelog
  and the drive's PR trail carry its path — a host-internal report path does
  not ride in portable Core (`practice-core-portability`).
- Director seat economics change: routing effort moves from slot sequencing
  to predicate verification and Phase-8 assignment.
- **Expected observable effect + falsifier** (the PDR-130 fast-lane
  obligation): grant-to-merge latency for settled PRs falls from the serial
  era's slot-queue scale to arm-time-bounded; the host estate's throughput
  register carries the concrete prediction (p50 landing latency under the
  target within one register-month) with its falsifier attached — the
  register's review is this record's falsification window.
- The 2026-07-20 drive's serial-era latencies stand in the record as the
  measured cost of the retired model.

## Amendment Log

- **2026-09-09 — the landing slot under a strict-currency ruleset is decision
  5's cost, not decision 3's machinery.** Where the owner keeps the
  strict-currency policy (decision 5), every merge knocks every other open PR
  BEHIND and each must sync and push again, and every push opens a review
  round; the `pr-lifecycle` skill's Phase 7 landing slot (one PR syncs at the
  slot word, the rest gather reviews and wait) is the order that policy's
  cost imposes, not a return of one-at-a-time grants: the Director still
  grants eligibility, never position, and the slot lapses the day the policy
  is dropped. Measured on the fork's default branch, 2026-09-08/09: eleven
  and then seven serial landings under `strict_required_status_checks_policy`,
  each landing re-syncing the next. A reviewer read the skill's slot clause
  and decision 3 as a contradiction; this entry names the condition that
  reconciles them.

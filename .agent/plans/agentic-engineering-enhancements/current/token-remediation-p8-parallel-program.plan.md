---
name: "Token / Remediation / P8 / Parallel Program 2026-05-14"
overview: >
  Cross-thread, multi-session program-plan artefact carrying the
  owner-stated four-step sequence: finish token work, run the
  singleton-lane remediation, return P8 to acceptance, then run
  cost-of-collaboration residual and graph-foundations in parallel.
  This file is the source of truth for *sequence-execution-state*;
  per-step controlling plans remain the source of truth for
  *work-shape-per-step*. Touched thread records and repo-continuity
  point here for sequence routing.
todos:
  - id: step-1-token-work
    content: "Step 1 — finish token-related work. Owning plan: fitness-token-measurements-and-frontmatter-mandation.plan.md. Inclusive boundary: WS2 (`ws2-token-frontmatter`) lands; remaining workstreams (frontmatter sweep, manifest coverage) deferred into step 4 parallel-pair if owner directs, otherwise closed at WS2 boundary."
    status: completed
  - id: step-2-singleton-lane-remediation
    content: "Step 2 — run the singleton-lane remediation. Owning plan: start-right-team-singleton-lane-remediation.plan.md. Inclusive boundary: plan promotes to DECISION-COMPLETE then WS0–WS7 execute and plan archives."
    status: pending
    depends_on: [step-1-token-work]
  - id: step-3-p8-to-acceptance
    content: "Step 3 — return P8 to acceptance. Owning plan: cost-of-collaboration.plan.md `ws-p8-collaboration-tui`. Inclusive boundary: workstream status `completed` AND all P8-A1 through P8-A4 acceptance criteria proven."
    status: pending
    depends_on: [step-2-singleton-lane-remediation]
  - id: step-4-parallel-cost-of-collab-plus-graph
    content: "Step 4 — run cost-of-collaboration residual and graph-foundations in parallel. Cost-of-collab lane: P6 + P7 + ws-subsumed-residual in cost-of-collaboration.plan.md. Graph lane: open WSes on connecting-oak-resources thread (slice plans under current/). Coordination via start-right-team when both lanes touch the same files."
    status: pending
    depends_on: [step-3-p8-to-acceptance]
isProject: true
---

# Token / Remediation / P8 / Parallel Program 2026-05-14

**Last Updated**: 2026-05-17
**Status**: SEQUENCE-LIVE — Step 1 closed at WS2 boundary. **Interrupt
RESOLVED**: `pnpm check` is fully green at commit `ee41cd49` (100/100
turbo tasks successful). The upstream Oak API adoption work (originally
landed at `da2a4aac`) plus the gate-green cleanup (six commits this
session, see §Current Snapshot) closes the interrupt that began
2026-05-14. Step 2 (singleton-lane remediation) opens in the next
session.
**Collection**: `agentic-engineering-enhancements/current` (program
spans two threads — see §Threads Touched).
**Threads Touched**:
[`agentic-engineering-enhancements`](../../../memory/operational/threads/agentic-engineering-enhancements.next-session.md)
(steps 1, 2, 3, and step-4 cost-of-collab lane);
[`connecting-oak-resources`](../../../memory/operational/threads/connecting-oak-resources.next-session.md)
(step-4 graph-foundations lane).
**Authoring agent**: Riverine Swimming Hull / `claude` /
`claude-opus-4-7-1m` / `304dde`.

## Current Snapshot

(updated by every session that touches the program)

- **Current step**: Step 1 — finish token-related work — **CLOSED at
  WS2 boundary**. Interrupt 2026-05-14 #2 (upstream API adoption +
  gate-green cleanup) is **RESOLVED** at `ee41cd49` (2026-05-17 session).
  Step 2 (singleton-lane remediation) opens next session.
- **This session (2026-05-17) brought `pnpm check` green** through six
  commits. Headline: each unmasked the next when its upstream gate
  cleared.
    1. `9f04d9af` — `chore(knip): include agent-tools/scripts in
       entry list`. Aligned the agent-tools knip workspace config
       with the canonical pattern used by other workspaces;
       reduced knip findings from 56+29 to 40+28.
    2. `b3ef1cbb` — `chore(agent-tools): slim practice-fitness
       barrel and demote internal-only exports`. Removed dead
       re-exports and demoted symbols only used inside their own
       module.
    3. `4c30ffee` — `chore(agent-tools): slim collaboration-state
       barrel and demote internal-only exports`. Same pattern;
       brought knip to zero unused findings.
    4. `0c083409` — `docs(patterns): add
       test-coverage-review-lens`. Captured the reusable review
       methodology that surfaced the next commit's deletions.
    5. `96fd3e61` — `test(mcp): delete misclassified e2e files
       duplicating unit and integration coverage`. Deleted two
       MCP e2e files (18 tests) whose every claim was already
       proved at the right level (curriculum-model-data.unit.test,
       agent-support-tool-metadata.unit.test,
       conditional-clerk-middleware.unit.test +
       .integration.test, register-resources.integration.test).
       Removed the test-design contribution to the cross-test
       parallel-load flake observed earlier.
    6. `ee41cd49` — `refactor(graph-core,agent-tools): break two
       circular type imports surfaced by depcruise`. Two
       pre-existing latent cycles became visible once the gates
       above turned green:
       `graph-core/jsonld/processor ↔ remote-context` (broken via
       new `processor-types.ts`) and
       `agent-tools/tui/snapshot ↔ operator-value` (broken via
       new `tui/entry-types.ts`). No behavioural change.
- **Final state**: `pnpm check` exits 0; 100/100 turbo tasks
  successful; agent-tools type-check + 419 tests green; graph-core
  type-check + 40 tests green; MCP e2e suite 155/155 green
  consistently in isolation and under full-`pnpm check` parallel load.
- **Step age** (sessions since last advance): 0 — interrupt
  resolved, Step 2 opens next session.

## Why This Artefact Exists

The Practice has thread records (continuity-per-thread), plan files
(work-shape-per-plan), and `repo-continuity.md` (live-state-per-repo).
It does not have a canonical artefact for *multi-session,
cross-thread, ordered programs*. The owner-stated four-step sequence
is exactly that shape: three steps on
`agentic-engineering-enhancements`, one parallel step crossing into
`connecting-oak-resources`. Without a program-level artefact carrying
sequence-execution-state, prior multi-session programs in this repo
have decayed via documented failure modes (fresh-context magnet,
step-bleed, next-step decay, ambiguous boundary, etc.). This file is
the structural cure.

This is the **first observed instance** of a cross-thread program
artefact in this repo. By the second-instance-trigger doctrine, the
artefact shape itself does not graduate to a PDR or rule yet —
napkin entry [`2026-05-14 — Cross-thread program artefact
shape`](../../../memory/active/napkin.md) holds the second-instance
trigger.

## The Four Steps

### Step 1 — Finish Token-Related Work

- **Owning plan**:
  [`fitness-token-measurements-and-frontmatter-mandation.plan.md`](fitness-token-measurements-and-frontmatter-mandation.plan.md).
- **Inclusive boundary**: WS2 (`ws2-token-frontmatter`) lands and is
  validated. The remaining workstreams in that plan (frontmatter
  sweep, manifest coverage) are deferred and reconsidered at step
  transition — they may fold into step 4 cost-of-collab residual if
  owner directs; otherwise closed at WS2 boundary.
- **Acceptance verification (runnable)**:

  ```bash
  grep -A1 "ws2-token-frontmatter" \
    .agent/plans/agentic-engineering-enhancements/current/fitness-token-measurements-and-frontmatter-mandation.plan.md \
    | grep -m1 "status"
  # Expect: status: completed
  ```

- **Intermediate value at step-1 close**: token-frontmatter semantics
  available for fitness reporting; subsequent steps can rely on
  frontmatter-driven token estimation.

### Step 2 — Run The Singleton-Lane Remediation

- **Owning plan**:
  [`start-right-team-singleton-lane-remediation.plan.md`](../../agent-tooling/current/start-right-team-singleton-lane-remediation.plan.md).
- **Inclusive boundary**: plan promotes from FIRST-PASS /
  NOT-DECISION-COMPLETE to DECISION-COMPLETE; WS0 baseline
  disposition runs; WS0–WS7 execute; plan archives to
  `archive/completed/`. Decision-completeness gate is owner-reviewed
  per the reviewer roster the plan names.
- **Acceptance verification (runnable)**:

  ```bash
  test -f .agent/plans/agent-tooling/archive/completed/start-right-team-singleton-lane-remediation.plan.md \
    && echo "PASS" || echo "FAIL"
  ```

- **Intermediate value at step-2 close**: the documented N=7 WS1
  self-organisation failure mode is structurally cured;
  multi-agent windows on singleton lanes are safe to attempt.

### Step 3 — Return P8 To Acceptance

- **Owning plan**:
  [`cost-of-collaboration.plan.md`](../../agent-tooling/current/cost-of-collaboration.plan.md)
  workstream `ws-p8-collaboration-tui`.
- **Inclusive boundary**: workstream status `completed` AND **all**
  named acceptance criteria (P8-A1 through P8-A4 as defined in the
  controlling plan) proven with named evidence (commit SHAs and/or
  test outputs).
- **Acceptance verification (runnable)**:

  ```bash
  grep -A1 "ws-p8-collaboration-tui" \
    .agent/plans/agent-tooling/current/cost-of-collaboration.plan.md \
    | grep -m1 "status"
  # Expect: status: completed
  # Plus: the four P8-A1..P8-A4 acceptance bars resolved in the plan body.
  ```

- **Intermediate value at step-3 close**: operator-visible live TUI
  for collaboration; the human-readable proof surface owner has
  named mandatory.

### Step 4 — Parallel: Cost-Of-Collab Residual + Graph Foundations

This step has **two lanes** running in parallel and explicit
coordination protocol.

#### Lane 4A — Cost-Of-Collaboration Residual

- **Owning plan**:
  [`cost-of-collaboration.plan.md`](../../agent-tooling/current/cost-of-collaboration.plan.md)
  — workstreams `ws-p6-coordination-artefact-isolation`,
  `ws-p7-async-sync-mode-awareness`, and `ws-subsumed-residual`.
- **Inclusive boundary**: all three workstreams `status: completed`
  in the controlling plan.

#### Lane 4B — Graph Foundations

- **Owning thread**:
  [`connecting-oak-resources`](../../../memory/operational/threads/connecting-oak-resources.next-session.md).
- **Owning plans**: the current `connecting-oak-resources/current/`
  slice plans (enumerated at lane-open time; the thread record's
  §"First Task of Next Session" names the active Increment).
- **Inclusive boundary**: TBD at lane-open — owner refines based on
  the connecting-oak-resources thread's state at the moment step 4
  opens (likely the open slice plans complete and merge).

#### Lane Coordination Protocol

- When both lanes are simultaneously active and touch the same
  file family, use `start-right-team` per the singleton-lane
  remediation plan's WS protocol (which is what step 2 lands).
- Cross-lane comms: any agent on either lane that observes a
  cross-lane signal (e.g., shared infrastructure touched, common
  reviewer required) posts a comms-event to the other lane's
  current agent.
- **Hard constraint**: lane 4B does not open implementation work
  until step 3 (P8) is at acceptance. Step 4's parallelism is a
  *Practice test* of multi-lane execution under coordinated
  protocol — not a relaxation of step ordering.

## Advancement Rule

Step N+1 does **not** open until step N has named-acceptance
evidence (commit SHAs cited in §Current Snapshot). The runnable
acceptance verifications under each step are the gate. A session
that *believes* a step has advanced but has not run the
acceptance-verification command has not advanced the step.

## Owner-Redirection Clause

The owner is the sole authority for sequence changes. An agent
working on step N may not reshape the program from inside a session
based on:

- mid-session owner direction that is *session-scoped* per the
  existing memory entry (Owner-direction scope is session-scoped
  unless explicitly standing);
- new evidence below the §"Evidence Threshold For Reshape" bar;
- "this is taking too long" pressure.

An agent who *believes* the program should reshape MUST surface to
owner with: (i) the concrete evidence, (ii) the proposed reshape,
(iii) the cost of continuing the current sequence. Owner decides.

## Evidence Threshold For Reshape

A reshape-to-owner is justified when:

- a step's owning plan reaches a structural blocker that the plan's
  own §Risk Assessment did not anticipate;
- a step's acceptance criterion is shown to be unverifiable as
  written (the verification command does not actually verify);
- new substance emerges that would change the *order* of remaining
  steps (e.g., step 4's graph-foundations lane discovers a
  prerequisite that retroactively blocks step 3 acceptance);
- a step's interrupt budget is exceeded.

Below threshold, agents continue the current step.

## Interrupt Log

Side trips that are not part of the program sequence go here with
**explicit budget**. A side trip over budget is surfaced to owner
for promotion (becomes a new step) or demotion (deferred to a later
program).

| Date | Interrupt | Owning agent | Budget | Status | Resume note |
|---|---|---|---|---|---|
| 2026-05-14 | Graduation-triage execution + metacog correction + PDR-060 landing | Riverine Swimming Hull | 1 session | resolved this session | program authoring is the resume note |
| 2026-05-14 | Upstream Oak API schema adoption (programme-variant filters + multi-unit lesson shape; codegen drift broke curriculum-sdk + search-cli `pnpm check`) | Highland Circling Plume surfaced; Luminous Waxing Twilight executed and surfaced gate-state error; Solar Orbiting Asteroid brought gate green | budget originally 1 session; expanded — gate-green was binding | resolved 2026-05-17 at `ee41cd49` | Adoption work landed at `da2a4aac` (commit-time gate-red was the foundational-rule violation owner corrected 2026-05-15). 2026-05-17 session closed the gate via six commits in sequence (see §Current Snapshot for the commit chain): knip config gap → barrel-slim → barrel-slim → review-lens pattern → e2e file deletions → cycle-break. Each commit unmasked the next downstream gate as upstream gates cleared. Final state: 100/100 turbo tasks successful. |

## Anti-Decay Handoff Clause

Every session that touches the program updates §Current Snapshot
with a one-line *"this session advanced/did-not-advance the program
because X"* note. A session that touches the program but does not
update §Current Snapshot has not honoured the program — the next
session reading the stale snapshot inherits drift.

§Step age increments per session that does not advance the current
step. Step age ≥ 3 sessions without advancement surfaces to owner
for explicit check-in.

## Intermediate Value Shipped Record

Each step's intermediate-value-shipped line appears in its step
section. The cumulative record means abandoning a later step does
not lose earlier value — each step's value lands before the next
step opens.

## Non-Goals

- This program is not a strategic roadmap. It is a four-step
  sequence with explicit boundaries. The agentic-engineering
  roadmap.md retains its strategic-direction-naming purpose.
- This program does not subsume the controlling plans for each
  step. Each step continues to be executed against its own
  controlling plan; this artefact carries *sequence-execution-
  state* only.
- This program is not a multi-thread plan in the sense of "one
  plan with workstreams across threads." The threads each retain
  their own continuity discipline; this artefact is a
  *cross-thread sequence pointer*.

## Reviewer Disposition

- `assumptions-expert` pass deferred to first program-step
  transition (step 1 → step 2) when the artefact will have
  observed real session traffic. Up-front review on a brand-new
  artefact shape returns abstract verdicts; one cycle of
  real-session signal yields concrete review value.

## Critical Files Referenced

- [`fitness-token-measurements-and-frontmatter-mandation.plan.md`](fitness-token-measurements-and-frontmatter-mandation.plan.md)
  (step 1 owning plan).
- [`start-right-team-singleton-lane-remediation.plan.md`](../../agent-tooling/current/start-right-team-singleton-lane-remediation.plan.md)
  (step 2 owning plan).
- [`cost-of-collaboration.plan.md`](../../agent-tooling/current/cost-of-collaboration.plan.md)
  (step 3 owning plan; step 4A owning plan).
- [`connecting-oak-resources.next-session.md`](../../../memory/operational/threads/connecting-oak-resources.next-session.md)
  (step 4B owning thread).
- [`agentic-engineering-enhancements.next-session.md`](../../../memory/operational/threads/agentic-engineering-enhancements.next-session.md)
  (steps 1, 2, 3, and step-4A owning thread).
- [`repo-continuity.md`](../../../memory/operational/repo-continuity.md)
  (pointer surface).

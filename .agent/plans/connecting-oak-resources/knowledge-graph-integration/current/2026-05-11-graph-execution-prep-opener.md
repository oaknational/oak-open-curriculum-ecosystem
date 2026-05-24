---
name: "Graph Execution Prep — Next Session Opener"
overview: "Opener for the next graph session. The 2026-05-11 MVP arc reshape closed planning; the next session prepares for graph execution by landing four definite scoped pieces of planning work in order: D-4 topology BLOCKERs, Inc.1 decomposition, EEF plan WS restructure, agent-tooling collaboration workstreams. None of these is graph implementation yet; they unblock and parallelise it."
type: session-opener
status: current
thread: connecting-oak-resources
parent_plan: ".agent/plans/graph-mvp-arc.plan.md"
last_updated: 2026-05-11
isProject: false
todos:
  - id: step-1-topology-blockers
    content: "Resolve D-4: absorb the two 2026-05-07 architecture-expert-betty topology BLOCKERs into graph-stack.plan.md before ACTIVE promotion / ADR-173 ratification. Single scoped session."
    status: completed
    completed: 2026-05-11
    landed_in: "66d4f0fb — D-4 closed; both BLOCKERs verified closed in-place by 2026-05-10 graph-stack edit via architecture-expert-betty + assumptions-expert; sub-task D-4a routed (ADR-041 amendment for agent-graphs/ + agent-tools/)"
  - id: step-2-inc-1-decompose
    content: "Decompose graph-stack Inc.1 (Oak Ontology Threads foundation) into file-scope-non-overlapping sub-streams so two agents can work it in parallel. Single planning session, no implementation."
    status: completed
    completed: 2026-05-11
    landed_in: "579cde34 — Inc.1 split into 1a/1b/1c/closure with sub_increment frontmatter tags + parallel-safety annotations; code-expert surfaced WS2.1+WS3.1 root-file conflict, absorbed"
    depends_on: [step-1-topology-blockers]
  - id: step-3-eef-ws-restructure
    content: "Restructure the EEF plan's 20 flat todos into workstream groupings (corpus loading, recommend, explain, compare, prompt-A, prompt-B, freshness, telemetry, credits) to expose intra-slice parallelism. Single planning session."
    status: completed
    completed: 2026-05-11
    landed_in: "85bcbc41 — 9 capability WS + 1 coordination WS overlay; cross_cuts semantics clarified; docs-adr-expert + assumptions-expert CLOSED"
  - id: step-4-collab-workstreams
    content: "Land Workstreams 2–5 of primary-agent-tooling-enhancements.plan.md (collaboration read APIs, comms render resilience, commit-queue safety, identity/build isolation). This is implementation, not planning, and must follow test-first discipline. B-01 (comms send created_at) is included in this scope."
    status: pending
---

# Graph Execution Prep — Next Session Opener

**Last updated**: 2026-05-11
**Status**: opener for the next graph session
**Parent**: [`graph-mvp-arc.plan.md`](../../../graph-mvp-arc.plan.md) §
Team-of-Agents Execution

## Discipline carried into this session

We only ever choose long-term architectural excellence; we never
compromise for the sake of expediency. This is absolute and applies to
every decision in every one of the four steps below — including step
sequencing, scope of each step, reviewer dispatch, and remediation
shape. If a step surfaces an "almost-right" option whose only
justification is speed, that option is excluded from consideration
upstream of any presentation. See
[`principles.md` § Architectural Excellence Over Expediency](../../../../directives/principles.md),
[`start-right-quick`](../../../../skills/start-right-quick/SKILL-CANONICAL.md),
and ADR-172.

## Why this opener exists

The 2026-05-11 MVP arc reshape closed the planning question. The
[graph-mvp-arc spine](../../../graph-mvp-arc.plan.md) and
[graph-combinatorial-arc](../../../graph-combinatorial-arc.plan.md) are
both decision-clear. **The next move is not to start writing slice 1
code** — it is to land four scoped pieces of planning + tooling work
that unblock and parallelise the execution that follows.

Each step below is a single scoped session. Three are planning sessions
(steps 1–3); one is an implementation session (step 4) that must follow
TDD-first discipline.

## The four definite steps

### Step 1 — Resolve D-4: topology BLOCKERs

**Type**: planning (graph-stack amendment).
**Owner thread**: `connecting-oak-resources`.
**Substrate**: `architecture-expert-betty` 2026-05-07 review surfaced
two BLOCKERs against `graph-stack.plan.md`:

1. **WS4 sequencing**: WS4 sequences `ws4-skos-extractor` before
   `ws4-graph-corpus-sdk-scaffold`, which leaks Oak-specific extraction
   logic into substrate workspaces. Reorder so the consumer SDK
   scaffold lands first; SKOS extractor lives in the consumer SDK.
2. **`practice-graph` workspace tier**: ADR-173 / graph-stack topology
   places `practice-graph` under `packages/libs/` instead of `sdks/` or
   `apps/`, mixing a domain consumer with public infrastructure.

Both must land before `graph-stack.plan.md` reaches ACTIVE or
ADR-173 is ratified. **This blocks Inc.1 implementation, therefore
blocks the post-Inc.1 agent ramp.** Step 1 is the unblock.

**Reviewer dispatch**: `architecture-expert-betty` (verify the
remediations close the BLOCKERs); `assumptions-expert` (verify the
reorder does not introduce hidden coupling).

### Step 2 — Decompose Inc.1 into sub-streams

**Type**: planning (graph-stack Inc.1 sub-incrementation).
**Depends on**: step 1 (must absorb the WS4 sequencing fix first).
**Substrate**: Inc.1 is currently a single "foundation" increment
holding substrate scaffolding + Threads adapter + Thread→Unit lookup.
With file-scope-non-overlapping sub-increments, two agents can share
Inc.1; without them, Inc.1 is a single-agent bottleneck through which
slices 2 and 3a both flow.

**Deliverable**: an amended graph-stack Inc.1 section naming
sub-increments (e.g. Inc.1a substrate scaffolding, Inc.1b Threads
adapter, Inc.1c Thread→Unit lookup) with file scopes, dependency
direction, and parallel-safe annotations.

**Reviewer dispatch**: `architecture-expert-betty` (boundary
correctness); `code-expert` (file-scope-overlap verification).

### Step 3 — Restructure EEF plan into workstream groupings

**Type**: planning (eef-evidence-corpus.plan.md amendment).
**Parallel-safe with**: steps 1 and 2 (different file scopes).
**Substrate**: `eef-evidence-corpus.plan.md` currently carries 20 flat
todos. It is the only MVP slice without explicit WS structure. Without
WS grouping, intra-slice parallelism is invisible to dispatch agents
and the slice defaults to single-agent execution. Grouping (corpus
loading, recommend tool, explain tool, compare tool, prompt-A,
prompt-B, freshness gate, telemetry, credits) exposes 2-agent intra-
slice work cleanly without re-deciding the underlying TDD cycle
content.

**Deliverable**: amended plan body with WS sections, todo IDs grouped
under each WS, file scopes named per WS. Underlying todo content
preserved verbatim; no scope drift.

**Reviewer dispatch**: `docs-adr-expert` (preservation of substance);
`assumptions-expert` (no scope drift).

### Step 4 — Land collaboration-protocol Workstreams 2–5

**Type**: implementation (test-first, atomic TDD pairs).
**Parallel-safe with**: steps 1–3 (different file scopes).
**Substrate**:
[`primary-agent-tooling-enhancements.plan.md`](../../../agent-tooling/current/primary-agent-tooling-enhancements.plan.md)
carries Workstreams 2–5:

- **WS2** — collaboration read APIs (comms list/show, claims
  filtering; decide whether comms watch lands now or is promoted
  separately)
- **WS3** — comms render resilience (prevent one malformed event from
  blocking every agent's shared-log regeneration)
- **WS4** — commit-queue safety and read APIs (queue inspection;
  close the active-claims fingerprint recursion hazard)
- **WS5** — identity and build isolation (stop ordinary sessions
  rebuilding the tools they are using; make identity routing drift
  visible)

The plan body's `## Bugs` section now also carries **B-01**: the
`pnpm agent-tools:collaboration-state -- comms send` `created_at`
failure. **All bug fixes in that section MUST be test-first** —
failing test in the same atomic commit as the product-code fix, no
audit-shaped tests.

**Reviewer dispatch**: per the enhancements plan — `code-expert` +
`test-expert` at minimum; `type-expert` for surfaces touching
validator types; `architecture-expert-betty` for boundary changes.

## Why these four, in this order

| Step | Unblocks |
|---|---|
| 1 (topology BLOCKERs) | Inc.1 implementation, therefore slices 2 and 3a |
| 2 (Inc.1 decompose) | 2-agent Inc.1 work, therefore the Phase B 3–4 agent ramp |
| 3 (EEF WS restructure) | 2-agent slice 1 work — parallel to steps 1 + 2 |
| 4 (collaboration WS 2–5) | Safe N-agent work across the entire arc; bug B-01 is the canary |

Steps 1, 2, and 3 are scoped planning sessions that can be fire-and-
forget to parallel agents. Step 4 is implementation; it follows TDD-
first discipline and lands its own commits.

## What this opener does NOT cover

- **MVP arc execution itself.** Slices 1, 2, 3a are downstream of these
  four steps. This opener does not start any of them.
- **Combinatorial arc.** That activates per its own promotion trigger
  (MVP gate-1 + gate-3a + Inc.3 design-stable). Not in this opener's
  scope.
- **D-1 (AI-client adoption tracking owner).** That is an owner
  decision, not a planning session — see graph-mvp-arc § Team-of-
  Agents Execution / Open decisions.
- **D-5/D-6/D-7.** Slice-by-slice or trigger-time decisions.

## Cross-references

- [`graph-mvp-arc.plan.md`](../../../graph-mvp-arc.plan.md) § Team-of-
  Agents Execution — full parallelisability findings; resolution
  surface for D-1 through D-7.
- [`graph-stack.plan.md`](graph-stack.plan.md) — substrate-side
  amendments for steps 1 + 2.
- [`../../../sector-engagement/eef/current/eef-evidence-corpus.plan.md`](../../../sector-engagement/eef/current/eef-evidence-corpus.plan.md) —
  WS restructure target for step 3.
- [`../../../agent-tooling/current/primary-agent-tooling-enhancements.plan.md`](../../../agent-tooling/current/primary-agent-tooling-enhancements.plan.md) —
  implementation surface for step 4; contains the B-01 bug entry.

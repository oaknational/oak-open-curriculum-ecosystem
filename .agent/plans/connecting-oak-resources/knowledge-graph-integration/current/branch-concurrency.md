---
plan_id: branch-concurrency-feat-mcp-graph-support-foundation
name: "Branch concurrency manifest — feat/mcp-graph-support-foundation"
overview: "Branch-state manifest naming every concurrent work-stream currently live on the feat/mcp-graph-support-foundation branch. Any coordinating agent picking up this branch reads this first to understand which streams can proceed in parallel, what blocking relationships exist, and which file-scope invariants prevent collisions. Branch-scoped — does not describe the work itself (owning plans do that), retires when the branch merges to main."
status: current
graph_layer: cross-cutting
graph_portfolio_index: "../../../graph-portfolio-index.md"
parent_plans:
  - "../../../graph-mvp-arc.plan.md"
related_plans:
  - "../active/graph-stack.plan.md"
  - "pr-108-snagging.plan.md"
  - "../../../sector-engagement/eef/current/eef-first-feature.plan.md"
  - "../../../sector-engagement/eef/current/eef-evidence-corpus.plan.md"
isProject: false
---

# Branch concurrency manifest — `feat/mcp-graph-support-foundation`

## Purpose

This is a **branch-state** document. Any coordinating agent picking up
`feat/mcp-graph-support-foundation` reads this first. It does NOT describe
the work itself (each owning plan does that). It describes how multiple
work-streams currently live on this branch coexist without colliding.

This document retires when the branch merges to main.

## Currently live on this branch

Six concurrent work-streams. Each stream's owning plan is authoritative on
the work itself; this manifest is authoritative on cross-stream
relationships.

### Stream A — PR-108 quality-gate unblock (snagging)

- **Owning plan**: [`pr-108-snagging.plan.md`](pr-108-snagging.plan.md)
- **Goal**: clear the SonarCloud Quality Gate + CodeQL alert(s) so PR-108
  can merge to main.
- **File scope (will edit)**: existing files per the plan's per-cycle
  tables. Touches `apps/oak-curriculum-mcp-streamable-http/`,
  `agent-tools/`, `packages/core/graph-core/src/` (excluding
  `graph-view/`), `packages/core/oak-eslint/`, vitest configs across
  graph-* workspaces.
- **Forbidden file scope**: any new directory at
  `packages/core/graph-core/src/graph-view/`; any file under
  `packages/sdks/graph-corpus-sdk/` (Stream B home, does not exist yet);
  any plan file or PDR file or memory/state file beyond the standard
  lifecycle-residue inclusion.
- **Current status**: Cycles 1+2+3+4.1-4.4 complete (commits 77463a22,
  73ab1624, ca28bd83, 0c3df45b, 604f64b7 + 12 Sonar dispositions + CodeQL
  #90 dismissal). Cycles 4.5-4.9, 5, 6 (Lane A source FIX + Lane B Sonar
  dispositions), 7, 8, 9, 10, Phase Final remaining.
- **Blocking**: PR-108 cannot merge to main until this stream completes
  and CI re-runs clean.
- **Blocked on**: nothing structural; Cycle 6 code-expert verdict in
  hand; Cycle 8 may need owner authorisation if its investigation lands
  a policy-amendment shape.

### Stream B — EEF gate-1a substrate authoring (Inc.1d)

- **Owning plan**: [`../active/graph-stack.plan.md`](../active/graph-stack.plan.md)
  — todos `ws4-graph-view-interface` (WS4.4) + `ws4-eef-strands-adapter`
  (WS4.5), both sub-increment `1d`.
- **Goal**: author the polymorphic `GraphView<TNode, TEdgeType>`
  interface and the `EefStrandsGraphView` adapter so gate-1a's substrate
  floor is in place.
- **File scope (will edit)**: NEW — `packages/core/graph-core/src/graph-view/`
  (does not exist) for WS4.4; new `packages/sdks/graph-corpus-sdk/`
  workspace (does not exist) for WS4.5. Both directories must be created
  by this stream.
- **Forbidden file scope**: any file in Stream A's existing-file scope;
  any file in `packages/libs/graph-ingest/` (Stream B uses graph-core
  types, not the graph-ingest pipeline — per graph-query-layer plan
  Phase B finding 2).
- **Current status**: 0% — `graph-view/` and `graph-corpus-sdk/`
  directories do not exist on this branch yet. WS4.4 + WS4.5 both
  pending.
- **Blocking**: gate-1a promotion (graph-mvp-arc `gate-0a`).
- **Blocked on**: WS3.3 (graph-project adjacency primitives) is a
  substrate dependency for WS4.5 `subgraph` BFS; WS3.3 is pending in
  graph-stack. WS4.4 itself (interface only) does NOT require WS3.3 and
  is safe to start immediately.

### Stream C — EEF gate-1a corpus + tool authoring

- **Owning plan**: [`../../../sector-engagement/eef/current/eef-evidence-corpus.plan.md`](../../../sector-engagement/eef/current/eef-evidence-corpus.plan.md)
  — gate-1a subset (t1, t2, t6a, t9, t10, t12, t13, t20 + partials of
  t14/t15/t16/t17/t18/t19 per the corpus plan's §Gate grouping).
- **Goal**: author the gate-1a tool `eef-explore-evidence-for-context`,
  the prompt `eef-evidence-grounded-lesson-plan`, the structural
  citation/caveat/freshness envelope, the Zod loader, and the freshness
  CI gate.
- **File scope (will edit)**: NEW corpus loader + scoring engine
  surfaces inside Stream B's `packages/sdks/graph-corpus-sdk/`
  workspace; tool registration in `apps/oak-curriculum-mcp-streamable-http/`
  MCP module per ADR-179.
- **Forbidden file scope**: any file in Stream A's source scope; any
  file in Stream B's graph-view interface files (consumer only).
- **Current status**: 0% — corpus todos not started on this branch.
- **Blocking**: gate-1a promotion.
- **Blocked on**: Stream B (WS4.4 + WS4.5) — the corpus tools compose
  against the GraphView surface.

### Stream D — EEF gate-1a non-technical preconditions

- **Owning plan**: [`../../../sector-engagement/eef/current/eef-first-feature.plan.md`](../../../sector-engagement/eef/current/eef-first-feature.plan.md)
  — todos ff1 (partnership opener), ff2 (adoption-tracking owner
  naming), ff5 (shape-understanding evidence).
- **Goal**: execute the non-technical gate-1a preconditions.
- **File scope (will edit)**: `eef-first-feature.plan.md` itself (the
  todos record the action + outcome); possibly `graph-mvp-arc.plan.md`
  for the `name-ai-client-adoption-owner` resolution.
- **Forbidden file scope**: any product code; any file outside the
  named plans.
- **Current status**: 0%.
- **Blocking**: gate-1a promotion.
- **Blocked on**: ff1 + ff2 are owner-actions (no agent unblock); ff5
  needs Stream B + Stream C at least drafted.

### Stream E — PDR-063..066 governance cures

- **Owning artefacts**: the four PDRs at
  `../../../../practice-core/decision-records/PDR-063-mid-cycle-retirement-protocol.md`,
  `PDR-064-coordinator-handoff-two-moments.md`,
  `PDR-065-grounding-cost-amortisation-under-rotation.md`,
  `PDR-066-comms-events-as-failure-mode-channel.md`.
- **Goal**: complete reviewer-absorption cures on the 4 PDRs and land
  them on main.
- **File scope (will edit)**: the 4 PDR files; potentially a sibling
  `docs/governance/collaboration-state-substrate-notes.md` (or
  equivalent) if Q1 portability-migration surface is chosen.
- **Forbidden file scope**: any source code; any plan file (other than
  the manifest cross-reference).
- **Current status**: PDR-064 cures landed in working tree
  (uncommitted — parenthetical tightening lines 145-154 + new
  open-question Q5/Q6); PDR-063 + PDR-065 + PDR-066 cures PAUSED
  mid-cure awaiting owner answers to routing questions.
- **Blocking**: nothing on Streams A-D (governance is parallel-safe at
  file-scope level).
- **Blocked on**: owner answers to Q1 (portability-migration surface
  shape), Q2 (PDR-065 `[DOCTRINE]` mechanism — split / defer /
  independent PDR?), Q3 (PDR-065 `fast_bootstrap_eligible` frontmatter
  field — justify or defer?).

### Stream F — Deep document consolidation (2026-05-22 session)

- **Owning artefact**: directed event `7bbe719a-2b7d-4c87-a3e7-93433690a42b`
  to Ferny Swaying Leaf.
- **Goal**: capture this session's comms-event substance into durable
  surfaces — napkin, pending-graduations, distilled, next-session
  record, repo-continuity.
- **File scope (will edit)**: `.agent/memory/active/napkin.md`,
  `.agent/memory/operational/pending-graduations.md`,
  `.agent/memory/active/distilled.md`,
  `.agent/memory/operational/repo-continuity.md`,
  `.agent/memory/operational/threads/eef.next-session.md`.
- **Forbidden file scope**: any plan file; any PDR file; any product
  code; the practice-core directory beyond reading.
- **Current status**: in flight.
- **Blocking**: nothing on other streams.
- **Blocked on**: nothing.

## File-disjointness invariant

The invariant that prevents working-tree collisions. **No stream edits a
file owned by another stream.** Consuming a type/interface from another
stream is fine; editing the file is not.

| Stream | Owns (will edit) | Must not edit |
|---|---|---|
| A — Snagging | Existing files per snagging plan tables | All new directories in B + C scope; PDR files; memory/state beyond lifecycle-residue |
| B — Substrate | `packages/core/graph-core/src/graph-view/` (NEW); `packages/sdks/graph-corpus-sdk/` (NEW workspace shell) | All A scope; PDR files; corpus loader interior of `graph-corpus-sdk/` (that is C) |
| C — Corpus | Corpus loader + scoring engine inside `graph-corpus-sdk/`; tool registration in `apps/oak-curriculum-mcp-streamable-http/` MCP module | All A and B scope except as type-consumer |
| D — Preconditions | `eef-first-feature.plan.md`, `graph-mvp-arc.plan.md` | All product code |
| E — PDR cures | The 4 PDR files (and possibly the Q1 portability-migration sibling doc) | All product code; all plan files |
| F — Consolidation | Memory files + `eef.next-session.md` + `repo-continuity.md` | All product code; all plan files; all PDR files |

**Edge case — `packages/sdks/graph-corpus-sdk/` ownership.** Stream B
authors the workspace SHELL (package.json, tsconfig, scaffold per the
WS4.1 checklist). Stream C authors INTERIOR corpus-specific source
(loader, scoring, tool registration). The seam is the scaffold: Stream B
lands `WS4.1` scaffold first, then both streams can operate without
collision because each touches different files inside the workspace.

**Edge case — Cycle 9 (Stream A) vs WS4.1 scaffold (Stream B).** Cycle 9
introduces a shared `eslint.config.base.ts` and modifies graph-*
workspace ESLint configs. If WS4.1 scaffolds a new `graph-corpus-sdk`
ESLint config concurrently, both edits land near each other. Resolution:
Cycle 9 owner should coordinate with WS4.1 owner before staging — the
new workspace should be authored to extend the shared base (per
`.agent/rules/consolidate-at-third-consumer.md`) so the streams compose
rather than collide.

## Dependency graph

```text
ff1 (partnership opener) ── owner action ──────────────────────┐
ff2 (adoption-tracking)  ── owner action ──────────────────────┤
                                                                ├──> gate-1a ACTIVE
A (snagging) ──> PR-108 merge to main ─────────────────────────┤    (plus path-dependent
                                                                │     merge ordering)
B (substrate, WS4.4 + WS4.5)
  ├─ WS4.4 (interface, file-disjoint from all of A/C)
  └─ WS4.5 (adapter, depends on WS3.3 + WS4.4)
   ── enables ──> C (corpus tools/prompt/envelope) ── enables ──> ff5 shape-evidence
                                                                ─┘

E (PDR cures) ── blocked on owner Q1/Q2/Q3 ── separate landing path

F (consolidation) ── parallel-safe with everything ── lands when ready
```

## Collision protocols

Same-branch operation has hot serialization points. Existing protocols
handle them.

1. **Git index/HEAD** — only one commit at a time. Protocol:
   `git:index/head` claim per commit window; abandon-on-foreign-staged-file
   (Salty-Flamebright collision pattern, 2026-05-22). Full protocol in
   the commit SKILL.
2. **Working tree** — multiple agents editing simultaneously. Protocol:
   per-file source claims via `active-claims.json`; the file-disjointness
   matrix above is the structural prevention.
3. **Comms event stream** — UUID-keyed events; concurrent writers handled
   by the existing mechanism.
4. **Memory/state files** — lifecycle residue swept into each commit per
   the standing inclusion-when-dirty rule.
5. **Plan files themselves** — open a planning claim on the plan file
   before editing. Plan-file collisions are the highest risk because two
   agents editing the same plan simultaneously produce divergent
   recoveries.

## Promotion / merge ordering — choice surface

Three legitimate paths from current branch state to gate-1a ACTIVE. The
choice is owner-class and is currently **not pinned**. Streams may proceed
in their file-disjoint scopes regardless of which path is later chosen;
the choice affects only the branch/PR topology at merge time.

### Path 1 — Strict serial

1. Stream A completes; PR-108 merges to main.
2. Streams B + C authored on a new branch off main; new PR; merges.
3. gate-1a promotes ACTIVE (Stream D non-technical actions any time).

Time-to-gate-1a: max(A) + max(B+C) sequenced. Clean PR scopes; slow.

### Path 2 — Parallel branches off this branch

1. Stream A continues on `feat/mcp-graph-support-foundation`.
2. Streams B + C authored on a NEW branch (e.g. `feat/eef-substrate-and-corpus`)
   branched off `feat/mcp-graph-support-foundation`; PR opens against main.
3. Stream A merges to main first; Stream B+C rebases onto main; merges next.
4. gate-1a promotes ACTIVE.

Time-to-gate-1a: max(A, B+C). Fastest wall-clock; rebase risk is low
because file-disjoint.

### Path 3 — Same branch, single PR

1. All streams operate on `feat/mcp-graph-support-foundation`.
2. PR-108 grows to encompass A + B + C + D outputs.
3. PR merges as one large PR.
4. gate-1a promotes ACTIVE after merge.

Time-to-gate-1a: max(A, B+C). Largest PR review surface; collision
discipline still applies at branch level.

**Recommendation**: defer the path decision until Stream B is far enough
along to estimate its PR scope. If PR-108 review-load becomes a constraint
before Stream B lands, pivot to Path 2 (branch B+C off this branch). Until
the decision is made, Streams B/C work is still file-disjoint from A and
safely co-resident on this branch.

## Open structural questions (owner-class)

Currently blocking or partially blocking. Until resolved, agents should
not assume any particular shape.

1. **PR-108 scope / merge topology** — Path 1 vs 2 vs 3 above.
2. **PDR-063/065/066 routing** — Q1 (portability-migration surface),
   Q2 (PDR-065 `[DOCTRINE]` mechanism), Q3 (`fast_bootstrap_eligible`
   field). Stream E paused on these.
3. **ff1 EEF partnership opener** — pure owner action.
4. **ff2 AI-client adoption-tracking owner naming** — pure owner action.
5. **Cycle 8 policy-amendment authorisation** — contingent on
   investigation outcome.
6. **Cycle 10 path selection** — contingent on post-Cycle-9 duplication
   metric.

## Coordinator-structure decision criteria

Heuristics for any coordinator picking up this branch, **without
prescribing topology**. Apply or override as the situation requires.

- **Sole full-session coordinator** is appropriate at ≤6 active agents
  and when streams remain file-disjoint (low arbitration load).
- **Slice-coordinators per stream** become preferred at ≥4 active agents
  per stream, or when one stream's coordination load (reviewer-dispatch
  density, commit-window contention) is structurally higher.
- Any coordinator transfer requires PDR-064 two-moments doctrine
  (outgoing pre-positioning broadcast + incoming active-acknowledgement
  broadcast).
- Selective-pause directives must state explicit scope (which agents are
  paused, which are not) to avoid the unblock-scope ambiguity Ferny
  surfaced 2026-05-22.

## Cross-references

- [`pr-108-snagging.plan.md`](pr-108-snagging.plan.md) — Stream A.
- [`../active/graph-stack.plan.md`](../active/graph-stack.plan.md) — Stream B (WS4.4 + WS4.5 = Inc.1d).
- [`../../../sector-engagement/eef/current/eef-evidence-corpus.plan.md`](../../../sector-engagement/eef/current/eef-evidence-corpus.plan.md) — Stream C gate-1a subset.
- [`../../../sector-engagement/eef/current/eef-first-feature.plan.md`](../../../sector-engagement/eef/current/eef-first-feature.plan.md) — Stream D non-technical preconditions + acceptance bundle.
- [`../../../graph-mvp-arc.plan.md`](../../../graph-mvp-arc.plan.md) — gate structure (gate-0a/1a/0b/1b/2/3a).
- [`../../../../skills/start-right-team/SKILL-CANONICAL.md`](../../../../skills/start-right-team/SKILL-CANONICAL.md) — team-coordination shape doctrine.

## Maintenance

- **Created**: 2026-05-22 (Blustery Lifting Plume coordinator team session)
  under owner direction to make the parallel work explicit and enable any
  coordinating agent to follow the appropriate high-level plan without
  team-topology assumptions.
- **Retires**: when `feat/mcp-graph-support-foundation` merges to main
  (and is replaced by a successor branch with its own concurrency state)
  OR when fewer than two concurrent streams remain on the branch.
- **Refresh trigger**: if any stream's "current status" drifts more than
  one team-session out of date, the manifest needs refresh. Coordinator
  pickup is responsible.
- **First Question**: before adding to this manifest — *could the
  information live in an owning plan instead?* The manifest holds only
  cross-stream relationships; per-stream substance belongs in the owning
  plan.

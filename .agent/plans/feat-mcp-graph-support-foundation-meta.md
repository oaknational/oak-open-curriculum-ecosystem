---
plan_id: feat-mcp-graph-support-foundation-meta
name: "Meta plan — feat/mcp-graph-support-foundation"
overview: "Navigation index for every planning document currently in force on the feat/mcp-graph-support-foundation branch. Names each plan, what it owns, the cross-plan dependency picture, the file-scope partition that makes parallel work possible, current state, and open owner-class structural questions. Pure work-structure — does NOT specify operational model, team composition, rotation cadence, branch/PR topology, or who-does-what. A fresh session reads this after the standard start-right grounding to understand the planning landscape and choose where to enter."
status: current
type: navigation-index
last_updated: 2026-05-22
related_plans:
  - "graph-mvp-arc.plan.md"
  - "graph-portfolio-index.md"
  - "high-level-plan.md"
  - "connecting-oak-resources/knowledge-graph-integration/active/graph-stack.plan.md"
  - "connecting-oak-resources/knowledge-graph-integration/current/pr-108-snagging.plan.md"
  - "connecting-oak-resources/knowledge-graph-integration/current/gate-1a-delivery-parallel-execution-addendum.plan.md"
  - "connecting-oak-resources/knowledge-graph-integration/current/graph-query-layer.plan.md"
  - "sector-engagement/eef/current/eef-first-feature.plan.md"
  - "sector-engagement/eef/current/eef-evidence-corpus.plan.md"
isProject: false
---

# Meta plan — `feat/mcp-graph-support-foundation`

## Purpose

This document is a **navigation index** for the planning surface that
governs work on the `feat/mcp-graph-support-foundation` branch. A fresh
session reads it after standard start-right grounding (AGENT.md →
repo-continuity → next-session record → this document) to understand:

- What plans exist and what each one owns.
- Which work-items can proceed in parallel by their structure
  (file scope, dependency graph, blocking relationships).
- What is currently done, in flight, or blocked.
- What owner-class structural questions are pending.

This document deliberately does NOT specify:

- Operational model (rotating cast, team composition, rotation cadence,
  auto-spawn cadence).
- Branch / PR topology (which work lands in which PR, in what order).
- Coordinator structure (sole, slice, full-session, transfer rituals).
- Who-does-what (agent assignment to work-items).

Those are session-time choices owned by whoever picks up the work, not
properties of the planning surface.

This document retires when the branch merges to main.

## Plan inventory

Each plan is the authoritative source for its scope. This meta plan
points; it does not duplicate.

### Strategic / portfolio layer

| Plan | Path | Scope |
|---|---|---|
| Repository goal narrative + milestone sequence | [`high-level-plan.md`](high-level-plan.md) | Strategic top-level index for the whole repository. M0 + M1 complete; M2 Open Public Alpha in progress. |
| Graph portfolio index | [`graph-portfolio-index.md`](graph-portfolio-index.md) | Portfolio view of all graph-layer work across the repo. |
| Graph MVP arc spine | [`graph-mvp-arc.plan.md`](graph-mvp-arc.plan.md) | Three-slice substrate-and-surface spine; gate structure (gate-0a / 1a / 0b / 1b / 2 / 3a). |

### Graph substrate + delivery layer

| Plan | Path | Scope |
|---|---|---|
| Graph stack — topology + foundation increment | [`connecting-oak-resources/knowledge-graph-integration/active/graph-stack.plan.md`](connecting-oak-resources/knowledge-graph-integration/active/graph-stack.plan.md) | Authoritative for WS0-WS8 workstreams; Inc.1a (graph-core + graph-ingest + graph-project) and Inc.1d (WS4.4 GraphView interface + WS4.5 EefStrandsGraphView adapter). |
| Graph query layer | [`connecting-oak-resources/knowledge-graph-integration/current/graph-query-layer.plan.md`](connecting-oak-resources/knowledge-graph-integration/current/graph-query-layer.plan.md) | Per-operation sequencing of the 17 MCP graph tools (subgraph, getNode, neighbours, enumerateNodes, findByTag, summary, manifest × prerequisite / misconception / eef-strands). |
| Gate-1a parallel-execution addendum | [`connecting-oak-resources/knowledge-graph-integration/current/gate-1a-delivery-parallel-execution-addendum.plan.md`](connecting-oak-resources/knowledge-graph-integration/current/gate-1a-delivery-parallel-execution-addendum.plan.md) | Architectural commitments for gate-1a delivery: WS4.4 test-partition amendment, 10 inviolate quality invariants, "test-partition by invariant-ownership" lever. **Operational-model framing (rotating-cast, auto-spawn cadence) is deprecated and ignored by this meta plan.** Substantive content survives. |

### EEF gate-1a delivery layer

| Plan | Path | Scope |
|---|---|---|
| EEF first feature (gate-1a delivery contract) | [`sector-engagement/eef/current/eef-first-feature.plan.md`](sector-engagement/eef/current/eef-first-feature.plan.md) | ff1-ff6 acceptance bundle. By-reference owner of gate-1a delivery — points at substrate (graph-stack) and corpus (eef-evidence-corpus) for the work itself. Carries the per-cycle dependency + file-scope table for gate-1a-scope cycles. |
| EEF evidence corpus | [`sector-engagement/eef/current/eef-evidence-corpus.plan.md`](sector-engagement/eef/current/eef-evidence-corpus.plan.md) | t1-t20 corpus tools, prompts, citation envelope, freshness gate. Gate-1a subset (t1, t2, t6a, t9, t10, t12, t13, t20 + partials) lands before gate-1a; remainder lands at gate-1b. |

### Quality + governance layer

| Plan / artefact | Path | Scope |
|---|---|---|
| PR-108 quality-gate snagging | [`connecting-oak-resources/knowledge-graph-integration/current/pr-108-snagging.plan.md`](connecting-oak-resources/knowledge-graph-integration/current/pr-108-snagging.plan.md) | Per-finding disposition of CodeQL alerts + SonarCloud Quality Gate issues on PR-108. 10 cycles + Phase Final. Resolves the merge blocker on this branch. |
| Multi-writer coordination doctrine | [`practice-core/decision-records/PDR-063-mid-cycle-retirement-protocol.md`](practice-core/decision-records/PDR-063-mid-cycle-retirement-protocol.md), [`PDR-064-coordinator-handoff-two-moments.md`](practice-core/decision-records/PDR-064-coordinator-handoff-two-moments.md), [`PDR-065-grounding-cost-amortisation-under-rotation.md`](practice-core/decision-records/PDR-065-grounding-cost-amortisation-under-rotation.md), [`PDR-066-comms-events-as-failure-mode-channel.md`](practice-core/decision-records/PDR-066-comms-events-as-failure-mode-channel.md) | Four PDRs covering multi-writer coordination protocols. Authored in working tree; reviewer-absorbed and under cure pending owner Q1/Q2/Q3 routing. These supersede the addendum's "four rotating-cast coordination questions" framing — substance is here, framing in the addendum is deprecated. |

## Work-structure: file-scope partition

The structural invariant that makes parallel work possible: **plans own
disjoint file scopes**. Below is the partition at the plan level — finer
per-cycle scope lives in each owning plan.

| Plan / artefact | Owns (edits permitted) | Must not edit |
|---|---|---|
| `pr-108-snagging.plan.md` cycles | Existing files in `apps/oak-curriculum-mcp-streamable-http/`, `agent-tools/`, `packages/core/graph-core/src/` (excluding the not-yet-existent `graph-view/`), `packages/core/oak-eslint/`, `packages/sdks/oak-sdk-codegen/` generated files (disposition-only), `packages/libs/graph-ingest/src/*/index.ts` (existing `export {}` files, Cycle 6 Lane B), `docs/governance/sonar-disposition-policy.md`, `sonar-project.properties`. See plan's `primary_artefacts` frontmatter for the exact set. | New directories under `packages/core/graph-core/src/graph-view/`; the new `packages/sdks/graph-corpus-sdk/` workspace; the four PDR-063..066 files; memory/state files beyond the standing lifecycle-residue inclusion. |
| `graph-stack.plan.md` WS4.4 | NEW directory `packages/core/graph-core/src/graph-view/` (interface + fixture-based smoke-test per WS4.4 architectural amendment in the addendum). | Anything outside `graph-view/`. |
| `graph-stack.plan.md` WS4.5 | NEW workspace `packages/sdks/graph-corpus-sdk/` (scaffold + EefStrandsGraphView adapter + EefStrand-instantiation smoke-test). | Anything outside `graph-corpus-sdk/`. |
| `graph-stack.plan.md` WS2.2 + WS2.3 | `packages/libs/graph-ingest/src/` source authoring (Inc.1a closure — jsonld-compatible + Turtle/SKOS parsing + source-mapping primitives). | Snagging-touched existing `index.ts` barrels in graph-ingest are out of scope when Cycle 6 Lane B has not landed; coordinate via per-file source claim if scope overlap arises. |
| `graph-stack.plan.md` WS3.3 | `packages/libs/graph-project/src/adjacency/` (NEW sub-path). | Anything outside `adjacency/`. |
| `eef-evidence-corpus.plan.md` gate-1a tokens (t1, t2, t6a, t9, t10, t12, t13, t20 + partials) | Corpus loader + scoring engine inside `packages/sdks/graph-corpus-sdk/` interior; tool + prompt registration in `apps/oak-curriculum-mcp-streamable-http/` MCP module per ADR-179. | The `graph-view/` interface files (consumer only); the addendum / PDR files. |
| `eef-first-feature.plan.md` ff1, ff2, ff5, ff6 | The plan body itself; `graph-mvp-arc.plan.md` `name-ai-client-adoption-owner` resolution; potentially `ATTRIBUTION.md` for ff1 outcome. | All product code. |
| PDR-063..066 cure work | The four PDR files. Possibly a sibling `docs/governance/collaboration-state-substrate-notes.md` if Q1 portability-migration surface is chosen by owner. | All product code; all plan files. |
| Documentation consolidation (memory surfaces) | `.agent/memory/active/napkin.md`, `.agent/memory/operational/pending-graduations.md`, `.agent/memory/active/distilled.md`, `.agent/memory/operational/repo-continuity.md`, `.agent/memory/operational/threads/eef.next-session.md`. | All product code; all plan files; all PDR files. |

## Work-structure: dependency picture

Pure dependency relationships between plans / cycles. Edges are
"completion of X is required before Y can start". Anything not on an
edge is parallel-safe by structure.

```text
ff1 (EEF partnership opener)        ─── owner action ─────────────────┐
ff2 (AI-client adoption-tracking)   ─── owner action ─────────────────┤
                                                                       ├──> gate-1a
PR-108 snagging cycles ─────> PR-108 merges to main ──────────────────┤    promotion
                                                                       │
WS4.4 (GraphView interface, file-disjoint from PR-108 cycles)          │
                                                                       │
WS3.3 (graph-project adjacency) ─┐                                     │
                                  ├──> WS4.5 (EefStrandsGraphView)     │
WS4.4 ──────────────────────────┘                                     │
WS4.1 (graph-corpus-sdk scaffold) ─┘                                  │
                                                                       │
WS4.4 ──> t1 corpus-shape ──> t2 zod-loader ──> t6a explore-tool ──> t10 prompt
                                                                       │
                       Independent gate-1a tokens (parallel-safe):     │
                       t9 guidance, t12 citation, t13 freshness,       │
                       t20 credits                                     │
                                                                       │
                       ff5 shape-evidence ── needs t1 + t6a drafted ───┤
                                                                       │
                                                                       └─> ff6
                                                                           acceptance
                                                                           bundle

PDR-063..066 cure work ── blocked on owner Q1/Q2/Q3 ─── independent landing path

WS2.2 + WS2.3 (graph-ingest Inc.1a closure) ─── parallel-safe with all gate-1a substrate
                                                (different workspace tree)
```

## Current state (2026-05-22)

State snapshot — refresh on session pickup.

### Done on this branch since the previous next-session refresh

- Commits landed: `77463a22` (Cycle 1 TSDoc), `73ab1624` (Cycle 4.1), `ca28bd83` (Cycle 4.2), `0c3df45b` (Cycle 4.3), `604f64b7` (Cycle 4.4), `5af5e289` (Phase 0 disposition ledger), `5b8635c4` (Stage 1a continuity-landing).
- SonarCloud quality-gate condition `new_security_hotspots_reviewed` advanced from 0% to 100% (12 dispositions: 11 × S5332 Cycle 2 + 1 × S4036 Cycle 3, REVIEWED/SAFE).
- CodeQL alert #90 dismissed FALSE_POSITIVE via `gh api`; criterion 3 pending next CI re-run.
- Cycle 6 code-expert verdict absorbed (5 S7785 FIX + 7 S7787 FALSE_POSITIVE).
- Architecture-expert-fred re-verify on PDR-066 cured spots: GO.
- assumptions-expert verdict on PDR-063..066 absorbed by drafter; cures in flight.
- Commit `77d6ce85` landed the architectural-excellence pass: PDR-063..066 portability-clean genotype, plus ADR-182 (mid-cycle handoff record substrate, PDR-063 phenotype) and ADR-183 (comms-event tag namespace substrate, PDR-066 phenotype). These supersede the addendum's four protocol questions.

### PDR slice (2026-05-22 architectural-excellence pass)

- **Owner direction received**: PDRs never contain repo-specific paths.
  Repo-specific content signals genotype/phenotype split (PDR = portable
  principle; ADR = repo-specific substrate) or pure-ADR placement.
- **Splits executed**:
  - ADR-182 `mid-cycle-handoff-record-substrate` authored (PDR-063
    phenotype).
  - ADR-183 `comms-event-tag-namespace-substrate` authored (PDR-066
    phenotype).
  - PDR-063, PDR-065, PDR-066 rewritten as portable genotype, cross-
    referencing the substrate-implementation ADRs via
    `practice-index.md`.
  - PDR-064 already portability-clean.
- **Deferred mechanisms in PDR-065** (per architectural-excellence
  invariant): doctrine-change cross-substrate surfacing mechanism;
  eligibility-signal carriage. Both graduate via substrate-
  implementation ADRs when rotating-cast Round 1 surfaces empirical
  evidence.
- Documentation consolidation completed earlier in the session.

### Blocked

- PR-108 cannot merge until residual SonarCloud QG conditions clear (`new_violations`, `new_duplicated_lines_density`) and CI re-runs clean for the hotspot + CodeQL dismissal.
- gate-1a promotion to ACTIVE waits for the substrate (WS4.4 + WS4.5) + corpus (gate-1a tokens) + ff1/ff2/ff5/ff6 + PR-108 merging to main.

## Entry points for a fresh session

"If you are picking up …" — read these in order.

### …PR-108 snagging work

1. [`pr-108-snagging.plan.md`](connecting-oak-resources/knowledge-graph-integration/current/pr-108-snagging.plan.md) end-to-end.
2. [`docs/governance/sonar-disposition-policy.md`](../../docs/governance/sonar-disposition-policy.md).
3. [`.agent/rules/never-disable-checks.md`](../rules/never-disable-checks.md).
4. The relevant cycle's file scope.

### …gate-1a substrate authoring (WS4.4 or WS4.5)

1. [`graph-stack.plan.md`](connecting-oak-resources/knowledge-graph-integration/active/graph-stack.plan.md) — full plan, focus on WS4.4 + WS4.5 todos.
2. [`gate-1a-delivery-parallel-execution-addendum.plan.md`](connecting-oak-resources/knowledge-graph-integration/current/gate-1a-delivery-parallel-execution-addendum.plan.md) — §"Architectural amendment: WS4.4 test partition" and §"Inviolate quality invariants" (these survive the addendum's deprecated operational framing).
3. [`graph-query-layer.plan.md`](connecting-oak-resources/knowledge-graph-integration/current/graph-query-layer.plan.md) — for the full GraphView interface specification.
4. [`eef-first-feature.plan.md`](sector-engagement/eef/current/eef-first-feature.plan.md) §"Execution Partition" cycle table for WS4.4 / WS4.5 entries.

### …gate-1a corpus authoring (t1 / t2 / t6a / t9 / t10 / t12 / t13 / t20)

1. [`eef-evidence-corpus.plan.md`](sector-engagement/eef/current/eef-evidence-corpus.plan.md) for the per-token contract.
2. [`eef-first-feature.plan.md`](sector-engagement/eef/current/eef-first-feature.plan.md) for the gate-1a delivery bar and the dependency table.
3. [`graph-stack.plan.md`](connecting-oak-resources/knowledge-graph-integration/active/graph-stack.plan.md) for the WS4.4 + WS4.5 substrate the tools compose against.

### …ff1 / ff2 (EEF non-technical preconditions)

1. [`eef-first-feature.plan.md`](sector-engagement/eef/current/eef-first-feature.plan.md) — ff1 + ff2 are owner-actions; the plan body records the action + outcome.

### …PDR-063..066 cure work

1. The four PDR files in `.agent/practice-core/decision-records/`.
2. The assumptions-expert verdict in working-tree comms history (event id available in repo-continuity at the next refresh).
3. Owner Q1 / Q2 / Q3 routing answers (pending — see §"Open structural questions" below).

### …documentation consolidation

1. The owner standing rule on knowledge-graduation ("knowledge in comms graduates and is not lost").
2. Memory surfaces: napkin, pending-graduations, distilled, repo-continuity, next-session records.

## Open structural questions (owner-class)

These currently block one or more work-items. Until resolved, treat them
as load-bearing constraints, not as gaps the session can decide unilaterally.

| Question | Affects | Status |
|---|---|---|
| Q1 — PDR portability-migration surface (where do repo-path specifics land — non-Practice-Core doc, or PDR §Implementation Notes appendix?) | PDR-063, 065, 066 cure work | Resolved 2026-05-22 (commit `77d6ce85`): genotype/phenotype split. Repo-specific paths live in ADR-182 (PDR-063 phenotype) and ADR-183 (PDR-066 phenotype); PDRs are portability-clean. |
| Q2 — PDR-065 `[DOCTRINE]` cross-substrate mechanism (split into PDR-066 Tranche 2, independent PDR, or defer to first-instance?) | PDR-065 cure work | Resolved 2026-05-22 as deferred-by-design. See PDR-065 §"Doctrine-change visibility under Mode B (deferred mechanism)" — graduates via a substrate-implementation ADR when second-instance evidence accumulates. |
| Q3 — PDR-065 `fast_bootstrap_eligible` frontmatter field (justify with concrete failure mode or downgrade to deferred?) | PDR-065 cure work | Resolved 2026-05-22 as deferred. See PDR-065 §"Eligibility-signal carriage (deferred)" — re-derivation by the incoming agent is the sound shape; static signal only graduates if empirical evidence shows re-derivation cost is systematically high. PDR-065 frontmatter does not carry the field. |
| ff1 EEF partnership opener — name the EEF contact, record first-contact action | gate-1a promotion | Pending owner action |
| ff2 AI-client adoption-tracking owner naming — resolves D-1 | gate-1a promotion | Pending owner action |
| Cycle 8 mechanical-encoding investigation policy-amendment authorisation (if investigation finds policy-amendment shape) | PR-108 merge | Contingent on investigation outcome |
| Cycle 10 path selection (further consolidation / policy amendment / accept-red with owner sign-off) | PR-108 merge | Contingent on post-Cycle-9 duplication metric |

## Standing invariants from the addendum (substantive content)

The following from the gate-1a parallel-execution addendum apply
regardless of how the work is operationally carried out. They are
work-discipline invariants, not operational prescriptions.

1. **Atomic-landing**: test code and product code travel in one commit. No "code now, tests later" split.
2. **Reviewer absorption in-cycle**: type-expert / architecture-expert / test-expert dispatched per cycle; verdicts absorbed before the cycle's commit.
3. **File-disjoint partition within any concurrent work**: no editing each other's scope.
4. **Pre-commit hook on every commit**: full gate suite (`pnpm check`).
5. **Schema-first execution**: types flow from the Open Curriculum OpenAPI schema. No manual types at SDK boundaries.
6. **Result pattern at SDK boundaries** per `principles.md`.
7. **TDD-as-design**: tests describe system state, not implementation choices.
8. **Owner direction is final**: any reshape requires owner authorisation.
9. **No `--no-verify`, no scoped-only gate substitution, no hook bypass** per `.agent/rules/no-verify-requires-fresh-authorisation.md`.
10. **Test-partition by invariant-ownership**: each workspace tests its own invariants; downstream consumers test integration; tests do not pull cycles forward via cross-workspace placement.

## Maintenance

- **Authored**: 2026-05-22 (Blustery Lifting Plume coordinator team session) — under owner direction to "create a meta plan, so that a fresh session can bring together all of our planning documents sensibly".
- **Retires**: when `feat/mcp-graph-support-foundation` merges to main.
- **Refresh trigger**: if any plan inventory entry, file-scope partition row, or open structural question drifts more than one team-session out of date.
- **First Question**: before adding to this index — *could the information live in an owning plan instead?* This document points; it does not duplicate. Per-cycle scope, dependency edges within a plan, acceptance criteria, and validation commands stay in the owning plan.

---
name: "Deep Mighty Peach — EEF First Feature 4-PR delivery sequence"
overview: "Delivery-sequence companion to eef-first-feature.plan.md. Decomposes the remaining gate-1a work into 4 small PRs (plan-freshness, boundary-discipline, MCP-feature surface, gate-closure ceremony) with verified ADR citations and a critical assessment of specialist verdicts. Authored 2026-05-25 in Claude plan mode (Stormy Surfing Dock); brought into the repo via the PR-0 commit for durable safe-keeping ahead of context-window compaction. The named architectural anchors are ADR-173:50 (EEF Zod loader inside graph-corpus-sdk), ADR-179:54-57 (substrate ships no MCP code), ADR-175:40-46 (180-day freshness as plan-promotion gate), and the verified canonical _meta.attribution = EEF_ATTRIBUTION at corpus plan line 66."
parent_plans:
  - "./eef-first-feature.plan.md"
sibling_plans:
  - "./eef-evidence-corpus.plan.md"
status: current
isProject: false
todos:
  - id: pr0-plan-freshness
    content: "PR-0 plan-freshness pass: drift A–I corrections across eef-first-feature.plan.md, graph-stack.plan.md, eef.next-session.md plus this companion plan landing. No source code. **LANDED 2026-05-25** in the same commit that landed this plan into the repo (Stormy Surfing Dock session, post-PR#114 consolidation branch)."
    status: completed
    depends_on: []
  - id: pr1-boundary-discipline
    content: "**SUPERSEDED 2026-05-27 → collapsed into the single EEF value-PR (see reshape banner).** PR-1 boundary discipline: relocate corpus-substrate types from oak-curriculum-sdk/src/mcp/evidence-corpus/types.ts:64-226 → graph-corpus-sdk/src/eef-strands/types.ts (replace-don't-bridge); add t2 Zod loader in graph-corpus-sdk/src/eef-strands/loader.ts; add pnpm freshness:check script + extend freshness.unit.test.ts with invalid-date error path + document plan-promotion checklist in eef/README.md §Promotion Rule. Heals pre-existing substrate-leak per ADR-173:50 + ADR-179:54-57; honours minimum ADR-175 §Implementation Notes binding. Now commit 1 (relocation) + commit 3 (loader+freshness) of the collapsed 4-commit value-PR (WS4.5 adapter is commit 2); Starless drives in worktree."
    status: pending
    depends_on: [pr0-plan-freshness]
  - id: pr2-mcp-feature-surface
    content: "**SUPERSEDED 2026-05-27 → collapsed into the single EEF value-PR (see reshape banner).** PR-2 MCP feature surface. Agent A — eef-explore-evidence-for-context tool + tests at oak-curriculum-sdk/src/mcp/evidence-corpus/tools/, asserting _meta.attribution = EEF_ATTRIBUTION (NOT _meta.source per corpus plan line 66). Agent B — wire-up: SDK barrel export + register t10 prompt in MCP registry + amend ADR-123 Tools + Prompts tables + t15 negative-space TSDoc on projection types (Betty: co-located, not README). Agent C — E2E shape conditions. architecture-expert-betty cross-cutting pre-merge includes Inc-3 contract-coherence checklist. Now commit 3 (tool + wire-up + tests) of the collapsed value-PR; Starless drives solo in worktree (the multi-agent A/B/C split is retired — one owner per worktree)."
    status: pending
    depends_on: [pr1-boundary-discipline]
  - id: pr3-gate-1a-closure
    content: "PR-3 gate-1a closure ceremony: ff5 five-question shape-understanding template answered against landed t6a; ff6 acceptance bundle filled in with substrate + PR-2 SHAs + Betty coherence-check verdict transcription + freshness pnpm freshness:check last-run-date confirmation; ATTRIBUTION.md ff1 skip-rationale one-liner; status syncs across eef-evidence-corpus.plan.md + graph-mvp-arc.plan.md + open-education-knowledge-surfaces.plan.md + thread record + repo-continuity. release-readiness-expert formal go/no-go. No new product code."
    status: pending
    depends_on: [pr2-mcp-feature-surface]
---

# Deep Mighty Peach — EEF First Feature: 4-PR delivery sequence

> ## ⚠️ 2026-05-27 RESHAPE — owner-approved (supersedes the 4-PR partitioning below)
>
> The 4-PR sequence in the todos/Phases below is **superseded** by an owner-approved
> reshape (2026-05-27; Galactic Dancing Constellation + Starless Prowling Mask joint
> recommendation; owner go on **shape + who**, then owner-directed **worktree mechanic**).
>
> **SHAPE — collapse to ONE teacher-value PR.** Merge `pr1-boundary-discipline` +
> `pr2-mcp-feature-surface` into a single PR whose identity is *"a teacher can explore
> EEF evidence for their teaching context."* Scope = type relocation (boundary heal) +
> the `EefStrandsGraphView` adapter (`WS4.5` — see drift note below; it does NOT yet exist) +
> `t2` Zod loader + **freshness gate** (`pnpm freshness:check` + invalid-date test path —
> ADR-175:40-46 binds freshness before any user-facing EEF surface ships, so it **cannot**
> be deferred out) + the `eef-explore-evidence-for-context` tool (`t6a`) + wire-up
> (`t15`–`t19`) + tests. Structure as **4 sequential commits** for reviewability
> (owner decided 2026-05-27 to FOLD the WS4.5 adapter in rather than ship it as a separate
> substrate-first PR — a separate plumbing-first PR would re-introduce the no-teacher-value
> front-loading this reshape removed, and extract a single-consumer abstraction ahead of its
> consumer): (1) type relocation [NARROW `public/evidence-corpus.ts` to telemetry-only, NO
> cross-SDK dep yet]; (2) `EefStrandsGraphView` adapter in `graph-corpus-sdk`; (3) loader +
> freshness; (4) tool + wire-up + tests [the `oak-curriculum-sdk → graph-corpus-sdk` dep is
> added HERE]. Rationale: the plumbing (old PR-1) exists only to serve the tool; the 4-PR
> split front-loaded two zero-teacher-value PRs before any teacher value.
> `pr3-gate-1a-closure` remains a **separate closeout step** after the value-PR lands.
>
> **MECHANIC — worktree-per-agent (owner-directed 2026-05-27).** Each concern is built in
> its own `git worktree` off `origin/main` (`037d0f7e`); each agent is **FULLY responsible
> for all functions in their worktree**. The primary checkout (`feat/graph-foundations`) is
> the shared **local integration branch** and the home of coordination substrate (plans,
> comms, claims). Worktree drivers **verify `HEAD = 037d0f7e` before any work** (practice
> memory: worktree base-divergence surprises). Concerns reach `main` via **separate PRs**
> (or integrate back into `feat/graph-foundations` locally).
>
> **WHO.** Starless Prowling Mask drives the EEF value-PR solo in its worktree. Galactic
> Dancing Constellation drives the **separate** agent-tools comms-schema cure-PR (NOT part
> of this EEF plan — `agent-tools/src/collaboration-state`) in its own worktree, and reviews
> the EEF value-PR in-cycle (architecture-expert-fred boundary, type-expert, test-expert,
> mcp-expert).
>
> **RELEASE SAFETY (verified 2026-05-27).** `.github/workflows/release.yml` already
> serialises releases — `concurrency: { group: release, cancel-in-progress: false }`.
> Near-simultaneous PR merges queue their release runs one-at-a-time, so semantic-release
> computes each version against the prior release's committed state. No change needed.
>
> **COORDINATION CONTRACT.** Worktrees isolate **code**; the shared primary tree still holds
> coordination docs (this plan, comms, claims). Single-committer discipline on the shared
> tree (one agent commits at a time; pause churn-producing watchers/heartbeats during any
> git op — this is the deadlock lesson from the pre-reshape session). ALL agents keep this
> plan and [`eef-first-feature.plan.md`](./eef-first-feature.plan.md) current as work proceeds.

## Context

The EEF Teaching and Learning Toolkit is the first concrete instance of
Oak's external-evidence-corpus integration pattern. Gate-1a — the first
user-facing EEF MCP feature — proves the pattern that will be repeated for
future evidence corpora.

This plan delivers the remaining gate-1a work as a small-PR sequence that
honours long-term architectural excellence under direct ADR verification,
not specialist authority alone. It is the delivery companion to
[`./eef-first-feature.plan.md`](./eef-first-feature.plan.md); the
owning-contract content stays there, the per-PR partitioning lives here.

The pattern this sequence establishes will be repeated. Getting it right
matters beyond gate-1a.

---

## Phase 1: current state of gate-1a

### What has LANDED on main

Via PR #108 (`feat/mcp-graph-support-foundation`, merged at `2462952a`) and
PR #114 (`feat/education-evidence-foundational-graphs`, merged at
`77fcf746` on 2026-05-24):

**Substrate**

- `WS4.1` `graph-corpus-sdk` workspace scaffold (pnpm + knip + depcruise registered)
- `WS4.4` `packages/core/graph-core/src/graph-view/` — `GraphView<TNode, TEdgeType>` interface + supporting types + barrel + compile-time smoke-test
- `WS4.5` `packages/sdks/graph-corpus-sdk/src/eef-strands/` — **placeholder only** (an `export {}` surface stub; PR #114 added only a NOSONAR comment). **CORRECTION 2026-05-27 (verified by directory listing): the `EefStrandsGraphView` adapter does NOT exist and did NOT land via PR #114** — the prior "adapter implementing subgraph + manifest" wording was drift. The adapter is genuinely remaining (see table below) and is now commit 2 of the value-PR.

**Corpus** (`packages/sdks/oak-curriculum-sdk/src/mcp/evidence-corpus/` — verified by directory listing)

- `t1-corpus-shape` — completed (types in `types.ts`, exports including `EvidenceCorpus<TNode, TEdgeType>`, `EefStrand`, `RankOptions`, `CompareOptions`, `ExplainOptions`, `NotImplementedYet`, `ComparisonDimension`, `RankedItem`, `RankedResults`, `NodeExplanation`, `ComparisonResult`, `RankError`, `CompareError`)
- `t9-guidance-constant` — completed (`eef-evidence-guidance.ts`)
- `t10-lesson-plan-prompt` — completed (`eef-evidence-grounded-lesson-plan-messages.ts` + test)
- `t12-citation-shape` — completed (`citation-shape.ts` + test; landed 2026-05-22)
- `t14-telemetry` — completed (`telemetry.ts`)
- `t20-credits` — completed (in ATTRIBUTION + README)
- `freshness.ts` + `freshness.unit.test.ts` already on disk (Fred's ground-state finding verified — landed via PR #114)

**Non-technical**

- `ff2-adoption-tracking-owner` — completed (Jim Cresswell; conversations mechanism; resolved 2026-05-22)
- `ff1-partnership-opener` — completed via skip-rationale (2026-05-23 owner direction "skip; EEF already aware"); durable disposition lands in ATTRIBUTION.md via PR-3

### What is GENUINELY remaining

| Item | Surface and notes |
|---|---|
| Substrate-boundary heal | Relocate `EvidenceCorpus`, `EefStrand`, and the other corpus types (verified at `oak-curriculum-sdk/src/mcp/evidence-corpus/types.ts:64-226`) to `graph-corpus-sdk/src/eef-strands/`. Fred verdict verified against ADR-179:54-57 + ADR-173:50 |
| `WS4.5` `EefStrandsGraphView` adapter | **NOT landed (drift corrected 2026-05-27)** — only a placeholder exists. Build the `GraphView` adapter over EEF strands in `graph-corpus-sdk/src/eef-strands/` (implement `subgraph` + `manifest`; remaining ops as typed `NotImplementedYet` Result stubs). Commit 3's tool consumes it. Folded into the value-PR as commit 2 (owner decision 2026-05-27). |
| `t2-zod-loader` | Add to `graph-corpus-sdk/src/eef-strands/` (NOT MCP module) per ADR-173:50 — "corpus-local Zod loader **inside `graph-corpus-sdk`**" |
| Freshness CI binding | `pnpm freshness:check` script + extend `freshness.unit.test.ts` with invalid-date path + plan-promotion-checklist note (NOT mandated GitHub Actions workflow — see Critical Assessment) |
| `t6a-explore-tool` | `oak-curriculum-sdk/src/mcp/evidence-corpus/tools/eef-explore-evidence-for-context.ts` — depends on relocated loader + types |
| Wire-up partials | t15 (negative-space TSDoc on projection types), t16 (barrel), t17 (register `t10` prompt), t18 (ADR-123 amendment), t19 (E2E shape conditions) |
| `ff3` + `ff4` + `ff6` | Plan status syncs + acceptance ceremony |
| `ff5` shape-understanding | Five-question template answered against landed `t6a`; lands in PR-3 closeout (test-expert's atomic-landing verdict) |

### Document drift catalogue (Drifts A–I — addressed by PR-0)

| Drift | Location | Required correction |
|---|---|---|
| A | `eef-first-feature.plan.md` ff3/ff4/ff5/ff6 | All `status: pending`; ff3 substantively complete; ff4 has partial progress |
| B | `eef-first-feature.plan.md` Branch ref | Said `feat/mcp-graph-support-foundation`; actual is `feat/education-evidence-foundational-graphs-take2` |
| C1 | `eef-first-feature.plan.md` PR-108-snagging plan ref | File archived; reference removed via E compression |
| C2 | ADR-175 link path | `175-evidence-corpus-freshness-governance.md` → `175-external-evidence-corpus-freshness-governance.md` |
| C3 | ADR-179 link path | `179-substrate-vs-transport-discipline.md` → `179-transport-agnostic-graph-substrate.md` |
| D | `eef-first-feature.plan.md` ff4 | t13 partial classification undercounted; precise count is 7 full + 7 partial |
| E | `eef-first-feature.plan.md` PR-#108 hard-gate section | PR-#108 historical; compressed to one dated block citing `2462952a` |
| F | `eef-first-feature.plan.md` ADR-157 citation | ADR-157 is `Proposed`; cite **ADR-175** (Accepted) as binding for `eef-*` prefix + `_meta.attribution` |
| G | `graph-stack.plan.md` WS4.4 + WS4.5 | `status: pending` despite landed via PR #114; set to `completed` with SHA `77fcf746` |
| H | `eef.next-session.md` | Refresh to 2026-05-25 |
| I | `eef-first-feature.plan.md` | Note pre-existing substrate-leak in `types.ts:64-226` PR-1 heals |

---

## Phase 2: critical assessment of specialist verdicts

Five concurrent specialists reviewed an initial 6-PR sketch. Each key claim
was then verified by direct ADR + corpus-plan read before being absorbed.

### Fred — CONFIRMED (CRITICAL #1) and OVER-STATED (CRITICAL #2)

**Critical #1 (loader belongs in `graph-corpus-sdk`)** — CONFIRMED by direct ADR-173 read:

> Line 50: "EEF strands via a corpus-local Zod loader **inside `graph-corpus-sdk`** with no `graph-ingest` participation."

Also verified ADR-179:54-57 names `graph-corpus-sdk` as substrate; substrate ships no MCP code. The corpus types currently at `oak-curriculum-sdk/src/mcp/evidence-corpus/types.ts:64-226` (`EvidenceCorpus`, `EefStrand`, etc.) are substrate-shaped types misplaced in the MCP module. PR-1 must heal this. **Cost is real** (every consumer import updates) but it's a one-time relocation that prevents leak compounding.

**Critical #2 (freshness vitest insufficient)** — PARTIALLY CONFIRMED, scope softened:

Fred quoted ADR-175 as mandating a CI workflow. Direct ADR-175 read at lines 40-46:

> "validate the snapshot metadata before promoting the plan to ACTIVE … fail or block promotion when `last_updated` is older than the accepted threshold"

ADR-175's binding mandate is a **plan-promotion gate**, not a per-PR release gate. The minimum-compliant implementation is:

- `pnpm freshness:check` script that loads bundled snapshot, checks `last_updated` against `Date.now()` with 180-day threshold, exits non-zero on breach
- Extended `freshness.unit.test.ts` with invalid-date error path
- Plan-promotion checklist documenting that freshness check must run before any EEF plan promotes ACTIVE

A scheduled CI workflow IS additional excellence but is NOT ADR-mandated. Owner can opt in; not forced.

**HIGH WARNING (pre-existing types.ts leak)** — CONFIRMED. Verified types at `types.ts:64-226` are substrate-shaped. Heal absorbed into PR-1.

### Wilma — REVISED placement of "single best change"

Wilma's "contract-coherence cycle" between PR-4 and PR-5 is valuable but mis-placed. If the coherence check happens at PR-3 closeout AND reveals a mismatch with Inc 3 preconditions, the cure requires re-opening PR-2 — expensive. Better: bind the coherence check to **PR-2's cross-cutting reviewer (architecture-expert-betty)** so mismatch surfaces while PR-2 is still amendable.

Wilma's PR-1↔PR-2 parallel-merge serialisation concern is moot in the revised 4-PR sequential shape. Wilma's PR-1 type-cascade is real but low-probability (t1 is settled in corpus plan); pre-PR-1 z.infer spot-check covers it. Wilma's adapter-capability audit is sensible cheap practice — t6a only needs `subgraph` per corpus plan t6a content, which is implemented in WS4.5; the audit takes minutes.

### Assumptions — 3-PR compression REJECTED; PR-0 hygiene argument DEFENDED

Assumptions argued compress to 3 PRs. Direct architectural-identity test of 4-PR shape:

- **PR-0 freshness**: identity = "documents match reality." Single identity ✓
- **PR-1 boundary discipline**: identity = "the EEF data-path boundary is correctly positioned, validated, and gated." Three changes (relocation + loader + freshness binding) all touch the SAME data path's boundary contracts ✓
- **PR-2 surface**: identity = "EEF becomes a discoverable MCP surface." Tool + wire-up + E2E all serve this ✓
- **PR-3 closeout**: identity = "gate-1a contract locks for downstream." ✓

Compression to 3 PRs forces freshness binding to ride with closeout (weak identity) or with surface (cross-concern coupling). 4 PRs is the right shape.

Assumptions' Opus-quota concern — over-applied. Specialists default to Sonnet. Reviewer-proliferation concern is independently valid; PR-2 reviewer set dropped from 5 to 3 in-cycle + 1 cross-cutting on attention-dilution grounds.

Assumptions' ATTRIBUTION.md for `ff1` skip-rationale — CONFIRMED. Durable home; ff6 cross-references.

### Test-expert — fully CONFIRMED with one correction propagated

**"30 strands" is audit-shaped** — CONFIRMED. Corpus plan lines 639-651 explicitly prohibit count assertions on bundled data.

**`_meta.attribution` not `_meta.source`** — CONFIRMED by corpus plan line 66:

> "Source attribution lives on the response envelope (`_meta.attribution`, carrying `EEF_ATTRIBUTION`) not per-citation."

Propagated through every plan reference touched by PR-0.

**Binding test should be CI smoke script, not Vitest** — CONFIRMED, convergent with Fred's softened position. `pnpm freshness:check` script is the right shape.

**ff5 atomic-landing spirit** — CONFIRMED. Move ff5 entirely to PR-3 closeout.

**No skipped / no conditional / no global state in tests** — CONFIRMED. Explicit briefs required in PR-1 and PR-2.

### Betty — partially CONFIRMED with one verdict superseded

**Route `t15` to TSDoc not README** — CONFIRMED. Co-location with projection types > shared README.

**PR-3 ff5 intra-PR ordering note** — SUPERSEDED by test-expert's "move ff5 to PR-3" verdict (cleaner).

**ADR-123 enumeration debt** — CONFIRMED forward concern. Flag for docs-adr-expert at PR-2; schedule ADR-123 shape refactor before second corpus integration.

---

## The 4-PR delivery sequence

```text
PR-0 (plan freshness, ~4 plan files; no code)  [LANDED 2026-05-25]
   │  eliminates stale state for downstream PRs
   ▼
PR-1 (boundary discipline — verified ADR-173 + ADR-179 + ADR-175)
   │  relocate corpus types to graph-corpus-sdk
   │  add t2 Zod loader in graph-corpus-sdk
   │  add freshness check script + extend unit test + checklist note
   ▼
PR-2 (MCP feature surface)
   │  Agent A: t6a tool + tests
   │  Agent B: wire-up (barrel, register, ADR-123 amendment, t15 TSDoc)
   │  Agent C: E2E shape conditions
   │  Cross-cutting pre-merge: contract-coherence check vs Inc 3
   ▼
PR-3 (gate-1a closure ceremony)
      ff5 plan answers + Inc-3 verification record + ff6 acceptance + status syncs
```

**Owner direction this session: execute PR-0 only, then pause.**

---

### PR-0 — Plan freshness pass (no source code) [LANDED 2026-05-25]

**Architectural identity**: live documents match live reality. Preventative.

**File scope**

- `eef-first-feature.plan.md` — fix Drifts A, B, C1–C3, D, E, F, I
- `graph-stack.plan.md` — Drift G
- `eef.next-session.md` — Drift H
- This file landed into the repo for safe-keeping

**Pre-stage**: file-scoped claim registered via `pnpm agent-tools:collaboration-state -- claims open` (Wilma collision prevention).

**Intra-PR agents**: 1 implementer (narrative coherence).

**Acceptance signal** (verified at land time)

- `pnpm markdownlint:root` clean
- All `[ADR-N](...)` and `[plan-name](...)` links resolve
- `pnpm practice:fitness:informational` shows no new drift findings

---

### PR-1 — Boundary discipline (verified ADR-173 + ADR-179 + ADR-175)

**Architectural identity**: the EEF data-path boundary is correctly positioned, validated, and gated.

**File scope** — 2 file-disjoint agents

**Agent A — Substrate boundary heal + loader** (`packages/sdks/graph-corpus-sdk/src/eef-strands/`)

- **Relocate**: `EvidenceCorpus`, `EefStrand`, `RankOptions`, `CompareOptions`, `ExplainOptions`, `NotImplementedYet`, `ComparisonDimension`, `RankedItem`, `RankedResults`, `NodeExplanation`, `ComparisonResult`, `RankError`, `CompareError` from `oak-curriculum-sdk/src/mcp/evidence-corpus/types.ts:64-226` to `graph-corpus-sdk/src/eef-strands/types.ts`. **Replace, don't bridge** — delete old file; update all consumer imports to the substrate path. Per ADR-179:54-57 + ADR-173:50
- **Add loader**: `loader.ts` (Zod schema + parse function returning `Result<EvidenceCorpus, LoaderError>`)
- **Add bundled snapshot**: `eef-toolkit.json` (canonical source: confirm at execution whether to move from `.agent/plans/sector-engagement/eef/reference/` or duplicate with attribution)
- **Tests**: `loader.unit.test.ts` — `Result.ok` on valid fixture, `Result.err` on invalid (test-expert-verified shape); **NO count assertions** on bundled data. Plus `loader.integration.test.ts` that asserts `Result.ok` against bundled snapshot
- **Pre-stage spot-check**: Agent A runs `z.infer<typeof EefStrandSchema>` against existing `EefStrand` skeleton to verify no cascade into landed `t12-citation-shape` or `t9-guidance-constant`

**Agent B — Freshness check script + unit-test extension** (verified-minimum scope per ADR-175 §Implementation Notes)

- Add `scripts/check-eef-freshness.ts` (or workspace-equivalent path): loads bundled snapshot, calls existing `freshness.ts` check function with `Date.now()` and 180-day threshold, exits non-zero on breach. Standalone script, not a Vitest test
- Add `pnpm freshness:check` wiring in workspace `package.json`
- Extend `freshness.unit.test.ts` with invalid-date error path
- Document in plan-promotion checklist (in `.agent/plans/sector-engagement/eef/README.md` §Promotion Rule): "Run `pnpm freshness:check` before promoting any EEF plan from CURRENT to ACTIVE"
- **Optional excellence (NOT mandated by ADR-175)**: scheduled GitHub Actions workflow that runs `pnpm freshness:check` daily and alerts on breach

**Reviewers** (in-cycle, concurrent)

- `architecture-expert-fred` (ADR-173 + ADR-179 + ADR-175 compliance)
- `type-expert` (Zod schema-flow; relocated types preserve compile-time semantics; no widening)
- `test-expert` (loader tests describe system state; invalid-date path covered; no skipped/conditional/global)
- `docs-adr-expert` (plan-promotion-checklist documentation correctness)

**Cross-cutting pre-merge**: `architecture-expert-betty` (boundary-discipline coherence verdict).

**Acceptance signal**

- `pnpm --filter @oaknational/graph-corpus-sdk test` green
- `pnpm --filter @oaknational/oak-curriculum-sdk test` green
- `pnpm freshness:check` green against bundled snapshot
- `pnpm build` green across all workspaces (relocation surfaces any consumer-import breakage)
- No imports from the deleted `types.ts` path remain in the codebase

---

### PR-2 — EEF becomes a discoverable MCP surface

**Architectural identity**: EEF turns from substrate into a real MCP feature.

**File scope** — 3 SEQUENCED agents (Wilma + test-expert verdict: parallel is fiction)

**Agent A — Tool implementation** (`packages/sdks/oak-curriculum-sdk/src/mcp/evidence-corpus/`)

- `tools/eef-explore-evidence-for-context.ts` — imports relocated `EvidenceCorpus` from `@oaknational/graph-corpus-sdk/eef-strands` and `EefStrandsGraphView`
- `tools/eef-explore-evidence-for-context.unit.test.ts` — injected fake corpus + `EefStrandsGraphView` test double; asserts envelope:
  - Non-empty `citations` tuple
  - Non-empty `caveats` tuple
  - `data_version` populated
  - `_meta.attribution = EEF_ATTRIBUTION` (verified-canonical per corpus plan line 66; **NOT** `_meta.source = 'EEF Toolkit'`)
- Compile-time tuple smoke co-located with `citation-shape.ts`
- Pre-Agent-B handoff: Agent A confirms tool interface stable → Agent B starts

**Agent B — Wire-up** (after Agent A's interface in tree)

- SDK barrel: export `t6a` tool (verify `t10` prompt already exported)
- MCP registration: register `t10` prompt in MCP registry
- `docs/architecture/architectural-decisions/123-mcp-server-primitives-strategy.md`: amend Tools table to name `eef-explore-evidence-for-context`; amend Prompts table to name `eef-evidence-grounded-lesson-plan`. Flag ADR-123 enumeration-debt for forward refactor
- `t15`-partial: negative-space TSDoc on `NodeProjection` and `SubgraphRequest` types (co-located, per Betty)

**Agent C — E2E shape conditions** (after Agent B's registration in tree)

- File: `eef-explore-evidence.e2e.test.ts` IF running MCP server over STDIO; `.integration.test.ts` IF in-process (resolve at execution)
- Assertions: tool in `tools/list`; declared type matches; non-empty citations tuple at runtime via Zod `.min(1)`; `_meta.attribution` populated; no skipped, no conditional, no `existsSync` guards, no `process.env` reads

**Reviewers** (concurrent with each agent's commits)

- `mcp-expert` (tool primitive shape + registration semantics) — during Agent A + Agent B
- `type-expert` (Zod schema + envelope tuples) — during Agent A
- `test-expert` (atomic-landing across 3 agents; describe-vs-audit; no skipped/conditional/global) — concurrent throughout

**Cross-cutting pre-merge** (load-bearing): `architecture-expert-betty`. **Includes the contract-coherence check vs Inc 3 preconditions**:

- Read `graph-combinatorial-arc.plan.md` Inc 3 preconditions (tool naming, response envelope, freshness gate active, `_meta.attribution`, EEF strand naming + URI scheme)
- Compare against PR-2 outputs (Agent A's tool + Agent B's wire-up + Agent C's E2E)
- Produce ✓/✗ checklist; if any ✗, surface as PR-2 amendment BEFORE merge

**Acceptance signal**

- `pnpm test` green
- Tool callable end-to-end against bundled EEF data with real KS-bound seed context (e.g., KS2 maths + "feedback")
- Response envelope passes: compile-time tuple guard + runtime Zod parse + behavioural contract test + `_meta.attribution = EEF_ATTRIBUTION`
- `pnpm sdk-codegen && pnpm build` green
- Betty's contract-coherence checklist all ✓

---

### PR-3 — Gate-1a contract closure ceremony

**Architectural identity**: gate-1a contract locks for Inc 3 and cross-corpus consumers. No new product code.

**File scope**

- `ATTRIBUTION.md` — ff1 skip-rationale recorded as one-liner ("EEF already aware; formal opener deferred to gate-1b pre-public")
- `eef-first-feature.plan.md` — ff5 answered; ff3/ff4/ff5 → completed with landing SHAs; ff6 acceptance bundle filled in with substrate SHA + PR-2 commit SHAs + **PR-2 betty coherence-check verdict transcribed** + freshness last-run-date confirmation; frontmatter status: lifecycle taxonomy update
- `eef-evidence-corpus.plan.md` — sync gate-1a todo statuses
- `graph-mvp-arc.plan.md` — gate-1a `status: completed`; gate-1b focus
- `open-education-knowledge-surfaces.plan.md` — WS-3 status update
- `eef.next-session.md` — closeout entry
- `repo-continuity.md` — gate-1a closure record

**Reviewers**

- `docs-adr-expert` (plan-shape + closure-record completeness)
- `release-readiness-expert` (formal go/no-go on gate-1a)
- `architecture-expert-betty` (gate-1a contract locked correctly for downstream)

**Acceptance signal**

- Gate-1a status emitted as completed across every plan that references it
- Inc 3 (combinatorial arc) and cross-corpus surfaces can begin unblocked
- `pnpm markdownlint:root` clean; `pnpm practice:fitness:informational` clean
- `release-readiness-expert` GO

---

## Architectural commitments held across the sequence

- **Substrate-vs-transport discipline (ADR-179:54-57)** — substrate workspaces ship no MCP code; PR-1 heals the pre-existing leak
- **First-wave-ingestion-scope (ADR-173:50)** — EEF Zod loader lives in `graph-corpus-sdk/src/eef-strands/`; `graph-ingest` does not participate
- **Freshness governance (ADR-175:40-46)** — `pnpm freshness:check` script + plan-promotion checklist; scheduled CI workflow is optional excellence (NOT mandated)
- **ADR-157 governance status** — cited as direction (Proposed), not constraint; ADR-175 (Accepted) is binding for `eef-*` prefix + `_meta.attribution`
- **Atomic-landing invariant** — product + tests in one commit per cycle; ff5 lands in PR-3 closeout per test-expert
- **Schema-first execution** — Zod loader (PR-1) precedes consumer (PR-2)
- **Strict types everywhere, always — one rule, multiple mechanisms** — the repo rule of strict everything everywhere all the time applies uniformly. For OpenAPI-derived data the mechanism is `pnpm sdk-codegen`; for EEF (and any non-OpenAPI source) the mechanism is Zod-validated at load time per ADR-157 §Typing Discipline. The discipline is identical: no `any`, no widening, no permissive defaults, no `z.unknown()` escape hatches, exhaustive parsing, exact types, `Result<T, E>` on every fallible operation, discriminated unions where the data varies. PR-1's loader honours this in full — the Zod schema is exact to the EEF JSON shape, not a permissive shim
- **All quality gates blocking, always** — `pnpm freshness:check` exit-code failures are blocking when run
- **Replace-don't-bridge** — PR-1 deletes old `types.ts`; no compatibility shim
- **No skipped / no conditional / no global state in tests** — explicit in every PR brief
- **`describe-vs-audit` test shape** — every test reshaped per test-expert verdict

---

## Trade-offs considered (post-critical-assessment)

**Why 4 PRs not 3?** — Each PR maps to one architectural identity (verified by direct identity test). Compression to 3 forces freshness binding to ride with closeout (weak fit) or surface (cross-concern). Assumptions' compression argument rejected.

**Why 4 PRs not 6?** — Original 6-PR sketch split by reviewer pool, which is operational not architectural.

**Why softened Fred's freshness scope?** — ADR-175 binds plan-promotion gating, not per-PR CI gating. Pretending the ADR mandates more than it does is mis-citation, not excellence.

**Why move contract-coherence check from PR-3 to PR-2 cross-cutting?** — Discovered at PR-3 = expensive to fix (PR-2 already merged). Discovered at PR-2 cross-cutting = cheap to fix.

**Why serial agents in PR-2 not parallel?** — Verified: barrel ordering + registration-before-E2E + E2E-on-stable-tool serialise the work regardless of file-disjointness.

**Why drop sentry-expert from PR-2 reviewers?** — Telemetry pattern landed at `t14`; PR-2 only consumes. Reviewer-proliferation argument valid even when Opus quota doesn't bind.

**Why ATTRIBUTION.md for ff1 not just ff6?** — Acceptance-bundle entries are buried in closed plans; ATTRIBUTION.md is the durable home.

**Why route negative-space doc to TSDoc not README?** — Co-location with the types defining the contract. READMEs drift.

---

## Verification

After each PR lands:

1. `pnpm sdk-codegen && pnpm build && pnpm type-check && pnpm test` (relevant workspace filter)
2. `pnpm practice:fitness:informational` — capture any new drift
3. `pnpm markdownlint:root` (for PR-0 and PR-3)
4. **PR-1 specific**: `pnpm freshness:check` green; no consumer imports the old `types.ts` path; `architecture-expert-fred` issues compliance verdict; plan-promotion checklist documented
5. **PR-2 specific**: live MCP-client round-trip against `eef-explore-evidence-for-context` with KS2 maths + "feedback"; response envelope visible in client; `_meta.attribution` populated (NOT `_meta.source`); Betty contract-coherence checklist ✓ before merge
6. **PR-3 specific**: gate-1a closure recorded across all touched plans; `release-readiness-expert` GO

---

## Pattern legacy for future evidence corpora

Each PR establishes a reusable contract:

- **PR-0 pattern**: "freshness-before-execution" — any plan layer reflecting stale reality is a PR-0 surface
- **PR-1 pattern**: substrate-boundary placement + corpus-local loader + plan-promotion freshness check — for corpus #2, compresses to loader + freshness check (no boundary correction once EEF correction lands)
- **PR-2 pattern**: tool + serial wire-up + E2E with PR-time coherence check — directly reusable
- **PR-3 pattern**: contract-closure ceremony with verification record — reusable invariant

**ADR-123 enumeration debt** (Betty's forward flag) is the one shape that will not scale; address before second corpus integrates.

---

## Honest limits of this assessment

What I directly verified:

- ADR-173:50 "EEF strands ... inside `graph-corpus-sdk`" (Fred CRITICAL #1)
- ADR-175:40-46 binding mechanism (Fred CRITICAL #2 softened)
- ADR-179:54-57 substrate discipline scope
- Corpus plan line 66 `_meta.attribution` canonical (test-expert)
- On-disk state of `oak-curriculum-sdk/src/mcp/evidence-corpus/` (substrate leak confirmed; freshness.ts already landed)

What I did NOT independently verify:

- Whether the codebase auto-regenerates barrels (Wilma serialisation concern — moot in sequential 4-PR shape)
- Exact import-consumer count for the relocated types (will surface at PR-1 build)
- Whether `eef-toolkit.json` should move or duplicate (resolve at PR-1 execution)
- Whether the lifecycle taxonomy uses `archive`, `landed`, or `completed` for closed plans (verify at PR-3 execution against repo conventions)

These unknowns do not block PR-0 (already landed); they are flagged for the PRs that depend on them.

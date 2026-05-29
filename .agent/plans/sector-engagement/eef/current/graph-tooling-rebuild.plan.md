---
title: Graph-tooling rebuild — plan (SPECIFIED)
status: specified (Goal 1 design settled + owner-ratified 2026-05-28; ready for Goal 2)
date: 2026-05-28
foundation: ./graph-tooling-rebuild-foundation-2026-05-28.md (single source of truth — read first)
supersedes: ../archive/* (the gate-1a/1b EEF plan estate)
---

# Graph-tooling rebuild — plan (SPECIFIED)

**Read the foundation first:**
[`graph-tooling-rebuild-foundation-2026-05-28.md`](./graph-tooling-rebuild-foundation-2026-05-28.md).
This plan is built on it. Goal 1 (settle the design) is **done and
owner-ratified (2026-05-28)**: the one open question — the selection / scoping
strategy — is resolved below, and the deliverable spine D0–D6 + DX is fully
specified. What remains is Goal 2 (implement).

## Purpose (discovery framing)

Build tools that **surface graphs (subgraphs) to LLM agents** — that traverse,
select, query, and understand graph data and deliver complete, navigable
subgraphs in a form suitable for agents — **as instruments to explore** how best
to deliver value to teachers. Teacher value is the north star; the immediate
beneficiary of this work is *us-able-to-explore*. Success at each step is "the
next exploration is now possible", not "a teacher used a feature".

The gate-1a / gate-1b split is **removed**. There is no "later gate": the
deliverable chain D0–D6 + DX is the **complete** capability and it terminates at
D6. Capability that is genuinely out of scope is *removed* (no soft stubs) and,
where worth keeping, homed as a candidate in the new
[`extending-graph-support-tooling`](../../../connecting-oak-resources/knowledge-graph-integration/future/extending-graph-support-tooling.plan.md)
plan — not deferred to a gate.

## Resolved design (Goal 1 — owner-ratified 2026-05-28)

**Selection / scoping strategy: membership, full nodes — effectively one axis.**

A delivered subgraph for a lesson context =

- **Membership** — context-matched **seeds** (relevance match on
  `school_context_relevance`; free-text fallback for the 13 relevance-less
  strands) **∪** their **bounded traversal neighbourhood** (`subgraph`, depth
  default 1) — plus **all `related_strand` edges among the included nodes**.
  Sparse (edge-less) seeds are legitimate members; a subgraph may be contiguous
  or sparse.
- **Full nodes** — every included node carries its full detail. No
  field-mask-for-budget, no runtime cap, no per-node thinning.
- **Navigable frontier** — a node's `related_strands` pointing outside the
  subgraph are **reachable** via the graph query surface (`getNode` /
  `subgraph` from that id). The agent traverses; this is the graph value, not a
  budget patch.

**Why full nodes, not graded progressive disclosure.** Graded disclosure is not
a helpful lever for this corpus. The whole 30-strand corpus is **~21k tokens,
under the ~25k agent ceiling** — full nodes *always fit under the ceiling*, so
graded disclosure solves no budget problem while handing the agent strictly
*less*. The 10k *preferred* target is a **design signal**, never a runtime cap:
a broad context (e.g. KS2 + `improving_reading` → 14 strands ≈ 12–14k) exceeds
the preferred target, and that is **honest breadth, surfaced — never truncated**.
(Foundation principle 5's role-graded disclosure stays a *general* graph-tool
option for corpora that genuinely cannot fit; EEF does not trigger it.)

**Why no ranking-to-top-N.** Rank-then-cut is sort-plus-slice — a **list-op**,
the exact anti-pattern. The value of delivering a *graph* is that the agent
reasons across the complete scoped subgraph. Relevance *ordering* is a candidate
enhancement, not part of graph delivery.

**Settled outcomes folded in:**

- **Encoding** — `structuredContent` only; drop the dual `content[]` block and
  any context hint (`oakContextHint`). (Foundation principle 8.)
- **Scope boundary** — agent-facing MCP tool; **no UI/widget, no second
  audience**. (Foundation §9.)
- **Completeness = integrity + traceability** (not maximalism) — every shown
  node carries the inseparable **integrity floor** `{impact_months,
  evidence_strength_rating + label, cost}`; full nodes satisfy it trivially. The
  data makes it non-negotiable: `homework` is `+5mo / Very Limited`,
  `repeating-a-year` `−2mo`, `learning-styles` `null / Insufficient`, vs
  `metacognition` `+8 / Extensive`. Impact without its uncertainty is dangerous.

**Capability boundary.** This arc's complete capability is graph **delivery** —
the graph query surface + the thin delivery tool + the proven navigation loop.
The corpus-analytical operations `EvidenceCorpus.rank / explain / compare` (the
old gate-1b inventory) are **out**: they are **type-only** today
(`interface EvidenceCorpus` + `RankError` / `CompareError` aliases in
`types.ts`; no runtime implementor), so removal is a type deletion, and the
capability ideas are preserved as candidates in the enhancements plan. This is
scope, not deferral.

### Worked examples (the evidence)

Real corpus:
[`packages/sdks/graph-corpus-sdk/src/eef-strands/eef-toolkit.ts`](../../../../../packages/sdks/graph-corpus-sdk/src/eef-strands/eef-toolkit.ts)
(30 strands; 17 carry `related_strands` edges, 17 carry
`school_context_relevance`; `improving_reading` is the most common priority — in
10 of 17 relevance-bearing strands).

- **A — KS2, focus `improving_reading` (broad):** seeds = 10 (feedback,
  metacognition, one-to-one, oral-language, reading-comprehension, small-group,
  extending-school-time\*, homework\*, parental-engagement\*, peer-tutoring;
  \* = relevant but edge-less → legitimate sparse region). `subgraph(depth=1)`
  adds mastery-learning, collaborative-learning, **phonics** (connected though
  EYFS/KS1, so never a seed here), teaching-assistant → **14 full strands ≈
  12–14k tokens** (over the 10k target, under the 25k ceiling — honest breadth,
  surfaced not cut). The neighbourhood spans strong (`feedback +6/Extensive`)
  and weak (`homework +5/Very Limited`) evidence — full nodes keep that visible.
- **B — KS3, focus `metacognition_and_self_regulation` (tight):** seeds = 2
  (metacognition, collaborative-learning); `depth=1` adds feedback, oral-language,
  reading-comprehension, peer-tutoring → **6 full strands ≈ 5–6k** — comfortably
  under target.
- **C — no focus (e.g. KS2 only):** key-stage barely filters (most strands span
  KS2–KS4) → very broad selection. An honest *finding* the instrument surfaces
  (should `focus` be required? is ordering wanted?) → feeds the enhancements plan
  at D6. Not cured by truncation.

## End goal + bounded goals (no endless follow-ons)

**End goal (terminal):** a reusable graph-delivery capability — proven once on
the EEF corpus — that hands LLM agents complete, navigable subgraphs, with the
"working with graphs" doctrine extracted. The arc COMPLETES at D6.

### Goal 1 — Fix the plan (DONE, owner-ratified 2026-05-28)

Selection/scoping resolved (above) via worked examples on the real corpus;
settled outcomes folded in; D0–D6 + DX fully specified; owner ratified.

### Goal 2 — Implement the plan

Execute the deliverables. **Done when D0–D6 + DX each pass their measurable
gate** (below). The self-correcting chain TERMINATES at D6. Every "follow-on"
folds into a deliverable's gate, is explicitly closed, or is homed in the
enhancements plan — never left as ambient future sessions. D6's output names the
*next* value-work as a fresh owner decision, not a continuation of this arc.

## Planning method — self-correcting deliverables (foundation §5)

Deliverables are sequenced by **consumption**: `D(n+1)` builds on / exercises
`D(n)`, so a drifted, stubbed, or sliced `D(n)` makes `D(n+1)`'s measurable gate
**fail**. For each deliverable: **(a)** measurable acceptance, **(b)** what it
consumes, **(c)** how its gate breaks if the predecessor drifted. This plan is
the first instance of the methodology; graduate it *from* this plan at D5.

---

## D0 — Merge-safety (precondition)

Land the sound foundation on `main` with the wrong-shaped tool quarantined.

- **Outcome:** PR #122 (`feat/graph-foundations`) merged to `main`, with both
  user-facing EEF surfaces (`eef-explore-evidence-for-context` tool AND
  `eef-evidence-grounded-lesson-plan` prompt) co-gated behind
  `OAK_CURRICULUM_MCP_EEF_ENABLED` — default OFF in code, **OFF in every deployed
  environment (preview + production), enabled only in local development**. No
  live orphan-prompt.
- **Prerequisite — fix ALL open quality signals first (owner-directed
  2026-05-28; the next session's first step).** The PR must be genuinely clean
  before merge; every cure is the COMPLETE fix, never suppression. From the
  2026-05-28 Sonar/review pass (verify the live set at execution time):
  1. **2 Sonar `new_violations`** (`typescript:S7763`, "use `export…from`") in
     `oak-sdk-codegen/src/types/generated/search/{fixtures.ts:155,
     index-documents.ts:10}` — these are GENERATED files: **fix the
     `@oaknational/sdk-codegen` generator** to emit the re-export form, then
     regenerate. Do NOT exclude `**/generated/**` from Sonar and do NOT hand-edit
     generated output (generator-first; the exclusion is a suppress-the-signal
     escape hatch — foundation §9).
  2. **1 Sonar security hotspot** at
     `agent-tools/src/claude/statusline-identity.ts:112` (PATH) — assess and
     remediate (fix if unsafe; a genuine documented review per
     `docs/governance/sonar-disposition-policy.md` only if genuinely safe).
  3. **3.9% `new_duplicated_lines_density`** (>3%) — RESOLVED via the
     owner-decided **external-data file convention** (2026-05-29). The duplication
     is entirely the EEF corpus *data* file (an external EEF snapshot), so DRY
     would distort fidelity to the source. Cure: rename →
     `eef-toolkit.external-data.ts`; a `**/*.external-data.ts` cpd-exclusion
     **pattern** in both `sonar-project.properties` + `.sonarcloud.properties`;
     a new `sonar-disposition-policy.md` §Duplications class; and an enforcing
     `validate-external-data-files` repo-validator (the anti-abuse contract).
     NOT a code de-duplication, NOT a path-only exclusion. (Pattern, not path,
     so it survives file moves.)
  4. **Valid review comments** — PDR-085 README status (`Proposed` → `Accepted`,
     verified against the PDR header); `.agent/state/collaboration/.gitignore`
     pattern (`_temp-*` → `_tmp-*`); `prompt-schemas.ts:81` focus docstring
     (soften — the tool enforces `EEF_PRIORITIES`; MCP prompt args are
     string-typed). The `execution.ts:84` `error.kind` leak is on the EEF tool D3
     rebuilds — fix it in whichever lands first; do not drop it.
  Merge proceeds only once the SonarCloud QG is green (0 new violations, hotspot
  reviewed, duplication ≤3%) and the valid comments are resolved.
- **(a) Measurable — all three conditions hold before merge:**
  1. **PR is safe** — CI green; required reviews/checks cleared (PR #122 is
     `MERGEABLE` but `mergeStateStatus: BLOCKED` on required review/checks — D0
     *clears* those, it does not bypass them); the wrong-shaped tool stays
     quarantined; no live orphan-prompt.
  2. **Flag is proven** — an integration test proves **flag OFF → neither
     surface registered**, **flag ON → both**.
  3. **Flag is OFF everywhere except local development** — confirmed unset/false
     in every deployed environment, ON only locally. This is a **checked**
     condition, not an assumed one: the code default OFF (`env.ts:48`) is
     necessary but a deployed env-var could override it, so verify the actual
     deployed env config (via the project Vercel MCP, not the CLI) shows the flag
     unset/false in preview and production.
- **(b) Consumes:** the current branch.
- **(c) Self-correction:** verify-don't-trust — co-gating is *already* present
  (`apps/oak-curriculum-mcp-streamable-http/src/handlers.ts:168`;
  `.../register-prompts.ts:123`; default OFF at `.../env.ts:48`). The gate FAILS
  if co-gating is incomplete, the proving test is absent, the PR is not actually
  mergeable, **or the flag is set ON in any deployed environment**. Standalone
  precondition; the rebuild chain begins at D1.

## D1 — Author the graph-tool contract (ADR)

Crystallise this session's ratified design into the permanent contract D2–D4
build to (plans are ephemeral; ADRs are permanent).

- **(a) Measurable:** an ADR states the **graph-tool category** invariants —
  `structuredContent` only; no context hint; **full-node, membership-scoped,
  complete-within-itself** subgraph; integrity floor; navigable frontier via the
  query surface; **budget is a design signal, never a runtime cap**; **no
  list-ops** (no slice / cap / field-mask-for-budget / rank-and-cut) — plus the
  EEF selection/scoping definition, **precise enough that D3's worked-example
  acceptance tests (contexts A/B/C) are derivable from it**. Owner ratifies.
- **(b) Consumes:** this plan's resolved design + the foundation.
- **(c) Self-correction:** D1 is what D2/D3 build to. It is the **relatively
  softest link** — a vague ADR (prose) will not mechanically fail a code gate
  the way a stubbed op does. Mitigation: D1 is not "done" until the contract can
  *generate* D3's worked-example test assertions; residual vagueness then
  surfaces at D3 as acceptance that cannot be specified.

## D2 — Build the graph query surface (no stubs)

Un-stub the GraphView ops so the surface the foundation says was *never built*
exists over the real corpus.

- **(a) Measurable:** `enumerateNodes(filter)`, `findByTag`, `neighbours`,
  `getNode`, `summary` are **built** (joining `subgraph` + `manifest`, already
  live), return real results, with integration tests on the 30-strand corpus.
  **Selection relocates into `enumerateNodes(filter)`** (foundation §1: the
  hand-rolled selection *was* `enumerateNodes`) — the `selectEefSeedIds` matching
  logic becomes a `NodeFilter`. The five live `Result.err(NotImplementedYet)`
  stubs in `graph-view.ts:171–196` are gone (built). The **type-only**
  `EvidenceCorpus.rank/explain/compare` interface + `RankError`/`CompareError`
  aliases (`types.ts`; no runtime implementor) are **removed**; their ideas land
  in the enhancements plan. **Reconcile the `gate-1a/1b`/`Inc.3` docstrings in
  every source file D2 rewrites.**
- **(b) Consumes:** D1's contract.
- **(c) Self-correction:** **THE link missing in F** — D3 must build the complete
  subgraph on these ops; if any is stubbed/missing the tool cannot assemble it
  (the absence/throw is loud).
- **Reuse (salvage):** `eef-graph-model.ts` (`buildGraphIndex`,
  `traverseSubgraph`), `selection.ts` (→ filter), `loader.ts`, `freshness.ts`,
  `strand-schema.ts`, `school-context.ts`.

## D3 — Build the graph-delivery tool (thin formatter)

Rebuild `eef-explore-evidence-for-context` as a thin formatter over D2.

- **(a) Measurable:** for the worked-example contexts (A: KS2+reading → 14 full
  strands; B: KS3+metacognition → 6; C: a no-focus broad case), the tool returns
  the complete **full-node** subgraph + **all edges among members** + envelope
  (corpus caveats + EEF attribution once), as **`structuredContent` only** (no
  `content[]`, no context hint), on real data — with out-of-subgraph references
  carrying enough id to be fetched via D2. `projectExploreNode` (field-mask,
  `.../projection.ts`) and `capForBudget` (cap, `.../response-budget.ts`) are
  **removed**. The tool holds **no scoping brain** beyond calling
  `enumerateNodes(filter)` then `subgraph`. **Reconcile the `gate-1a/1b`
  docstrings in every tool file D3 rewrites.**
- **(b) Consumes:** D2's query surface + D1's contract.
- **(c) Self-correction:** if a D2 op is missing/stubbed → cannot assemble
  (loud); if D1's contract was vague → wrong shape surfaces here.

## D4 — Prove an agent can consume and traverse

The navigation loop works end to end.

- **(a) Measurable:** a real MCP-client round-trip where the agent receives a
  subgraph, then follows a `related_strand` reference pointing **outside** the
  returned subgraph by calling `getNode`/`subgraph` and receives the connecting
  node/subgraph (progressive disclosure **by navigation**, not field-mask); ≥1
  telemetry span recorded.
- **(b) Consumes:** D3.
- **(c) Self-correction:** if D3's subgraph did not expose navigable
  out-of-subgraph references (missing ids, broken edges), D4 fails — exposing
  D3/D2 drift.

## D5 — 'Working with graphs' doctrine + graduate the methodology

- **(a) Measurable:** initial 'working with graphs' skill(s) authored, grounded
  in the real built tool — graph≠list; the list-ops that must never touch a
  graph (slice / cap / field-mask-for-budget / **rank-and-cut**); completeness =
  integrity + traceability; **full-node delivery + navigable frontier** (and
  *why* graded disclosure was considered and not needed for a corpus under the
  ceiling); contiguous vs sparse subgraphs; the soft-stub failure mode. ALSO
  graduate the **self-correcting-deliverables** methodology (foundation §5) and
  address the **Definition-of-Delivery instrument-deliverable** refinement
  (foundation §6).
- **(b) Consumes:** D1–D4 (real instances + lived doctrine).
- **(c) Self-correction:** if the doctrine cannot be grounded in the real built
  tool/contract, that signals D1–D4 did not establish it concretely.

## D6 — Use the instrument: explore the value path

With graph-delivery tools in hand, explore what best helps teachers and identify
the next value-work.

- **(a) Measurable:** documented findings from exercising the instrument; the
  enhancements plan is populated with discovered candidates (rank/explain/compare,
  relevance-ordering, whether `focus` should be required, additional corpora,
  cross-corpus, prose-delivery — each tagged build-now or add-to-plan per owner
  decision); the next concrete value step is named (a fresh owner decision, the
  arc's terminus — not a continuation).
- **(b) Consumes:** D3/D4 (the working instrument).
- **(c) Self-correction:** if agents cannot meaningfully work with the delivered
  graphs, that surfaces here as "exploration not actually enabled".

## DX — Estate-wide reference reconciliation (after D1; not a pre-D1 sweep)

- **(a) Measurable:** live `gate-1a/1b` references reconciled to the new framing
  across the ~30 live surfaces the inventory found — highest density:
  `eef.next-session.md` (~34), `graph-portfolio-index.md` (~10),
  `oak-misconceptions-eef-cross-corpus-surface.plan.md` (~12),
  `graph-stack.plan.md` (~6), `graph-query-layer.plan.md` (~5),
  `high-level-plan.md`, the `knowledge-graph-integration/` plan area,
  `repo-continuity.md` (Nebulous-owned — coordinate, do not edit unilaterally).
  **Plus the SDK *source* docstrings not rewritten by D2/D3** — ~16 files under
  `graph-corpus-sdk/src/eef-strands/` and
  `oak-curriculum-sdk/src/mcp/evidence-corpus/` carry stale `gate-1a/1b`/`Inc.3`
  prose (e.g. `eef-toolkit.ts`, `school-context.ts`, `loader.ts`,
  `strand-schema.ts`, `freshness.ts`, `eef-evidence-guidance.ts`) that the
  `.agent/`-estate inventory missed. Archived plans under `eef/archive/` are left
  alone.
- **(b) Consumes:** D1 (cannot reconcile until you know what to reconcile TO).
- **(c) Self-correction:** stale references surfacing during D2–D6 indicate
  incomplete reconciliation.

---

## Verification

**Goal 1 (this session) — done when ALL hold:**

- The selection/scoping strategy is resolved to a written, owner-ratified
  definition of "intelligently scoped, complete-within-itself subgraph"
  (full-node membership), grounded in the worked examples. ✓
- Settled outcomes folded in (encoding = `structuredContent`-only; scope =
  agent-facing, no UI; capability boundary = graph delivery; analytics → new
  plan). ✓
- D0–D6 + DX upgraded skeleton → fully specified, each with concrete
  (a)/(b)/(c). ✓
- Owner ratifies. ✓ (2026-05-28)

**Goal 2 (implementation)** — per-deliverable: each `(a)` is the measurable
gate, and the chain is self-correcting (a drifted `D(n)` breaks `D(n+1)`'s gate,
strongest at D2→D3→D4).

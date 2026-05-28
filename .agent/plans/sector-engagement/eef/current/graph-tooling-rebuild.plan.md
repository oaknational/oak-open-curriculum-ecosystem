---
title: Graph-tooling rebuild — plan (SKELETON)
status: skeleton (deliverable spine drafted; content firms at D1 — do NOT treat as fully specified)
date: 2026-05-28
foundation: ./graph-tooling-rebuild-foundation-2026-05-28.md (single source of truth — read first)
supersedes: ../archive/* (the gate-1a/1b EEF plan estate)
---

# Graph-tooling rebuild — plan (SKELETON)

**Read the foundation first:**
[`graph-tooling-rebuild-foundation-2026-05-28.md`](./graph-tooling-rebuild-foundation-2026-05-28.md).
This plan is built on it and inherits its firm/open registers. It is a
**skeleton**: the deliverable *spine* is drafted; most deliverable *content* is
deliberately open and firms at **D1**. Do not over-anchor on it.

## Purpose (discovery framing)

Build tools that **surface graphs (subgraphs) to LLM agents** — that traverse,
select, query, and understand graph data and deliver complete, navigable
subgraphs in a form suitable for agents — **as instruments to explore** how best
to deliver value to teachers. Teacher value is the north star; the immediate
beneficiary of this work is *us-able-to-explore*. Success at each step is
"the next exploration is now possible", not "a teacher used a feature".

The gate-1a / gate-1b split is **removed**. This plan replaces it with an
end-goal plus a self-correcting deliverable sequence.

## Planning method — self-correcting deliverables (firm; foundation §5)

Deliverables are sequenced by **consumption**: D(n+1) builds on / exercises
D(n), so a drifted, stubbed, or sliced D(n) makes D(n+1)'s measurable gate
**fail**. For each deliverable: **(a)** measurable acceptance, **(b)** what it
consumes, **(c)** how its gate breaks if the predecessor drifted. If (c) cannot
be stated, the link is not self-correcting and the plan has drifted — fix the
plan, not the gate. This plan is the first instance of this methodology;
graduate the methodology *from* it (D5).

---

## D0 — Merge-safety (precondition; owner-directed first next-session deliverable)

- **Outcome:** PR #122 (`feat/graph-foundations`) merged to `main`, with all
  user-facing EEF surfaces (the `eef-explore-evidence-for-context` tool AND the
  `eef-evidence-grounded-lesson-plan` prompt) behind `OAK_CURRICULUM_MCP_EEF_ENABLED`,
  default OFF. The wrong-shaped tool is quarantined behind the flag pending
  rebuild; no live orphan-prompt.
- **(a) Measurable:** PR merged; CI green; a test/inspection proves that with the
  flag OFF neither EEF surface is served, and with it ON both are (co-gating
  holds).
- **(b) Consumes:** the current branch.
- **(c) Self-correction:** verify-don't-trust — increment E (`9554ffbc`) likely
  already co-gated both; the gate FAILS if that co-gating is incomplete or the
  PR is not actually mergeable. (Standalone precondition; the rebuild chain
  begins at D1.)

## D1 — Restate the end-goal + define the graph-tool contract (DESIGN; resolves the open questions)

- **Outcome:** an owner-ratified written definition of what we are building.
- **(a) Measurable:** a document (likely a PDR / ADR + an `oak-plan`-conformant
  spec) that states: the **graph-tool category** and its invariants (inherits
  base-tool constraints; `structuredContent` only; no context hint;
  complete-within-itself subgraph payload; navigable links to connecting
  subgraphs; budget as design signal not cap); a precise definition of
  **"complete within itself"** and **"intelligently scoped subgraph"** (contiguous
  or sparse; when a subset of node values is legitimate); and the **client
  research findings** (what claude.ai — the desktop/web app, NOT Claude Code —
  and ChatGPT.com actually read from MCP responses). Owner ratifies.
- **(b) Consumes:** the foundation doc + fresh client research.
- **(c) Self-correction:** this is the spec D2–D4 build to; if it is vague, D2's
  "build to the contract" gate cannot be met cleanly — the vagueness surfaces at
  D2 immediately.
- **GAPS (foundation §10):** the graph-tool invariants, "intelligently scoped",
  the client research, and the end-goal restatement are all resolved HERE. This
  deliverable is where we stop not-knowing.

## D2 — Build the graph query surface (no stubs)

- **Outcome:** the real graph query operations exist over the real corpus.
- **(a) Measurable:** `enumerateNodes(filter, projection, page)`, `findByTag`,
  `neighbours`, `getNode` (and corpus `rank`/`explain` if D1 requires them) are
  BUILT, returning real results, with integration tests on real data. The soft
  `Result.err(NotImplementedYet)` stubs are removed — built, or throwing (honest).
- **(b) Consumes:** D1's contract.
- **(c) Self-correction:** D3 must be built on these ops; if any is stubbed/fake,
  D3 cannot be built (the throw makes the hole loud). **This is the exact link
  that was missing in F** — nothing consumed the stubbed ops with a measurable
  gate, so the hole hid.
- **Reuses (salvage):** loader, schema, data-derived vocabulary, BFS traversal
  primitive; the context-matching *logic* relocates here as a filter/rank.

## D3 — Build the graph tool(s): deliver complete, navigable subgraphs

- **Outcome:** a graph tool returns an intelligently-scoped, complete-within-itself,
  navigable subgraph for a real context.
- **(a) Measurable:** for a real lesson context, the tool returns a subgraph that
  is complete in the foundation §2.3 sense (relationships represented;
  evidence+uncertainty intact; referenced-but-absent nodes reachable via links),
  as `structuredContent` only, within budget **by design** (not by cap), on real
  data. Citations/caveats are part of node completeness.
- **(b) Consumes:** D2's query surface + D1's contract.
- **(c) Self-correction:** if D2 drifted (incomplete query surface), the tool
  cannot assemble a complete subgraph; if D1's contract was vague, the tool's
  shape is wrong — both surface here.
- **GAP:** the exact scoping intelligence (how the region/sparsity/links are
  chosen) is open until D1.

## D4 — Prove an agent can consume and traverse

- **Outcome:** the navigation loop works end to end.
- **(a) Measurable:** a real MCP-client round-trip where an agent receives a
  subgraph and successfully requests a **connecting** subgraph via the navigable
  links (progressive disclosure by navigation, not field-masking); ≥1 telemetry
  span.
- **(b) Consumes:** D3.
- **(c) Self-correction:** if D3's subgraph was not actually navigable (links
  missing/broken/incomplete), D4 fails — exposing D3 drift.
- **GAP:** which client(s) we prove against depends on D1's research.

## D5 — 'Working with graphs' skills + supporting docs; graduate the methodology (owner-directed)

- **Outcome:** initial reusable doctrine, grounded in what D1–D4 actually built.
- **(a) Measurable:** initial 'working with graphs' skill(s) + supporting
  documentation authored (graph≠list; the list-ops that must never touch a
  graph; completeness-as-integrity; contiguous vs sparse subgraphs; navigable
  links; graph tools as a category; the soft-stub failure mode) — extracted from
  the real built tool/contract, not abstract. ALSO graduate the
  self-correcting-deliverables planning methodology (foundation §5) and address
  the Definition-of-Delivery refinement question (foundation §6).
- **(b) Consumes:** D1–D4 (the real instances + lived doctrine).
- **(c) Self-correction:** if the skills cannot be grounded in a real built
  tool/contract, that signals D1–D4 did not establish the doctrine concretely.

## D6 — Use the instrument: explore the value path

- **Outcome:** with graph-delivery tools in hand, explore what additional tools
  or other things best help deliver value to teachers (the actual discovery
  purpose) and identify the next value-delivery work.
- **(a) Measurable:** documented findings from exercising the instrument that
  identify the next concrete value-delivery step (possibly: a prose-delivery
  tool, additional corpora, ranking — unknown yet, that is the point).
- **(b) Consumes:** D3/D4 (the working instrument).
- **(c) Self-correction:** if agents cannot meaningfully work with the delivered
  graphs, that surfaces here as "exploration not actually enabled".

## DX — Estate-wide reference reconciliation (cross-cutting; do NOT rush as a sweep)

- **Outcome:** the discarded gate-1a/1b framing and the archived EEF plans no
  longer mislead any LIVE surface.
- **(a) Measurable:** live references reconciled to the new foundation/plan
  across the plan estate — at least `high-level-plan.md`,
  `graph-portfolio-index.md`, the `connecting-oak-resources/knowledge-graph-integration/`
  plan area (which also encodes gate-1a/1b), the relevant thread next-session
  records, and `repo-continuity.md` (Nebulous-owned — coordinate, do not edit
  unilaterally).
- **(b) Consumes:** D1 (you cannot reconcile until you know what to reconcile TO).
- **(c) Self-correction:** stale references surfacing during D2–D6 indicate
  incomplete reconciliation.
- **NOTE:** the damaging concepts are woven across ~30 surfaces; this is real
  realignment work, sequenced AFTER D1, never a hasty pre-D1 sweep.

---

## Open questions (consolidated; foundation §10 is canonical)

Resolved at D1: graph-tool invariants; "intelligently scoped" / "complete within
itself"; the client research (claude.ai + ChatGPT.com read behaviour); the
restated end-goal; how we measure "exploration enabled". Held open until then.

## How to use this skeleton

D0 is the immediate next-session deliverable. D1 is the design/research gate that
turns this skeleton into a fully specified plan — it is where the open content
firms. Re-ratify the spine at D1; it is a hypothesis, not a fixed sequence.

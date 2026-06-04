---
title: "Migration-plan overhaul — replace behaviour-preservation with design-in-our-power"
status: completed
completed_date: 2026-06-04
lane: current
type: executable
thread: eef
date: 2026-06-04
owner_scope: >-
  A metaplan. It scoped the overhaul of
  graph-tools-value-redesign.plan.md (renamed from graph-tools-substrate-migration.plan.md), fully replacing its
  behaviour-preservation frame with the owner-directed design-in-our-power frame:
  because we construct the non-EEF graph data objects (the vocab-gen pipeline) AND
  build the graph substrate (graph-core + graph-corpus-sdk), the data-object shape
  AND the retrieval mechanism are both ours to design. The two governing
  constraints are the first principles — (1) maximise value to users, (2) do not
  flood agents with tokens on irrelevant information. Non-code (a plan-document
  overhaul); the migration execution itself stays parked on EEF D6 + D7.
todos:
  - id: reframe-governing-premise
    content: "Replace the migration plan's governing premise from 'same observable tool behaviour, scaled-up substrate' to 'bounded, relevant, token-efficient retrieval per the two constraints'. The 2026-06-04 in-place amendment is fully metabolised — it is currently a bolt-on §'Owner-directed revision' + an amend-pointer; the overhaul rewrites the affected sections so the new frame is the spine, not an annotation, leaving no residual behaviour-preservation framing as the governing premise."
    status: done
  - id: re-derive-ratified-decisions
    content: "Re-derive the 'Ratified decisions (closed)' section: decisions 3 (existing tools untouched / behaviour preserved) and 8 (output-only, no input, whole-corpus) and Q4/Decision C (thread-progressions not graph-forced) are fully REPLACED with the constraint-governed shape (not amended in place). Decisions still valid under the new frame (1 ownership, 2 one-replacement-unit, 4 consumer-readiness sequencing, 5 schema-arrives-with-the-tool, 6 single-upstream, 7 projection schema doctrine) are re-grounded and retained. Every old decision gets a recorded disposition (replaced / retained / superseded) — nothing silently dropped."
    status: done
    depends_on: [reframe-governing-premise]
  - id: per-corpus-value-token-analysis
    content: "For each corpus, a value + token analysis under the two constraints, replacing behaviour-preservation: misconception (currently flat, 12,858 nodes, ~6MB whole-corpus return — a token problem; candidate for graph-shaping with ids+edges from the bulk source, or an attribute filter, to return a bounded relevant subset); prior-knowledge (a natural subgraph consumer — unitSlug ids + prerequisiteFor edges); thread-progressions (shape chosen by the constraints — sequence projection or graph, not forced either way). Each names the retrieval shape and why it serves user value + token efficiency. Verdicts land at promotion with architecture review + owner ratification."
    status: done
    depends_on: [reframe-governing-premise]
  - id: scope-fundamental-node-edge-model
    content: "Promote the 'define-fundamental-node-edge-model' todo from a deferred placeholder to a properly scoped deliverable: the substrate's heterogeneous node/edge model (multiple node kinds, a cross-kind node-id policy, typed inter-kind edges) and the generic bounded-retrieval primitive, deferred from EEF D4's homogeneous strand graph (decision B). Reconcile with the EEF D4 contract (the homogeneous case) and the shared projection→single-Zod-call mechanism. Must not be assumed-inherited from EEF nor dropped."
    status: done
    depends_on: [reframe-governing-premise]
  - id: reconcile-open-decisions
    content: "Re-examine open Decisions A–F under the new frame (data/type re-emission shape may now also reshape the data object, not just re-emit it as-is; the adapter/home and schema-emission decisions inherit the new constraints). Update each open decision's grounded narrowing to reflect design-in-our-power. Verdicts still land at promotion."
    status: done
    depends_on: [re-derive-ratified-decisions, per-corpus-value-token-analysis]
  - id: overhaul-reviewers
    content: "Before marking the overhauled plan ready: assumptions-expert (plan readiness / proportionality / are the constraints faithfully the spine), and an architecture reviewer (the substrate node/edge-model scoping + the per-corpus reshaping vs ADR-041/ADR-179 boundaries). Validate every finding against the artefact before applying; relay a synthesised verified verdict."
    status: done
    depends_on: [re-derive-ratified-decisions, per-corpus-value-token-analysis, scope-fundamental-node-edge-model, reconcile-open-decisions]
---

# Migration-plan overhaul — replace behaviour-preservation with design-in-our-power

> **✅ COMPLETED 2026-06-04 (Twilit Cascading Supernova, session bb53a9).** Executed
> this session, not a later dedicated one (owner-directed). The product is
> [`../future/graph-tools-value-redesign.plan.md`](../future/graph-tools-value-redesign.plan.md)
> — the migration plan was **renamed** (`graph-tools-substrate-migration` →
> `graph-tools-value-redesign`) and re-derived. The owner ratified a **deeper** scope
> than this metaplan first framed: not a premise-swap inside a "migration" container,
> but a full **value-driven redesign** that drops the migration framing, adds the
> input-interface design surface (bounded retrieval ⇒ the tools take an anchor input),
> and **decides the per-corpus value-shapes now** (owner-ratified) while deferring only
> mechanism to promotion. Per-corpus shapes landed: prior-knowledge = bounded subgraph
> (`unitSlug` + depth, **owner-ratified**); thread-progressions = bounded sequence projection
> (`threadSlug`, **owner-ratified**); misconception = **owner-directed to a graph-shaped
> curriculum-anchored subgraph** (thread/unit/lesson → misconceptions), verified fully supported
> by the bulk source (`bulk-downloads/schema.json` carries the whole chain; the flat generated
> corpus was a lossy projection) — concept-anchoring excluded (no concept node). Exact anchor/
> journey to confirm with owner. This metaplan archives at consolidation.

A **metaplan**: its product is the re-derived
[`graph-tools-value-redesign.plan.md`](../future/graph-tools-value-redesign.plan.md).

## Why this metaplan exists

The migration plan was authored under a **behaviour-preservation** frame — "same
observable tool behaviour, scaled-up substrate" (ratified decisions 3, 8; Q4). New
owner understanding (2026-06-04) overturns that frame: because we **construct the
non-EEF graph data objects** (the `vocab-gen` pipeline in `oak-sdk-codegen`) **and
build the graph substrate** (`graph-core` + `graph-corpus-sdk`), the data-object
shape and the retrieval mechanism are **both ours to design**, governed by two
constraints — (1) maximise user value, (2) do not flood agents with irrelevant
tokens. "If we can make it work with graphs, we use graphs."

A frame-overturning change cannot be a bolt-on. The 2026-06-04 in-place amendment
(§"Owner-directed revision — governing constraints and design agency" + the
amend-pointer in the closed-decisions section) is an **honest interim** — it homes
the deferred fundamental node/edge model and prevents the drop — but it leaves the
plan half-reframed (the old behaviour-preservation decisions still read as the
spine, now annotated). The overhaul **metabolises** the amendment into a coherent
re-derivation so the new frame is the spine, not a footnote.

## End goal, mechanism, means

- **End goal**: a migration plan whose governing premise is bounded, relevant,
  token-efficient retrieval, with full design agency over data-object shape and
  substrate — so the eventual migration delivers more user value per token than a
  behaviour-preserving re-platform would, and the fundamental node/edge model is a
  scoped deliverable rather than an assumed inheritance.
- **Mechanism**: a dedicated session re-derives the plan from the two constraints
  and our design agency (not from behaviour-preservation), with every replaced
  decision recorded in a disposition ledger so nothing is silently dropped.
- **Means**: the frontmatter todos — reframe the premise; re-derive the ratified
  decisions (replace 3/8/Q4, retain+re-ground the rest); a per-corpus value+token
  analysis; scope the fundamental node/edge model; reconcile open decisions A–F;
  readiness reviewers.

## Acceptance criteria (non-code; outcome-level)

1. The overhauled migration plan states the **two constraints as its first
   principles**, with no residual behaviour-preservation framing as the governing
   premise.
2. Decisions 3, 8, and Q4 are **fully replaced** (not amended in place); every old
   decision carries a recorded disposition (replaced / retained / superseded).
3. Each corpus has a **value + token analysis** naming its retrieval shape and why
   it serves the two constraints; per-corpus verdicts are explicitly held for
   promotion + owner ratification.
4. The **fundamental node/edge model** is a scoped deliverable (node kinds,
   cross-kind id policy, typed edges, bounded-retrieval primitive), reconciled with
   EEF D4's homogeneous case and the shared mechanism.
5. Readiness reviewers (assumptions-expert + architecture reviewer) are READY with
   conditions grounded and applied; **owner ratifies** the overhauled plan.

**Proof**: `non-code` — owner + `assumptions-expert` + architecture-reviewer
ratification of the overhauled plan against criteria 1–5.

## Non-goals

- **Not executing the migration** — it stays parked on EEF D6 + D7; no graph data
  object is built and no tool is rewritten here or in the overhaul session.
- **Not the EEF D4/D5 work** — D4 review and D5 are their own sequenced sessions
  (owner-directed 2026-06-04: next session = D4 + EEF-plan review; the session
  after = D5). This overhaul is independent of that sequence and does not block it.
- **Not finalising per-corpus shape verdicts** — those land at the migration plan's
  own promotion (EEF D6 + D7), with architecture review + owner ratification.

## Scheduling and relationship to the EEF sequence

The migration plan is parked on EEF D6 + D7, so its overhaul can run **any time**
before that promotion and **does not block** the EEF D4-review / D5 sequence. The
exact slot is the owner's to schedule (surfaced as a ratification question).

## Foundation alignment and lifecycle

- Aligns with `principles.md` (design for value; no speculative surface),
  PDR-018 (planning discipline), ADR-117 (plan architecture), ADR-041 / ADR-179
  (substrate boundaries), `consolidate-at-third-consumer`, and the metacognition
  directive (reshape on frame-overturn, do not patch).
- Lifecycle: on completion of the overhaul session, run the consolidation workflow
  and re-confirm the migration plan's `future/` parked status + promotion trigger.

## Plan-body first-principles check

Before the overhaul session executes any re-derivation, apply
[`.agent/rules/plan-body-first-principles-check.md`](../../../../rules/plan-body-first-principles-check.md):
the shape (is a graph the value-serving shape for this corpus, or a filter?), the
landing path (the migration stays parked; this is plan-document work), and the
vendor-literal clauses (verify any SDK/codegen call shapes at author time).

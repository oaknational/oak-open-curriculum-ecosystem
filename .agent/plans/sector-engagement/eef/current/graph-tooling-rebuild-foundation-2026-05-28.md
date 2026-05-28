---
title: Graph-tooling rebuild — foundation, diagnosis, and intent
status: evolving-understanding (NOT frozen — deepens across passes)
date: 2026-05-28
supersedes: tmp/first-pass-eef-tooling-feedback.md (initial pass — do not over-anchor)
provenance: owner feedback (16-point first pass + 2-point boundary refinement + next-steps direction) and this session's metacognitive reflections, 2026-05-28
---

# Graph-tooling rebuild — foundation, diagnosis, and intent

This is the foundation the **new** EEF/graph-tooling plan is built on. It exists
because the EEF explore tool shipped in commits `9f6eb215` + `2214f0b2`
(increment F) was built on the **wrong foundation**. Some atomic code primitives
survive; the *assembly* does not. A fresh session should read this to inherit the
understanding, not re-derive it.

> **Do not over-anchor on any single pass — including this document.** The owner
> is deliberately delivering the critique over several passes from different
> angles, and the understanding is still deepening. The original first pass lives
> at `tmp/first-pass-eef-tooling-feedback.md`; it is *superseded and deepened* by
> what is below, and `tmp/` is not durable. Treat this doc as the current best
> synthesis, not a final specification.

## How to read this doc

Two registers, kept deliberately separate:

- **FIRM** — the diagnosis (evidenced), the principles, the intent, the
  methodology, the anti-patterns. The owner stated these as requirements.
- **OPEN** — the design *content*: the precise graph-tool contract, what an
  "intelligently scoped" subgraph is, the restated end-goal, the rebuild
  deliverables, the client research. These are gaps to resolve, marked as gaps —
  not to be filled with confident filler. Writing the plan is partly an
  instrument for *finding* these gaps.

---

## 1. Diagnosis — why the old shape was wrong (FIRM)

**The core error: list-thinking imported into a graph domain.** A graph is not a
list. Selection-by-reading-fields, projection (field-masking), the runtime
strand cap, and dropping `key_findings` to fit a budget are all *list* operations
(slice / page / truncate / column-select). They are the native vocabulary of
REST-over-rows and are categorically unsuited to a graph. You cannot cut a graph
off at N and "get the rest later" — the tail is not a continuation, it is a
different (also-complete) subgraph, and the thing you handed over was never a
valid whole. F did all of these.

**The root-cause cascade.** The required graph *query* operations
(`enumerateNodes`, `findByTag`, `neighbours`, `getNode`, `summary`) were never
built — they ship as `Result.err(NotImplementedYet)` stubs. The soft stub made a
*missing capability look like a handled outcome*. Each subsequent agent hit the
resulting functional limits and reached for traditional list-tools to "fix" them,
instead of building the graph tools; the gate-1a/1b split gave that lateral
workaround a respectable name ("defer to gate-1b"). F is the latest link in that
chain: the handoff literally said "do NOT un-stub `enumerateNodes` (YAGNI)", and
the un-built `enumerateNodes({ filter, projection, page })` *was* exactly the
selection/projection/cap then hand-rolled in the tool.

**Other concrete wrongs:**

- **Budget treated as a runtime cap.** 10k was implemented as a `capForBudget`
  guillotine. 10k is a *design signal*, not a runtime limit — most agents allow
  ~25k; under 10k is *preferred* (it avoids special large-response handling), but
  it is a target that tells you to *design* appropriately-scoped complete
  subgraphs, never a licence to truncate.
- **Dual-emit + context hint by default.** Graph tools should return
  `structuredContent` only and drop the context hint (budget + audience).
- **Merged, green, multi-reviewer-approved — and yet no value delivered.** F
  passed every gate and three specialist reviews and is still the wrong shape.
  This is a Definition-of-Delivery case study (see §6).

**The process error underneath (metacognitive, FIRM):** *premature
crystallisation* — shipping a shape before the foundational questions were
answered; converting architectural warning-signals (having to bypass the
`projection` param; having to reach around the graph to select; having to add a
cap; having to drop evidence) into local patches instead of reading them as a
verdict on the shape. And: extensive review validates *within* a frame and
cannot catch a wrong *frame*; only "is this the right thing to build at all"
catches that, and it was under-applied.

## 2. The new foundation — principles (FIRM)

1. **Graphs are not lists.** The unique value is the relationships *and their
   meaning* — both relational ("these approaches combine") and contextual
   (`school_context_relevance`). Stripping relationships destroys the value.
2. **Graph tools are a first-class tool *category*** — inheriting all base-tool
   constraints, adding graph-specific requirements (DRY, strict, long-term
   architectural excellence as everywhere). *Precise definition is OPEN — §10.*
3. **Completeness = integrity + traceability, NOT maximalism.** A returned
   subgraph is "complete within itself" in this sense: (a) relationships are
   always *represented* (edges/refs are the value, so they are never the thing
   dropped); (b) no claim about an approach's evidence travels without its
   uncertainty; (c) nothing is *silently* lost — a referenced-but-not-included
   node is reachable. The token budget MUST NOT be met by slicing
   approaches from evidence, or evidence from uncertainty.
4. **Subgraphs may be contiguous OR sparse.** A subgraph is a chosen node-set
   plus edges; it need not be a connected region. "Boundary" is not a spatial
   frontier. A *sparse* subgraph (a scattered selection across the graph) is
   legitimate.
5. **A subset of a node's values can be appropriate *in some cases*** — role-
   appropriate representation (focal nodes fuller, connective nodes lighter) —
   *provided* integrity holds (§3) and full detail is reachable. This
   is real progressive disclosure, categorically different from F's
   budget-driven field-masking (which severed `key_findings` from the approach
   with no recourse, because `explain` was stubbed).
6. **Build the graph query surface; do not work around it.** Selection,
   projection, pagination, traversal are *graph/corpus operations*
   (`enumerateNodes(filter, projection, page)`, `findByTag`, `neighbours`,
   `subgraph`), reusable across every adapter — not bespoke per-tool logic.
7. **The graph/corpus is smart; the tool is a thin formatter.** The intelligence
   is reusable across adapters (Threads, prerequisites, misconceptions). This was
   always the requirement; the thick-tool/thin-graph shape was an unapproved dead
   end, never a stepping stone.
8. **Graph tools return `structuredContent` only, and no context hint**
   (owner-directed). To be *validated* by the client research (§10), which also
   informs whether a separate prose-delivery tool is ever wanted.
9. **No soft stubs.** Build the operation, or throw a not-implemented error
   (honest). Never `Result.err(NotImplementedYet)` that masks a hole as a handled
   case.
10. **Budget is a design signal, not a runtime cap.** Meet <10k (preferred) by
    *designing* the right complete subgraph, never by truncation.

## 3. What we are actually building, and why (INTENT — FIRM)

This is **discovery work.** We are building tools that work with, traverse,
select, query, and *understand* graph data, and deliver subgraphs to LLM agents
in a form suitable for LLM agents — **so that we can then explore** what
additional tools (or other things) best help us deliver value to teachers.

The graph tools are *instruments for exploration*, not the end product. Teacher
value is the north star; the immediate beneficiary of *this* work is
us-able-to-explore. This reframing matters operationally: it removes the false
"deliver teacher value now" pressure that drove the shortcuts. Whether we also
need tools that deliver the evidence corpus as *prose* is genuinely unknown — that
is one of the things the exploration will tell us; it is not the point now.

## 4. The EEF data — what it is (context, FIRM)

A meta-analytic **evidence corpus for pedagogy**: 30 strands (teaching
approaches), each with impact, cost, **evidence strength**, mechanisms,
implementation guidance, `school_context_relevance` (priorities/key-stages), and
`related_strands` edges. Veracity, completeness, and traceability are critical:
the honest framing (caveats travelling with claims) *is* the value, and the
relationships encode both connections and their meaning.

## 5. Planning methodology — self-correcting measurable deliverables (FIRM; to graduate)

**The doctrine the owner requires for the new plan, and wants to become part of
our planning methodology generally:**

A plan is a sequence of deliverables. Each has an **objective, measurable
acceptance gate**. The sequence is ordered by **consumption**: deliverable
`D(n+1)` genuinely builds on / exercises `D(n)`, such that a drifted, stubbed, or
sliced `D(n)` makes `D(n+1)`'s gate **fail**. Drift self-corrects, because the
next deliverable tests the previous one's reality.

**Drafting discipline** — for every deliverable, state:
(a) its measurable acceptance test; (b) what it consumes from its predecessor;
(c) *how its gate breaks if the predecessor drifted.* If you cannot state (c),
the link is not self-correcting and the planning itself has drifted.

This is the **structural cure** to the exact F failure: nothing downstream
consumed the stubbed graph ops with a measurable gate, so the hole stayed
invisible and lateral workarounds accreted. Graduate this doctrine *from* the new
plan as its first real instance (extract, don't invent abstractly) — likely a
PDR and/or an `oak-plan` amendment.

## 6. Definition of Delivery — what this episode teaches (FIRM connection; refinement OPEN)

See `.agent/directives/definition-of-delivery.md` and PDR-085 (owner-accepted
this session). F is a textbook instance of the doctrine's "not delivery" list:
merged code + green gates + reviewer approval delivered *no value* — the
beneficiary received a wrong-shaped thing.

**OPEN doctrine-refinement question:** the doctrine is framed around end-user
value with the feature flag as the LANDED↔RELEASED seam. Discovery/instrument
work bends that: the beneficiary may be "us, enabled to explore" and the value
"exploration capability," not end-user feature use. Does the Definition of
Delivery need to account for instrument deliverables, and is the
self-correcting-deliverables structure (§5) the honesty mechanism that keeps
"delivered" truthful? Flag for discussion — do not resolve here.

## 7. Salvageable atomic blocks vs wrong assembly (FIRST-CUT — not final)

"We don't have to throw away much, but it needs deep restructuring; some pieces
survive as atomic building blocks reassembled into something fundamentally new."

Likely-sound primitives (reassemble, don't discard):

- corpus loader + freshness gate (`loader.ts`, `freshness.ts`)
- Zod schema + data-derived vocabulary + drift guard (`strand-schema.ts`,
  `school-context.ts` — `EEF_PRIORITIES`/`EEF_KEY_STAGES`)
- `school_context_relevance` modelling (the contextual value)
- BFS traversal primitive (`eef-graph-model.ts`: `buildGraphIndex`,
  `traverseSubgraph`)
- the context-matching *logic* (`selectEefSeedIds`) — but it **relocates into the
  graph/corpus query layer** (a filter/rank), not the tool
- the caveat/uncertainty construction (`citations.ts`) — reframed as part of node
  completeness, not a bolted-on envelope

Likely-wrong assembly (discard / rebuild):

- tool-as-brain; `projectExploreNode` (field-mask-for-budget);
  `capForBudget` (runtime cap); the soft `NotImplementedYet` stubs;
  dual-emit + context-hint by default for graph tools; the gate-1a/1b split.

*This discernment is to be done carefully at design time, not finalised here.*

## 8. First next-session deliverable — merge-safety sub-plan (INTENT, FIRM)

Before any rebuild, and after this knowledge is fully on disk, the **first**
deliverable next session is a sub-plan to:

1. get PR #122 (`feat/graph-foundations`) into mergeable shape;
2. ensure **all** user-facing EEF surfaces — the `eef-explore-evidence-for-context`
   tool AND the `eef-evidence-grounded-lesson-plan` prompt — are behind
   `OAK_CURRICULUM_MCP_EEF_ENABLED`, default OFF;
3. merge the PR.

This lands the sound foundational work on `main` and quarantines the
wrong-shaped tool behind the flag (pending rebuild), preventing any live
orphan-prompt (a served prompt referencing a tool that does not exist / will not
exist in its presumed form).

**Verify-don't-trust:** increment E (`9554ffbc`) already co-gated both surfaces
behind the flag (default OFF), so the orphan is *likely already prevented* in
production. The sub-plan must **verify** this holds and confirm the PR is
genuinely mergeable — not assume it.

## 9. Anti-patterns — what NOT to do (FIRM, from the lived failure)

- No list-ops on graphs: no slice / cap / truncate / field-mask-for-budget.
- No soft stubs (build, or throw).
- No premature crystallisation: do not ship a shape before the foundational
  questions are answered; hold the design space open until its shape is found.
- Do not over-anchor on any single feedback pass (including this doc).
- Do not let "deliver value now" pressure reintroduce shortcuts — this is
  discovery work; the budget is a design signal, not a deadline.

## 10. Open questions / gaps a fresh session must resolve (FIRM that they are OPEN)

- **Client research (gates §2.8 / structuredContent-only).** What
  *claude.ai* (the Claude **desktop/web app — NOT Claude Code**) and
  *ChatGPT.com* (desktop/web) actually read from MCP tool responses
  (`structuredContent` vs `content`), and the audience for each output type.
  Current understanding is incomplete, outdated, and self-contradictory; the
  prior "Claude = Claude Code" premise was wrong. Fresh research required.
- The precise **graph-tool category** definition + invariants, DRY against the
  base tool contract.
- What makes a subgraph **"intelligently scoped"** — how scope, sparsity, and the
  navigable boundary-links are chosen. This is the real intelligence to build.
- The restated **end-goal** once the gate-1a/1b split is removed, and a sensible
  implementation sequence (§5 structure).
- How we **measure "exploration enabled"** at each deliverable.
- The Definition-of-Delivery refinement question (§6).
- The **first rebuild deliverable** — probably "the real graph query surface
  exists and is consumed", but this depends on the restated end-goal; held open.

## 11. Notes toward a "working with graphs" skill (SEED — to graduate)

Capture toward a future skill (or skill family): graph ≠ list; the list-ops that
must never touch a graph; completeness-as-integrity; contiguous vs sparse
subgraphs; navigable boundary-links as the budget/completeness reconciliation;
the soft-stub failure mode; graph tools as a category. Extract properly during
consolidation — not rushed here.

## 12. Status of the old plan

`eef-delivery-restructure.plan.md` (and the gate-1a/1b conceptual boundaries it
encodes) is to be **archived/superseded** by the new plan built on this
foundation. Archive with a supersession pointer and preserved learning — do not
delete (knowledge preservation). The new plan may reuse elements of the old.

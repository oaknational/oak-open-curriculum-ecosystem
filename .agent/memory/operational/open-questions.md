---
fitness_line_target: 180
fitness_line_limit: 240
fitness_char_limit: 14000
fitness_line_length: 100
drain_strategy: >-
  Surface strategic open questions to the owner during consolidate-docs. Answer,
  withdraw, or leave open with deferral-honesty. A resolved question is removed —
  its answer lives in the permanent home it produced (PDR/ADR/plan/decision),
  which is the record. Do not keep a resolved-question ledger.
merge_class: mostly-append-register
fitness_content_role: drainable-buffer
---

# Open Questions

Register of **strategic, genuinely-open architectural / design questions** — the
kind that name a fork in future direction, have no decisive answer yet (the
[decision lenses](../../directives/principles.md#decision-lenses--order-of-resolution)
do not resolve them), and are not blocking a current cycle. Each names the
question, why it shapes future work, why it is not cheaply answerable now, its
owning artefact, and a status with a resolution trigger. They are surfaced to the
owner at each consolidation and either answered (then removed), withdrawn, or
left open with deferral-honesty.

## What belongs here — and what does not

**Belongs**: a strategic architectural / design question whose answer changes the
shape of future work and which nobody can decide now — it needs owner direction,
an incoming engineer's design, or evidence that does not yet exist.

- *"What is the content-structure graph's node/edge schema, and how does it join
  to atomic concepts and lesson slugs?"* (Q-009 — shapes the whole curriculum
  graph-of-graphs; genuinely undecided.)

**Does NOT belong** — route via
[`ephemeral-to-permanent-homing.md`](ephemeral-to-permanent-homing.md):

- **"What should we do next?"** (sequencing / operational priority) →
  [`repo-continuity.md`](repo-continuity.md) Next Safe Steps, or the owning plan.
- **An operational / coordination decision** (*"should we re-establish the
  Director seat?"*) → an owner decision recorded in `repo-continuity.md` Open
  Owner-Decision Items or the owning thread record — not a standing open question.
- **A design decision that just needs a session** (candidate options exist; it
  only needs the time to choose) → an exploration / research plan in `plans/`.
- **Learned doctrine awaiting a home** → [`pending-graduations.md`](pending-graduations.md).
- **A resolved question** → remove it; its answer lives in the permanent home it
  produced (the PDR / ADR / plan / decision), which is the record that it was
  answered.

The test: a genuine open question names a *fork in future direction nobody can
close yet* — not a task to schedule, not a decision the owner has effectively
already made, not a lesson already learned.

## Q-009 — The content-structure graph + renderers-as-projections (curriculum domain)

**Question:** Oak's curriculum estate has the pedagogical **meaning** (atomic concepts), the
**macrostructure** (ontology + bulk graphs), and the **evidence** (EEF), but no graph of the
**content structure** — the typed forms that convey meaning (questions, data-tables, charts,
datasets, images, KLPs, flashcards) — nor a medium-agnostic renderer/projection layer (worksheet /
web / print / ODP / slides). What is its node/edge schema, its identity scheme, its references out
to atomic `entity_id`s and lesson slugs, where it lives, and what is reused vs built fresh from
Aila's content/renderer code?

**Why it shapes future work:** it is the largest missing member of the curriculum graph-of-graphs
and the most cross-repo-entangled (oak-openapi content, Aila content + renderers, moderation input).
It is the layer that would make adaptation-integrity *checkable* (a preservation predicate over
content↔intent edges) and turn renderers into projections of one content graph.

**Why not cheaply answerable now:** this is **initial-research stage**. An engineer is joining the
project and will bring an exploration brief for these features; the design is theirs and the owner's
to shape, not to pre-decide here. It also depends on the open single-team question (repo-continuity
§Open Owner-Decision Items #7).

**Owning artefact:** [`knowledge-as-graph-two-altitudes-2026-06-23.md`][kg-two-altitudes]
(names the decisions, the LTAE build-vs-reuse reading of Aila's code, and the thin-slice
identity-join proof); the curriculum-graph-estate synthesis (2026-06-22); paused threads
`connecting-oak-resources`, `oak-kg-ontology-planning-review`.

**Status:** open — initial landscape research recorded; owned by the incoming engineer's brief and
owner.

## Q-011 — Liveness after an ungraceful death (external staleness-reaper / dead-man's-switch)?

**Question:** "Stop your heartbeat at stand-down" cures only the *graceful* case. In a
model-availability outage a session's Monitors die with it, so it cannot re-arm or stop its own
heartbeat — leaving a stale-but-"active" liveness signal (~8h false "active" observed when the
worktree-pilot team went down in such an outage). What external liveness primitive — a
staleness-reaper / dead-man's-switch that reaps from *outside* the session rather than relying on
self-stop — should the operating model carry?

**Why it shapes future work:** a successor (or the owner) reading a false "active" claim defers or
mis-coordinates; every multi-agent and solo-with-heartbeat session depends on the liveness signal
being trustworthy after an ungraceful death. It remains live under solo operation.

**Why not cheaply answerable now:** it is a structural primitive needing an owner architectural
decision (external reaping is not a fact to look up); the graceful-case cure is in place, so it is
unresolved but not blocking.

**Owning artefact:** [`worktree-pilot-consolidation-and-model-verdict.plan.md`][worktree-pilot-plan]
§Risk Assessment names this as an open architectural question for the owner. (The earlier
pending-graduation entry was removed — a question is not learned doctrine; its home is here, and
the plan must re-home it here, not lose it, when it archives.)

**Status:** open — architectural; owner-decision.

[kg-two-altitudes]: ../../reports/knowledge-as-graph-two-altitudes-2026-06-23.md
[worktree-pilot-plan]: ../../plans/agentic-engineering-enhancements/current/worktree-pilot-consolidation-and-model-verdict.plan.md

---
fitness_line_target: 180
fitness_line_limit: 240
fitness_char_limit: 14000
fitness_line_length: 100
drain_strategy: >-
  Surface owner-decision items during consolidate-docs; move answered or
  withdrawn entries to an archive when the register needs rotation.
merge_class: mostly-append-register
fitness_content_role: drainable-buffer
---

# Open Questions

Drainable register of architectural / design questions that are not yet decidable
and are not blocking a current cycle. Each entry names the question, why it shapes
future work, why it is not cheaply answerable now, its owning artefact, and a
status with a resolution trigger.

Drained empty at the 2026-06-15 dedicated consolidation; new questions are appended
as they arise.

## Q-004 — A general convention for naming openly-licensed external sources?

**Question:** The external-skills substrate study was source-neutralised by design (its AGENTS-side
"vendor-literal clause" kept the source anonymous). The owner determined (2026-06-22) that for an
openly-licensed public repo (`mattpocock/skills`, MIT) the anonymity "never had a real purpose" and
directed dropping it. That decision was scoped to this source. Should the Practice carry a *general*
convention — name openly-licensed external sources plainly with attribution; keep genuinely
proprietary/unlicensed sources private — and if so, where does it live? (Not the general
`plan-body-first-principles-check` vendor-literal clause, which governs token-drift, not source
attribution.)

**Why it shapes future work:** future external-substrate studies (ponytail is already the second)
will each face the same naming decision; a settled convention prevents re-litigating it per source.

**Why not cheaply answerable now:** it is an owner doctrine call about Practice-wide
source-handling, not a fact to look up; low-urgency (does not block any current cycle).

**Owning artefact:** [`external-skills-substrate-learning.plan.md`](../../plans/agentic-engineering-enhancements/future/external-skills-substrate-learning.plan.md)
§Decisions; the two substrate studies in
`research/agentic-engineering/operating-model-and-platforms/`.

**Status:** RESOLVED (owner-ratified, 2026-06-23). Graduated to
[PDR-115](../../practice-core/decision-records/PDR-115-naming-openly-licensed-external-sources.md):
name openly-licensed external sources plainly with attribution; keep genuinely
proprietary/unlicensed sources private; when licence status is unclear, treat as proprietary until
confirmed. Distinct from the `plan-body-first-principles-check` vendor-literal clause (token-drift,
not source attribution).

## Q-007 — Per-user `MEMORY.md` is over its index limit

**Question:** The Claude per-user `MEMORY.md` index is over its size limit (~28.9KB); substance is safe
(per-entry topic files + repo doctrine persist) but index pointers degrade at session-load. When does a
dedicated per-user-memory drain run (graduate settled feedback whose substance is now homed in repo
rules/PDRs, then trim the index)?

**Why it shapes future work:** degraded index pointers mean session-open recall silently drops late-listed
entries — the skill-load-budget failure mode applied to memory.

**Why not cheaply answerable now:** a bounded maintenance pass (per-platform per-user memory), not a fact;
low-urgency, owner-prioritised.

**Owning artefact:** Claude per-user memory `MEMORY.md`; the `consolidate-docs` cross-platform memory step.

**Status:** RESOLVED (owner-authorised, 2026-06-23) — the drain ran this pass: repo-homed
redundancy (entries graduated to repo rules/PDRs this session, plus verbatim always-applied-rule
duplicates) graduated out and bloated hooks tightened (30.3→28.8KB; per-entry topic files persist).
The drain surfaced a deeper residual: the index is still over the 24.4KB load-cap because the flat
single-file shape does not scale to 160+ legitimate entries — escalated as a system-shape question
(the LTAE answer is relevance-based or tiered recall, not deletion), since graduated into
[`memory-feedback-and-emergent-learning-mechanisms.plan.md`](../../plans/agentic-engineering-enhancements/future/memory-feedback-and-emergent-learning-mechanisms.plan.md),
distinct from this one (when does a drain run — answered: it ran).

## Q-009 — The content-structure graph + renderers-as-projections (curriculum domain)

**Question:** Oak's curriculum estate has the pedagogical **meaning** (atomic concepts), the
**macrostructure** (ontology + bulk graphs), and the **evidence** (EEF), but no graph of the **content
structure** — the typed forms that convey meaning (questions, data-tables, charts, datasets, images, KLPs,
flashcards) — nor a medium-agnostic renderer/projection layer (worksheet / web / print / ODP / slides).
What is its node/edge schema, its identity scheme, its references out to atomic `entity_id`s and lesson
slugs, where it lives, and what is reused vs built fresh from Aila's content/renderer code?

**Why it shapes future work:** it is the largest missing member of the curriculum graph-of-graphs and the
most cross-repo-entangled (oak-openapi content, Aila content + renderers, moderation input). It is the layer
that would make adaptation-integrity *checkable* (a preservation predicate over content↔intent edges) and
turn renderers into projections of one content graph.

**Why not cheaply answerable now:** this is **initial-research stage**. An engineer is joining the project
and will bring an exploration brief for these features; the design is theirs and the owner's to shape, not
to pre-decide here. It also depends on the open single-team question (repo-continuity §Open Owner-Decision
Items #7).

**Owning artefact:** [`knowledge-as-graph-two-altitudes-2026-06-23.md`](../../reports/knowledge-as-graph-two-altitudes-2026-06-23.md)
(names the decisions, the LTAE build-vs-reuse reading of Aila's code, and the thin-slice identity-join
proof); the curriculum-graph-estate synthesis (2026-06-22); paused threads `connecting-oak-resources`,
`oak-kg-ontology-planning-review`.

**Status:** open — initial landscape research recorded; owned by the incoming engineer's brief and owner.

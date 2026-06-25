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

## Q-010 — Re-establish the Director seat at all, now the team is dissolved and one agent operates solo?

**Question:** The worktree-pilot team is dissolved; a single agent now operates solo under direct owner
direction, while the guiding plan and the director brief still assume a future Director-led team. Should
the Director seat be re-established at all for the next session, or does a solo operator under owner
direction make the seat a routing tax with no team to route? The plan gathers the model verdict; this is
the prior operational decision of whether to stand the seat back up before that verdict lands.

**Why it shapes future work:** the next session opens either by rehydrating the Director seat from the
brief or by operating seatless; the choice sets the whole session shape and feeds the very
Director-model verdict the plan exists to render.

**Why not cheaply answerable now:** it is an owner-shaped operating-model call (coordinator-threshold
doctrine says peer/solo is default at or below three agents), not a fact to look up; low-urgency, does
not block a current cycle.

**Owning artefact:** [`worktree-pilot-consolidation-and-model-verdict.plan.md`](../../plans/agentic-engineering-enhancements/current/worktree-pilot-consolidation-and-model-verdict.plan.md)
(the Director-+-worktree model is on trial there; that plan renders the verdict, this question is the
immediate stand-up-the-seat-or-not decision that precedes it); the
[director brief](director-handoff.md) seat-takeover protocol; [PDR-117](../../practice-core/decision-records/PDR-117-director-and-implementer-roles.md).

**Status:** open — owner-shaped; not-yet-decided.

## Q-011 — Liveness during a model-availability outage (external staleness-reaper / dead-man's-switch)?

**Question:** "Stop your heartbeat at stand-down" cures only the *graceful* case. In a
model-availability outage a session's Monitors die with it, so it cannot re-arm or stop its own
heartbeat — leaving a stale-but-"active" liveness signal (~8h false "active" observed when the
worktree-pilot team went down in exactly such an outage). What external liveness primitive — a
staleness-reaper / dead-man's-switch that reaps from *outside* the session rather than relying on
self-stop — should the operating model carry?

**Why it shapes future work:** a successor reading a false "active" claim defers or mis-coordinates;
every multi-agent and solo-with-heartbeat session depends on the liveness signal being trustworthy
after an ungraceful death.

**Why not cheaply answerable now:** it is a structural primitive needing an owner architectural
decision (external reaping is not a fact to look up); the graceful-case cure is in place, so it is
unresolved but not blocking.

**Owning artefact:** [`worktree-pilot-consolidation-and-model-verdict.plan.md`](../../plans/agentic-engineering-enhancements/current/worktree-pilot-consolidation-and-model-verdict.plan.md)
§Risk Assessment names this as an open architectural question for the owner; tracked as a PDR
candidate in [`pending-graduations.md`](pending-graduations.md).

**Status:** open — architectural; owner-decision PDR candidate (see pending-graduations).

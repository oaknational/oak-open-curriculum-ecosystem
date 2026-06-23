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

## Q-001 — Cadence anchor for report-only fitness

**Question:** Now that fitness is report-only (ADR-144, 2026-06-16 — the validator never
fails a build), what structural anchor ensures the signal is actually *run and read* at
the right cadence (consolidation / session handoff)?

**Why it shapes future work:** report-only is only as live as its invocation. ADR-144 was
originally created to stop fitness drifting into "advisory and ignored"; the report-only
amendment answers that with "prominence + discipline," but a passive discipline with no
firing surface is exactly the failure mode this repo has repeatedly found decays under
pressure. A cadence anchor (a skill step that *runs* `practice:fitness`, a handoff checklist
item, or a non-gating hook that emits the report) would make the signal reliably seen.

**Why not cheaply answerable now:** needs design — which surface owns the cadence, and how to
emit a prominent signal without re-introducing a gate. Out of scope for the decision-debt drain.

**Owning artefact:** ADR-144 (§Exit code semantics); relates to `consolidate-docs` /
`session-handoff` cadence.

**Status:** open. **Resolution path (named 2026-06-21):** the consolidation skills already *run*
`practice:fitness:informational` (cadence anchor exists); the open half — ensuring the signal is
*read and acted on* — now has a concrete candidate home in the action-time design plan's
"make the fitness report self-frame" worked instance (the conservation-first / chase-numbers
pathogen). **Resolution trigger:** the next fitness/cadence design pass adopts (or rejects) that
self-framing mechanism, or a second instance of a report-only fitness signal going unread.
Deferral-honesty: the design (which surface owns the read-discipline, and the report-self-framing
shape) is not yet decided; falsifiable by a second unread-report instance. Surfaced by
assumptions-expert during the 2026-06-16 report-only review. (Q-001 is a member of the Q-006
action-time-interrupt family — its read-discipline cure is the same firing mechanism.)

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

**Status:** open (2026-06-22, Perseus turns Horizon). **Lens-resolved direction (2026-06-22, L1 + L3):**
name openly-licensed sources plainly with attribution; keep genuinely proprietary/unlicensed sources
private — a PDR clause the owner ratifies. **Resolution trigger:** the next external-substrate study, or
owner ratification of the convention.

## Q-005 — When does the worktree-per-agent transition land?

**Question:** The repo runs one-dev-many-agents now, moving to many-checkouts / variable-agent-density.
Concurrent agents on one shared checkout couple through the whole-tree pre-commit gate and the shared
working tree (F-83); this session repeatedly hit it (a peer co-committed a file mid-edit, HEAD shifted ~5
times). When does worktree-per-agent (one git worktree per concurrent agent) land?

**Why it shapes future work:** L4 ("would it be simpler if the system changed?") decisively resolves the
*direction* — worktrees dissolve the shared-checkout coupling rather than coordinating around it. Only the
*timing* is open, and every future multi-agent window pays the coupling cost until it lands.

**Why not cheaply answerable now:** infra work with its own design (worktree lifecycle; the shared
coordination-home resolution, part-built via `resolveCoordinationHome` in WS-3 F-41); sequencing against
the WS2/rewrite lane is the owner's prioritisation.

**Owning artefact:** F-83 in [`frictions-register.md`](../../plans/agent-tooling/frictions-register.md);
the multi-developer-transition direction (per-user memory; the WS-3 F-41 `resolveCoordinationHome` work).

**Status:** open — direction lens-resolved (adopt worktrees). **Trigger (owner, 2026-06-22 — automatic,
out of owner ownership):** fires at the next n≥2 concurrent-agent window on a shared checkout, or a second
recorded shared-checkout commit-coupling incident (F-83), whichever comes first.

## Q-006 — The action-time-interrupt mechanism (PDR-098 empty quadrant)

**Question:** "Passive guidance loses at the action moment" recurs across agents (~9+ worked instances,
plus a fresh one this session — relaying a subagent verdict without first-hand verification). The cure must
be a *mechanical* interrupt that fires at the action moment, not another passive memory (doctrine:
`passive-guidance-loses-to-artefact-gravity`). What is the mechanism, and what surface owns it?

**Why it shapes future work:** it is the highest-frequency meta-failure; every agent keeps re-paying it. L1
plus the doctrine resolve the *direction* (a firing mechanism); the *design* (which surface, what trip
conditions) is open.

**Why not cheaply answerable now:** the mechanism is non-obvious (that is why it is the PDR-098 empty
quadrant); prioritisation is the owner's.

**Owning artefact:** [`action-time-structural-interrupt-design-space.plan.md`](../../plans/agentic-engineering-enhancements/future/action-time-structural-interrupt-design-space.plan.md).

**Status:** open — direction lens-resolved. **Trigger (owner, 2026-06-22 — automatic, out of owner
ownership):** the sequencing is off the owner; the firing surface is the consolidation pass, which walks
this register first-hand. **Agent assessment (not owner-attributed):** the PDR-098 recurrence threshold is
already met (~9+ instances plus a fresh one this session), so this is due at the next consolidation that
has design capacity — not on an owner cue.

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

**Status:** open — lens-resolved as maintenance. **Trigger (owner, 2026-06-22 — automatic, out of owner
ownership):** fires when the per-user `MEMORY.md` index exceeds its limit (it does), at the next
consolidation pass (the `consolidate-docs` cross-platform-memory step owns it).

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

---
pdr_kind: governance
---

# PDR-119: Agent Memory as an Event Graph with Renderers

**Status**: Proposed (direction owner-ratified 2026-06-27; this PDR records the
decision and a rough design — the repo phenotype ADR and executable plan are
future and owner-sequenced; Accepted on build-time design ratification).
**Date**: 2026-06-27
**Related**:
[PDR-049](PDR-049-memory-and-state-file-merge-semantics.md)
(memory/state file merge semantics — the post-divergence discipline this PDR
*supersedes for the append-only-narrative class* by removing the divergence at
source; PDR-049 named the root cause this PDR closes);
[PDR-050](PDR-050-state-memory-substrate-contracts.md)
(state/memory substrate contracts — the surface-contract doctrine this evolves);
[PDR-094](PDR-094-coordination-event-rotation-is-class-tiered-archive-not-delete.md)
and ADR-199
(the comms event-log phenotype this generalises — the proven in-repo system that
never needs a semantic merge; host ADRs resolved via the practice-index bridge,
not linked from this portable body per PDR-079 / PDR-105);
[PDR-014](PDR-014-consolidation-and-knowledge-flow-discipline.md)
(consolidation/knowledge-flow — the capture→distil→graduate pipeline that becomes
render-time curation here);
[PDR-027](PDR-027-threads-sessions-and-agent-identity.md)
(the unit-of-coordination ≠ unit-of-git-history gap PDR-049 named);
ADR-200
(intent as a living idea-graph — the same documents-as-projections-of-a-graph-SSOT
move; the convergence point for the index-narrative tail).
Phenotype skill superseded for one class: `semantic-merge`
(`.agent/skills/semantic-merge/SKILL-CANONICAL.md`).

## Context

PDR-049 named the structural cause precisely: **the unit of coordination
(thread / session) is not the unit of git history (file).** Agent memory and
state surfaces — the napkin, `distilled.md`, registers, `repo-continuity.md`,
thread records — are concept-bearing narratives stored as *lines in shared
mutable files*. The concept unit is the *entry* (a lesson, a session record, a
row); git's merge unit is the *line/hunk*. They are orthogonal and finer-than, so
two **disjoint** concepts (two sessions' independent napkin entries) collide at
the line level purely because the encoding forces them to share a file region.
The collision is an artefact of the storage encoding, not of the concepts.

PDR-049's cure was the **post-divergence discipline**: the `semantic-merge` skill,
where an LLM reconciles the concepts by hand because git cannot. That cure is
correct, but it carries three costs that scale *up* with the worktree-per-agent
transition (the strategic root of the current Director/Implementer arc — more
checkouts, more divergence):

1. **Coordination tax** — every session must know and apply "all memory via
   semantic-merge," carried in handoff files and standing instructions.
2. **Critical-path serialization** — memory-touching PRs must be hand-merged,
   tangling continuity bundles with the merge train.
3. **Silent-loss on the absolute invariant** — every merge is a fresh chance for
   a fallible agent under context pressure to drop an entry. The LLM doing the
   merge *is where the loss comes from*; "the LLM is already in the loop" is the
   reason the merge is *risky*, not the reason it is cheap.

The repo already contains the cure and renders it invisible: **comms**. ~1,747
comms events, each an immutable content-addressed file, one event per file. Comms
has *never* needed a semantic merge — two agents, two branches, N worktrees all
append disjoint files, git unions the directory, there is no shared line region to
collide on. `shared-comms-log.md` is *generated* from the events; the watcher and
inbox are projections. The rendered markdown is a view, never a source. The
`active-register-shard` merge class is the same instinct applied halfway.

## Decision

**Model append-only-narrative agent memory as a graph of immutable events with
renderers** — generalising the comms event-log phenotype (ADR-199 / PDR-094) from
coordination state to memory. An *entry* becomes an immutable event file; the
*document* (napkin.md, distilled.md, a register) becomes a deterministic **render**
(projection) over the live event set. Concurrent sessions append disjoint event
files; git unions them; **`semantic-merge` is retired for that class.**

The LLM is *removed from the write-combine path*, eliminating the silent-loss
failure class there. The genuinely-conceptual judgement (is this the same lesson;
does this refine that) does not disappear — it **moves off the critical path** to
render-time curation, where it is non-destructive (both source events are
immutable and retained) and never blocks a merge.

It is an event **graph**, not merely a log: events carry typed edges
(`supersedes`, `refines`, `duplicate-of`, `links-to`). The napkin already uses
`[[name]]` links between lessons — those become first-class edges. The renderer
resolves the edges (supersession ordering, duplicate folding), which is what makes
the projection coherent rather than a raw concatenation.

**This is a member of the Practice's graph systems, not a standalone scheme.** It
is the *same architecture* as ADR-200
(intent as a living idea-graph — note: ADR-200 is an **ADR**, the repo phenotype;
its portable doctrine layer is the strategy/plan-estate work): a machine-readable
graph is the SSOT and the human-readable documents are co-equal **projections**
connected by typed edges. ADR-200 covers the *intent / planning* graph; this PDR
covers the *memory / learning* graph; both build on `graph-core`. Memory-events are
the append-only special case of the same idea, and the two graphs **converge at the
index-narrative tail** (repo-continuity is already a hand-maintained projection over
thread, claim, and PR state — exactly an ADR-200-shaped surface). Treating them as
one family is a design constraint: a shared **renderer/projection pattern** (the
*substrate* is a per-member choice — see §Sequencing), not two parallel projection
engines. The shared thing is the event→render shape, not necessarily `graph-core`'s
RDF triple-store.

## Rough design

- **Event.** One immutable file per entry — `napkin/<utc-timestamp>-<slug>.md` (or
  uuid), with frontmatter: author identity tuple (PDR-027), created-at, tags
  (ADR-183 namespace reused where it fits), and typed edges to other events.
  Body = the entry prose. Never edited after write; corrections are new events
  with a `supersedes`/`refines` edge.
- **Renderer.** A deterministic per-class projector (`agent-tools memory render
  <class>`) that reads the live event set and emits the document a human/agent
  reads. Render-on-read or a render step; the document is generated, never a
  source. **Render invariant:** every live source event appears in the render
  (the completeness check is mechanical — no concept-understanding — and is the
  loss-detector PDR-049's skill lacked).
- **Rotation = ADR-199 archive-move.** Fitness/size handled by archive-moving old
  events (process-then-archive, never delete), not by trimming a file. This
  **dissolves the recurring fitness-vs-preservation tension** in the napkin: the
  render shows the live set; rotation moves events out of it without loss.
- **Curation = render-time, off critical path.** Duplicate-lesson detection and
  distillation (PDR-014 capture→distil→graduate) become curation passes that add
  edges, not destructive merges. Graduation = an edge to a permanent home.

## Scope — by merge class (honest, the answer differs)

- **`append-only-narrative` (napkin, distilled — the majority, fires
  semantic-merge most): primary, high-confidence.** Napkin entries are *already*
  immutable timestamped events mis-encoded as headings in a shared file. Strongest
  fit; pilot here. **Caveat:** `distilled.md` is *curated synthesis*, not raw
  append — it needs the `supersedes`/`refines` edge pattern, not plain union, so
  it is a weaker fit than the napkin and follows it.
- **Registers (`mostly-append-register`, `active-register-shard`,
  `curation-ledger`): intermediate.** Mostly-append; the shard class is the
  half-step made whole.
- **`index-narrative-tables` (repo-continuity, director-handoff): the hard tail —
  deferred, converges with ADR-200.** These are *maintained current-state
  indexes* with cross-entry mutation (a next-safe-step gains "DONE", table rows
  update). Immutability — the load-bearing assumption — does not hold in place, so
  a naïve event log fragments their coherence. Their cure is the fuller ADR-200
  projection (render the index over thread records, the claims registry, git/PR
  state, plus a thin continuity-note event stream), or a deliberate decision that
  they stay hand-curated docs and keep `semantic-merge`. **Do not fold these in
  early.**

## Consequences

- `semantic-merge` is retired for append-only-narrative; it remains correct and
  load-bearing for the index-narrative tail during and after.
- The silent-loss failure class is eliminated on the write-combine path for the
  migrated classes; the render-invariant guards the remainder.
- The fitness-vs-preservation tension dissolves (rotation = archive-move).
- Provenance improves: `git log`/blame on per-event files beats blame on a
  churning shared file; authorship is per-event, not inferred from headings.
- New load-bearing infrastructure: per-class renderers and the render step. This
  is real, but it is the *proven* comms phenotype, not speculation.

## Warrant and falsifier

The load-bearing assumption is **immutability**: the model is total only where
entries are append-only-and-immutable. Napkin passes; index-narrative fails in
place (hence its deferral). **Falsifier:** if a class shows frequent in-place
edits to old entries, events-and-renderer adds overhead without removing merge
pain — that class stays a curated document.

**Cheapest probe (resolves the direction before any large commit):** pilot on the
**napkin alone** — one class, clearest immutable-append fit, highest
merge-frequency, the file that hurts most. Build the per-event write, the
deterministic renderer, and the render-invariant; prove the zero-merge property
across two worktrees. If the napkin pilot does not clearly beat the skill in
practice, that falsifies the direction cheaply.

## Sequencing

This PDR records the **decision and a rough design**; it does not authorise the
build. The repo phenotype (the concrete `.agent/memory` event layout + the render
CLI + migration) lands as an **ADR + executable plan** when built, owner-sequenced
against ADR-200 (with which the index-narrative tail converges) and product work.

Three decisions the build must settle, named here (not made):

1. **Class adoption order** — append-only-narrative first (napkin pilot), then
   registers; the index-narrative tail deferred to the ADR-200 convergence or kept
   as curated docs.
2. **Distilled.md treatment** — curated synthesis needs `supersedes`/`refines`
   edges, not plain union; confirm the edge model carries it before migrating.
3. **Shared pattern, per-member substrate** (refined 2026-06-27 with Beluga rides
   Wave). The family shares the renderer/projection PATTERN (derive an authoritative
   read from immutable sources — the ADR-199 event→render shape); the SUBSTRATE is a
   per-member choice. `graph-core` (RDF/JSON-LD: jsonld/vocab/term/canon/dataset)
   fits the *semantic* members (the curriculum ontology, the ADR-200 intent
   idea-graph). The *operational/narrative* members — agent-work-state (PDR-118,
   derived from `git worktree list` + claims + event-recency) and the napkin
   event-graph (whose `[[links]]`/`supersedes` edges are lightweight narrative
   edges, not RDF triples) — likely want a lighter event store, **not** `graph-core`.
   *"Is `graph-core` the right substrate for operational/memory state, or a category
   mismatch?"* is an open Phase-0-ADR question. **Two anti-goals, not one:** a
   gratuitously parallel projection engine, AND a forced unification of operational
   state onto the wrong (RDF) substrate — the mirror category error.

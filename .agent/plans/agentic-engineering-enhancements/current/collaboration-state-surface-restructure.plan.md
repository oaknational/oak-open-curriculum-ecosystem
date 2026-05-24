---
name: Collaboration-State Surface Restructure
overview: >
  Apply the collaboration-state placement contract to the surface family
  (`collaboration-state-lifecycle.md`, `collaboration-state-conventions.md`,
  `agent-collaboration.md`, and the four schemas in
  `.agent/state/collaboration/`). Move substance to its canonical home,
  normalise vocabulary, and verify cross-references. The contract itself
  lives at
  `.agent/memory/executive/collaboration-state-placement-contract.md`.
todos:
  - id: contract-authored
    content: "Author the placement contract in executive memory and add a one-line pointer from collaboration-state-conventions.md."
    status: completed
  - id: provenance-to-schemas
    content: "Move §Schema-Field Provenance content from lifecycle.md into per-property `description` and `$comment_provenance` blocks across active-claims.schema.json (and the three sibling schemas where applicable). Delete the prose table; lifecycle gains a one-line pointer."
    status: completed
  - id: doctrine-to-directive
    content: "Move doctrine paragraphs from lifecycle.md (read/write posture; 'resist unilateral cleanup'; 'visibility before deletion is the discipline'; identity-preflight-gates-all-writes) into agent-collaboration.md. Lifecycle keeps recipe halves and cites the directive."
    status: completed
  - id: vocabulary-normalisation
    content: "Separate commit, same phase: pick one term per concept and rewrite for consistency: stale (past TTL, archivable) / fresh-but-quiet (within TTL, no heartbeat) / orphaned (fresh-but-quiet whose owning session has ended) / expired (wall-clock past `expires_at`, stale-reporting only)."
    status: completed
  - id: lifecycle-tagline-and-trim
    content: "Re-tagline lifecycle.md ('Operational recipes for `.agent/state/collaboration/`') and trim sections that are no longer load-bearing after the moves above. Verify the file is recipe-shaped throughout."
    status: completed
  - id: cross-ref-audit
    content: "Audit all incoming cross-references to the moved sections (search for 'Schema-Field Provenance', 'Apparently Orphaned', 'do not treat hot shared-state docs as read-only') and update pointers."
    status: completed
  - id: validation
    content: "Run `pnpm practice:fitness:informational`, `pnpm practice:vocabulary`, `pnpm markdownlint:root`, and the collaboration-state CLI `check` action. Confirm fitness pressure on lifecycle.md is resolved by structural moves, not by trim."
    status: completed
  - id: reviewer-dispatch
    content: "Dispatch docs-adr-expert and code-expert on the change set with execution-legitimacy-given-decisions framing (placement is owner-fixed by the contract; do not re-open the contract decision)."
    status: completed
  - id: napkin-graduation
    content: "If the restructure surfaces any standing-rule-shaped insight (beyond the wrong-file-by-adjacency pattern already captured), add a napkin entry and queue for distilled.md."
    status: completed
---

# Collaboration-State Surface Restructure

## 1. Intent

The collaboration-state surface family
(`.agent/state/collaboration/` plus its three governance/recipe
files) has accumulated substance through graduation-flow inertia
rather than first-principles placement. The
2026-05-06 apparently-orphaned-claim graduation made the pattern
visible: a graduation correct in substance landed in the wrong
file because an adjacent section shared a topic. This plan
applies the
[placement contract][contract] to bring the surface family into
alignment.

## 2. Authority

The placement contract is the authority for *where* substance
lives. Doctrine about the surfaces themselves remains in
[`agent-collaboration.md`][directive]; field semantics live in the
schemas. This plan does not amend the contract; it executes it.

[contract]: ../../../memory/executive/collaboration-state-placement-contract.md
[directive]: ../../../directives/agent-collaboration.md

## 3. Scope

In scope:

- `collaboration-state-lifecycle.md` (operational memory)
- `collaboration-state-conventions.md` (operational memory)
- `agent-collaboration.md` (directive)
- `active-claims.schema.json`, `closed-claims.schema.json`,
  `conversation.schema.json`, `escalation.schema.json` (schemas)

Out of scope:

- Changing collaboration-state behaviour (recipe semantics, TTL
  values, schema field shapes). This is a *placement* restructure,
  not a behavioural one. Behavioural changes are separate plans
  cited from this one if they emerge.
- Schema major-version bumps. Adding `$comment_provenance` blocks
  is a documentation move, not a schema field reduction. If the
  move surfaces a missing field or an enum that warrants change,
  open a separate plan under the v1.x → v2.0 evolution flow per
  [`collaboration-state-conventions.md` §Refinement Discipline][refine].

[refine]: ../../../memory/operational/collaboration-state-conventions.md#refinement-discipline

## 4. Phases

### Phase 1 — Contract authored (completed in this session)

- Placement contract at
  `.agent/memory/executive/collaboration-state-placement-contract.md`.
- One-line pointer from `collaboration-state-conventions.md`
  introducing the contract surface.

### Phase 2 — Substance moves

Each item lands as its own commit so review is decoupled.

1. **Provenance → schema annotations** (`provenance-to-schemas`).
   Per-property `description` is already rich on
   `active-claims.schema.json`; the move adds
   `$comment_provenance: "Observed" | "First-principles" | "Observed + first-principles"`
   per property and deletes the lifecycle.md prose table.
   Lifecycle keeps a one-line pointer ("Field provenance is
   co-located with the field in `active-claims.schema.json`.").
2. **Doctrine → directive** (`doctrine-to-directive`). Move:
   - "Do not treat hot shared-state docs as read-only" paragraph
     → `agent-collaboration.md` §Knowledge-and-Communication or
     a new §Shared-State Posture clause.
   - "Resist unilateral cleanup" + "visibility before deletion is
     the discipline" → `agent-collaboration.md` (cleanup ethics
     clause). Lifecycle keeps the recipe (when to archive, what
     evidence to attach) and cites the directive.
   - Identity-preflight-gates-all-writes paragraph (currently in
     §Claims preamble though it gates *all* mutation) → move to
     `agent-collaboration.md` §Identity vs Liveness or
     `collaboration-state-conventions.md` §Write-Safety Contract
     where it half-lives. Lifecycle keeps a one-line pointer.
3. **Vocabulary normalisation** (`vocabulary-normalisation`,
   separate commit, same phase). Adopt the four-term taxonomy:
   *stale* (past TTL, archivable), *fresh-but-quiet* (within TTL,
   no heartbeat), *orphaned* (fresh-but-quiet whose owning
   session has ended), *expired* (wall-clock past `expires_at`,
   stale-reporting only). Rewrite all near-miss phrasings in
   lifecycle.md, conventions.md, and the schemas. Add a
   §Vocabulary section to conventions.md naming the four terms
   if not already present.
4. **Tagline + trim** (`lifecycle-tagline-and-trim`). Update
   lifecycle.md opening to "Operational recipes for
   `.agent/state/collaboration/`". Confirm every section is
   recipe-shaped (sequence-of-actions); flag any residual
   non-recipe paragraph for re-routing.

### Phase 3 — Cross-reference audit and trim

- `cross-ref-audit`: search the repo for incoming pointers to the
  moved sections; update.
- Trim conventions.md if the schema-provenance move created a
  duplication (the current `## Schema Provenance` redirect
  becomes the durable pointer).

### Phase 4 — Validation and reviewer dispatch

- `validation`: gates and `collaboration-state -- check`.
- `reviewer-dispatch`: docs-adr-expert + code-expert with
  execution-legitimacy framing. The contract is owner-decided;
  reviewer remit is *did the moves apply the contract correctly*,
  not *should the contract differ*.

## 5. Acceptance Criteria

- `collaboration-state-lifecycle.md` is recipe-shaped throughout;
  no doctrine paragraphs, no provenance tables.
- Schema files carry per-property `$comment_provenance` annotations.
- `agent-collaboration.md` carries the cleanup-ethics and
  shared-state-posture clauses.
- Vocabulary is consistent across the surface family per the
  four-term taxonomy.
- Cross-references resolve; markdown lint clean; fitness pressure
  on lifecycle.md is resolved.
- Reviewer dispatch returns no P0/P1 findings on the moves.

## 6. Lifecycle

Active session lands Phase 1 (contract + plan + thread arc +
napkin + opener supersession) under one commit. Phase 2 onward
runs in a fresh session per the standing 30%-context-budget rule
for directive-file work; the directive edit lands in that session
under the new context budget.

This plan moves to `archived/` after Phase 4 acceptance and after
the contract has prevented at least one wrong-file landing in a
subsequent graduation. Until then, the contract is theoretically
sufficient but empirically unvalidated.

## 7. Validation Hooks

- Quality gates: `pnpm practice:fitness:informational`,
  `pnpm practice:vocabulary`, `pnpm markdownlint:root`.
- Schema validation: `pnpm agent-tools:collaboration-state -- check`
  (catches malformed `$comment_provenance` blocks if any are
  required by the schemas; expect them to be ignored as
  custom annotations).
- Reviewer dispatch per `invoke-code-experts` rule.

## 8. Cross-References

- [Placement contract][contract]
- [Agent collaboration directive][directive]
- [Collaboration-state conventions](../../../memory/operational/collaboration-state-conventions.md)
- [Collaboration-state lifecycle](../../../memory/operational/collaboration-state-lifecycle.md)
- [Active claims schema](../../../state/collaboration/active-claims.schema.json)
- Superseded opener:
  [`2026-05-06-collaboration-state-lifecycle-deep-exploration-opener.md`](2026-05-06-collaboration-state-lifecycle-deep-exploration-opener.md)
  — the deep-exploration step folded into this plan once the
  reflection produced a contract-shaped finding.

---
fitness_line_target: 110
fitness_line_limit: 160
fitness_char_limit: 9000
fitness_line_length: 100
split_strategy: "Keep tight; this is an executive-memory reference card for one surface family"
---

# Collaboration-State Placement Contract

Names which **substance-kind** belongs in which file across the
collaboration-state surface family. Looked up when authoring,
graduating, or auditing content that touches
`.agent/state/collaboration/`, the matching directive, or the
operational lifecycle file.

The contract is an authority for *placement*, not for *content*.
What a section says is governed by doctrine; *where* it lives is
governed here.

## Surfaces and Substance Kinds

| Substance kind | Canonical home | Shape |
| --- | --- | --- |
| Operational recipes — sequence-of-actions, imperative steps for open / refresh / close / archive / queue ops / decision-thread / sidebar / escalation lifecycle | [`collaboration-state-lifecycle.md`][lifecycle] | Numbered or bullet steps; recipe-shaped |
| Surface index, schema-evolution rules, write-safety contract, default-value rationale, session-close-and-resume semantics | [`collaboration-state-conventions.md`][conventions] | Tables + invariants; index-shaped |
| Doctrine — knowledge-vs-mechanical-refusal, scope discipline, posture, threat model, cleanup ethics, peer-vs-owner authority, founding patterns | [`agent-collaboration.md`][directive] | Stance + principles; doctrine-shaped |
| Field-level provenance, semantics, validation, enum constraints, additive-only compatibility | Schema `description` and `$comment_provenance` blocks in [`active-claims.schema.json`][active-schema], [`closed-claims.schema.json`][closed-schema], [`conversation.schema.json`][conv-schema], [`escalation.schema.json`][esc-schema] | Co-located with field; JSON Schema annotation |
| Reporting contract for protocol observability — what consolidate-docs surfaces and how | [`consolidate-docs.md § 7e`][consolidate-7e] | Skill-step body; command-behaviour-shaped |

## Routing the Hard Cases

A new piece of substance is hard to place when it carries more than
one shape. Three failure modes recur:

1. **Recipe-with-doctrine bleed** — a recipe paragraph carries a
   *why* clause that is doctrine ("resist unilateral cleanup",
   "visibility before deletion is the discipline"). Split: recipe
   half stays in lifecycle.md and *cites* the doctrine half in the
   directive. Lifecycle never re-states doctrine; it links.
2. **Provenance-as-prose** — a paragraph or table explaining where
   a field came from. Belongs in the schema as a `description` or
   `$comment_provenance` block on the field, not as ambient prose
   in a lifecycle or conventions file. The schema is the artefact
   whose evolution provenance tracks; co-locate.
3. **Index-vs-recipe overlap** — a paragraph that names *what a
   surface is* versus *how to operate on it*. The naming half
   belongs in conventions.md (surface index); the operating half
   belongs in lifecycle.md (recipe).

When the substance is genuinely cross-cutting, place the durable
half in the higher-authority surface (directive > conventions >
lifecycle > schema-as-data) and leave a one-line cite in the
shallower surface. **Do not duplicate substance to keep two
files self-contained.**

## Placement Audit Checklist

Run when authoring or graduating content that touches this surface
family. Each "yes" is the wrong file:

- [ ] Does the new paragraph state a *stance* or *posture* about
      agent-to-agent behaviour, rather than steps to take?
      → directive (`agent-collaboration.md`).
- [ ] Does the new paragraph define *what a field means* or *where
      it came from*? → schema annotation, not prose.
- [ ] Does the new paragraph explain *which surface owns what*,
      rather than how to operate on it? → conventions (surface
      index), not lifecycle (recipe).
- [ ] Does the new paragraph tell consolidate-docs *what to report
      on*? → consolidate-docs skill body, not lifecycle.
- [ ] Does the new paragraph tell an agent *what sequence of
      actions to take* against a state file? → lifecycle (this is
      the only "yes" that confirms placement).
- [ ] Is there an adjacent section in the file already, and is
      that the only reason this is landing here? → graduation-flow
      inertia. Re-route by substance-kind, not by adjacency.

## Failure Mode This Contract Exists to Prevent

Graduations from the active-memory learning loop tend to land
adjacent to whatever section they cite, not in the file whose
substance-kind they match. The
2026-05-06 **apparently-orphaned-claim policy** graduated from
`distilled.md` into `collaboration-state-lifecycle.md` because the
existing `### Archive Stale Claims` subsection was nearby — the
graduation was correct in *substance* but landed in the *wrong
file half* (the doctrine clause "resist unilateral cleanup" should
be in the directive; only the cleanup recipe belongs in
lifecycle). The recurring shape: *graduation-flow inertia produces
wrong-file landings; the cure is a placement contract authored
before the next graduation, not after.*

## Evolution

This contract is an executive-memory reference. Updates land when
the surface family adds or retires a substance-kind, not on
session cadence. A new state surface (e.g. a new schema file)
extends the table; a retired surface removes its row. Doctrine
about the surfaces themselves still lives in
[`agent-collaboration.md`][directive].

[lifecycle]: ../operational/collaboration-state-lifecycle.md
[conventions]: ../operational/collaboration-state-conventions.md
[directive]: ../../directives/agent-collaboration.md
[active-schema]: ../../state/collaboration/active-claims.schema.json
[closed-schema]: ../../state/collaboration/closed-claims.schema.json
[conv-schema]: ../../state/collaboration/conversation.schema.json
[esc-schema]: ../../state/collaboration/escalation.schema.json
[consolidate-7e]: ../../commands/consolidate-docs.md#stale-claim-audit

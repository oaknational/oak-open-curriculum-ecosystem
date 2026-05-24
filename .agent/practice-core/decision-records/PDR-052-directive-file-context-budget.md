---
pdr_kind: governance
---

# PDR-052: Directive-File Context Budget

**Status**: Accepted
**Date**: 2026-05-10
**Related**:
[PDR-014](PDR-014-pattern-routing-discipline.md) (consolidation flow —
this PDR fixes directive-file work as the final step of any consolidation
pass);
[PDR-026](PDR-026-per-session-landing-commitment.md) (per-session landing
commitment — context budget interacts with session shape);
[PDR-046](PDR-046-layered-knowledge-processing.md) (layered knowledge
processing — directive-file work sits at the topmost layer of the
processing staircase).

## Context

Directive files (the canonical entry points and operative rules an
agent reads at every session open) are deep, dense, and structurally
load-bearing. In this Practice they live under `.agent/directives/`
(`AGENT.md`, `principles.md`, `tdd-as-design.md`, `testing-strategy.md`,
`schema-first-execution.md`, `orientation.md`, etc.). Other Practice-
bearing repos have analogous surfaces under their host equivalents.

A directive file edit lands at the apex of the doctrine staircase. A
mistake there compounds across the entire Practice — every agent in
every subsequent session reads the corrupted directive at session
open, and downstream artefacts (rules, plans, ADRs) cite the directive
as authoritative.

The error rate of editing operations rises sharply under context
pressure. The disposition that produces *"I'll just be careful"* under
context pressure is the rounding-off failure mode named at
[`patterns/eager-rounding-off-on-partial-structures.md`](../../memory/active/patterns/eager-rounding-off-on-partial-structures.md):
agents reach for shortcut framings (skip the section read; trust the
prior summary; let the diff stand without re-reading the surrounding
prose) precisely when the surrounding doctrine least tolerates
shortcuts.

The owner has stated that this discipline is standing — *"this is
always true"* — across sessions, not a session-scoped suggestion.

## Decision

**Directive-file work runs only when context usage is below 30% of
the active session's working budget.** The threshold is a structural
constraint, not a guideline. At or above 30%, directive-file work is
deferred to a fresh session with a written handoff opener.

The rule has three operational corollaries:

1. **Sequencing**. Directive-file work is the FINAL step of any
   consolidation pass. The processing order is *napkin → other capture
   surfaces (experience, comms-events, plugin buffers) → `distilled.md`
   → `pending-graduations.md` → directive files*. The earlier surfaces
   are processed first so that, by the time directive editing is
   reached, residual context is dense rather than crowded with
   capture-surface scan output.

2. **Threshold check at the boundary**. Immediately before directive-
   file work begins, the agent performs an explicit context-usage
   check. If at or above 30%, the agent finishes the current step,
   writes a session-handoff opener that names the queued directive
   work, and ends the session. The next fresh-context session resumes
   at the directive-file step.

3. **Self-applying clause**. This PDR is itself directive-shape doctrine.
   When this PDR is edited, the same 30%-context-budget rule applies
   to the edit itself.

## Scope

**Adopter scope**: every Practice-bearing repo that ships directive
files. The substance is portable — directive-file editing under
context pressure is a failure mode of agent infrastructure design, not
a host-repo product concern.

**What counts as "directive-file work"**:

- Direct editing of `.agent/directives/*` content (any host equivalent).
- Restructuring of section ordering, semantic relationships between
  sections, or cross-references between directives.
- Authoring new directive sections.

**What does NOT count as "directive-file work"**:

- Citation updates that point at newly-landed PDRs/ADRs (mechanical
  link insertion).
- Frontmatter-only edits (e.g. `last_updated:`, `fitness_*` tuning).
- Reading a directive as input to other work.
- Authoring PDRs in `.agent/practice-core/decision-records/` —
  PDRs are governance artefacts, not directives. (This is a common
  conflation under context pressure: the surface that *cites* doctrine
  is not the same as the surface that *carries* doctrine.)

## Rationale

The 30% threshold is not arithmetic; it is a structural margin. It
preserves headroom for:

- **Full-depth file reading**. Directive files commonly run 200–500
  lines of dense prose. Reading the file in full before editing,
  without truncation, is a non-negotiable precondition.
- **Existing-structure comprehension**. Directive edits need to
  understand the surrounding section's frame (the parent rule, the
  cross-referenced sibling sections, the operative example). A budget
  too tight to read the parent frame is a budget too tight to edit
  the section.
- **Editing without crowding-out**. Each Edit operation consumes
  context. A long sequence of small edits (typical of directive-file
  refinement) accumulates context cost.

A higher threshold (50% / 60%) loses the structural margin under any
plausible session shape. A lower threshold (10% / 20%) makes directive
work effectively impossible in any session that has done other useful
work first. 30% threads the needle.

The sequencing corollary (directive-file work LAST) compounds the
margin: by the time directive editing is reached, the agent has
already discharged the earlier surfaces' substance, and the working
context is correspondingly denser per token.

The self-applying clause is the structural guard: any PDR/directive
that exempts itself from its own rule is the avoidance shape. This
PDR explicitly applies to its own edits.

## Consequences

**Enables**:

- Directive-file edits arrive with full-depth reading and full
  surrounding-frame comprehension intact, materially reducing the
  rounding-off error rate.
- Sessions that hit the threshold without reaching directive work
  produce a clean handoff opener rather than a degraded edit. The
  next session inherits a precise resume point.
- The doctrine layer at the apex of the staircase ages slowly because
  it accumulates careful edits, not panicked under-pressure ones.

**Costs**:

- Some sessions will discover, mid-pass, that they cannot reach the
  directive-file step. This is the rule operating correctly — the
  cost of a clean handoff is small compared to the cost of a corrupted
  directive.
- Multi-step consolidation passes (e.g. consolidate-docs running all 10
  steps) need to budget context across earlier steps so that directive
  work at the end is reachable. Step-by-step accounting is a small
  discipline compared to single-session-everything ambition.

**Forbids**:

- Authoring or editing directive content under context pressure with
  *"I'll just be careful"* framing. The framing is the diagnostic; the
  rule fires regardless.
- Skipping the threshold check by claiming the edit is "small". Edit
  size is not the discipline's input; context budget is.

## Implementation

The threshold check is presently agent-side discipline, not tooling.
Future hardening MAY add a context-usage probe to the consolidation
workflow tooling so the threshold becomes machine-checkable, but the
substance of the rule is the discipline itself, not its automation.

User-memory `feedback_30_percent_context_for_directives.md` references
this PDR as the canonical statement of the rule.

## Source

This PDR graduates the substance of the
`pending-graduations.md` entry *"30% context budget for directive-file
processing is a standing rule, not a session-scoped suggestion"*
(captured 2026-05-05 from owner direction during Opalescent Threading
Nebula's promotion pass; graduation deferred under fabricated-gate
vocabulary across multiple sessions until owner reframe in the
`knowledge graduation` session 2026-05-10).
